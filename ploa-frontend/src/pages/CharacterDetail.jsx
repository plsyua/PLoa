import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, User, Star, Package, Zap, Map, Crown, ChevronDown, ChevronUp } from 'lucide-react';
import useFavorites from '../hooks/useFavorites';
import { 
  getCharacterProfile, 
  getCharacterEquipment, 
  getCharacterEngravings, 
  getCharacterGems, 
  getCharacterSkills,
  getCharacterCollectibles,
  getCharacterArkPassive,
  getCharacterSiblings
} from '../services/lostarkApi';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CollectiblesProgress from '../components/character/CollectiblesProgress';
import WeeklyGoldCalculator from '../components/character/WeeklyGoldCalculator';
import { 
  CharacterProfileSkeleton, 
  EquipmentSkeleton, 
  GemsSkeleton, 
  EngravingsSkeleton, 
  SkillsSkeleton, 
  CollectiblesSkeleton
} from '../components/common/SkeletonLoader';
import { getGradeTextColor, getMarketGradeStyle, getGradeBorderColor } from '../utils/formatters';
import { getGemDisplayInfo, calculateGemStats, getGemTypeBorderColor } from '../utils/gemUtils';
import { generateSimpleGemTooltip } from '../utils/tooltipParsers';
import { getRefiningLevel, getQualityValue, getQualityBgColor, parseArkPassiveDescription, getArkPassivePointColor, getArkPassivePointLevel, getItemLevel, getElixirEffects, getAbilityStoneEngravings, getAccessoryPolishEffects, getBraceletEffects, mapAbilityStoneEngravings } from '../utils/tooltipParsers';
import { getIcon } from '../utils/icons';
import { getTranscendenceLevel } from '../utils/equipmentParsers';
import { getCombatPowerColor } from '../utils/combatPowerUtils';
import { shortenAccessoryEffect, shouldShortenAccessory } from '../utils/accessoryShortener';

// 캐릭터 상세 정보 페이지
const CharacterDetail = () => {
  const { characterName } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  
  const [loading, setLoading] = useState(false);
  const [characterData, setCharacterData] = useState(null);
  const [error, setError] = useState('');
  
  // 탭 관련 상태
  const [activeTab, setActiveTab] = useState('equipment');
  const [tabLoading, setTabLoading] = useState(false);
  const [equipmentData, setEquipmentData] = useState(null);
  const [engravingsData, setEngravingsData] = useState(null);
  const [gemsData, setGemsData] = useState(null);
  const [skillsData, setSkillsData] = useState(null);
  const [collectiblesData, setCollectiblesData] = useState(null);
  const [arkPassiveData, setArkPassiveData] = useState(null);
  const [siblingsData, setSiblingsData] = useState(null);
  
  // 보석 섹션 확대/축소 상태
  const [isGemsExpanded, setIsGemsExpanded] = useState(false);
  


  // 컴포넌트 마운트 시 캐릭터 정보 로드
  useEffect(() => {
    if (characterName) {
      setActiveTab('equipment'); // 캐릭터 변경 시 장비탭으로 초기화
      handleSearch();
    }
  }, [characterName]);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setCharacterData(null);
    setEquipmentData(null);
    setEngravingsData(null);
    setGemsData(null);
    setSkillsData(null);
    setCollectiblesData(null);
    setArkPassiveData(null);
    setSiblingsData(null);

    try {
      const profile = await getCharacterProfile(characterName);
      setCharacterData(profile);
      
      // 장비탭과 아크패시브 데이터를 강제로 로드 (전투력 색상 판단을 위해 arkPassive 필요)
      loadTabData('equipment', characterName, true);
      loadTabData('engravings', characterName, true);
      loadTabData('gems', characterName, true);
      loadTabData('arkpassive', characterName, true);
      loadTabData('skills', characterName, true);
      loadTabData('roster', characterName, true); // 원정대 데이터 로드
    } catch (error) {
      console.error('캐릭터 검색 실패:', error);
      console.error('Error details:', {
        status: error.response?.status,
        message: error.message,
        response: error.response?.data
      });
      
      // 모든 에러 상황에 대해 에러 메시지 설정
      if (error.response?.status === 404 || error.message.includes('404') || error.response?.data === null) {
        setError(`'${characterName}' 캐릭터를 찾을 수 없습니다.`);
      } else {
        setError(`캐릭터 정보를 불러오는 중 오류가 발생했습니다. (${error.message || '알 수 없는 오류'})`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 즐겨찾기 토글 함수
  const handleFavoriteToggle = () => {
    const isCurrentlyFavorite = isFavorite(characterName);
    
    if (isCurrentlyFavorite) {
      removeFromFavorites(characterName);
    } else {
      // 캐릭터 정보가 있으면 추가 정보와 함께 저장
      const serverName = characterData?.ServerName || '';
      const className = characterData?.CharacterClassName || '';
      const itemLevel = characterData?.ItemAvgLevel ? parseFloat(characterData.ItemAvgLevel.replace(',', '')) : 0;
      
      addToFavorites(characterName, serverName, className, itemLevel);
    }
  };

  const loadTabData = async (tab, charName = characterName, forceReload = false) => {
    setTabLoading(true);
    try {
      switch (tab) {
        case 'equipment':
          if (!equipmentData || forceReload) {
            const equipment = await getCharacterEquipment(charName);
            setEquipmentData(equipment);
          }
          break;
        case 'engravings':
          if (!engravingsData || forceReload) {
            const engravings = await getCharacterEngravings(charName);
            setEngravingsData(engravings);
          }
          break;
        case 'gems':
          if (!gemsData || forceReload) {
            const gems = await getCharacterGems(charName);
            setGemsData(gems);
          }
          break;
        case 'skills':
          if (!skillsData || forceReload) {
            const skills = await getCharacterSkills(charName);
            setSkillsData(skills);
          }
          break;
        case 'collectibles':
          if (!collectiblesData || forceReload) {
            const collectibles = await getCharacterCollectibles(charName);
            setCollectiblesData(collectibles);
          }
          break;
        case 'arkpassive':
          if (!arkPassiveData || forceReload) {
            const arkPassive = await getCharacterArkPassive(charName);
            setArkPassiveData(arkPassive);
          }
          break;
        case 'roster':
          if (!siblingsData || forceReload) {
            const siblings = await getCharacterSiblings(charName);
            setSiblingsData(siblings);
          }
          break;
      }
    } catch (error) {
      console.error(`${tab} 정보 로드 실패:`, error);
    } finally {
      setTabLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (characterData) {
      loadTabData(tab);
    }
  };

  // 통합 섹션 렌더링 함수들
  // 장비 데이터 처리 - 컴포넌트 레벨
  const filteredEquipment = equipmentData ? equipmentData.filter(item => 
    !['나침반', '부적', '문장'].some(type => item.Type?.includes(type))
  ) : [];
  
  const armorOrder = ['투구', '어깨', '상의', '하의', '장갑', '무기'];
  const accessoryOrder = ['목걸이', '귀걸이', '반지'];
  
  const armor = filteredEquipment
    .filter(item => armorOrder.some(type => item.Type?.includes(type)))
    .sort((a, b) => {
      const aIndex = armorOrder.findIndex(type => a.Type?.includes(type));
      const bIndex = armorOrder.findIndex(type => b.Type?.includes(type));
      return aIndex - bIndex;
    });
    
  const accessories = filteredEquipment
    .filter(item => accessoryOrder.some(type => item.Type?.includes(type)))
    .sort((a, b) => {
      const aIndex = accessoryOrder.findIndex(type => a.Type?.includes(type));
      const bIndex = accessoryOrder.findIndex(type => b.Type?.includes(type));
      return aIndex - bIndex;
    });
    
  const bracelet = filteredEquipment.filter(item => item.Type?.includes('팔찌'));
  const abilityStone = filteredEquipment.filter(item => item.Type?.includes('스톤'));

  const renderIntegratedEquipment = () => {
    if (!equipmentData) return <div className="text-gray-500 dark:text-gray-400 text-center py-4">장비 정보를 불러오는 중...</div>;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">장비</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 왼쪽: 장비류 - 3컬럼 */}
          <div className="md:col-span-3 space-y-2">
            {armor.map((item, index) => (
              <div key={`armor-${index}`} className="bg-gray-100 dark:bg-gray-700 rounded p-2 flex items-start gap-2">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded border overflow-hidden flex-shrink-0 ${getGradeBorderColor(item.Grade)}`}>
                    {item.Icon && (
                      <img src={item.Icon} alt={item.Name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  {getQualityValue(item.Tooltip) >= 0 && (
                    <div className={`w-8 h-3 rounded flex items-center justify-center ${getQualityBgColor(getQualityValue(item.Tooltip))}`}>
                      <span className="text-white text-xs font-bold">
                        {getQualityValue(item.Tooltip)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium text-xs ${getGradeTextColor(item.Grade)} flex items-center gap-1 whitespace-nowrap`}>
                      {(() => {
                        const enhanceMatch = item.Name.match(/^\+(\d+)\s/);
                        const enhanceLevel = enhanceMatch ? `+${enhanceMatch[1]} ` : '';
                        return `${enhanceLevel}${item.Type}`;
                      })()}
                      {getRefiningLevel(item.Tooltip) && (
                        <span className="text-yellow-400 font-bold">
                          +{getRefiningLevel(item.Tooltip)}
                        </span>
                      )}
                      {getTranscendenceLevel(item.Tooltip) && (
                        <span className="text-gray-900 dark:text-white font-bold flex items-center gap-0.5">
                          <img 
                            src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/ico_tooltip_transcendence.png" 
                            alt="초월" 
                            className="w-3 h-3"
                          />
                          {getTranscendenceLevel(item.Tooltip)}
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-1">
                      {getItemLevel(item.Tooltip) && (
                        <div className="w-10 h-5 rounded flex items-center justify-center bg-gray-400 dark:bg-gray-600">
                          <span className="text-white text-xs font-bold">
                            {getItemLevel(item.Tooltip)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 엘릭서 효과 표시 */}
                  {getElixirEffects(item.Tooltip).length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {getElixirEffects(item.Tooltip).map((effect, idx) => {
                        const getLevelColor = (level) => {
                          const numLevel = parseInt(level, 10);
                          switch(numLevel) {
                            case 1: return 'text-gray-900 dark:text-white';
                            case 2: return 'text-green-400';
                            case 3: return 'text-blue-400';
                            case 4: return 'text-purple-400';
                            case 5: return 'text-orange-400';
                            default: return 'text-gray-400';
                          }
                        };
                        
                        return (
                          <div key={idx} className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700/30 border border-gray-400 dark:border-gray-500/50 rounded">
                            <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">{effect.name} </span>
                            <span className={`font-bold text-xs ${getLevelColor(effect.level)}`}>
                              Lv.{effect.level}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
          </div>
          
          {/* 오른쪽: 장신구류 + 어빌리티 스톤 - 2컬럼 */}
          <div className="md:col-span-2 space-y-2">
            {accessories.map((item, index) => (
              <div key={`accessory-${index}`} className="bg-gray-100 dark:bg-gray-700 rounded p-2 flex items-start gap-2">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded border overflow-hidden flex-shrink-0 ${getGradeBorderColor(item.Grade)}`}>
                    {item.Icon && (
                      <img src={item.Icon} alt={item.Name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  {getQualityValue(item.Tooltip) >= 0 && (
                    <div className={`w-8 h-3 rounded flex items-center justify-center ${getQualityBgColor(getQualityValue(item.Tooltip))}`}>
                      <span className="text-white text-xs font-bold">
                        {getQualityValue(item.Tooltip)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-end">
                    <div className="flex items-center gap-1">
                      {getRefiningLevel(item.Tooltip) && (
                        <span className="text-yellow-400 font-bold text-xs">
                          +{getRefiningLevel(item.Tooltip)}
                        </span>
                      )}
                      {getItemLevel(item.Tooltip) && (
                        <div className="w-10 h-4 rounded flex items-center justify-center bg-gray-400 dark:bg-gray-600">
                          <span className="text-white text-xs font-bold">
                            {getItemLevel(item.Tooltip)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 장신구 연마 효과 표시 - 한 줄씩 표시 */}
                  {shouldShortenAccessory(item.Type) && getAccessoryPolishEffects(item.Tooltip).length > 0 && (
                    <div className="space-y-0.5">
                      {getAccessoryPolishEffects(item.Tooltip)
                        .filter(effect => effect.grade && effect.grade !== '')
                        .map((effect, idx) => {
                          const { shortText, colorClass } = shortenAccessoryEffect(effect.text, effect.grade);
                          return (
                            <div key={idx} className="text-xs">
                              <span className={`font-medium ${colorClass}`}>
                                {shortText}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* 어빌리티 스톤 - 장신구와 통합 */}
            {abilityStone.length > 0 && abilityStone.map((item, index) => (
              <div key={`stone-${index}`} className="bg-gray-100 dark:bg-gray-700 rounded p-2 flex items-start gap-2">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded border overflow-hidden flex-shrink-0 ${getGradeBorderColor(item.Grade)}`}>
                    {item.Icon && (
                      <img src={item.Icon} alt={item.Name} className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium text-xs truncate ${getGradeTextColor(item.Grade)}`}>
                      {getRefiningLevel(item.Tooltip) && (
                        <span className="text-yellow-400 font-bold">
                          +{getRefiningLevel(item.Tooltip)}
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-1">
                      {getQualityValue(item.Tooltip) >= 0 && (
                        <div className={`w-6 h-5 rounded flex items-center justify-center ${getQualityBgColor(getQualityValue(item.Tooltip))}`}>
                          <span className="text-white text-xs font-bold">
                            {getQualityValue(item.Tooltip)}
                          </span>
                        </div>
                      )}
                      {getItemLevel(item.Tooltip) && (
                        <div className="px-1.5 py-0.5 bg-gray-400 dark:bg-gray-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {getItemLevel(item.Tooltip)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {getAbilityStoneEngravings(item.Tooltip).length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {getAbilityStoneEngravings(item.Tooltip).map((engraving, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="text-gray-900 dark:text-white">
                            {engraving.name}
                          </span>
                          <span className="text-blue-400 font-bold ml-1">
                            Lv.{engraving.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 각인 툴팁 상태 - 컴포넌트 레벨
  const [engravingTooltipData, setEngravingTooltipData] = useState(null);
  const [engravingTooltipPosition, setEngravingTooltipPosition] = useState({ x: 0, y: 0 });
  
  // 어빌리티 스톤 각인 매핑 데이터
  const abilityStoneEngravingsMap = equipmentData ? mapAbilityStoneEngravings(equipmentData) : {};

  const renderIntegratedEngravings = () => {
    
    if (!engravingsData?.ArkPassiveEffects || engravingsData.ArkPassiveEffects.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">각인</h3>
          <div className="text-gray-500 dark:text-gray-400 text-center py-4">활성화된 각인이 없습니다.</div>
        </div>
      );
    }

    const handleMouseEnter = (event, effect) => {
      setEngravingTooltipData(effect);
      setEngravingTooltipPosition({
        x: event.clientX + 10,
        y: event.clientY - 10
      });
    };

    const handleMouseMove = (event) => {
      if (engravingTooltipData) {
        setEngravingTooltipPosition({
          x: event.clientX + 10,
          y: event.clientY - 10
        });
      }
    };

    const handleMouseLeave = () => {
      setEngravingTooltipData(null);
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">각인</h3>
        <div className="space-y-2 relative">
          {engravingsData.ArkPassiveEffects.map((effect, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-help"
              onMouseEnter={(e) => handleMouseEnter(e, effect)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`w-8 h-8 rounded flex items-center justify-center ${getMarketGradeStyle(effect.Grade)}`}>
                <Star size={16} className={getGradeTextColor(effect.Grade)} />
              </div>
              <div className="flex-1">
                <div className="text-gray-900 dark:text-white font-medium text-sm">{effect.Name}</div>
              </div>
              <div className="text-right">
                {/* 어빌리티 스톤 각인 보너스 표시 */}
                {abilityStoneEngravingsMap[effect.Name] && (
                  <span className="text-blue-400 font-bold text-sm mr-2">
                    +Lv.{abilityStoneEngravingsMap[effect.Name]}
                  </span>
                )}
                <span className={`${getGradeTextColor(effect.Grade)} font-bold text-sm`}>
                  Lv.{effect.Level}
                </span>
              </div>
            </div>
          ))}
          
          {/* 커스텀 툴팁 */}
          {engravingTooltipData && (
            <div 
              className="fixed z-50 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-xl max-w-sm pointer-events-none"
              style={{
                left: `${engravingTooltipPosition.x}px`,
                top: `${engravingTooltipPosition.y}px`
              }}
            >
              <div className="mb-2">
                <div className={`font-bold text-sm ${getGradeTextColor(engravingTooltipData.Grade)} mb-1`}>
                  {engravingTooltipData.Name} Lv.{engravingTooltipData.Level}
                </div>
              </div>
              <div 
                className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: engravingTooltipData.Description
                    ?.replace(/<FONT COLOR='#99ff99'>/g, '<span class="text-green-400">')
                    ?.replace(/<FONT COLOR='#ff9999'>/g, '<span class="text-red-400">')
                    ?.replace(/<FONT COLOR='#[^']*'>/g, '<span class="text-blue-400">')
                    ?.replace(/<\/FONT>/g, '</span>')
                    ?.replace(/<BR>/g, '<br>')
                    || '설명이 없습니다.'
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // 보석 툴팁 상태
  const [gemTooltipData, setGemTooltipData] = useState(null);
  const [gemTooltipPosition, setGemTooltipPosition] = useState({ x: 0, y: 0 });

  const renderIntegratedGems = () => {
    if (!gemsData?.Gems || gemsData.Gems.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">보석</h3>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-center py-4">장착된 보석이 없습니다.</div>
        </div>
      );
    }

    // 보석 툴팁 핸들러
    const handleGemMouseEnter = (event, gem) => {
      const gemInfo = getGemDisplayInfo(gem);
      setGemTooltipData({ gem, gemInfo });
      setGemTooltipPosition({
        x: event.clientX + 10,
        y: event.clientY - 10
      });
    };

    const handleGemMouseMove = (event) => {
      if (gemTooltipData) {
        setGemTooltipPosition({
          x: event.clientX + 10,
          y: event.clientY - 10
        });
      }
    };

    const handleGemMouseLeave = () => {
      setGemTooltipData(null);
    };

    // 보석 통계 계산
    const gemStats = calculateGemStats(gemsData.Gems);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 relative border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">보석</h3>
          <button 
            onClick={() => setIsGemsExpanded(!isGemsExpanded)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {isGemsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        {/* 보석 통계 요약 */}
        <div className="mb-3 text-sm text-gray-600 dark:text-gray-400 text-right">
          피해 {gemStats.damageCount} | 쿨감 {gemStats.cooldownCount}
          {gemStats.totalBasicAttack > 0 && (
            <span> | 기본 공격력 {gemStats.totalBasicAttack}% 증가</span>
          )}
        </div>
        
        {isGemsExpanded ? (
          // 확대 모드: 피해/쿨감 그룹별 상세 정보
          <div className="space-y-4">
            {/* 헤더 라인 */}
            <div className="flex justify-between text-sm font-medium">
              <div className="text-red-400">피해 ({gemStats.damageCount})</div>
              <div className="text-blue-400">쿨감 ({gemStats.cooldownCount})</div>
            </div>
            
            {/* 피해 보석 상세 */}
            {gemStats.damageGems.length > 0 && (
              <div className="space-y-2">
                {gemStats.damageGems.map((gem, index) => {
                  const gemInfo = getGemDisplayInfo(gem);
                  
                  return (
                    <div key={`damage-detail-${index}`} className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded p-2">
                      <div className={`w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded border relative overflow-hidden flex-shrink-0 ${getGemTypeBorderColor(gemInfo.type)}`}>
                        {gem.Icon && (
                          <img src={gem.Icon} alt={gem.Name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className={`px-2 py-0.5 rounded text-xs font-bold ${gemInfo.typeColor}`}>
                        {gemInfo.gemTypeName || gemInfo.keyword}
                      </div>
                      <div className="flex-1">
                        {gemInfo.hasTooltipData && gemInfo.skillName && gemInfo.effects.length > 0 ? (
                          <div className="flex items-center font-medium text-xs">
                            <span className="text-yellow-400 w-28">{gemInfo.skillName}</span>
                            <span className="text-gray-900 dark:text-white">{gemInfo.effects.join(', ')}</span>
                          </div>
                        ) : (
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            정보 없음
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* 쿨감 보석 상세 */}
            {gemStats.cooldownGems.length > 0 && (
              <div className="space-y-2">
                {gemStats.cooldownGems.map((gem, index) => {
                  const gemInfo = getGemDisplayInfo(gem);
                  
                  return (
                    <div key={`cooldown-detail-${index}`} className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded p-2">
                      <div className={`w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded border relative overflow-hidden flex-shrink-0 ${getGemTypeBorderColor(gemInfo.type)}`}>
                        {gem.Icon && (
                          <img src={gem.Icon} alt={gem.Name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className={`px-2 py-0.5 rounded text-xs font-bold ${gemInfo.typeColor}`}>
                        {gemInfo.gemTypeName || gemInfo.keyword}
                      </div>
                      <div className="flex-1">
                        {gemInfo.hasTooltipData && gemInfo.skillName && gemInfo.effects.length > 0 ? (
                          <div className="flex items-center font-medium text-xs">
                            <span className="text-yellow-400 w-28">{gemInfo.skillName}</span>
                            <span className="text-gray-900 dark:text-white">{gemInfo.effects.join(', ')}</span>
                          </div>
                        ) : (
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            정보 없음
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          // 축소 모드: 피해/쿨감 가로 배치
          <div className="space-y-2">
            {/* 헤더 라인 */}
            <div className="flex justify-between text-xs font-medium">
              <div className="text-red-400">피해 ({gemStats.damageCount})</div>
              <div className="text-blue-400">쿨감 ({gemStats.cooldownCount})</div>
            </div>
            
            {/* 보석 라인 */}
            <div className="flex justify-between">
              {/* 피해 보석들 */}
              <div className="flex flex-wrap gap-0">
                {gemStats.damageGems.map((gem, index) => {
                  const gemInfo = getGemDisplayInfo(gem);
                  
                  return (
                    <div key={`damage-${index}`} className="flex flex-col items-center">
                      <div 
                        className={`w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded border relative overflow-hidden cursor-help ${getGemTypeBorderColor(gemInfo.type)}`}
                        onMouseEnter={(e) => handleGemMouseEnter(e, gem)}
                        onMouseMove={handleGemMouseMove}
                        onMouseLeave={handleGemMouseLeave}
                      >
                        {gem.Icon && (
                          <img src={gem.Icon} alt={gem.Name} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute top-0 left-0 bg-black/70 text-white text-xs px-1 leading-tight">
                          {gemInfo.level}
                        </div>
                      </div>
                      <div className={`mt-1 px-1 py-0.5 rounded text-xs font-bold min-w-[20px] text-center ${gemInfo.typeColor}`}>
                        {gemInfo.gemTypeName || gemInfo.keyword}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* 쿨감 보석들 */}
              <div className="flex flex-wrap gap-0">
                {gemStats.cooldownGems.map((gem, index) => {
                  const gemInfo = getGemDisplayInfo(gem);
                  
                  return (
                    <div key={`cooldown-${index}`} className="flex flex-col items-center">
                      <div 
                        className={`w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded border relative overflow-hidden cursor-help ${getGemTypeBorderColor(gemInfo.type)}`}
                        onMouseEnter={(e) => handleGemMouseEnter(e, gem)}
                        onMouseMove={handleGemMouseMove}
                        onMouseLeave={handleGemMouseLeave}
                      >
                        {gem.Icon && (
                          <img src={gem.Icon} alt={gem.Name} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute top-0 left-0 bg-black/70 text-white text-xs px-1 leading-tight">
                          {gemInfo.level}
                        </div>
                      </div>
                      <div className={`mt-1 px-1 py-0.5 rounded text-xs font-bold min-w-[20px] text-center ${gemInfo.typeColor}`}>
                        {gemInfo.gemTypeName || gemInfo.keyword}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* 기타 보석 그룹 (있을 경우에만) */}
            {gemStats.otherGems.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">기타 ({gemStats.otherGems.length})</div>
                <div className="flex flex-wrap gap-0">
                  {gemStats.otherGems.map((gem, index) => {
                    const gemInfo = getGemDisplayInfo(gem);
                    
                    return (
                      <div key={`other-${index}`} className="flex flex-col items-center">
                        <div 
                          className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded border relative overflow-hidden cursor-help"
                          onMouseEnter={(e) => handleGemMouseEnter(e, gem)}
                          onMouseMove={handleGemMouseMove}
                          onMouseLeave={handleGemMouseLeave}
                        >
                          {gem.Icon && (
                            <img src={gem.Icon} alt={gem.Name} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute top-0 left-0 bg-black/70 text-white text-xs px-1 leading-tight">
                            {gemInfo.level}
                          </div>
                        </div>
                        <div className={`mt-1 px-1 py-0.5 rounded text-xs font-bold min-w-[20px] text-center ${gemInfo.typeColor}`}>
                          {gemInfo.gemTypeName || gemInfo.keyword}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 보석 툴팁 */}
        {gemTooltipData && (
          <div 
            className="fixed z-50 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-xl max-w-md pointer-events-none"
            style={{
              left: `${gemTooltipPosition.x}px`,
              top: `${gemTooltipPosition.y}px`
            }}
          >
            <div 
              className="text-gray-900 dark:text-white font-medium text-sm"
              dangerouslySetInnerHTML={{ 
                __html: generateSimpleGemTooltip(gemTooltipData.gemInfo, true, gemTooltipData.gem.Name) 
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderIntegratedArkPassive = () => {
    if (!arkPassiveData) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">아크 패시브</h3>
          <div className="text-gray-500 dark:text-gray-400 text-center py-4">아크 패시브 정보를 불러오는 중...</div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">아크 패시브</h3>
        
        {/* 포인트 현황 - 간결한 형태 */}
        {arkPassiveData.Points && arkPassiveData.Points.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {arkPassiveData.Points.map((point, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded p-2 text-center">
                <div className="mb-1">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mr-2 ${getArkPassivePointColor(point.Name)}`}>
                    {point.Name.replace('포인트', '')}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{point.Value}</span>
                </div>
                {getArkPassivePointLevel(point.Description) && (
                  <div className="inline-block px-1.5 py-0.5 bg-gray-400 dark:bg-gray-600 rounded text-xs text-white font-bold">
                    {getArkPassivePointLevel(point.Description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 활성 노드 - 축소된 형태 */}
        {arkPassiveData.Effects && arkPassiveData.Effects.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {/* 진화 노드 */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
              <div className="bg-orange-600 px-2 py-1 text-center">
                <h4 className="text-white font-medium text-xs">진화</h4>
              </div>
              <div className="p-1 space-y-1">
                {arkPassiveData.Effects
                  .filter(effect => effect.Name.includes('진화') || effect.Description?.includes('진화'))
                  .map((effect, index) => (
                    <div key={index} className="flex items-center gap-1 p-1 bg-gray-200 dark:bg-gray-600 rounded">
                      <div className="w-4 h-4 bg-gray-300 dark:bg-gray-500 rounded border overflow-hidden flex-shrink-0">
                        {effect.Icon && (
                          <img src={effect.Icon} alt={effect.Name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-900 dark:text-white font-medium truncate">
                          {parseArkPassiveDescription(effect.Description) || effect.Name.replace('진화', '').trim()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 깨달음 노드 */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
              <div className="bg-blue-600 px-2 py-1 text-center">
                <h4 className="text-white font-medium text-xs">깨달음</h4>
              </div>
              <div className="p-1 space-y-1">
                {arkPassiveData.Effects
                  .filter(effect => effect.Name.includes('깨달음') || effect.Description?.includes('깨달음'))
                  .map((effect, index) => (
                    <div key={index} className="flex items-center gap-1 p-1 bg-gray-200 dark:bg-gray-600 rounded">
                      <div className="w-4 h-4 bg-gray-300 dark:bg-gray-500 rounded border overflow-hidden flex-shrink-0">
                        {effect.Icon && (
                          <img src={effect.Icon} alt={effect.Name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-900 dark:text-white font-medium truncate">
                          {parseArkPassiveDescription(effect.Description) || effect.Name.replace('깨달음', '').trim()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 도약 노드 */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
              <div className="bg-green-600 px-2 py-1 text-center">
                <h4 className="text-white font-medium text-xs">도약</h4>
              </div>
              <div className="p-1 space-y-1">
                {arkPassiveData.Effects
                  .filter(effect => effect.Name.includes('도약') || effect.Description?.includes('도약'))
                  .map((effect, index) => (
                    <div key={index} className="flex items-center gap-1 p-1 bg-gray-200 dark:bg-gray-600 rounded">
                      <div className="w-4 h-4 bg-gray-300 dark:bg-gray-500 rounded border overflow-hidden flex-shrink-0">
                        {effect.Icon && (
                          <img src={effect.Icon} alt={effect.Name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-900 dark:text-white font-medium truncate">
                          {parseArkPassiveDescription(effect.Description) || effect.Name.replace('도약', '').trim()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 탭 내용 렌더링 함수
  const renderTabContent = () => {
    if (tabLoading) {
      // 탭별로 다른 스켈레톤 UI 표시
      switch (activeTab) {
        case 'equipment':
          return <EquipmentSkeleton />;
        case 'skills':
          return <SkillsSkeleton />;
        case 'collectibles':
          return <CollectiblesSkeleton />;
        case 'roster':
          return <LoadingSpinner size="lg" text="원정대 정보를 불러오는 중..." />;
        default:
          return (
            <div className="py-12">
              <LoadingSpinner size="lg" text="정보를 불러오는 중..." />
            </div>
          );
      }
    }

    switch (activeTab) {
      case 'equipment':
        return (
          <div className="space-y-6">
            {/* 상단: 장비 + 장신구 그리드 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 왼쪽 컬럼: 장비 + 팔찌 + 보석 */}
              <div className="space-y-0">
                {renderIntegratedEquipment()}
                
                {/* 팔찌 섹션 */}
                {bracelet.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    {bracelet.map((item, index) => (
                      <div key={`bracelet-${index}`} className="bg-gray-100 dark:bg-gray-700 rounded p-3 flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded border overflow-hidden flex-shrink-0 ${getGradeBorderColor(item.Grade)}`}>
                            {item.Icon && (
                              <img src={item.Icon} alt={item.Name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          {getQualityValue(item.Tooltip) >= 0 && (
                            <div className={`w-8 h-3 rounded flex items-center justify-center mt-1 ${getQualityBgColor(getQualityValue(item.Tooltip))}`}>
                              <span className="text-white text-xs font-bold">
                                {getQualityValue(item.Tooltip)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-end mb-2">
                            <div className="flex items-center gap-2">
                              {getRefiningLevel(item.Tooltip) && (
                                <span className="text-yellow-400 font-bold text-xs">
                                  +{getRefiningLevel(item.Tooltip)}
                                </span>
                              )}
                              {getItemLevel(item.Tooltip) && (
                                <div className="px-2 py-1 bg-gray-400 dark:bg-gray-600 rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    {getItemLevel(item.Tooltip)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* 팔찌 효과 표시 */}
                          {(() => {
                            const { baseStats, specialEffects } = getBraceletEffects(item.Tooltip, item.Grade);
                            
                            if (baseStats.length === 0 && specialEffects.length === 0) return null;
                            
                            return (
                              <div className="space-y-2">
                                {baseStats.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {baseStats.map((effect, idx) => (
                                      <div key={idx} className="inline-flex items-center px-2 py-1 bg-gray-200 dark:bg-gray-600/50 border border-gray-400 dark:border-gray-500/50 rounded-full">
                                        <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">
                                          {effect.text}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {specialEffects.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {specialEffects.map((effect, idx) => {
                                      const gradeColors = {
                                        '하': 'bg-blue-900/30 border-blue-500/50',
                                        '중': 'bg-purple-900/30 border-purple-500/50',
                                        '상': 'bg-orange-900/30 border-orange-500/50'
                                      };
                                      
                                      const gradeBadgeColors = {
                                        '하': 'bg-blue-600 text-white',
                                        '중': 'bg-purple-600 text-white', 
                                        '상': 'bg-orange-600 text-white'
                                      };
                                      
                                      const backgroundClass = gradeColors[effect.grade] || 'bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-500';
                                      const badgeClass = gradeBadgeColors[effect.grade] || 'bg-gray-600 text-gray-200';
                                      
                                      return (
                                        <div key={idx} className={`inline-flex items-center px-2 py-1 border rounded-full ${backgroundClass}`}>
                                          <span className="text-xs text-gray-700 dark:text-gray-200 mr-1 whitespace-pre-line">
                                            {effect.text}
                                          </span>
                                          {effect.grade && (
                                            <span className={`text-xs font-bold px-1 py-0.5 rounded-full ${badgeClass}`}>
                                              {effect.grade}
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {renderIntegratedGems()}
              </div>
              
              {/* 오른쪽 컬럼: 각인 + 아크패시브 */}
              <div className="space-y-3">
                {renderIntegratedEngravings()}
                {renderIntegratedArkPassive()}
              </div>
            </div>
          </div>
        );
      
      case 'skills':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {skillsData && skillsData
              .filter(skill => skill.Level > 1 || (skill.Rune && skill.Rune.Name))
              .map((skill, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded border overflow-hidden flex-shrink-0 self-start">
                    {skill.Icon && <img src={skill.Icon} alt={skill.Name} className="w-full h-full object-cover" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-gray-900 dark:text-white font-medium text-sm truncate">{skill.Name}</h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-blue-400 font-bold text-sm">Lv.{skill.Level}</span>
                        {skill.Rune && skill.Rune.Name && (
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded border overflow-hidden flex-shrink-0">
                              {skill.Rune.Icon && (
                                <img 
                                  src={skill.Rune.Icon} 
                                  alt={skill.Rune.Name} 
                                  className="w-full h-full object-cover" 
                                />
                              )}
                            </div>
                            <span className={`text-[14px] px-1.5 py-0.5 rounded font-medium ${getGradeTextColor(skill.Rune.Grade)} ${getMarketGradeStyle(skill.Rune.Grade)}`}>
                              {skill.Rune.Name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {skill.Tripods && skill.Tripods.filter(tripod => tripod.IsSelected).length > 0 && (
                      <div className="space-y-1">
                        {skill.Tripods.filter(tripod => tripod.IsSelected).map((tripod, tIndex) => (
                          <div key={tIndex} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-[11px]">
                            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded border overflow-hidden flex-shrink-0">
                              {tripod.Icon && (
                                <img 
                                  src={tripod.Icon} 
                                  alt={tripod.Name} 
                                  className="w-full h-full object-cover" 
                                />
                              )}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 truncate flex-1">
                              {tripod.Name}
                            </span>
                            <div className="w-4 h-4 bg-gray-400 dark:bg-gray-600 rounded border border-gray-500 dark:border-gray-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-[9px] text-white font-bold">
                                {tripod.Slot}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'collectibles':
        return <CollectiblesProgress collectiblesData={collectiblesData} />;
      
      case 'roster': {
        if (!siblingsData) {
          return <div className="text-gray-500 dark:text-gray-400 text-center py-8">원정대 정보를 불러오는 중...</div>;
        }

        const charactersByServer = siblingsData.reduce((acc, character) => {
          if (!acc[character.ServerName]) {
            acc[character.ServerName] = [];
          }
          acc[character.ServerName].push(character);
          return acc;
        }, {});

        const sortCharacters = (characters) => {
          const sorted = characters.sort((a, b) => {
            const aLevel = parseFloat(a.ItemAvgLevel.replace(',', ''));
            const bLevel = parseFloat(b.ItemAvgLevel.replace(',', ''));
            return bLevel - aLevel;
          });
          
          return sorted;
        };

        return (
          <div className="space-y-6">
            {Object.entries(charactersByServer).map(([serverName, characters]) => (
              <div key={serverName} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{serverName}</h3>
                  <span className="text-blue-400">보유 캐릭터 {characters.length}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortCharacters(characters).map((character, index) => (
                    <div 
                      key={`${character.ServerName}-${character.CharacterName}-${index}`}
                      onClick={() => navigate(`/character/${character.CharacterName}`)}
                      className={`bg-gray-100 dark:bg-gray-700 rounded-lg p-3 border transition-colors cursor-pointer ${
                        character.CharacterName === characterName 
                          ? 'border-blue-500 bg-gray-200 dark:bg-gray-600' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center border border-gray-400 dark:border-gray-500 overflow-hidden">
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
                          <User 
                            className="w-5 h-5 text-gray-600 dark:text-gray-300" 
                            style={{ display: getIcon('CHARACTER', character.CharacterClassName) ? 'none' : 'block' }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 dark:text-white font-medium text-sm">Lv.{character.CharacterLevel}</span>
                            <span className="text-blue-400 font-medium text-sm">{character.CharacterClassName}</span>
                            {character.CharacterName === characterName && (
                              <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">현재</span>
                            )}
                          </div>
                          <div className="text-base font-bold text-gray-900 dark:text-white">
                            {character.CharacterName}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 font-medium text-sm">
                              {character.ItemAvgLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {siblingsData.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">원정대 정보를 찾을 수 없습니다.</p>
              </div>
            )}
          </div>
        );
      }
      
      default:
        return <div className="text-gray-400 text-center py-8">정보를 불러오는 중...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 컴포넌트 */}
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* 캐릭터 검색 헤더 */}

        {/* 로딩 */}
        {loading && (
          <div className="space-y-6">
            <CharacterProfileSkeleton />
          </div>
        )}


        {/* 에러 메시지 또는 기본 안내 */}
        {!loading && !characterData && (
          <div className="bg-red-50 dark:bg-red-600/20 border border-red-200 dark:border-red-600/30 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">'{characterName}' 캐릭터를 찾을 수 없습니다</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-3">{error || '요청하신 캐릭터가 존재하지 않습니다.'}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">상단 검색창에서 다시 시도해주세요</p>
          </div>
        )}

        {/* 캐릭터 정보 */}
        {characterData && (
          <div className="space-y-6">
            {/* 캐릭터 프로필 헤더 - 게임 스타일 */}
            <div className="relative h-60 bg-black rounded-lg overflow-hidden">
              {/* 캐릭터 배경 이미지 */}
              <div className="absolute inset-0">
                {characterData.CharacterImage ? (
                  <img 
                    src={characterData.CharacterImage} 
                    alt={characterData.CharacterName}
                    className="w-full h-[150%] object-contain object-center scale-125"
                  />
                ) : null}
              </div>
              
              
              {/* 텍스트 오버레이 */}
<div className="absolute inset-0 p-6 flex flex-col">
                {/* 상단 정보 */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex gap-2 mb-1">
                      <span className="bg-gray-700/80 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                        {characterData.ServerName}
                      </span>
                      <span className="bg-gray-700/80 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                        {characterData.CharacterClassName}
                      </span>
                    </div>
                  </div>
                  
                  {/* 우측 스탯 */}
                  <div className="w-60">
                    <div className="flex text-base mb-0.5">
                      <span className="text-gray-400">아이템</span>
                      <span className="text-white ml-auto">
                        {characterData.ItemAvgLevel || '0'}
                      </span>
                    </div>
                    <div className="flex text-base mb-0.5">
                      <span className="text-gray-400">전투력</span>
                      <span className={`font-bold ml-auto ${getCombatPowerColor(arkPassiveData)}`}>
                        {characterData.CombatPower || '0'}
                      </span>
                    </div>
                    <div className="flex text-base mb-0.5">
                      <span className="text-gray-400">레벨</span>
                      <span className="text-white ml-auto">Lv.{characterData.CharacterLevel || '0'}</span>
                    </div>
                    {/* 빈 공간 - 적당한 간격 */}
                    <div className="mb-3"></div>
                    
                    {/* 영지 정보 */}
                    {characterData.TownName && characterData.TownName !== '영지 없음' && (
                      <div className="flex text-base mb-0.5">
                        <span className="text-gray-400">영지</span>
                        <span className="text-white ml-auto">{characterData.TownName}</span>
                      </div>
                    )}
                    
                    {/* PVP 정보 */}
                    {characterData.PvpGradeName && characterData.PvpGradeName !== '등급 없음' && (
                      <div className="flex text-base mb-0.5">
                        <span className="text-gray-400">PVP</span>
                        <span className="text-white ml-auto">{characterData.PvpGradeName}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 하단 정보 */}
                <div className="mt-auto flex justify-between items-end">
                  <div>
                    {/* 길드명 (캐릭터 이름 위) */}
                    {characterData.GuildName && characterData.GuildName !== '길드 없음' && (
                      <div className="mb-1">
                        <span className="bg-blue-600/80 text-white px-2 py-1 rounded text-sm font-medium backdrop-blur-sm">
                          {characterData.GuildName}
                        </span>
                      </div>
                    )}
                    <h1 className="text-2xl font-bold text-white mb-2">{characterData.CharacterName}</h1>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* 즐겨찾기 버튼 */}
                    <button
                      onClick={handleFavoriteToggle}
                      className={`${
                        isFavorite(characterName)
                          ? 'bg-yellow-600/80 hover:bg-yellow-600 text-white'
                          : 'bg-gray-600/80 hover:bg-gray-600 text-gray-300 hover:text-white'
                      } px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-1.5 backdrop-blur-sm`}
                    >
                      <Star 
                        className="w-3.5 h-3.5" 
                        fill={isFavorite(characterName) ? "currentColor" : "none"}
                      />
                    </button>
                    
                    {/* 갱신 버튼 */}
                    <button
                      onClick={handleSearch}
                      disabled={loading}
                      className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1.5 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 backdrop-blur-sm"
                    >
                      <Search className="w-3.5 h-3.5" />
                      갱신
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 주간 골드 수익 계산기 */}
            <WeeklyGoldCalculator siblingsData={siblingsData || []} />
            
            {/* 상세 정보 탭 섹션 */}
            <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">상세 정보</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleTabClick('equipment')}
                    className={`px-4 py-2 text-sm font-medium rounded flex items-center gap-2 ${
                      activeTab === 'equipment' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Package size={16} />
                    장비
                  </button>
                  <button 
                    onClick={() => handleTabClick('skills')}
                    className={`px-4 py-2 text-sm font-medium rounded flex items-center gap-2 ${
                      activeTab === 'skills' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Zap size={16} />
                    스킬
                  </button>
                  <button 
                    onClick={() => handleTabClick('collectibles')}
                    className={`px-4 py-2 text-sm font-medium rounded flex items-center gap-2 ${
                      activeTab === 'collectibles' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Map size={16} />
                    수집품
                  </button>
                  <button 
                    onClick={() => handleTabClick('roster')}
                    className={`px-4 py-2 text-sm font-medium rounded flex items-center gap-2 ${
                      activeTab === 'roster' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Crown size={16} />
                    원정대
                  </button>
                </div>
              </div>
              
              {/* 탭 내용 */}
              <div className="min-h-[200px]">
                {renderTabContent()}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CharacterDetail;