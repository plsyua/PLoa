import { useState, useEffect } from 'react';
import { DollarSign, ChevronUp, ChevronDown } from 'lucide-react';
import { getIcon } from '../../utils/icons';

// 레이드 데이터 상수 정의
const RAID_DATA = [
  { id: 'valtan_hard', name: '발탄 하드', itemLevel: 1445, gold: 1800 },
  { id: 'biackiss_hard', name: '비아키스 하드', itemLevel: 1460, gold: 2400 },
  { id: 'kouku_normal', name: '쿠크세이튼 노말', itemLevel: 1475, gold: 3000 },
  { id: 'abrel_hard_1_3', name: '아브렐슈드 하드 1-3', itemLevel: 1540, gold: 3600 },
  { id: 'abrel_4', name: '아브렐슈드 하드 4 (격주)', itemLevel: 1560, gold: 2000 },
  { id: 'kayang_hard', name: '카양겔 하드', itemLevel: 1580, gold: 4300 },
  { id: 'illiakan_hard', name: '일리아칸 하드', itemLevel: 1600, gold: 6000 },
  { id: 'ivory_tower_hard', name: '혼돈의 상아탑 하드', itemLevel: 1620, gold: 7200 },
  { id: 'kamen_hard_1_3', name: '카멘 하드 1-3', itemLevel: 1630, gold: 8000 },
  { id: 'kamen_4', name: '카멘 하드 4 (격주)', itemLevel: 1630, gold: 5000 },
  
  { id: 'behemoth_normal', name: '베히모스 노말', itemLevel: 1640, gold: 8800 },
  { id: 'ekidna_normal', name: '서막: 에키드나 노말', itemLevel: 1620, gold: 7300 },
  { id: 'ekidna_hard', name: '서막: 에키드나 하드', itemLevel: 1640, gold: 8800 },
  { id: 'aegir_normal', name: '1막: 에기르 노말', itemLevel: 1660, gold: 15500 },
  { id: 'aegir_hard', name: '1막: 에기르 하드', itemLevel: 1680, gold: 24500 },
  { id: '2nd_abrel_normal', name: '2막: 아브렐슈드 노말', itemLevel: 1670, gold: 21500 },
  { id: '2nd_abrel_hard', name: '2막: 아브렐슈드 하드', itemLevel: 1690, gold: 30500 },
  { id: '3rd_mordum_normal', name: '3막: 모르둠 노말', itemLevel: 1680, gold: 28000 },
  { id: '3rd_mordum_hard', name: '3막: 모르둠 하드', itemLevel: 1700, gold: 38000 }
];

// 레이드 연계 관계 정의 (부모 -> 자식)
const RAID_DEPENDENCIES = {
  'abrel_hard_1_3': 'abrel_4',      // 아브렐슈드 하드 1-3 -> 아브렐슈드 하드 4 (격주)
  'kamen_hard_1_3': 'kamen_4'       // 카멘 하드 1-3 -> 카멘 하드 4 (격주)
};

// 노말/하드 레이드 쌍 정의 (노말 -> 하드)
const NORMAL_HARD_PAIRS = {
  'ekidna_normal': 'ekidna_hard',
  'aegir_normal': 'aegir_hard',
  '2nd_abrel_normal': '2nd_abrel_hard',
  '3rd_mordum_normal': '3rd_mordum_hard'
};

// 테스트용 더미 데이터
const DUMMY_SIBLINGS_DATA = [
  { CharacterName: "테스트캐릭1", ItemAvgLevel: "1630.00", CharacterClassName: "버서커", ServerName: "카단" },
  { CharacterName: "테스트캐릭2", ItemAvgLevel: "1620.00", CharacterClassName: "소서리스", ServerName: "카단" },
  { CharacterName: "테스트캐릭3", ItemAvgLevel: "1610.00", CharacterClassName: "아르카나", ServerName: "카단" },
  { CharacterName: "테스트캐릭4", ItemAvgLevel: "1600.00", CharacterClassName: "데모닉", ServerName: "카단" },
  { CharacterName: "테스트캐릭5", ItemAvgLevel: "1590.00", CharacterClassName: "리퍼", ServerName: "카단" },
  { CharacterName: "테스트캐릭6", ItemAvgLevel: "1580.00", CharacterClassName: "도화가", ServerName: "카단" }
];

// 주간 골드 계산기 컴포넌트
const WeeklyGoldCalculator = ({ siblingsData = [] }) => {
  // 캐릭터별 레이드 선택 상태 관리 (characterName -> [raidId, ...])
  const [characterRaidSelections, setCharacterRaidSelections] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  // 실제 데이터가 없을 때 더미 데이터 사용 (개발환경에서만)
  const effectiveSiblingsData = siblingsData.length > 0 ? siblingsData : 
    (import.meta.env.DEV ? DUMMY_SIBLINGS_DATA : []);

  // 아이템레벨 1445 이상 캐릭터 필터링 및 파싱
  const eligibleCharacters = effectiveSiblingsData
    .map(char => ({
      ...char,
      ItemAvgLevel: parseFloat(char.ItemAvgLevel?.replace(',', '') || '0')
    }))
    .filter(char => char.ItemAvgLevel >= 1445)
    .sort((a, b) => (b.ItemAvgLevel || 0) - (a.ItemAvgLevel || 0));

  // 서버별로 캐릭터 그룹핑 및 서버당 상위 6개 선택
  const charactersByServer = eligibleCharacters.reduce((acc, char) => {
    const serverName = char.ServerName || '알 수 없는 서버';
    if (!acc[serverName]) {
      acc[serverName] = [];
    }
    if (acc[serverName].length < 6) {
      acc[serverName].push(char);
    }
    return acc;
  }, {});

  // 전체 선택된 캐릭터들 (계산용)
  const allSelectedCharacters = Object.values(charactersByServer).flat();


  // 각 캐릭터별로 참여 가능한 레이드 목록 생성 (상위 8개만)
  const getAvailableRaidsForCharacter = (character) => {
    return RAID_DATA
      .filter(raid => {
        // 기본 아이템레벨 체크
        if (character.ItemAvgLevel < raid.itemLevel) return false;
        
        // 노말 레이드인 경우, 해당 하드 레이드에 충족되는지 확인
        const hardVersion = NORMAL_HARD_PAIRS[raid.id];
        if (hardVersion) {
          const hardRaid = RAID_DATA.find(r => r.id === hardVersion);
          if (hardRaid && character.ItemAvgLevel >= hardRaid.itemLevel) {
            return false; // 하드에 충족되므로 노말 제외
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        // 1차 정렬: 아이템레벨 높은 순
        if (b.itemLevel !== a.itemLevel) {
          return b.itemLevel - a.itemLevel;
        }
        // 2차 정렬: 골드 많이 주는 순
        return b.gold - a.gold;
      })
      .slice(0, 8);  // 상위 8개만 선택
  };

  // 컴포넌트 마운트 시 각 캐릭터별로 최고 골드 레이드 자동 선택
  useEffect(() => {
    if (allSelectedCharacters.length > 0) {
      const newSelections = {};
      
      allSelectedCharacters.forEach(character => {
        const availableRaids = getAvailableRaidsForCharacter(character);
        if (availableRaids.length > 0) {
          // 각 캐릭터별로 상위 3개 레이드 자동 선택 (getAvailableRaidsForCharacter에서 이미 아이템레벨 순 정렬됨)
          const topThreeRaids = availableRaids
            .slice(0, 3)
            .map(raid => raid.id);
          
          // 연계 레이드 자동 추가
          const finalRaids = [...topThreeRaids];
          topThreeRaids.forEach(raidId => {
            const dependentRaid = RAID_DEPENDENCIES[raidId];
            if (dependentRaid && availableRaids.some(raid => raid.id === dependentRaid)) {
              finalRaids.push(dependentRaid);
            }
          });
          
          newSelections[character.CharacterName] = finalRaids;
        }
      });
      
      setCharacterRaidSelections(newSelections);
    } else {
      setCharacterRaidSelections({});
    }
  }, [allSelectedCharacters.map(char => `${char.CharacterName}_${char.ItemAvgLevel}`).join('|')]);

  // 연계 레이드인지 확인하는 함수
  const isDependentRaid = (raidId) => {
    return Object.values(RAID_DEPENDENCIES).includes(raidId);
  };

  // 기본 레이드 개수 계산 (연계 레이드 제외)
  const getBasicRaidCount = (selections) => {
    return selections.filter(id => !isDependentRaid(id)).length;
  };

  // 캐릭터별 레이드 선택 토글 핸들러
  const handleCharacterRaidToggle = (characterName, raidId) => {
    setCharacterRaidSelections(prev => {
      const currentSelections = prev[characterName] || [];
      
      if (currentSelections.includes(raidId)) {
        // 체크 해제
        let newSelections = currentSelections.filter(id => id !== raidId);
        
        // 만약 해제하는 것이 부모 레이드라면, 연계된 자식 레이드도 함께 해제
        const dependentRaid = RAID_DEPENDENCIES[raidId];
        if (dependentRaid && currentSelections.includes(dependentRaid)) {
          newSelections = newSelections.filter(id => id !== dependentRaid);
        }
        
        return {
          ...prev,
          [characterName]: newSelections
        };
      } else {
        // 체크 추가
        const basicRaidCount = getBasicRaidCount(currentSelections);
        const isDependent = isDependentRaid(raidId);
        
        // 연계 레이드가 아닌 경우 3개 제한 확인
        if (!isDependent && basicRaidCount >= 3) {
          return prev; // 3개 제한 도달 시 추가 불가
        }
        
        // 연계 레이드인 경우 부모 레이드가 선택되어 있는지 확인
        if (isDependent) {
          const parentRaid = Object.keys(RAID_DEPENDENCIES).find(key => RAID_DEPENDENCIES[key] === raidId);
          if (!parentRaid || !currentSelections.includes(parentRaid)) {
            return prev; // 부모 레이드가 선택되지 않은 경우 추가 불가
          }
        }
        
        return {
          ...prev,
          [characterName]: [...currentSelections, raidId]
        };
      }
    });
  };

  // 계산 로직들
  const calculateCharacterGold = (characterName) => {
    const selectedRaids = characterRaidSelections[characterName] || [];
    return selectedRaids.reduce((sum, raidId) => {
      const raid = RAID_DATA.find(r => r.id === raidId);
      return sum + (raid ? raid.gold : 0);
    }, 0);
  };

  const calculateServerGold = (serverName) => {
    const characters = charactersByServer[serverName] || [];
    return characters.reduce((sum, character) => {
      return sum + calculateCharacterGold(character.CharacterName);
    }, 0);
  };

  // 전체 총 골드 계산
  const totalGold = allSelectedCharacters.reduce((sum, character) => {
    return sum + calculateCharacterGold(character.CharacterName);
  }, 0);

  // 카테고리 구분 제거 - 단일 리스트로 표시

  return (
    <div className="bg-gradient-to-r from-blue-600/30 to-blue-500/30 border border-blue-400/50 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">주간 골드 획득량</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold text-xl">
            {totalGold.toLocaleString()} G
          </span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-yellow-300 hover:text-yellow-100 transition-colors p-1 hover:bg-yellow-600/20 rounded"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <>
          {Object.keys(charactersByServer).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(charactersByServer).map(([serverName, characters]) => (
                <div key={serverName} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{serverName}</h4>
                    <span className="text-yellow-400 font-bold">
                      {calculateServerGold(serverName).toLocaleString()}G
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((character) => {
                      const availableRaids = getAvailableRaidsForCharacter(character);
                      const selectedRaidIds = characterRaidSelections[character.CharacterName] || [];
                      const characterGold = calculateCharacterGold(character.CharacterName);
                      
                      return (
                        <div key={character.CharacterName} className="bg-gray-200 dark:bg-gray-600 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-500 rounded-full flex items-center justify-center overflow-hidden">
                                {(() => {
                                  const classIcon = getIcon('CHARACTER', character.CharacterClassName);
                                  return classIcon ? (
                                    <img 
                                      src={classIcon} 
                                      alt={character.CharacterClassName}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null;
                                })()}
                                <span 
                                  className="text-gray-900 dark:text-white text-sm font-bold w-full h-full flex items-center justify-center"
                                  style={{ display: getIcon('CHARACTER', character.CharacterClassName) ? 'none' : 'flex' }}
                                >
                                  {character.CharacterName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-gray-900 dark:text-white font-medium text-sm">
                                  {character.CharacterName}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 text-xs">
                                  {character.CharacterClassName} • {character.ItemAvgLevel.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-yellow-400 font-bold text-sm">
                                {characterGold.toLocaleString()}G
                              </span>
                              <p className="text-gray-600 dark:text-gray-500 text-xs">
                                {getBasicRaidCount(selectedRaidIds)}/3
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {availableRaids.map((raid) => {
                              const isSelected = selectedRaidIds.includes(raid.id);
                              const isDependent = isDependentRaid(raid.id);
                              const basicRaidCount = getBasicRaidCount(selectedRaidIds);
                              
                              // 비활성화 조건 계산
                              let isDisabled = false;
                              if (!isSelected) {
                                if (isDependent) {
                                  // 연계 레이드인 경우: 부모 레이드가 선택되지 않았으면 비활성화
                                  const parentRaid = Object.keys(RAID_DEPENDENCIES).find(key => RAID_DEPENDENCIES[key] === raid.id);
                                  isDisabled = !parentRaid || !selectedRaidIds.includes(parentRaid);
                                } else {
                                  // 일반 레이드인 경우: 기본 3개 제한
                                  isDisabled = basicRaidCount >= 3;
                                }
                              }
                              
                              return (
                                <label 
                                  key={raid.id}
                                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                                    isSelected
                                      ? 'bg-blue-600/20 border border-blue-500' 
                                      : isDisabled
                                      ? 'bg-gray-300 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-500'
                                  } ${isDependent ? 'ml-4 border-l-2 border-gray-400 dark:border-gray-500' : ''}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleCharacterRaidToggle(character.CharacterName, raid.id)}
                                      disabled={isDisabled}
                                      className="w-3 h-3 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                                    />
                                  <div className="flex flex-col">
                                    <span className="text-gray-900 dark:text-white text-xs font-medium">
                                      {raid.name}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400 text-xs">
                                      {raid.itemLevel.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                    <span className="text-yellow-400 font-bold text-xs">
                                      {raid.gold.toLocaleString()}G
                                    </span>
                                  </label>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-2">아이템레벨 1445 이상의 캐릭터가 없습니다.</p>
              <p className="text-gray-600 dark:text-gray-500 text-sm">
                {effectiveSiblingsData.length === 0 
                  ? "원정대 캐릭터 정보를 불러와주세요." 
                  : "캐릭터의 아이템 레벨을 1445 이상으로 올려주세요."}
              </p>
            </div>
          )}
          
        </>
      )}
    </div>
  );
};

export default WeeklyGoldCalculator;