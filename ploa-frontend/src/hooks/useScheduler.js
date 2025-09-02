import { useState, useEffect, useCallback } from 'react';
import { createDefaultCharacterSchedule, RESET_TIMES, WEEKLY_CONTENT, DAILY_CONTENT, ABYSS_DUNGEON_CONTENT, LEGION_RAID_CONTENT, KAZEROTH_RAID_CONTENT } from '../data/contentData';
import { getCharacterProfile } from '../services/lostarkApi';
import { getIcon } from '../data/icons';
import { isContentAvailableToday } from '../utils/dateUtils';

const useScheduler = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // 초기 로드 완료 플래그
  const [draggedCharacter, setDraggedCharacter] = useState(null); // 드래그 중인 캐릭터
  const [dragOverIndex, setDragOverIndex] = useState(-1); // 드래그 오버 인덱스
  const [dragPreviewIndex, setDragPreviewIndex] = useState(-1); // 드롭 예상 위치
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 진행 중
  const [cardPositions, setCardPositions] = useState([]); // 각 카드의 실제 위치 정보
  const [movingCards, setMovingCards] = useState(new Set()); // 현재 이동 중인 카드들
  const [gridColumns, setGridColumns] = useState(4); // Grid 컬럼 수 (반응형 대응)

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

  // Grid 컬럼 수 계산 및 업데이트
  useEffect(() => {
    const updateGridColumns = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      let cols = 4; // 기본값
      if (width >= 1280) cols = 4; // xl
      else if (width >= 1024) cols = 3; // lg  
      else if (width >= 768) cols = 2;  // md
      else cols = 1; // sm
      
      setGridColumns(cols);
    };

    updateGridColumns();
    window.addEventListener('resize', updateGridColumns);
    
    return () => {
      window.removeEventListener('resize', updateGridColumns);
    };
  }, []);

  // 로컬스토리지에서 캐릭터 목록 불러오기
  useEffect(() => {
    if (isInitialized) return; // 이미 초기화된 경우 중복 실행 방지
    
    const savedCharacters = localStorage.getItem('scheduler_characters');
    if (savedCharacters) {
      try {
        const parsedCharacters = JSON.parse(savedCharacters);
        // 배열인지 확인하고 리셋 체크 후 설정
        if (Array.isArray(parsedCharacters)) {
          setCharacters(checkAndResetSchedules(parsedCharacters));
        } else {
          // 잘못된 데이터 형식인 경우 빈 배열로 초기화
          setCharacters([]);
        }
      } catch (error) {
        console.error('스케줄러 데이터 로드 실패:', error);
        // 파싱 에러 시 빈 배열로 초기화
        setCharacters([]);
      }
    } else {
      // 저장된 데이터가 없으면 빈 배열로 시작
      setCharacters([]);
    }
    
    setIsInitialized(true); // 초기화 완료 표시
  }, []); // 의존성 제거로 한 번만 실행

  // 캐릭터 목록 변경 시 로컬스토리지에 저장
  useEffect(() => {
    if (isInitialized) { // 초기화 완료 후에만 저장
      localStorage.setItem('scheduler_characters', JSON.stringify(characters));
    }
  }, [characters, isInitialized]);

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
      
      // 첫 번째 캐릭터 추가 시 임시 캐릭터 제거
      setCharacters(prev => {
        const hasTemporaryCharacter = prev.some(char => char.name === '임시 캐릭터');
        if (hasTemporaryCharacter && prev.length === 1) {
          return [newCharacter]; // 임시 캐릭터만 있다면 대체
        }
        return [...prev, newCharacter]; // 그 외에는 추가
      });
      
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
    // 해당 컨텐츠가 공유 컨텐츠인지 확인
    const content = Object.values(DAILY_CONTENT).find(c => c.id === contentId);
    const isSharedContent = content?.shared;
    
    setCharacters(prev => prev.map(character => {
      // 공유 컨텐츠인 경우 모든 캐릭터에 적용, 아니면 해당 캐릭터만 적용
      if (isSharedContent || character.id === characterId) {
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

  // 캐릭터 순서 변경
  const reorderCharacters = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    
    setIsAnimating(true);
    setCharacters(prev => {
      const newCharacters = [...prev];
      const [draggedItem] = newCharacters.splice(fromIndex, 1);
      newCharacters.splice(toIndex, 0, draggedItem);
      return newCharacters;
    });
    
    // 애니메이션 완료 후 상태 초기화
    setTimeout(() => {
      setIsAnimating(false);
    }, 200);
  };

  // Grid 기반 위치 계산 (안정화된 버전)
  const calculateCardPosition = (index, totalCards, cols = gridColumns) => {
    if (typeof index !== 'number' || index < 0) return { row: 0, col: 0, index: 0 };
    
    const row = Math.floor(index / cols);
    const col = index % cols;
    return { row, col, index };
  };

  // 영향받는 카드들과 그들의 최종 위치 계산
  const getAffectedCardsPositions = (dragIndex, dropIndex, totalCards) => {
    if (dragIndex === -1 || dropIndex === -1 || dragIndex === dropIndex) {
      return [];
    }

    const affectedCards = [];
    
    if (dragIndex < dropIndex) {
      // 오른쪽으로 이동: dragIndex+1 ~ dropIndex 카드들이 왼쪽으로 한 칸씩 이동
      for (let i = dragIndex + 1; i <= dropIndex; i++) {
        affectedCards.push({
          currentIndex: i,
          targetIndex: i - 1,
          direction: 'left'
        });
      }
    } else {
      // 왼쪽으로 이동: dropIndex ~ dragIndex-1 카드들이 오른쪽으로 한 칸씩 이동  
      for (let i = dropIndex; i < dragIndex; i++) {
        affectedCards.push({
          currentIndex: i,
          targetIndex: i + 1,
          direction: 'right'
        });
      }
    }

    return affectedCards;
  };

  // 카드별 transform 스타일 계산 (디버깅 강화)
  const getCardTransform = (cardIndex, dragIndex, previewIndex, totalCards) => {
    // 기본 검증
    if (typeof cardIndex !== 'number' || typeof dragIndex !== 'number' || typeof previewIndex !== 'number') {
      return { transform: '', className: '' };
    }
    
    if (dragIndex === -1 || previewIndex === -1 || cardIndex === dragIndex) {
      return { transform: '', className: '' };
    }

    const affectedCards = getAffectedCardsPositions(dragIndex, previewIndex, totalCards);
    const affectedCard = affectedCards.find(card => card.currentIndex === cardIndex);
    
    if (!affectedCard) {
      return { transform: '', className: '' };
    }

    // Grid 위치 기반 실제 이동 거리 계산
    const currentPos = calculateCardPosition(affectedCard.currentIndex, totalCards, gridColumns);
    const targetPos = calculateCardPosition(affectedCard.targetIndex, totalCards, gridColumns);
    
    // 유효성 검증
    if (!currentPos || !targetPos) {
      return { transform: '', className: '' };
    }
    
    // 같은 행 내에서의 이동
    if (currentPos.row === targetPos.row) {
      const moveDistance = (targetPos.col - currentPos.col) * 100;
      if (isNaN(moveDistance)) {
        return { transform: '', className: '' };
      }
      
      return {
        transform: `translateX(${moveDistance}%)`,
        className: 'transition-transform duration-300 ease-in-out'
      };
    }
    
    // 다른 행으로의 이동 (행과 열 모두 변경)
    const moveX = (targetPos.col - currentPos.col) * 100;
    const moveY = (targetPos.row - currentPos.row) * 100;
    
    if (isNaN(moveX) || isNaN(moveY)) {
      return { transform: '', className: '' };
    }
    
    return {
      transform: `translate(${moveX}%, ${moveY}%)`,
      className: 'transition-transform duration-300 ease-in-out'
    };
  };

  // 드래그 시작
  const handleDragStart = (character, index) => {
    if (character && typeof index === 'number') {
      setDraggedCharacter({ character, index });
    }
  };

  // 드래그 종료
  const handleDragEnd = () => {
    setDraggedCharacter(null);
    setDragOverIndex(-1);
    setDragPreviewIndex(-1);
    setMovingCards(new Set());
    setIsAnimating(false);
  };

  // 드래그 오버
  const handleDragOver = (e, index) => {
    e.preventDefault();
    
    if (draggedCharacter && draggedCharacter.index !== index) {
      setDragOverIndex(index);
      setDragPreviewIndex(index);
      
      const affectedCards = getAffectedCardsPositions(draggedCharacter.index, index, characters.length);
      const movingCardSet = new Set(affectedCards.map(card => card.currentIndex));
      setMovingCards(movingCardSet);
    }
  };

  // 드롭
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedCharacter && typeof dropIndex === 'number' && draggedCharacter.index !== dropIndex) {
      reorderCharacters(draggedCharacter.index, dropIndex);
    }
    
    handleDragEnd();
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
    resetAllSchedules,
    // 드래그 앤 드롭 관련
    draggedCharacter,
    dragOverIndex,
    dragPreviewIndex,
    isAnimating,
    movingCards,
    gridColumns,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    getCardTransform,
    calculateCardPosition,
    getAffectedCardsPositions
  };
};

export default useScheduler;