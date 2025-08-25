import { useState } from 'react';
import { useMoreRewards } from '../../hooks/useMoreRewards';
import RaidGateCard from './RaidGateCard';
import RaidSelectCard from './RaidSelectCard';
import TotalSummaryCard from './TotalSummaryCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { RAID_DATA } from '../../data/raidData';
import { formatNumber, formatDateTime } from '../../utils/formatters';
import { 
  RefreshCw, 
  AlertCircle,
  Clock
} from 'lucide-react';

const MoreRewardsCalculator = () => {
  const {
    selectedRaid,
    selectedDifficulty,
    gateData,
    loading,
    error,
    priceUpdateInfo,
    raidOptions,
    currentRaid,
    handleRaidChange,
    handleDifficultyChange,
    handleMaterialToggle,
    refreshPrices,
    getSortedGates,
    getEfficiencyStats,
    hasData,
    hasPrices,
    isOutdated
  } = useMoreRewards();

  // 관문 데이터 (항상 관문순으로 고정)
  const sortedGates = getSortedGates('gate');
  
  // 효율성 통계
  const stats = getEfficiencyStats();
  
  // 최고/최저 효율 관문

  if (loading && !hasPrices) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">더보기 효율 데이터 로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        onRetry={refreshPrices}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 및 컨트롤 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* 제목 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                더보기 효율 계산기
              </h2>
              {priceUpdateInfo && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
                  isOutdated 
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
                    : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                }`}>
                  <Clock size={12} />
                  <span>
                    {isOutdated 
                      ? '가격 정보 오래됨'
                      : `가격 정보: ${priceUpdateInfo.lastUpdate || '오늘'} 기준`
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* 가격 갱신 버튼 */}
          <button
            onClick={refreshPrices}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              loading
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            가격 갱신
          </button>
        </div>

        {/* 레이드 선택 */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {raidOptions.map((option) => (
              <RaidSelectCard
                key={option.value}
                raid={RAID_DATA[option.value]}
                isSelected={selectedRaid === option.value}
                onClick={handleRaidChange}
              />
            ))}
          </div>
        </div>

        {/* 난이도 선택 */}
        <div className="mb-6">
          <div className="flex gap-2">
            {currentRaid?.difficulty.map((diff) => (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {diff === 'normal' ? '노말' : '하드'}
              </button>
            )) || []}
          </div>
        </div>
      </div>



      {/* 관문 카드 목록 */}
      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* 총합 카드 */}
          <TotalSummaryCard
            allGates={sortedGates}
            raidName={currentRaid?.name}
            difficulty={selectedDifficulty}
          />
          
          {/* 개별 관문 카드들 */}
          {sortedGates.map((gate) => (
            <RaidGateCard
              key={`${selectedRaid}-${gate.gateId}`}
              gate={gate}
              raidName={currentRaid?.name}
              difficulty={selectedDifficulty}
              onMaterialToggle={handleMaterialToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            데이터를 불러올 수 없습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            레이드 정보나 가격 데이터를 확인할 수 없습니다.
          </p>
          <button
            onClick={refreshPrices}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            다시 시도
          </button>
        </div>
      )}
    </div>
  );
};

export default MoreRewardsCalculator;