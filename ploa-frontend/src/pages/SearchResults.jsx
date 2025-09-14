import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { User, ExternalLink, TrendingUp, Swords, Crown, Calendar, Zap } from 'lucide-react';
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

// 외부 사이트 링크 생성
const generateExternalLinks = (characterName) => {
  return {
    lostarkInfo: `https://lostark.game.onstove.com/Profile/Character/${encodeURIComponent(characterName)}`,
    loawa: `https://loawa.com/char/${encodeURIComponent(characterName)}`,
    lostarkDiary: `https://lostark-diary.com/character/${encodeURIComponent(characterName)}`,
  };
};

const CharacterCard = ({ characterName, onCharacterClick }) => {
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
        try {
          const arkPassive = await getCharacterArkPassive(characterName);
          setArkPassiveData(arkPassive);
        } catch (arkPassiveError) {
          console.warn('아크패시브 정보 로드 실패:', arkPassiveError);
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

  // 외부 링크
  const externalLinks = generateExternalLinks(characterName);

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
        <div className="mt-4 flex gap-2 flex-wrap">
          <a
            href={externalLinks.lostarkInfo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-sm rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
          >
            <ExternalLink size={12} />
            전투정보실
          </a>
        </div>
      </div>
    );
  }

  if (!characterData) return null;

  const classIcon = getIcon('CHARACTER', characterData.CharacterClassName);
  const itemLevel = parseFloat(characterData.ItemAvgLevel?.replace(',', '') || '0');
  const expeditionLevel = parseInt(characterData.ExpeditionLevel || '0');

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500"
      onClick={() => onCharacterClick(characterName)}
    >
      {/* 캐릭터 기본 정보 헤더 */}
      <div className="flex items-center gap-4 mb-4">
        {/* 캐릭터 아이콘 */}
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
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
            className="w-6 h-6 text-gray-500 dark:text-gray-400" 
            style={{ display: classIcon ? 'none' : 'flex' }}
          />
        </div>

        {/* 캐릭터 기본 정보 */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {characterData.CharacterName}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{characterData.ServerName}</span>
            <span>•</span>
            <span>{characterData.CharacterClassName}</span>
            {characterData.GuildName && (
              <>
                <span>•</span>
                <span>
                  {characterData.GuildName}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 전투정보실 버튼 */}
        <div className="text-right">
          <a
            href={externalLinks.lostarkInfo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-sm rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
          >
            <ExternalLink size={12} />
            전투정보실
          </a>
        </div>
      </div>

      {/* 캐릭터 정보 메인 콘텐츠 영역 */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 좌측: 레벨 및 전투력 정보 */}
        <div className="w-fit max-w-lg">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-1 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Crown size={14} className="text-yellow-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">원정대</span>
              </div>
              <div className="text-base font-bold text-gray-900 dark:text-white">
                Lv.{expeditionLevel}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-1 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap size={14} className={arkPassiveData && getCombatPowerColor(arkPassiveData) === 'text-green-400' ? 'text-green-500' : 'text-orange-500'} />
                <span className="text-xs text-gray-500 dark:text-gray-400">전투력</span>
              </div>
              <div className="text-base font-bold text-gray-900 dark:text-white">
                {characterData?.CombatPower
                  ? parseFloat(characterData.CombatPower.toString().replace(/[,\s]/g, '')).toLocaleString('ko-KR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                  : '정보없음'}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-1 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Swords size={14} className="text-red-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">아이템레벨</span>
              </div>
              <div className="text-base font-bold text-gray-900 dark:text-white">
                {itemLevel > 0 ? itemLevel.toLocaleString() : '정보없음'}
              </div>
            </div>
          </div>
        </div>

        {/* 우측: 레이드 참가 가능 정보 */}
        {expeditionData.length > 0 && (
          <div className="flex-1 lg:max-w-md border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-600 pt-4 lg:pt-0 lg:pl-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              레이드 참가 가능 캐릭터 수
            </span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {(() => {
              const validRaids = [];
              
              // 아이템레벨 높은 순으로 정렬하고 18명 제한 적용
              const sortedRaids = Object.entries(RAID_REQUIREMENTS)
                .sort((a, b) => b[1] - a[1]) // 아이템레벨 높은 순으로 정렬
                .map(([raidName, requiredLevel]) => ({
                  raidName,
                  requiredLevel,
                  eligibleCount: getEligibleCharacters(raidName)
                }))
                .filter(raid => raid.eligibleCount > 0); // 0명인 레이드는 제외
              
              // 상위 6개 레이드로 제한
              for (const raid of sortedRaids) {
                validRaids.push(raid);
                if (validRaids.length >= 6) break; // 6개 레이드 제한
              }
              
              return validRaids.map(({ raidName, requiredLevel, eligibleCount }) => {
                const iconUrl = getRaidIconUrl(raidName);
                
                return (
                  <div
                    key={raidName}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20
                               border border-blue-200 dark:border-blue-800 rounded-lg p-1
                               shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {/* 상단: 레이드 아이콘 + 이름 */}
                    <div className="flex items-center gap-1 mb-1">
                      {/* 레이드 아이콘 */}
                      <div className="flex-shrink-0 w-4 h-4 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                        {iconUrl ? (
                          <img 
                            src={iconUrl} 
                            alt={`${raidName} 아이콘`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: iconUrl ? 'none' : 'flex' }}>
                          <Crown size={16} />
                        </div>
                      </div>
                      
                      {/* 레이드 이름 */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[10px] font-semibold text-gray-900 dark:text-white truncate">
                          {raidName.length > 8 ? raidName.substring(0, 8) + '...' : raidName}
                        </h4>
                        <p className="text-[9px] text-gray-500 dark:text-gray-400">
                          {requiredLevel.toLocaleString()}+
                        </p>
                      </div>
                    </div>
                    
                    {/* 하단: 참가 가능 캐릭터 수 */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">참가 가능</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {eligibleCount}
                        </span>
                        <span className="text-[9px] text-gray-600 dark:text-gray-400">명</span>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nicknames } = location.state || {};

  // OCR로 인식된 닉네임이 없으면 자동 검색 페이지로 리다이렉트
  useEffect(() => {
    if (!nicknames || nicknames.length === 0) {
      navigate('/auto-search');
    }
  }, [nicknames, navigate]);

  // 캐릭터 클릭 시 상세 정보를 새 탭에서 열기
  const handleCharacterClick = (characterName) => {
    const url = `/character/${encodeURIComponent(characterName)}`;
    window.open(url, '_blank');
  };

  if (!nicknames || nicknames.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            검색 결과
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            인식된 {nicknames.length}명의 캐릭터 정보입니다. 캐릭터를 클릭하면 상세 정보를 확인할 수 있습니다.
          </p>
        </div>


        {/* 캐릭터 카드 리스트 */}
        <div className="grid grid-cols-1 gap-6">
          {nicknames.map((nickname, index) => (
            <CharacterCard
              key={`${nickname}-${index}`}
              characterName={nickname}
              onCharacterClick={handleCharacterClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;