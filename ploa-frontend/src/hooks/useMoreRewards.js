// 더보기 효율 계산 커스텀 훅
import { useState, useEffect, useCallback } from 'react';
import { RAID_DATA, getRaidOptions, getRaidGates } from '../data/raidData';
import { MATERIAL_SEARCH_NAMES } from '../data/raidData';
import { 
  updatePricesIfNeeded, 
  calculateRaidEfficiency, 
  getPriceUpdateInfo,
  manualUpdatePrices,
  getStoredPrices 
} from '../utils/priceStorage';

export const useMoreRewards = () => {
  // 상태 관리
  const [selectedRaid, setSelectedRaid] = useState('valtan'); // 기본값: 발탄
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal'); // 기본값: 노말
  const [gateData, setGateData] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceUpdateInfo, setPriceUpdateInfo] = useState(null);
  const [materialCheckedStates, setMaterialCheckedStates] = useState({}); // 재료별 체크 상태

  // 레이드 옵션 가져오기
  const raidOptions = getRaidOptions();

  // 현재 선택된 레이드 정보
  const currentRaid = RAID_DATA[selectedRaid];

  // 가격 정보 초기화
  const initializePrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 필요한 모든 재료 이름 수집
      const allMaterials = Object.keys(MATERIAL_SEARCH_NAMES);
      
      // 가격 데이터 갱신 (자정 체크 포함)
      const updatedPrices = await updatePricesIfNeeded(allMaterials);
      
      setPrices(updatedPrices);
      setPriceUpdateInfo(getPriceUpdateInfo());
      
    } catch (err) {
      console.error('가격 초기화 실패:', err);
      setError('가격 정보를 불러오는데 실패했습니다.');
      
      // 실패 시 저장된 데이터라도 사용
      setPrices(getStoredPrices());
    } finally {
      setLoading(false);
    }
  }, []);

  // 관문 데이터 계산
  const calculateGateData = useCallback(() => {
    if (!currentRaid || Object.keys(prices).length === 0) {
      setGateData([]);
      return;
    }

    const raidGates = getRaidGates(selectedRaid, selectedDifficulty);
    const calculatedGates = calculateRaidEfficiency(
      { gates: raidGates }, 
      prices, 
      selectedDifficulty,
      materialCheckedStates
    );
    
    setGateData(calculatedGates);
  }, [selectedRaid, selectedDifficulty, currentRaid, prices, materialCheckedStates]);

  // 레이드 변경 핸들러
  const handleRaidChange = useCallback((raidId) => {
    setSelectedRaid(raidId);
    
    // 선택된 레이드에서 지원하지 않는 난이도면 기본값으로 변경
    const raid = RAID_DATA[raidId];
    if (raid && !raid.difficulty.includes(selectedDifficulty)) {
      setSelectedDifficulty(raid.difficulty[0] || 'normal');
    }
  }, [selectedDifficulty]);

  // 난이도 변경 핸들러
  const handleDifficultyChange = useCallback((difficulty) => {
    setSelectedDifficulty(difficulty);
  }, []);

  // 재료 체크 상태 변경 핸들러
  const handleMaterialToggle = useCallback((gateId, materialName, isChecked) => {
    const key = `${selectedRaid}-${gateId}-${materialName}`;
    setMaterialCheckedStates(prev => ({
      ...prev,
      [materialName]: isChecked
    }));
  }, [selectedRaid]);

  // 수동 가격 갱신
  const refreshPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const allMaterials = Object.keys(MATERIAL_SEARCH_NAMES);
      const result = await manualUpdatePrices(allMaterials);
      
      if (result.success) {
        setPrices(result.prices);
        setPriceUpdateInfo(getPriceUpdateInfo());
      } else {
        throw new Error(result.error || '가격 갱신 실패');
      }
    } catch (err) {
      console.error('수동 가격 갱신 실패:', err);
      setError('가격 갱신에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 효율성 기준 정렬
  const getSortedGates = useCallback((sortBy = 'efficiency') => {
    const sorted = [...gateData];
    
    switch (sortBy) {
      case 'efficiency':
        return sorted.sort((a, b) => b.efficiency - a.efficiency);
      case 'profit':
        return sorted.sort((a, b) => b.profit - a.profit);
      case 'gate':
        return sorted.sort((a, b) => a.gateId - b.gateId);
      default:
        return sorted;
    }
  }, [gateData]);

  // 총 효율성 통계
  const getEfficiencyStats = useCallback(() => {
    if (gateData.length === 0) return null;

    const profitableGates = gateData.filter(gate => gate.isProfit);
    const totalCost = gateData.reduce((sum, gate) => sum + gate.moreRewardCost, 0);
    const totalValue = gateData.reduce((sum, gate) => sum + gate.totalValue, 0);
    const totalProfit = totalValue - totalCost;
    const overallEfficiency = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    return {
      totalGates: gateData.length,
      profitableGates: profitableGates.length,
      totalCost,
      totalValue,
      totalProfit,
      overallEfficiency,
      averageEfficiency: gateData.reduce((sum, gate) => sum + gate.efficiency, 0) / gateData.length
    };
  }, [gateData]);


  // 초기화
  useEffect(() => {
    initializePrices();
  }, [initializePrices]);

  // 관문 데이터 재계산
  useEffect(() => {
    calculateGateData();
  }, [calculateGateData]);

  return {
    // 상태
    selectedRaid,
    selectedDifficulty,
    gateData,
    prices,
    loading,
    error,
    priceUpdateInfo,
    
    // 옵션
    raidOptions,
    currentRaid,
    
    // 핸들러
    handleRaidChange,
    handleDifficultyChange,
    handleMaterialToggle,
    refreshPrices,
    
    // 유틸리티
    getSortedGates,
    getEfficiencyStats,
    
    // 상태 체크
    hasData: gateData.length > 0,
    hasPrices: Object.keys(prices).length > 0,
    isOutdated: priceUpdateInfo?.isOutdated || false
  };
};