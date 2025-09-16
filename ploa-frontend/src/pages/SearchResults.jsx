import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { User, TrendingUp, Swords, Crown, Calendar, Zap, UserPlus } from 'lucide-react';
import { getCombatPowerColor } from '../utils/combatPowerUtils';
// 레이드 아이콘 직접 import
import valtanIcon from '../assets/images/raid/valtan.webp';
import vykasIcon from '../assets/images/raid/vykas.webp';
import koukuIcon from '../assets/images/raid/kouku.webp';
import brelshazaIcon from '../assets/images/raid/brelshaza.webp';
import illiakanIcon from '../assets/images/raid/illiakan.webp';
import kamenIcon from '../assets/images/raid/kamen.webp';
import kayangelIcon from '../assets/images/raid/kayangel.webp';
import ivory_towerIcon from '../assets/images/raid/ivory_tower.webp';
import behemothIcon from '../assets/images/raid/behemoth.webp';
import ekidnaIcon from '../assets/images/raid/ekidna.webp';
import aegirIcon from '../assets/images/raid/aegir.webp';
import abrelIcon from '../assets/images/raid/abrel.webp';
import mordumIcon from '../assets/images/raid/mordum.webp';
import armocheIcon from '../assets/images/raid/armoche.webp';
import kazerothIcon from '../assets/images/raid/kazeroth.webp';
import { getCharacterProfile, getCharacterSiblings, getCharacterArkPassive } from '../services/lostarkApi';
import { getIcon } from '../data/icons';

// 레이드별 아이템레벨 요구사항 데이터 (WeeklyGoldCalculator와 동기화)
const RAID_REQUIREMENTS = {
  // 군단장 레이드
  '발탄 하드': 1445,
  '비아키스 하드': 1460,
  '쿠크세이튼 노말': 1475,
  '아브렐슈드 하드 1-3': 1540,
  '아브렐슈드 하드 4': 1560,
  '카양겔 하드': 1580,
  '일리아칸 하드': 1600,
  '혼돈의 상아탑 하드': 1620,
  '카멘 하드 1-3': 1630,
  '카멘 하드 4': 1630,
  
  // 에픽 레이드
  '베히모스 노말': 1640,
  
  // 카제로스 레이드
  '서막: 에키드나 노말': 1620,
  '서막: 에키드나 하드': 1640,
  '1막: 에기르 노말': 1660,
  '1막: 에기르 하드': 1680,
  '2막: 아브렐슈드 노말': 1670,
  '2막: 아브렐슈드 하드': 1690,
  '3막: 모르둠 노말': 1680,
  '3막: 모르둠 하드': 1700,
  '4막: 아르모체 노말': 1700,
  '4막: 아르모체 하드': 1720,
  '종막: 카제로스 노말': 1710,
  '종막: 카제로스 하드': 1730,
};

// 레이드명으로 아이콘 찾기 (RAID_REQUIREMENTS 키값에 맞춰 매핑)
const getRaidIconUrl = (raidName) => {
  // 레이드명에서 난이도 정보를 제거하고 기본 레이드명 추출
  const raidIconMapping = {
    // 발탄
    '발탄 하드': valtanIcon,
    
    // 비아키스
    '비아키스 하드': vykasIcon,
    
    // 쿠크세이튼
    '쿠크세이튼 노말': koukuIcon,
    
    // 아브렐슈드
    '아브렐슈드 하드 1-3': brelshazaIcon,
    '아브렐슈드 하드 4': brelshazaIcon,
    
    // 카양겔
    '카양겔 하드': kayangelIcon,
    
    // 일리아칸
    '일리아칸 하드': illiakanIcon,
    
    // 혼돈의 상아탑
    '혼돈의 상아탑 하드': ivory_towerIcon,
    
    // 카멘
    '카멘 하드 1-3': kamenIcon,
    '카멘 하드 4': kamenIcon,
    
    // 베히모스
    '베히모스 노말': behemothIcon,
    
    // 카제로스 레이드
    '서막: 에키드나 노말': ekidnaIcon,
    '서막: 에키드나 하드': ekidnaIcon,
    '1막: 에기르 노말': aegirIcon,
    '1막: 에기르 하드': aegirIcon,
    '2막: 아브렐슈드 노말': abrelIcon,
    '2막: 아브렐슈드 하드': abrelIcon,
    '3막: 모르둠 노말': mordumIcon,
    '3막: 모르둠 하드': mordumIcon,
    '4막: 아르모체 노말': armocheIcon,
    '4막: 아르모체 하드': armocheIcon,
    '종막: 카제로스 노말': kazerothIcon,
    '종막: 카제로스 하드': kazerothIcon
  };

  return raidIconMapping[raidName] || null;
};

// 빈 슬롯 컴포넌트
const EmptySlot = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <UserPlus className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
            모집중
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            파티원을 찾고 있습니다
          </p>
        </div>
      </div>
    </div>
  );
};

// 직업별 시너지 데이터
const CLASS_SYNERGIES = {
  // 전사
  '슬레이어': ['피증'],
  '발키리': {
    서폿: ['낙인', '이속'],
    딜러: ['치피증']
  },
  '홀리나이트': {
    서폿: ['낙인'],
    딜러: ['치피증']
  },
  '버서커': ['피증'],
  '워로드': ['방깎', '백헤드'],
  '디스트로이어': ['방깎'],
  // 마법사
  '아르카나': ['치적'],
  '서머너': ['방깎'],
  '소서리스': ['피증'],
  '바드': {
    서폿: ['낙인', '공깎'],
    딜러: ['방깎']
  },
  // 무도가
  '브레이커': ['피증'],
  '창술사': ['치피증'],
  '배틀마스터': ['치적', '공이속'],
  '인파이터': ['피증'],
  '기공사': ['공증'],
  '스트라이커': ['치적'],
  // 헌터
  '건슬링어': ['치적'],
  '데빌헌터': ['치적'],
  '스카우터': ['공증'],
  '블래스터': ['방깎'],
  '호크아이': ['피증'],
  // 암살자
  '데모닉': ['피증'],
  '블레이드': ['백헤드', '공이속'],
  '리퍼': ['방깎'],
  '소울이터': ['피증'],
  // 스페셜리스트
  '도화가': {
    서폿: ['낙인'],
    딜러: ['방깎']
  },
  '기상술사': ['치적'],
  '환수사': ['방깎']
};

// 레이드 이름 줄임
const shortenRaidName = (raidName) => {
  // '종막: 카제로스 노말' → '종막 노말'
  if (raidName.includes(':')) {
    const [act, rest] = raidName.split(':');
    const simplifiedRest = rest.trim().split(' ');
    return `${act.trim()} ${simplifiedRest[simplifiedRest.length - 1]}`;
  }
  
  // '아브렐슈드' → '아브렐', '베히모스' → '베히'
  return raidName
    .replace('아브렐슈드', '아브렐')
    .replace('베히모스', '베히');
};

// 시너지 색상 매핑
const SYNERGY_COLORS = {
  '치피증': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  '피증': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  '방깎': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  '공증': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  '백헤드': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
  '치적': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
  '낙인': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  '이속': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  '공이속': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  '공깎': 'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200',
};

// 시너지 정렬 우선순위 (색깔별 그룹화)
const SYNERGY_PRIORITY = {
  // 파랑 (딜증계) - 우선순위 1
  '치피증': 1, '피증': 1, '방깎': 1, '공증': 1,
  // 빨강 (백헤드/치적계) - 우선순위 2  
  '백헤드': 2, '치적': 2,
  // 초록 (지원계) - 우선순위 3
  '낙인': 3, '이속': 3, '공이속': 3,
  // 기타 - 우선순위 4 (정의되지 않은 시너지)
};

// 시너지 배지 컴포넌트
const SynergyBadge = ({ synergyName, count }) => {
  const colorClass = SYNERGY_COLORS[synergyName] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {synergyName}{count > 1 && ` x${count}`}
    </span>
  );
};

// 파티별 시너지 집계 함수
const getPartySynergies = (partyMembers, characterDataMap) => {
  const synergyCount = {};
  
  partyMembers.forEach(nickname => {
    if (nickname && characterDataMap[nickname] && characterDataMap[nickname].synergies) {
      characterDataMap[nickname].synergies.forEach(synergy => {
        synergyCount[synergy] = (synergyCount[synergy] || 0) + 1;
      });
    }
  });
  
  return Object.entries(synergyCount)
    .map(([synergy, count]) => ({ name: synergy, count }))
    .sort((a, b) => {
      // 색깔별 우선순위로 정렬 (파랑 > 빨강 > 초록 > 기타)
      const priorityA = SYNERGY_PRIORITY[a.name] || 4;
      const priorityB = SYNERGY_PRIORITY[b.name] || 4;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB; // 우선순위별 정렬
      }
      return a.name.localeCompare(b.name); // 같은 우선순위 내에서 이름순
    });
};

// 시너지 정보 가져오기
const getClassSynergies = (className, arkPassiveData) => {
  const synergies = CLASS_SYNERGIES[className];
  
  if (!synergies) return [];
  
  // 바드 같이 서폿/딜러 구분이 있는 경우
  if (typeof synergies === 'object' && !Array.isArray(synergies)) {
    const combatPowerColor = getCombatPowerColor(arkPassiveData);
    const role = combatPowerColor === 'text-green-400' ? '서폿' : '딜러';
    return synergies[role] || [];
  }
  
  return synergies;
};


const CharacterCard = ({ characterName, onCharacterClick, onDataLoaded }) => {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expeditionData, setExpeditionData] = useState([]);
  const [arkPassiveData, setArkPassiveData] = useState(null);

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 캐릭터 기본 정보 가져오기
        const profile = await getCharacterProfile(characterName);
        if (!profile) {
          throw new Error('캐릭터를 찾을 수 없습니다');
        }

        setCharacterData(profile);

        // 원정대 정보 가져오기
        try {
          const siblings = await getCharacterSiblings(characterName);
          if (siblings && Array.isArray(siblings)) {
            setExpeditionData(siblings);
          }
        } catch (siblingError) {
          console.warn('원정대 정보 로드 실패:', siblingError);
        }

        // 아크패시브 정보 가져오기 (서포터 판단용)
        let arkPassive = null; 
        try {
          arkPassive = await getCharacterArkPassive(characterName);
          setArkPassiveData(arkPassive);
        } catch (arkPassiveError) {
          console.warn('아크패시브 정보 로드 실패:', arkPassiveError);
        }
          // 시너지 정보 계산 및 부모 컴포넌트에 전달
          const synergies = getClassSynergies(profile.CharacterClassName, arkPassive);
          if (onDataLoaded) {
            onDataLoaded(characterName, { synergies, characterData: profile, arkPassive });
          }

      } catch (err) {
        console.error('캐릭터 데이터 로드 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (characterName) {
      fetchCharacterData();
    }
  }, [characterName]);

  // 레이드 참가 가능한 캐릭터 수 계산 (각 캐릭터별 상위 3개 레이드 기준)
  const getEligibleCharacters = (targetRaidName) => {
    let count = 0;

    expeditionData.forEach(char => {
      const itemLevel = parseFloat(char.ItemAvgLevel?.replace(',', '') || '0');
      if (itemLevel < 1640) return; // 기본 참가 자격 미달 (1640 이상 캐릭터만 필터링)

      // 해당 캐릭터가 입장 가능한 모든 레이드 목록 생성 (아이템레벨 높은 순으로 정렬)
      const availableRaids = Object.entries(RAID_REQUIREMENTS)
        .filter(([, requiredLevel]) => itemLevel >= requiredLevel)
        .sort((a, b) => b[1] - a[1]) // 아이템레벨 높은 순 정렬
        .slice(0, 3) // 상위 3개 레이드만 선택
        .map(([name]) => name);
      
      // 타겟 레이드가 해당 캐릭터의 상위 3개 레이드에 포함되는지 확인
      if (availableRaids.includes(targetRaidName)) {
        count++;
      }
    });
    
    return count;
  };


  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600 dark:text-gray-400">캐릭터 정보 로딩 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-300 dark:border-red-600 p-6">
        <div className="flex items-center gap-3 mb-3">
          <User className="w-8 h-8 text-red-500" />
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">{characterName}</h3>
        </div>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!characterData) return null;

  const classIcon = getIcon('CHARACTER', characterData.CharacterClassName);
  const itemLevel = parseFloat(characterData.ItemAvgLevel?.replace(',', '') || '0');
  const expeditionLevel = parseInt(characterData.ExpeditionLevel || '0');
  const classSynergies = getClassSynergies(characterData.CharacterClassName, arkPassiveData);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500"
      onClick={() => onCharacterClick(characterName)}
    >
      {/* 캐릭터 기본 정보 */}
      <div className="text-center mb-4">
        {/* 캐릭터 아이콘 */}
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 overflow-hidden mx-auto mb-3">
          {classIcon ? (
            <img 
              src={classIcon} 
              alt={characterData.CharacterClassName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <User 
            className="w-8 h-8 text-gray-500 dark:text-gray-400" 
            style={{ display: classIcon ? 'none' : 'flex' }}
          />
        </div>

        {/* 캐릭터 기본 정보 */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {characterData.CharacterName}
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <div className="flex items-center flex-wrap gap-2">
            <span>{characterData.ServerName} • {characterData.CharacterClassName}</span>
            {classSynergies.length > 0 && (
              <div className="flex gap-1">
                {classSynergies.map(synergy => (
                  <span 
                    key={synergy}
                    className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                  >
                    {synergy}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 캐릭터 정보 (가로형) */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">원정대</span>
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            Lv.{expeditionLevel}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">전투력</span>
          </div>
          <div className={`text-sm font-bold ${arkPassiveData && getCombatPowerColor(arkPassiveData) === 'text-green-400' ? 'text-green-400' : 'text-red-400'}`}>
            {characterData?.CombatPower
              ? parseFloat(characterData.CombatPower.toString().replace(/[,\s]/g, '')).toLocaleString('ko-KR', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })
              : '정보없음'}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">템렙</span>
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            {itemLevel > 0 ? itemLevel.toLocaleString() : '정보없음'}
          </div>
        </div>
      </div>

      {/* 레이드 참가 가능 정보 (간소화) */}
      {expeditionData.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Calendar size={12} className="text-blue-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              원정대 참가 가능 레이드
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {(() => {
              const validRaids = [];
              
              // 아이템레벨 높은 순으로 정렬하고 상위 6개만 표시
              const sortedRaids = Object.entries(RAID_REQUIREMENTS)
                .sort((a, b) => b[1] - a[1])
                .map(([raidName, requiredLevel]) => ({
                  raidName,
                  requiredLevel,
                  eligibleCount: getEligibleCharacters(raidName)
                }))
                .filter(raid => raid.eligibleCount > 0);
              
              // 상위 6개 레이드로 제한
              for (const raid of sortedRaids) {
                validRaids.push(raid);
                if (validRaids.length >= 6) break;
              }
              
              return validRaids.map(({ raidName, requiredLevel, eligibleCount }) => {
                return (
                  <div
                    key={raidName}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20
                               border border-blue-200 dark:border-blue-800 rounded p-1 text-center"
                  >
                    <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {shortenRaidName(raidName)}
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-0.5 mx-1 my-1">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {requiredLevel}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {eligibleCount}명
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nicknames } = location.state || {};
  
  // 캐릭터 데이터 수집을 위한 상태
  const [characterDataMap, setCharacterDataMap] = useState({});

  // OCR로 인식된 닉네임이 없으면 자동 검색 페이지로 리다이렉트
  useEffect(() => {
    if (!nicknames || nicknames.length === 0) {
      navigate('/party-search');
    }
  }, [nicknames, navigate]);

  // OCR 결과에 빈 슬롯 정보 추가 (임시 해결책)
  const insertEmptySlots = (names) => {
    // 현재 OCR 결과가 6개이고 실제로는 2-3, 2-4가 빈 슬롯인 경우
    if (names.length === 6) {
      return [
        names[0], // 1-1: 귀여운건슬링
        names[1], // 2-1: 리릭시아
        names[2], // 1-2: 친구차이
        names[3], // 2-2: 플슈링
        names[4], // 1-3: 밤고개로
        '!',      // 2-3: 빈 슬롯
        names[5], // 1-4: 홀리는딜러입니다
        '!'       // 2-4: 빈 슬롯
      ];
    }
    return names;
  };

  // 파티별로 닉네임 분리 (1-1, 2-1, 1-2, 2-2, 1-3, 2-3, 1-4, 2-4 순서)
  const organizeParties = (names) => {
    const party1 = []; // 1번 파티
    const party2 = []; // 2번 파티
    let position1 = 0; // 1번 파티 포지션 카운터
    let position2 = 0; // 2번 파티 포지션 카운터
    
    for (let i = 0; i < names.length; i++) {
      const nickname = names[i];
      
      // 현재 어느 파티 차례인지 판단 (전체 포지션 기준)
      const totalPosition = position1 + position2;
      const isParty1Turn = (totalPosition % 2 === 0);
      
      // '!' 또는 '모집중' 인식된 경우 해당 파티에 null 추가
      if (nickname === '!' || nickname === '모집중') {
        if (isParty1Turn) {
          party1.push(null);
          position1++;
        } else {
          party2.push(null);
          position2++;
        }
        continue;
      }
      
      // 실제 닉네임 처리
      if (nickname) {
        if (isParty1Turn) {
          party1.push(nickname);
          position1++;
        } else {
          party2.push(nickname);
          position2++;
        }
      }
    }
    
    // 각 파티를 정확히 4개 슬롯으로 맞추기
    while (party1.length < 4) {
      party1.push(null);
    }
    while (party2.length < 4) {
      party2.push(null);
    }
    
    return { party1, party2 };
  };

  // 캐릭터 클릭 시 상세 정보를 새 탭에서 열기
  const handleCharacterClick = (characterName) => {
    const url = `/character/${encodeURIComponent(characterName)}`;
    window.open(url, '_blank');
  };

  if (!nicknames || nicknames.length === 0) {
    return null;
  }

  const processedNames = insertEmptySlots(nicknames);
  const { party1, party2 } = organizeParties(processedNames);
  
  // 캐릭터 데이터 로드 완료 시 호출되는 함수
  const handleCharacterDataLoaded = (characterName, data) => {
    setCharacterDataMap(prev => ({
      ...prev,
      [characterName]: data
    }));
  };
  
  // 파티별 시너지 계산
  const party1Synergies = getPartySynergies(party1.filter(name => name !== null), characterDataMap);
  const party2Synergies = getPartySynergies(party2.filter(name => name !== null), characterDataMap);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            파티 구성 현황
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            파티별로 구성된 캐릭터 정보를 확인하세요.</p>
          <p className="text-gray-600 dark:text-gray-400">
            시너지 정보는 실제 채용 스킬이 아닌 보편적인 채용률로 적용됩니다.</p>
        </div>


        {/* 파티별 캐릭터 카드 */}
        <div className="space-y-8">
          {/* 1번 파티 */}
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">1번 파티</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({party1.filter(name => name !== null).length}/4명)
                </span>
              </div>
              {party1Synergies.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {party1Synergies.map((synergy, index) => (
                    <SynergyBadge 
                      key={index} 
                      synergyName={synergy.name} 
                      count={synergy.count} 
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {party1.map((nickname, index) => (
                nickname !== null && nickname ? (
                  <CharacterCard
                    key={`party1-${index}`}
                    characterName={nickname}
                    onCharacterClick={handleCharacterClick}
                    onDataLoaded={handleCharacterDataLoaded}
                  />
                ) : (
                  <EmptySlot key={`party1-empty-${index}`} />
                )
              ))}
            </div>
          </div>

          {/* 2번 파티 */}
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">2번 파티</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({party2.filter(name => name !== null).length}/4명)
                </span>
              </div>
              {party2Synergies.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {party2Synergies.map((synergy, index) => (
                    <SynergyBadge 
                      key={index} 
                      synergyName={synergy.name} 
                      count={synergy.count} 
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {party2.map((nickname, index) => (
                nickname !== null && nickname ? (
                  <CharacterCard
                    key={`party2-${index}`}
                    characterName={nickname}
                    onCharacterClick={handleCharacterClick}
                    onDataLoaded={handleCharacterDataLoaded}
                  />
                ) : (
                  <EmptySlot key={`party2-empty-${index}`} />
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;