import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Loader2, Clock, X, Plus, Minus, RefreshCw } from 'lucide-react';
import { getCharacterProfile, getCharacterEquipment, searchMarketItems } from '../../services/lostarkApi';
import { getRefiningLevel } from '../../utils/equipmentParsers';
import { formatNumber } from '../../utils/formatters';
import { MaterialItem, ChestIcon, GoldIcon } from '../common/MaterialComponents';
import { 
  ENHANCEMENT_RATES, 
  BOOK_BONUS, 
  MATERIAL_MARKET_MAPPING, 
  MATERIAL_PRICE_CALCULATORS, 
  MATERIAL_COSTS 
} from '../../data/enhancementData';


const EnhancementCalculator = () => {
  const parseNumber = (str) => {
    if (!str) return 0;
    const cleaned = str.replace(/,/g, '');
    const parsed = parseInt(cleaned) || 0;
    // 최대값 999,999,999로 제한
    return Math.min(parsed, 999999999);
  };

  // 소숫점 끝자리 0 제거 함수
  const formatItemLevel = (num) => {
    if (!num && num !== 0) return '0';
    return parseFloat(num.toFixed(2)).toString();
  };

  // 상급 재련 드롭다운 옵션 동적 생성
  const generateAdvancedOptions = (currentLevel) => {
    const baseOptions = [0, 10, 20, 30, 40];
    const options = new Set(baseOptions);
    
    // 현재 값이 기본 옵션에 없는 중간값(예: 14)이면 포함
    if (currentLevel > 0 && !baseOptions.includes(currentLevel)) {
      options.add(currentLevel);
    }
    
    return Array.from(options).sort((a, b) => a - b);
  };

  // 상태 관리
  const [characterName, setCharacterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [equipmentData, setEquipmentData] = useState(null);
  const [enhancementTargets, setEnhancementTargets] = useState({});
  const [materialOptions, setMaterialOptions] = useState({
    normalBooks: false,
    normalBreaths: false,
    advancedScrolls: false,
    advancedBreaths: false
  });
  const [clickedButton, setClickedButton] = useState(null);
  const [highlightedEquipment, setHighlightedEquipment] = useState({
    type: null, // 'normal' or 'advanced'
    equipmentTypes: [] // 영향받은 장비 타입들의 배열
  });
  const [materials, setMaterials] = useState({
    파괴석: { count: 0, isMax: false, savedCount: 0 },
    수호석: { count: 0, isMax: false, savedCount: 0 },
    돌파석: { count: 0, isMax: false, savedCount: 0 },
    아비도스: { count: 0, isMax: false, savedCount: 0 },
    '운명의 파편': { count: 0, isMax: false, savedCount: 0 }
  });
  const [currentItemLevel, setCurrentItemLevel] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [enhancementSearchHistory, setEnhancementSearchHistory] = useState([]);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const ENHANCEMENT_STORAGE_KEY = 'ploa_enhancement_search_history';
  const MAX_HISTORY_SIZE = 7;

  // 재료 가격 관련 상태
  const [materialPrices, setMaterialPrices] = useState({});
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceLastUpdated, setPriceLastUpdated] = useState(null);
  const priceUpdateInterval = useRef(null);

  // 재료 상세 표시 관련 상태
  const [selectedScenario, setSelectedScenario] = useState('median');

  // 장비 부위별 순서 정의 (요구사항에 따른 순서)
  const equipmentOrder = ['투구', '어깨', '상의', '하의', '장갑', '무기'];
  const equipmentTypeMap = {
    '투구': '머리',
    '어깨': '견갑', 
    '상의': '상의',
    '하의': '하의',
    '장갑': '장갑',
    '무기': '무기'
  };

  // 캐릭터 장비 정보 검색
  const handleSearchCharacter = async (searchName = null) => {
    const targetName = searchName || characterName;
    if (!targetName.trim()) {
      setError('캐릭터명을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // 캐릭터 프로필과 장비 정보 병렬 호출
      const [profileData, equipmentData] = await Promise.all([
        getCharacterProfile(targetName),
        getCharacterEquipment(targetName)
      ]);
      
      if (!equipmentData || equipmentData.length === 0) {
        throw new Error('캐릭터 장비 정보를 찾을 수 없습니다.');
      }
      
      // 현재 아이템 레벨 설정 (프로필에서 ItemAvgLevel 추출)
      if (profileData && profileData.ItemAvgLevel) {
        setCurrentItemLevel(parseFloat(profileData.ItemAvgLevel.replace(',', '')));
      }
      
      // 장비 데이터 처리 및 초기 목표값 설정
      const processedData = processEquipmentData(equipmentData);
      setEquipmentData(processedData);
      initializeTargets(processedData);
      
      // 검색 성공 시 히스토리에 추가
      addToEnhancementHistory(targetName);
      // 검색 완료 후 입력창 포커스 해제 및 드롭다운 닫기
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
      setShowDropdown(false);
    } catch (err) {
      setError(err.message || '캐릭터 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      // 검색 완료 후 드롭다운 닫기 (성공/실패 무관)
      setShowDropdown(false);
    }
  };

  // 입력창 포커스 핸들러
  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  // 드롭다운에서 검색어 선택
  const handleHistorySelect = (selectedName) => {
    setCharacterName(selectedName);
    setShowDropdown(false);
    // selectedName을 직접 전달하여 즉시 검색 실행
    handleSearchCharacter(selectedName);
  };

  // 강화 계산기 전용 검색 히스토리 관리
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ENHANCEMENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
          setEnhancementSearchHistory(parsed);
        }
      }
    } catch (error) {
      console.error('강화 계산기 검색 기록 로드 실패:', error);
      setEnhancementSearchHistory([]);
    }
  }, [ENHANCEMENT_STORAGE_KEY]);

  // 히스토리에 추가하는 함수
  const addToEnhancementHistory = (characterName) => {
    if (!characterName || typeof characterName !== 'string') return;
    
    const trimmedName = characterName.trim();
    if (!trimmedName) return;

    setEnhancementSearchHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(name => name !== trimmedName);
      const newHistory = [trimmedName, ...filteredHistory].slice(0, MAX_HISTORY_SIZE);
      
      try {
        localStorage.setItem(ENHANCEMENT_STORAGE_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('강화 계산기 검색 기록 저장 실패:', error);
      }
      
      return newHistory;
    });
  };

  // 히스토리에서 제거하는 함수
  const removeFromEnhancementHistory = (characterName) => {
    setEnhancementSearchHistory(prevHistory => {
      const newHistory = prevHistory.filter(name => name !== characterName);
      
      try {
        localStorage.setItem(ENHANCEMENT_STORAGE_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('강화 계산기 검색 기록 저장 실패:', error);
      }
      
      return newHistory;
    });
  };

  // 히스토리 삭제
  const handleRemoveHistory = (e, name) => {
    e.stopPropagation();
    removeFromEnhancementHistory(name);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // 장비 데이터 처리 함수
  const processEquipmentData = (data) => {
    const processed = {};
    
    data.forEach(item => {
      if (equipmentOrder.includes(item.Type)) {
        // 일반 재련 수치 추출 (장비 이름에서 +숫자)
        const normalLevel = extractNormalEnhancement(item.Name);
        // 상급 재련 수치 추출 (툴팁에서)
        const advancedLevel = getRefiningLevel(item.Tooltip) || '0';
        
        processed[item.Type] = {
          name: item.Name,
          icon: item.Icon,
          grade: item.Grade,
          normalLevel: parseInt(normalLevel),
          advancedLevel: parseInt(advancedLevel)
        };
      }
    });
    
    return processed;
  };

  // 일반 재련 수치 추출 함수
  const extractNormalEnhancement = (name) => {
    const match = name.match(/\+(\d+)/);
    return match ? match[1] : '0';
  };

  // 강화 목표 초기화
  const initializeTargets = (data) => {
    const targets = {};
    Object.keys(data).forEach(type => {
      targets[type] = {
        normalTarget: data[type].normalLevel,
        advancedTarget: data[type].advancedLevel
      };
    });
    setEnhancementTargets(targets);
  };

  // 강화 목표 변경 핸들러
  const handleTargetChange = (equipmentType, targetType, value) => {
    setEnhancementTargets(prev => ({
      ...prev,
      [equipmentType]: {
        ...prev[equipmentType],
        [targetType]: parseInt(value)
      }
    }));
  };

  // 일반재련 증가/감소 함수
  const adjustNormalTarget = (equipmentType, delta) => {
    const equipment = equipmentData[equipmentType];
    if (!equipment) return;
    
    const currentTarget = enhancementTargets[equipmentType].normalTarget;
    const newTarget = Math.max(equipment.normalLevel, Math.min(25, currentTarget + delta));
    
    handleTargetChange(equipmentType, 'normalTarget', newTarget);
  };

  // 상급재련 증가/감소 함수
  const adjustAdvancedTarget = (equipmentType, delta) => {
    const equipment = equipmentData[equipmentType];
    if (!equipment) return;
    
    const currentTarget = enhancementTargets[equipmentType].advancedTarget;
    const availableLevels = [10, 20, 30, 40].filter(level => level >= equipment.advancedLevel);
    const currentIndex = availableLevels.indexOf(currentTarget);
    const newIndex = Math.max(0, Math.min(availableLevels.length - 1, currentIndex + delta));
    
    handleTargetChange(equipmentType, 'advancedTarget', availableLevels[newIndex]);
  };

  // 재료 사용 옵션 변경 핸들러
  const handleMaterialOptionChange = (option, checked) => {
    setMaterialOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  // 보유 재료 수량 변경 핸들러
  const handleMaterialChange = (materialType, value) => {
    // 숫자와 콤마만 허용
    const cleanedValue = value.replace(/[^0-9,]/g, '');
    
    // 콤마 제거하고 숫자로 변환
    const numericValue = parseNumber(cleanedValue);
    
    setMaterials(prev => ({
      ...prev,
      [materialType]: {
        ...prev[materialType],
        count: numericValue
      }
    }));
  };

  // 최대 버튼 토글 핸들러
  const handleMaxToggle = (materialType) => {
    setMaterials(prev => {
      const currentMaterial = prev[materialType];
      
      if (!currentMaterial.isMax) {
        // 최대 버튼 활성화: 현재 값을 savedCount에 저장
        return {
          ...prev,
          [materialType]: {
            ...currentMaterial,
            isMax: true,
            savedCount: currentMaterial.count
          }
        };
      } else {
        // 최대 버튼 해제: savedCount 값을 count로 복원
        return {
          ...prev,
          [materialType]: {
            ...currentMaterial,
            isMax: false,
            count: currentMaterial.savedCount
          }
        };
      }
    });
  };

  // 확률 계산 시스템
  // 시도 차수별 확률 계산 (실패 누적 보너스 포함)
  const calculateAttemptRate = (baseRate, attemptCount) => {
    // 실패 누적 보너스: 기본 확률의 1/10씩 최대 10회
    const failureBonus = baseRate * Math.min(attemptCount - 1, 10) * 0.1;
    return baseRate + failureBonus;
  };

  // 책 보너스 확률 계산
  const getBookBonus = (level, useBooks) => {
    if (!useBooks) return 0;
    return BOOK_BONUS[level] || 0;
  };

  // 숨결 보너스 확률 계산
  const getBreathBonus = (level, baseRate, useBreaths) => {
    if (!useBreaths) return 0;
    // 24-25단계는 특별 처리 (+1.0% 고정)
    if (level >= 24) return 1.0;
    // 일반 단계는 기본 확률만큼 추가
    return baseRate;
  };

  // 최종 시도 확률 계산
  const calculateFinalRate = (level, attemptCount, useBooks, useBreaths) => {
    const baseRate = ENHANCEMENT_RATES[level] || 0;
    const attemptRate = calculateAttemptRate(baseRate, attemptCount);
    const bookBonus = getBookBonus(level, useBooks);
    const breathBonus = getBreathBonus(level, baseRate, useBreaths);
    
    return attemptRate + bookBonus + breathBonus;
  };

  // 장인의 기운 누적 계산
  const calculateArtisanEnergy = (finalRate) => {
    return Math.floor(finalRate / 2.15 * 100) / 100;
  };

  // 재료 가격 계산 헬퍼 함수
  const calculateMaterialPrice = (itemName, marketPrice) => {
    const calculator = MATERIAL_PRICE_CALCULATORS[itemName] || MATERIAL_PRICE_CALCULATORS.default;
    return calculator(marketPrice);
  };

  // 개별 재료 가격 조회
  const fetchMaterialPrice = async (materialName) => {
    try {
      const results = await searchMarketItems({
        ItemName: materialName,
        Sort: 'GRADE',
        CategoryCode: 60000, // 기타 재료 카테고리
        PageNo: 0,
        SortCondition: 'ASC'
      });

      if (results && results.Items && results.Items.length > 0) {
        // 최저가 상품의 가격 사용
        const lowestPriceItem = results.Items[0];
        return lowestPriceItem.AuctionInfo.BuyPrice || lowestPriceItem.AuctionInfo.BidStartPrice;
      }
      return 0;
    } catch (error) {
      console.error(`재료 가격 조회 실패: ${materialName}`, error);
      return 0;
    }
  };

  // 모든 재료 가격 갱신
  const updateMaterialPrices = useCallback(async () => {
    setPriceLoading(true);
    
    try {
      const newPrices = {};
      
      // 기본 재료 가격 조회
      for (const [key, itemName] of Object.entries(MATERIAL_MARKET_MAPPING)) {
        if (typeof itemName === 'string') {
          const marketPrice = await fetchMaterialPrice(itemName);
          newPrices[key] = calculateMaterialPrice(itemName, marketPrice);
        }
      }
      
      // 무기용 재료 가격 조회
      for (const [key, itemName] of Object.entries(MATERIAL_MARKET_MAPPING.weapon)) {
        const marketPrice = await fetchMaterialPrice(itemName);
        newPrices[`weapon_${key}`] = calculateMaterialPrice(itemName, marketPrice);
      }
      
      // 방어구용 재료 가격 조회
      for (const [key, itemName] of Object.entries(MATERIAL_MARKET_MAPPING.armor)) {
        const marketPrice = await fetchMaterialPrice(itemName);
        newPrices[`armor_${key}`] = calculateMaterialPrice(itemName, marketPrice);
      }

      setMaterialPrices(newPrices);
      setPriceLastUpdated(new Date());
      
      // 로컬스토리지에 캐시 저장
      localStorage.setItem('ploa_material_prices', JSON.stringify({
        prices: newPrices,
        lastUpdated: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('재료 가격 갱신 실패:', error);
    } finally {
      setPriceLoading(false);
    }
  }, []); // useCallback 의존성 배열

  // 캐시된 가격 불러오기
  const loadCachedPrices = useCallback(() => {
    try {
      const cached = localStorage.getItem('ploa_material_prices');
      if (cached) {
        const { prices, lastUpdated } = JSON.parse(cached);
        const cacheAge = Date.now() - new Date(lastUpdated).getTime();
        
        // 캐시가 10분 이내면 사용
        if (cacheAge < 10 * 60 * 1000) {
          setMaterialPrices(prices);
          setPriceLastUpdated(new Date(lastUpdated));
          return true;
        }
      }
    } catch (error) {
      console.error('캐시된 가격 로드 실패:', error);
    }
    return false;
  }, []);

  // 재료별 단가 조회 함수
  const getMaterialPrice = (materialKey, equipmentType) => {
    // 새로운 키 구조 → 기존 가격 키 매핑
    if (materialKey === '무기_책_11_14') return materialPrices['weapon_책_11_14'] || 0;
    if (materialKey === '무기_책_15_18') return materialPrices['weapon_책_15_18'] || 0;
    if (materialKey === '방어구_책_11_14') return materialPrices['armor_책_11_14'] || 0;
    if (materialKey === '방어구_책_15_18') return materialPrices['armor_책_15_18'] || 0;
    if (materialKey === '무기_숨결') return materialPrices['weapon_숨결'] || 0;
    if (materialKey === '방어구_숨결') return materialPrices['armor_숨결'] || 0;
    
    // 기존 키 구조 (하위 호환성)
    if (equipmentType === 'weapon') {
      // 무기용 재료
      if (materialKey === '파괴석') return materialPrices['weapon_파괴석'] || 0;
      if (materialKey === '숨결') return materialPrices['weapon_숨결'] || 0;
    } else {
      // 방어구용 재료  
      if (materialKey === '수호석') return materialPrices['armor_수호석'] || 0;
      if (materialKey === '숨결') return materialPrices['armor_숨결'] || 0;
    }
    
    // 공통 재료
    if (materialKey === '돌파석') return materialPrices['돌파석'] || 0;
    if (materialKey === '아비도스') return materialPrices['아비도스'] || 0;
    if (materialKey === '운명의 파편') return materialPrices['운명의 파편'] || 0;
    
    return 0;
  };

  // 재료 가격 관리 useEffect
  useEffect(() => {
    // 컴포넌트 마운트 시 캐시된 가격 로드 시도
    const hasCache = loadCachedPrices();
    
    // 캐시가 없거나 오래된 경우 즉시 갱신
    if (!hasCache) {
      updateMaterialPrices();
    }

    // 5분 주기 자동 갱신 설정
    priceUpdateInterval.current = setInterval(() => {
      updateMaterialPrices();
    }, 5 * 60 * 1000); // 5분

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      if (priceUpdateInterval.current) {
        clearInterval(priceUpdateInterval.current);
      }
    };
  }, [updateMaterialPrices, loadCachedPrices]); // 필요한 함수들 의존성 추가

  // 개별 장비 강화 시뮬레이션 (몬테카를로 방식) - 가격 정보 포함
  const simulateEquipmentEnhancement = (currentLevel, targetLevel, equipmentType, useBooks, useBreaths) => {
    const results = [];
    const iterations = 10000;

    for (let sim = 0; sim < iterations; sim++) {
      let level = currentLevel;
      let artisanEnergy = 0;
      let totalMaterials = {
        '수호석': 0,
        '파괴석': 0,
        '돌파석': 0,
        '아비도스': 0,
        '운명의 파편': 0,
        '무기_숨결': 0,
        '방어구_숨결': 0,
        '무기_책_11_14': 0,
        '무기_책_15_18': 0,
        '방어구_책_11_14': 0,
        '방어구_책_15_18': 0
      };
      let totalGold = 0; // 강화 자체 골드

      while (level < targetLevel) {
        const nextLevel = level + 1;
        let attemptCount = 1;
        let success = false;

        // 현재 강화 단계 시뮬레이션
        while (!success) {
          // 최종 시도 확률 계산
          const finalRate = calculateFinalRate(nextLevel, attemptCount, useBooks, useBreaths);
          
          // 장인의 기운이 100% 이상이면 확정 성공
          if (artisanEnergy >= 100) {
            success = true;
            artisanEnergy = 0; // 성공 시 초기화
          } else {
            // 확률 판정
            const random = Math.random() * 100;
            if (random < finalRate) {
              success = true;
              artisanEnergy = 0; // 성공 시 초기화
            } else {
              // 실패 시 장인의 기운 누적
              artisanEnergy += calculateArtisanEnergy(finalRate);
              attemptCount++;
            }
          }

          // 재료 소모량 추가 (11단계 데이터만 있으므로 다른 단계는 0으로 처리)
          const materialCost = MATERIAL_COSTS[equipmentType][nextLevel];
          if (materialCost) {
            // 장비 타입에 따른 재료 추가
            if (equipmentType === 'weapon') {
              totalMaterials['파괴석'] += materialCost['파괴석'] || 0;
            } else {
              totalMaterials['수호석'] += materialCost['수호석'] || 0;
            }
            
            totalMaterials['돌파석'] += materialCost['돌파석'] || 0;
            totalMaterials['아비도스'] += materialCost['아비도스'] || 0;
            totalMaterials['운명의 파편'] += materialCost['운명의 파편'] || 0;
            totalGold += materialCost['골드'] || 0;
            
            if (useBreaths) {
              // 장비 타입에 따라 다른 숨결 사용
              if (equipmentType === 'weapon') {
                totalMaterials['무기_숨결'] += materialCost['숨결'] || 0;
              } else {
                totalMaterials['방어구_숨결'] += materialCost['숨결'] || 0;
              }
            }
            if (useBooks && BOOK_BONUS[nextLevel]) {
              // 장비 타입과 강화 단계에 따라 다른 책 사용
              if (equipmentType === 'weapon') {
                if (nextLevel <= 14) {
                  totalMaterials['무기_책_11_14'] += materialCost['책'] || 0;
                } else {
                  totalMaterials['무기_책_15_18'] += materialCost['책'] || 0;
                }
              } else {
                if (nextLevel <= 14) {
                  totalMaterials['방어구_책_11_14'] += materialCost['책'] || 0;
                } else {
                  totalMaterials['방어구_책_15_18'] += materialCost['책'] || 0;
                }
              }
            }
          }
        }

        level = nextLevel;
      }

      // 재료비 계산
      let materialsCost = 0;
      const materialsWithPrice = {};
      
      Object.keys(totalMaterials).forEach(materialKey => {
        const count = totalMaterials[materialKey];
        if (count > 0) {
          const unitPrice = getMaterialPrice(materialKey, equipmentType);
          const totalPrice = count * unitPrice;
          
          materialsWithPrice[materialKey] = {
            count,
            unitPrice,
            totalPrice
          };
          
          materialsCost += totalPrice;
        }
      });

      results.push({
        materials: materialsWithPrice,
        gold: {
          enhancement: totalGold,      // 강화 자체 골드
          materials: materialsCost,    // 재료 구매 골드
          total: totalGold + materialsCost  // 총 필요 골드
        }
      });
    }

    return results;
  };

  // 장인의 기운 100% 확정 강화 비용 계산 (새 구조)
  const calculateGuaranteedCost = (currentLevel, targetLevel, equipmentType, useBooks, useBreaths) => {
    let totalMaterials = {
      '수호석': 0,
      '파괴석': 0,
      '돌파석': 0,
      '아비도스': 0,
      '운명의 파편': 0,
      '무기_숨결': 0,
      '방어구_숨결': 0,
      '무기_책_11_14': 0,
      '무기_책_15_18': 0,
      '방어구_책_11_14': 0,
      '방어구_책_15_18': 0
    };
    let totalGold = 0; // 강화 자체 골드

    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      let artisanEnergy = 0;
      let attemptCount = 1;

      // 장인의 기운이 100%에 도달할 때까지 계산
      while (artisanEnergy < 100) {
        const finalRate = calculateFinalRate(level, attemptCount, useBooks, useBreaths);
        artisanEnergy += calculateArtisanEnergy(finalRate);
        
        // 재료 소모량 추가
        const materialCost = MATERIAL_COSTS[equipmentType][level];
        if (materialCost) {
          // 장비 타입에 따른 재료 추가
          if (equipmentType === 'weapon') {
            totalMaterials['파괴석'] += materialCost['파괴석'] || 0;
          } else {
            totalMaterials['수호석'] += materialCost['수호석'] || 0;
          }
          
          totalMaterials['돌파석'] += materialCost['돌파석'] || 0;
          totalMaterials['아비도스'] += materialCost['아비도스'] || 0;
          totalMaterials['운명의 파편'] += materialCost['운명의 파편'] || 0;
          totalGold += materialCost['골드'] || 0;
          
          if (useBreaths) {
            // 장비 타입에 따라 다른 숨결 사용
            if (equipmentType === 'weapon') {
              totalMaterials['무기_숨결'] += materialCost['숨결'] || 0;
            } else {
              totalMaterials['방어구_숨결'] += materialCost['숨결'] || 0;
            }
          }
          if (useBooks && BOOK_BONUS[level]) {
            // 장비 타입과 강화 단계에 따라 다른 책 사용
            if (equipmentType === 'weapon') {
              if (level <= 14) {
                totalMaterials['무기_책_11_14'] += materialCost['책'] || 0;
              } else {
                totalMaterials['무기_책_15_18'] += materialCost['책'] || 0;
              }
            } else {
              if (level <= 14) {
                totalMaterials['방어구_책_11_14'] += materialCost['책'] || 0;
              } else {
                totalMaterials['방어구_책_15_18'] += materialCost['책'] || 0;
              }
            }
          }
        }

        attemptCount++;
      }

      // 장인의 기운 100%일 때 확정 성공 시도 - 마지막 재료 소모 추가!
      const finalMaterialCost = MATERIAL_COSTS[equipmentType][level];
      if (finalMaterialCost) {
        // 장비 타입에 따른 재료 추가
        if (equipmentType === 'weapon') {
          totalMaterials['파괴석'] += finalMaterialCost['파괴석'] || 0;
        } else {
          totalMaterials['수호석'] += finalMaterialCost['수호석'] || 0;
        }
        
        totalMaterials['돌파석'] += finalMaterialCost['돌파석'] || 0;
        totalMaterials['아비도스'] += finalMaterialCost['아비도스'] || 0;
        totalMaterials['운명의 파편'] += finalMaterialCost['운명의 파편'] || 0;
        totalGold += finalMaterialCost['골드'] || 0;
        
        if (useBreaths) {
          // 장비 타입에 따라 다른 숨결 사용
          if (equipmentType === 'weapon') {
            totalMaterials['무기_숨결'] += finalMaterialCost['숨결'] || 0;
          } else {
            totalMaterials['방어구_숨결'] += finalMaterialCost['숨결'] || 0;
          }
        }
        if (useBooks && BOOK_BONUS[level]) {
          // 장비 타입과 강화 단계에 따라 다른 책 사용
          if (equipmentType === 'weapon') {
            if (level <= 14) {
              totalMaterials['무기_책_11_14'] += finalMaterialCost['책'] || 0;
            } else {
              totalMaterials['무기_책_15_18'] += finalMaterialCost['책'] || 0;
            }
          } else {
            if (level <= 14) {
              totalMaterials['방어구_책_11_14'] += finalMaterialCost['책'] || 0;
            } else {
              totalMaterials['방어구_책_15_18'] += finalMaterialCost['책'] || 0;
            }
          }
        }
      }
    }

    // 재료비 계산
    let materialsCost = 0;
    const materialsWithPrice = {};
    
    Object.keys(totalMaterials).forEach(materialKey => {
      const count = totalMaterials[materialKey];
      if (count > 0) {
        const unitPrice = getMaterialPrice(materialKey, equipmentType);
        const totalPrice = count * unitPrice;
        
        materialsWithPrice[materialKey] = {
          count,
          unitPrice,
          totalPrice
        };
        
        materialsCost += totalPrice;
      }
    });

    return {
      materials: materialsWithPrice,
      gold: {
        enhancement: totalGold,      // 강화 자체 골드
        materials: materialsCost,    // 재료 구매 골드
        total: totalGold + materialsCost  // 총 필요 골드
      }
    };
  };

  // 4가지 시나리오 계산 로직
  const calculateScenarios = (results) => {
    // 총 골드를 기준으로 정렬
    const sortedResults = results.sort((a, b) => {
      return a.gold.total - b.gold.total;
    });

    const totalResults = sortedResults.length;
    
    return {
      upper25: sortedResults[Math.floor(totalResults * 0.25)], // 상위 25%
      median: sortedResults[Math.floor(totalResults * 0.5)],   // 중앙값
      lower25: sortedResults[Math.floor(totalResults * 0.75)], // 하위 25%
      guaranteed: null // 별도 계산 필요
    };
  };


  // 전체 장비 강화 비용 계산
  const calculateTotalEnhancementCost = () => {
    if (!equipmentData || !enhancementTargets || Object.keys(equipmentData).length === 0) {
      return null;
    }

    // 각 장비별 시뮬레이션 결과 수집
    const allResults = [];
    
    equipmentOrder.forEach(type => {
      const equipment = equipmentData[type];
      const targets = enhancementTargets[type];
      
      if (equipment && targets && targets.normalTarget > equipment.normalLevel) {
        // 현재 레벨에서 목표 레벨까지 강화 필요
        const currentLevel = equipment.normalLevel;
        const targetLevel = targets.normalTarget;
        const equipmentType = type === '무기' ? 'weapon' : 'armor';
        
        const results = simulateEquipmentEnhancement(
          currentLevel,
          targetLevel,
          equipmentType,
          materialOptions.normalBooks || materialOptions.advancedScrolls,
          materialOptions.normalBreaths || materialOptions.advancedBreaths
        );
        
        // 각 장비의 결과를 전체 결과에 통합
        results.forEach((result, index) => {
          if (!allResults[index]) {
            allResults[index] = {
              materials: {},
              gold: { enhancement: 0, materials: 0, total: 0 }
            };
          }
          
          // 재료 통합
          Object.keys(result.materials).forEach(materialKey => {
            if (!allResults[index].materials[materialKey]) {
              allResults[index].materials[materialKey] = {
                count: 0,
                unitPrice: result.materials[materialKey].unitPrice,
                totalPrice: 0
              };
            }
            allResults[index].materials[materialKey].count += result.materials[materialKey].count;
            allResults[index].materials[materialKey].totalPrice += result.materials[materialKey].totalPrice;
          });
          
          // 골드 통합
          allResults[index].gold.enhancement += result.gold.enhancement;
          allResults[index].gold.materials += result.gold.materials;
          allResults[index].gold.total += result.gold.total;
        });
      }
    });

    if (allResults.length === 0) {
      return null;
    }

    // 4가지 시나리오 계산
    const scenarios = calculateScenarios(allResults);
    
    // 장인의 기운 100% 확정 강화 비용 계산
    let guaranteedResult = {
      materials: {},
      gold: { enhancement: 0, materials: 0, total: 0 }
    };

    equipmentOrder.forEach(type => {
      const equipment = equipmentData[type];
      const targets = enhancementTargets[type];
      
      if (equipment && targets && targets.normalTarget > equipment.normalLevel) {
        const currentLevel = equipment.normalLevel;
        const targetLevel = targets.normalTarget;
        const equipmentType = type === '무기' ? 'weapon' : 'armor';
        
        const guaranteed = calculateGuaranteedCost(
          currentLevel,
          targetLevel,
          equipmentType,
          materialOptions.normalBooks || materialOptions.advancedScrolls,
          materialOptions.normalBreaths || materialOptions.advancedBreaths
        );
        
        // 재료 통합
        Object.keys(guaranteed.materials).forEach(materialKey => {
          if (!guaranteedResult.materials[materialKey]) {
            guaranteedResult.materials[materialKey] = {
              count: 0,
              unitPrice: guaranteed.materials[materialKey].unitPrice,
              totalPrice: 0
            };
          }
          guaranteedResult.materials[materialKey].count += guaranteed.materials[materialKey].count;
          guaranteedResult.materials[materialKey].totalPrice += guaranteed.materials[materialKey].totalPrice;
        });
        
        // 골드 통합
        guaranteedResult.gold.enhancement += guaranteed.gold.enhancement;
        guaranteedResult.gold.materials += guaranteed.gold.materials;
        guaranteedResult.gold.total += guaranteed.gold.total;
      }
    });

    scenarios.guaranteed = guaranteedResult;
    
    return scenarios;
  };

  // 재료 데이터를 TotalSummaryCard 형식으로 변환
  const formatMaterialsForDisplay = (scenario) => {
    if (!scenario || !scenario.materials) return [];
    
    const materialNames = {
      '수호석': '운명의 수호석',
      '파괴석': '운명의 파괴석', 
      '돌파석': '운명의 돌파석',
      '아비도스': '아비도스 융화 재료',
      '운명의 파편': '운명의 파편',
      // 장비 타입별 구체적인 숨결 이름 매핑
      '무기_숨결': '용암의 숨결',
      '방어구_숨결': '빙하의 숨결',
      // 장비 타입별 구체적인 책 이름 매핑
      '무기_책_11_14': '야금술 : 업화 [11-14]',
      '무기_책_15_18': '야금술 : 업화 [15-18]',
      '방어구_책_11_14': '재봉술 : 업화 [11-14]',
      '방어구_책_15_18': '재봉술 : 업화 [15-18]'
    };
    
    return Object.entries(scenario.materials)
      .map(([key, data]) => ({
        name: materialNames[key] || key,
        quantity: data.count,
        totalValue: data.totalPrice,
        category: '일반'
      }))
      .sort((a, b) => b.totalValue - a.totalValue); // 가격 높은 순으로 정렬
  };

  // 목표 아이템 레벨 계산 함수
  const calculateTargetItemLevel = () => {
    if (!equipmentData || !enhancementTargets || Object.keys(equipmentData).length === 0) {
      return "0.00";
    }

    let totalEnhancementIncrease = 0;
    let equipmentCount = 0;

    equipmentOrder.forEach(type => {
      const equipment = equipmentData[type];
      const targets = enhancementTargets[type];
      
      if (equipment && targets) {
        // 현재 → 목표 강화로 인한 아이템 레벨 증가량 계산
        const normalIncrease = (targets.normalTarget - equipment.normalLevel) * 5;
        const advancedIncrease = (targets.advancedTarget - equipment.advancedLevel);
        
        totalEnhancementIncrease += normalIncrease + advancedIncrease;
        equipmentCount++;
      }
    });

    // 평균 증가량을 현재 아이템 레벨에 더함
    const averageIncrease = equipmentCount > 0 ? totalEnhancementIncrease / equipmentCount : 0;
    const targetItemLevel = currentItemLevel + averageIncrease;
    
    // 소숫점 끝자리 0 제거하여 표시
    return formatItemLevel(targetItemLevel);
  };

  // 모든 목표치 초기화 (현재 강화 수치로 되돌리기)
  const resetAllTargets = () => {
    setEnhancementTargets(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(type => {
        const equipment = equipmentData[type];
        if (equipment) {
          updated[type] = {
            normalTarget: equipment.normalLevel,
            advancedTarget: equipment.advancedLevel
          };
        }
      });
      return updated;
    });
    
    // 클릭 이펙트
    setClickedButton('reset');
    setTimeout(() => setClickedButton(null), 300);
  };

  // 보유 재료 초기화
  const resetMaterials = () => {
    setMaterials(prev => {
      const updated = {};
      Object.keys(prev).forEach(materialType => {
        updated[materialType] = {
          count: 0,
          isMax: false,
          savedCount: 0
        };
      });
      return updated;
    });
    
    // 클릭 이펙트
    setClickedButton('resetMaterials');
    setTimeout(() => setClickedButton(null), 300);
  };

  // 재료 일괄 최대 설정
  const handleBulkMaxToggle = () => {
    setMaterials(prev => {
      const updated = {};
      Object.keys(prev).forEach(materialType => {
        updated[materialType] = {
          count: 0,
          isMax: true,
          savedCount: prev[materialType].savedCount
        };
      });
      return updated;
    });
    
    // 클릭 이펙트
    setClickedButton('bulkMax');
    setTimeout(() => setClickedButton(null), 300);
  };


  // 일괄 일반 재련 목표 적용
  const applyBulkNormalTarget = (targetLevel) => {
    const highlightTypes = []; // 하이라이트할 장비만 추적
    
    setEnhancementTargets(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(type => {
        const equipment = equipmentData[type];
        if (equipment && equipment.normalLevel <= targetLevel) {
          updated[type] = {
            ...updated[type],
            normalTarget: targetLevel
          };
          
          // 현재 수치와 다른 경우에만 하이라이트
          if (equipment.normalLevel !== targetLevel) {
            highlightTypes.push(type);
          }
        }
      });
      return updated;
    });
    
    // 하이라이트 효과는 변화가 있는 장비에만 적용
    setHighlightedEquipment({
      type: 'normal',
      equipmentTypes: highlightTypes
    });
    
    // 클릭 이펙트
    const buttonId = `normal-${targetLevel}`;
    setClickedButton(buttonId);
    
    // 하이라이트 및 클릭 이펙트 해제 (1초 후)
    setTimeout(() => {
      setHighlightedEquipment({ type: null, equipmentTypes: [] });
      setClickedButton(null);
    }, 1000);
  };

  // 일괄 상급 재련 목표 적용
  const applyBulkAdvancedTarget = (targetLevel) => {
    const highlightTypes = []; // 하이라이트할 장비만 추적
    
    setEnhancementTargets(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(type => {
        const equipment = equipmentData[type];
        if (equipment && equipment.advancedLevel <= targetLevel) {
          updated[type] = {
            ...updated[type],
            advancedTarget: targetLevel
          };
          
          // 현재 수치와 다른 경우에만 하이라이트
          if (equipment.advancedLevel !== targetLevel) {
            highlightTypes.push(type);
          }
        }
      });
      return updated;
    });
    
    // 하이라이트 효과는 변화가 있는 장비에만 적용
    setHighlightedEquipment({
      type: 'advanced',
      equipmentTypes: highlightTypes
    });
    
    // 클릭 이펙트
    const buttonId = `advanced-${targetLevel}`;
    setClickedButton(buttonId);
    
    // 하이라이트 및 클릭 이펙트 해제 (1초 후)
    setTimeout(() => {
      setHighlightedEquipment({ type: null, equipmentTypes: [] });
      setClickedButton(null);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* 제목 */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        강화 계산기
      </h2>

      {/* 캐릭터 검색 */}
      <div className="relative">
        <div className="flex gap-3">
          <input
            ref={searchInputRef}
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="캐릭터명"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                     focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleSearchCharacter()}
          />
          <button
            onClick={handleSearchCharacter}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
                     disabled:opacity-50 text-sm flex items-center gap-1"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            검색
          </button>
        </div>
        
        {/* 검색 기록 드롭다운 */}
        {showDropdown && enhancementSearchHistory.length > 0 && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-b shadow-lg z-50 mt-1"
          >
            {enhancementSearchHistory.map((name, index) => (
              <div
                key={index}
                onClick={() => handleHistorySelect(name)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Clock size={14} />
                <span className="flex-1">{name}</span>
                <button
                  onClick={(e) => handleRemoveHistory(e, name)}
                  className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-sm">
          {error}
        </div>
      )}

      {/* 일괄 목표 설정 */}
      {equipmentData && (
        <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm flex-wrap">
          <span className="font-medium text-gray-900 dark:text-white">일괄설정:</span>
          
          <div className="flex items-center gap-1">
            <span className="text-gray-700 dark:text-gray-300 mr-1">일반</span>
            {[14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(level => {
              const buttonId = `normal-${level}`;
              const isClicked = clickedButton === buttonId;
              return (
                <button
                  key={level}
                  onClick={() => applyBulkNormalTarget(level)}
                  className={`px-2 py-1 text-xs border rounded transition-all duration-200 transform ${
                    isClicked 
                      ? 'bg-green-500 text-white border-green-500 scale-110' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-400 dark:hover:border-blue-400 hover:shadow-sm hover:scale-105'
                  }`}
                >
                  +{level}
                </button>
              );
            })}
          </div>
          
          <div className="text-gray-400">|</div>
          
          <div className="flex items-center gap-1">
            <span className="text-gray-700 dark:text-gray-300 mr-1">상재</span>
            {[10, 20, 30, 40].map(level => {
              const buttonId = `advanced-${level}`;
              const isClicked = clickedButton === buttonId;
              return (
                <button
                  key={level}
                  onClick={() => applyBulkAdvancedTarget(level)}
                  className={`px-2 py-1 text-xs border rounded transition-all duration-200 transform ${
                    isClicked 
                      ? 'bg-green-500 text-white border-green-500 scale-110' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-400 dark:hover:border-blue-400 hover:shadow-sm hover:scale-105'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
          
          {/* 아이템 레벨 표시를 뒤쪽으로 이동 */}
          <div className="text-gray-700 dark:text-gray-300 font-medium">
            현재: {formatItemLevel(currentItemLevel)} │ 목표: {calculateTargetItemLevel()}
          </div>
          
          <button
            onClick={resetAllTargets}
            className={`px-3 py-1 text-xs border rounded transition-all duration-200 transform ml-auto ${
              clickedButton === 'reset'
                ? 'bg-red-600 dark:bg-red-500 text-white border-red-600 dark:border-red-500 scale-110'
                : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-200 dark:hover:bg-red-900/40'
            }`}
          >
            초기화
          </button>
        </div>
      )}

      {/* 2열 레이아웃: 보유 재료 + 장비 정보 */}
      {equipmentData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 왼쪽 열 - 보유 재료 */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 h-full">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                보유 재료
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkMaxToggle}
                  className={`px-3 py-1 text-xs border rounded transition-all duration-200 transform ${
                    clickedButton === 'bulkMax'
                      ? 'bg-green-600 dark:bg-green-500 text-white border-green-600 dark:border-green-500 scale-110'
                      : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-600 hover:bg-green-200 dark:hover:bg-green-900/40'
                  }`}
                >
                  일괄 최대
                </button>
                <button
                  onClick={resetMaterials}
                  className={`px-3 py-1 text-xs border rounded transition-all duration-200 transform ${
                    clickedButton === 'resetMaterials'
                      ? 'bg-red-600 dark:bg-red-500 text-white border-red-600 dark:border-red-500 scale-110'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-200 dark:hover:bg-red-900/40'
                  }`}
                >
                  초기화
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(materials).map(([materialType, materialData]) => (
                <div key={materialType} className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    {materialType}
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={materialData.isMax ? '' : formatNumber(materialData.count)}
                      onChange={(e) => handleMaterialChange(materialType, e.target.value)}
                      disabled={materialData.isMax}
                      className={`flex-1 px-2 py-1 text-xs border rounded transition-colors ${
                        materialData.isMax
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 border-gray-200 dark:border-gray-600 placeholder-gray-900 dark:placeholder-white'
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-500'
                      }`}
                      placeholder={materialData.isMax ? "최대+" : "0"}
                    />
                    <button
                      onClick={() => handleMaxToggle(materialType)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        materialData.isMax 
                          ? 'bg-green-500 text-white border border-green-500' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      최대
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽 열 - 장비 정보 및 목표 설정 */}
          <div className="space-y-3">
            {equipmentOrder.map(type => {
              const equipment = equipmentData[type];
              const targets = enhancementTargets[type];
              if (!equipment || !targets) return null;
              
              const isNormalHighlighted = highlightedEquipment.type === 'normal' && 
                                         highlightedEquipment.equipmentTypes.includes(type);
              const isAdvancedHighlighted = highlightedEquipment.type === 'advanced' && 
                                           highlightedEquipment.equipmentTypes.includes(type);
              
              return (
                <div key={type} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <img 
                    src={equipment.icon} 
                    alt={equipment.name}
                    className="w-8 h-8 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 dark:text-white">
                      {equipmentTypeMap[type]}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="text-gray-600 dark:text-gray-400">
                      +{equipment.normalLevel}
                    </div>
                    
                    {/* 일반재련: 드롭다운 + [+ -] 버튼 */}
                    <div className="flex items-center gap-1">
                      <select
                        value={targets.normalTarget}
                        onChange={(e) => handleTargetChange(type, 'normalTarget', e.target.value)}
                        className={`w-16 px-2 py-1 text-sm border rounded transition-all duration-500 ${
                          isNormalHighlighted 
                            ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-bold'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        {Array.from({length: 16}, (_, i) => i + 10).map(level => (
                          <option key={level} value={level} disabled={level < equipment.normalLevel}>
                            +{level}
                          </option>
                        ))}
                      </select>
                      <div className="flex flex-row">
                        <button
                          onClick={() => adjustNormalTarget(type, -1)}
                          className="w-8 h-6 flex items-center justify-center text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-l transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <button
                          onClick={() => adjustNormalTarget(type, 1)}
                          className="w-8 h-6 flex items-center justify-center text-xs border border-l-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-r transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="text-gray-600 dark:text-gray-400">
                      {equipment.advancedLevel}단계
                    </div>
                    
                    {/* 상급재련: 드롭다운 + [+ -] 버튼 */}
                    <div className="flex items-center gap-1">
                      <select
                        value={targets.advancedTarget}
                        onChange={(e) => handleTargetChange(type, 'advancedTarget', e.target.value)}
                        className={`w-16 px-2 py-1 text-sm border rounded transition-all duration-500 ${
                          isAdvancedHighlighted 
                            ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-bold'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        {generateAdvancedOptions(equipment.advancedLevel).map(level => (
                          <option key={level} value={level} disabled={level < equipment.advancedLevel}>
                            {level}
                          </option>
                        ))}
                      </select>
                      <div className="flex flex-row">
                        <button
                          onClick={() => adjustAdvancedTarget(type, -1)}
                          className="w-8 h-6 flex items-center justify-center text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-l transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <button
                          onClick={() => adjustAdvancedTarget(type, 1)}
                          className="w-8 h-6 flex items-center justify-center text-xs border border-l-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-r transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 재료 옵션 및 가격 갱신 */}
      {equipmentData && (
        <div className="flex items-center justify-between gap-6 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-900 dark:text-white">일반:</span>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={materialOptions.normalBooks}
                  onChange={(e) => handleMaterialOptionChange('normalBooks', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>책</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={materialOptions.normalBreaths}
                  onChange={(e) => handleMaterialOptionChange('normalBreaths', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>숨결</span>
              </label>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-900 dark:text-white">상급:</span>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={materialOptions.advancedScrolls}
                  onChange={(e) => handleMaterialOptionChange('advancedScrolls', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>스크롤</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={materialOptions.advancedBreaths}
                  onChange={(e) => handleMaterialOptionChange('advancedBreaths', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>숨결</span>
              </label>
            </div>
          </div>

          {/* 재료 가격 정보 및 갱신 버튼 */}
          <div className="flex items-center gap-3">
            {priceLastUpdated && (
              <span className="text-xs text-gray-600 dark:text-gray-400">
                가격 갱신: {priceLastUpdated.toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            )}
            <button
              onClick={() => updateMaterialPrices()}
              disabled={priceLoading}
              className={`px-3 py-1 text-xs rounded transition-all duration-200 flex items-center gap-1 ${
                priceLoading
                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 border border-blue-300 dark:border-blue-600'
              }`}
            >
              {priceLoading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <RefreshCw size={12} />
              )}
              가격 갱신
            </button>
          </div>
        </div>
      )}


      {/* 상세 재료 목록 섹션 */}
      {equipmentData && (() => {
        const scenarios = calculateTotalEnhancementCost();
        
        if (!scenarios) return null;
        
        const selectedScenarioData = scenarios[selectedScenario];
        const displayMaterials = formatMaterialsForDisplay(selectedScenarioData);
        
        const scenarioOptions = [
          { key: 'upper25', label: '25% (상위)', color: 'blue' },
          { key: 'median', label: '중앙값', color: 'green' },
          { key: 'lower25', label: '75% (하위)', color: 'yellow' },
          { key: 'guaranteed', label: '장기백', color: 'red' }
        ];
        
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
            {/* 시나리오 선택 버튼 */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                상세 재료 목록
              </h3>
              <div className="flex gap-2">
                {scenarioOptions.map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedScenario(key)}
                    className={`px-3 py-1 text-sm rounded transition-all duration-200 ${
                      selectedScenario === key
                        ? `bg-${color}-500 text-white border-${color}-500`
                        : `bg-${color}-50 dark:bg-${color}-900/20 text-${color}-700 dark:text-${color}-400 border border-${color}-300 dark:border-${color}-600 hover:bg-${color}-100 dark:hover:bg-${color}-900/40`
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 비용 요약 */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">재료비</div>
                <div className="text-base font-semibold text-blue-600 dark:text-blue-400">
                  {formatNumber(Math.round(selectedScenarioData.gold.materials))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">강화비</div>
                <div className="text-base font-semibold text-orange-600 dark:text-orange-400">
                  {formatNumber(Math.round(selectedScenarioData.gold.enhancement))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">총 비용</div>
                <div className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-1 justify-center">
                  <span>{formatNumber(Math.round(selectedScenarioData.gold.total))}</span>
                  <GoldIcon />
                </div>
              </div>
            </div>
            
            {/* 재료 목록 */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 mb-2">
                <ChestIcon />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  필요 재료
                </span>
              </div>
              {displayMaterials.length > 0 ? (
                displayMaterials.map((material, index) => (
                  <MaterialItem 
                    key={`${material.name}-${index}`} 
                    material={material} 
                  />
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                  필요한 재료가 없습니다.
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default EnhancementCalculator;