import { useState, useEffect, useCallback } from 'react';
import { createDefaultCharacterSchedule, RESET_TIMES, WEEKLY_CONTENT, DAILY_CONTENT, ABYSS_DUNGEON_CONTENT, LEGION_RAID_CONTENT, KAZEROTH_RAID_CONTENT } from '../data/contentData';
import { getCharacterProfile } from '../services/lostarkApi';
import { getIcon } from '../data/icons';
import { isContentAvailableToday } from '../utils/dateUtils';

const useScheduler = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);

  // 이번 주 리셋 시간 계산 (수요일 오전 6시)
  const getThisWeekResetTime = (currentDate) => {
    const resetDate = new Date(currentDate);
    const currentDay = resetDate.getDay();
    const daysUntilWednesday = (3 - currentDay + 7) % 7;
    
    // 현재가 수요일이고 6시 이후라면 다음 주 수요일
    if (currentDay === 3 && resetDate.getHours() >= RESET_TIMES.WEEKLY_RESET_HOUR) {
      resetDate.setDate(resetDate.getDate() + 7);
    } else {
      resetDate.setDate(resetDate.getDate() - daysUntilWednesday);
    }
    
    resetDate.setHours(RESET_TIMES.WEEKLY_RESET_HOUR, 0, 0, 0);
    return resetDate;
  };

  // 리셋 시간 체크 및 스케줄 초기화
  const checkAndResetSchedules = useCallback((characterList) => {
    const now = new Date();
    
    return characterList.map(character => {
      const updatedSchedule = { ...character.schedule };
      let needsUpdate = false;

      // 각 컨텐츠별 리셋 체크
      Object.keys(updatedSchedule).forEach(contentId => {
        const scheduleData = updatedSchedule[contentId];
        const lastReset = new Date(scheduleData.lastReset || character.createdAt);
        
        // 일일 리셋 체크 (매일 오전 6시)
        if (contentId.includes('chaos_dungeon') || contentId.includes('guardian_raid') || 
            contentId.includes('daily_quest') || contentId.includes('guild_quest') ||
            contentId.includes('field_boss') || contentId.includes('chaos_gate')) {
          
          // 요일별 컨텐츠는 해당 요일에만 리셋 체크
          const dailyContent = Object.values(DAILY_CONTENT).find(c => c.id === contentId);
          if (dailyContent && !isContentAvailableToday(dailyContent, now)) {
            return; // 오늘 진행 불가능한 컨텐츠는 리셋하지 않음
          }
          
          const lastResetDate = new Date(lastReset);
          const todayReset = new Date(now);
          todayReset.setHours(RESET_TIMES.DAILY_RESET_HOUR, 0, 0, 0);
          
          // 마지막 리셋이 오늘 리셋 시간 이전이면 초기화
          if (lastResetDate < todayReset) {
            updatedSchedule[contentId] = {
              ...scheduleData,
              completed: false,
              lastReset: now.toISOString()
            };
            needsUpdate = true;
          }
        }
        
        // 주간 리셋 체크 (수요일 오전 6시)
        else {
          const lastResetDate = new Date(lastReset);
          const thisWeekReset = getThisWeekResetTime(now);
          
          // 마지막 리셋이 이번 주 리셋 시간 이전이면 초기화
          if (lastResetDate < thisWeekReset) {
            // 주간 컨텐츠만 maxCount 검증, 나머지는 false
            const weeklyContent = Object.values(WEEKLY_CONTENT).find(c => c.id === contentId);
            const initialValue = weeklyContent && weeklyContent.maxCount > 1 ? 0 : false;
            
            updatedSchedule[contentId] = {
              ...scheduleData,
              completed: initialValue,
              lastReset: now.toISOString()
            };
            needsUpdate = true;
          }
        }
      });

      return needsUpdate ? {
        ...character,
        schedule: updatedSchedule,
        updatedAt: now.toISOString()
      } : character;
    });
  }, []);

  // 로컬스토리지에서 캐릭터 목록 불러오기
  useEffect(() => {
    const savedCharacters = localStorage.getItem('scheduler_characters');
    if (savedCharacters) {
      try {
        const parsedCharacters = JSON.parse(savedCharacters);
        // 데이터가 있고 빈 배열이 아닌 경우에만 사용
        if (parsedCharacters.length > 0) {
          // 리셋 체크 후 캐릭터 목록 설정
          setCharacters(checkAndResetSchedules(parsedCharacters));
        } else {
          // 빈 배열인 경우 테스트 캐릭터 추가
          const testCharacter = createDefaultCharacterSchedule({
            name: '임시 캐릭터',
            className: '바드',
            serverName: '아브렐슈드',
            itemLevel: 1650,
            classIcon: getIcon('CHARACTER', '바드')
          });
          setCharacters([testCharacter]);
        }
      } catch (error) {
        console.error('스케줄러 데이터 로드 실패:', error);
        // 파싱 에러 시에도 테스트 캐릭터 추가
        const testCharacter = createDefaultCharacterSchedule({
          name: '임시 캐릭터',
          className: '바드',
          serverName: '아브렐슈드',
          itemLevel: 1650,
          classIcon: getIcon('CHARACTER', '바드')
        });
        setCharacters([testCharacter]);
      }
    } else {
      // 저장된 데이터가 없으면 테스트용 캐릭터 추가
      const testCharacter = createDefaultCharacterSchedule({
        name: '임시 캐릭터',
        className: '바드',
        serverName: '아브렐슈드',
        itemLevel: 1650,
        classIcon: getIcon('CHARACTER', '바드')
      });
      setCharacters([testCharacter]);
    }
  }, [checkAndResetSchedules]);

  // 캐릭터 목록 변경 시 로컬스토리지에 저장
  useEffect(() => {
    if (characters.length >= 0) {
      localStorage.setItem('scheduler_characters', JSON.stringify(characters));
    }
  }, [characters]);

  // 캐릭터 추가
  const addCharacter = async (characterName) => {
    if (!characterName || characters.some(char => char.name === characterName)) {
      throw new Error('이미 존재하는 캐릭터이거나 유효하지 않은 이름입니다.');
    }

    setLoading(true);
    try {
      // API에서 캐릭터 정보 가져오기
      const profile = await getCharacterProfile(characterName);
      
      const characterInfo = {
        name: profile.CharacterName,
        className: profile.CharacterClassName,
        serverName: profile.ServerName,
        itemLevel: Math.floor(parseFloat(profile.ItemAvgLevel.replace(',', ''))),
        classIcon: getIcon('CHARACTER', profile.CharacterClassName)
      };

      const newCharacter = createDefaultCharacterSchedule(characterInfo);
      setCharacters(prev => [...prev, newCharacter]);
      
      return newCharacter;
    } catch (error) {
      console.error('캐릭터 추가 실패:', error);
      throw new Error('캐릭터 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 캐릭터 제거
  const removeCharacter = (characterId) => {
    setCharacters(prev => prev.filter(char => char.id !== characterId));
  };

  // 스케줄 업데이트
  const updateSchedule = (characterId, contentId, scheduleUpdate) => {
    setCharacters(prev => prev.map(character => {
      if (character.id === characterId) {
        return {
          ...character,
          schedule: {
            ...character.schedule,
            [contentId]: {
              ...character.schedule[contentId],
              ...scheduleUpdate
            }
          },
          updatedAt: new Date().toISOString()
        };
      }
      return character;
    }));
  };

  // 전체 리셋
  const resetAllSchedules = () => {
    setCharacters(prev => prev.map(character => {
      const resetSchedule = {};
      
      Object.keys(character.schedule).forEach(contentId => {
        if (contentId.includes('chaos_dungeon') || contentId.includes('guardian_raid') || 
            contentId.includes('daily_quest') || contentId.includes('guild_quest') ||
            contentId.includes('field_boss') || contentId.includes('chaos_gate')) {
          // 일일 컨텐츠는 체크박스로 변경
          resetSchedule[contentId] = {
            completed: false,
            lastReset: new Date().toISOString()
          };
        } else {
          // 주간 컨텐츠만 maxCount 검증, 나머지는 false
          const weeklyContent = Object.values(WEEKLY_CONTENT).find(c => c.id === contentId);
          const initialValue = weeklyContent && weeklyContent.maxCount > 1 ? 0 : false;
          
          resetSchedule[contentId] = {
            completed: initialValue,
            lastReset: new Date().toISOString()
          };
        }
      });

      return {
        ...character,
        schedule: resetSchedule,
        updatedAt: new Date().toISOString()
      };
    }));
  };

  return {
    characters,
    loading,
    addCharacter,
    removeCharacter,
    updateSchedule,
    resetAllSchedules
  };
};

export default useScheduler;