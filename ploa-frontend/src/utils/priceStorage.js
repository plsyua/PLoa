// 더보기 효율 계산용 재료 가격 저장 및 관리
import { searchMarketItems } from '../services/lostarkApi';
import { calculateMaterialUnitPrice, MATERIAL_SEARCH_NAMES } from '../data/raidData';

const PRICE_STORAGE_KEY = 'loa_material_prices';
const PRICE_UPDATE_TIME_KEY = 'loa_price_update_time';

// 현재 시간의 30분 기준 문자열 반환 (예: "2025-01-15 14:30")
const getCurrentHourString = () => {
  const now = new Date();
  let hour = now.getHours();
  const minute = now.getMinutes();
  
  // 30분 이전이면 이전 시간의 30분 기준
  if (minute < 30) {
    hour = hour - 1;
    if (hour < 0) {
      // 0시 이전이면 전날 23시로
      hour = 23;
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return `${yesterday.toISOString().split('T')[0]} ${hour.toString().padStart(2, '0')}:30`;
    }
  }
  
  return `${now.toISOString().split('T')[0]} ${hour.toString().padStart(2, '0')}:30`;
};

// 시간 단위 체크 (가격 갱신 필요 여부 - 매시 30분 기준)
const isNewHour = () => {
  const lastUpdate = localStorage.getItem(PRICE_UPDATE_TIME_KEY);
  const currentHour = getCurrentHourString();
  
  return !lastUpdate || lastUpdate !== currentHour;
};

// 저장된 가격 데이터 가져오기
export const getStoredPrices = () => {
  try {
    const storedData = localStorage.getItem(PRICE_STORAGE_KEY);
    if (!storedData) return {};
    
    return JSON.parse(storedData);
  } catch (error) {
    console.error('가격 데이터 로드 실패:', error);
    return {};
  }
};

// 가격 데이터 저장
export const storePrices = (priceData) => {
  try {
    localStorage.setItem(PRICE_STORAGE_KEY, JSON.stringify(priceData));
    localStorage.setItem(PRICE_UPDATE_TIME_KEY, getCurrentHourString());
    return true;
  } catch (error) {
    console.error('가격 데이터 저장 실패:', error);
    return false;
  }
};

// 단일 재료 가격 조회 (거래소 API)
const fetchMaterialPrice = async (materialName) => {
  try {
    // 재료명을 실제 거래소 검색명으로 변환 (예: "명예의 파편" → "명예의 파편 주머니(대)")
    const searchItemName = MATERIAL_SEARCH_NAMES[materialName] || materialName;
    
    const searchOptions = {
      CategoryCode: 50000, // 강화재료 카테고리
      ItemName: searchItemName,
      Sort: "CURRENT_MIN_PRICE",
      SortCondition: "ASC",
      PageNo: 0
    };
    
    const response = await searchMarketItems(searchOptions);
    
    if (response?.Items && response.Items.length > 0) {
      const item = response.Items[0];
      
      // 거래소 가격을 재료별 개당 가격으로 변환
      const rawCurrentMinPrice = item.CurrentMinPrice || 0;
      const rawYDayAvgPrice = item.YDayAvgPrice || 0;
      const rawRecentPrice = item.RecentPrice || 0;
      
      return {
        name: materialName,
        currentMinPrice: calculateMaterialUnitPrice(materialName, rawCurrentMinPrice),
        yDayAvgPrice: calculateMaterialUnitPrice(materialName, rawYDayAvgPrice),
        recentPrice: calculateMaterialUnitPrice(materialName, rawRecentPrice),
        timestamp: Date.now()
      };
    }
    
    return null;
  } catch (error) {
    console.error(`${materialName} 가격 조회 실패:`, error);
    return null;
  }
};

// 여러 재료 가격 일괄 조회
export const fetchMaterialPrices = async (materialNames) => {
  const pricePromises = materialNames.map(name => fetchMaterialPrice(name));
  const results = await Promise.allSettled(pricePromises);
  
  const priceData = {};
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      priceData[materialNames[index]] = result.value;
    }
  });
  
  return priceData;
};

// 가격 데이터 갱신 (시간 단위 체크 포함)
export const updatePricesIfNeeded = async (materialNames) => {
  // 새로운 시간대인지 체크
  if (!isNewHour()) {
    return getStoredPrices();
  }
  
  console.log('새로운 시간대 감지 - 재료 가격 갱신 중...');
  
  try {
    // 새 가격 데이터 조회
    const newPrices = await fetchMaterialPrices(materialNames);
    
    // 기존 데이터와 병합
    const existingPrices = getStoredPrices();
    const mergedPrices = { ...existingPrices, ...newPrices };
    
    // 저장
    storePrices(mergedPrices);
    
    return mergedPrices;
  } catch (error) {
    console.error('가격 갱신 실패:', error);
    // 실패 시 기존 데이터 반환
    return getStoredPrices();
  }
};

// 특정 재료의 가격 정보 가져오기
export const getMaterialPrice = (materialName, storedPrices = null) => {
  const prices = storedPrices || getStoredPrices();
  const priceInfo = prices[materialName];
  
  if (!priceInfo) {
    return {
      currentMinPrice: 0,
      yDayAvgPrice: 0,
      recentPrice: 0,
      isAvailable: false
    };
  }
  
  return {
    currentMinPrice: priceInfo.currentMinPrice || 0,
    yDayAvgPrice: priceInfo.yDayAvgPrice || 0,
    recentPrice: priceInfo.recentPrice || 0,
    isAvailable: true,
    lastUpdate: priceInfo.timestamp
  };
};

// 효율 계산 함수
export const calculateGateEfficiency = (gate, storedPrices, difficulty = 'normal', materialCheckedStates = {}) => {
  let totalValue = 0;
  const materialDetails = [];
  
  // 각 재료별 가치 계산
  gate.materials.forEach(material => {
    const priceInfo = getMaterialPrice(material.name, storedPrices);
    
    // 난이도별 수량 처리 (하위 호환성 지원)
    let materialQuantity;
    if (typeof material.quantity === 'object' && material.quantity !== null) {
      // 난이도별 객체 형태: { normal: 3, hard: 6 }
      materialQuantity = material.quantity[difficulty];
      
      // 해당 난이도에 수량이 없는 재료는 건너뛰기 (표시하지 않음)
      if (materialQuantity === undefined || materialQuantity === null) {
        return;
      }
      
      // 0인 경우에도 기본값으로 처리
      materialQuantity = materialQuantity || 0;
    } else {
      // 기존 단일 값 형태: 3
      materialQuantity = material.quantity || 0;
    }
    
    // 재료별 체크 상태 확인 (기본값: true)
    const materialKey = material.name;
    const isChecked = materialCheckedStates[materialKey] !== undefined ? materialCheckedStates[materialKey] : true;
    
    // '고유' 카테고리 재료는 0원으로 처리 (거래 불가능한 고유 아이템)
    // 체크 해제된 재료도 0원으로 처리
    const baseValue = material.category === '고유' 
      ? 0 
      : (priceInfo.currentMinPrice || priceInfo.yDayAvgPrice || 0) * materialQuantity;
    
    const itemValue = isChecked ? baseValue : 0;
    
    totalValue += itemValue;
    
    // gradeInfo가 있는 경우 난이도에 맞는 값 추출
    let gradeInfo = null;
    if (material.gradeInfo) {
      if (typeof material.gradeInfo === 'object' && material.gradeInfo !== null) {
        gradeInfo = material.gradeInfo[difficulty];
      } else {
        gradeInfo = material.gradeInfo;
      }
    }
    
    materialDetails.push({
      ...material,
      quantity: materialQuantity, // 계산된 난이도별 수량으로 업데이트
      unitPrice: material.category === '고유' ? 0 : (priceInfo.currentMinPrice || priceInfo.yDayAvgPrice || 0),
      totalValue: itemValue,
      isAvailable: material.category === '고유' ? false : priceInfo.isAvailable,
      isChecked: isChecked,
      gradeInfo: gradeInfo // 난이도에 맞는 등급 정보 추가
    });
  });
  
  const moreRewardCost = gate.moreRewardCost[difficulty] || gate.moreRewardCost.normal || 0;
  const profit = totalValue - moreRewardCost;
  const efficiency = moreRewardCost > 0 ? (profit / moreRewardCost) * 100 : 0;
  
  return {
    totalValue,
    moreRewardCost,
    profit,
    efficiency,
    materialDetails,
    isProfit: profit > 0
  };
};

// 전체 레이드의 관문별 효율 계산
export const calculateRaidEfficiency = (raidData, storedPrices, difficulty = 'normal', materialCheckedStates = {}) => {
  return raidData.gates
    .map(gate => ({
      ...gate,
      ...calculateGateEfficiency(gate, storedPrices, difficulty, materialCheckedStates)
    }))
    .filter(gate => gate.materialDetails.length > 0); // 재료가 있는 관문만 표시
};

// 가격 업데이트 시간 정보
export const getPriceUpdateInfo = () => {
  const lastUpdate = localStorage.getItem(PRICE_UPDATE_TIME_KEY);
  const isOutdated = isNewHour();
  
  return {
    lastUpdate: lastUpdate || null,
    isOutdated,
    nextUpdate: getNextUpdateTime()
  };
};

// 다음 갱신 시간 계산 (다음 시간의 30분)
const getNextUpdateTime = () => {
  const nextHour = new Date();
  nextHour.setHours(nextHour.getHours() + 1, 30, 0, 0);
  return nextHour.toISOString();
};

// 수동 가격 갱신
export const manualUpdatePrices = async (materialNames) => {
  try {
    console.log('수동 가격 갱신 시작...');
    
    const newPrices = await fetchMaterialPrices(materialNames);
    const existingPrices = getStoredPrices();
    const mergedPrices = { ...existingPrices, ...newPrices };
    
    storePrices(mergedPrices);
    
    return {
      success: true,
      updatedCount: Object.keys(newPrices).length,
      prices: mergedPrices
    };
  } catch (error) {
    console.error('수동 가격 갱신 실패:', error);
    return {
      success: false,
      error: error.message,
      prices: getStoredPrices()
    };
  }
};