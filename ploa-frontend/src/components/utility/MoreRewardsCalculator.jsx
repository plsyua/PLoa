import { useState } from 'react';
import { useMoreRewards } from '../../hooks/useMoreRewards';
import RaidGateCard from './RaidGateCard';
import RaidSelectCard from './RaidSelectCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { RAID_DATA } from '../../data/raidData';
import { formatNumber, formatDateTime } from '../../utils/formatters';
import { 
  RefreshCw, 
  TrendingUp, 
  Target, 
  AlertCircle, 
  BarChart3,
  Clock,
  Filter,
  SortAsc
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
    getEfficiencyExtremes,
    hasData,
    hasPrices,
    isOutdated
  } = useMoreRewards();

  // 관문 데이터 (항상 관문순으로 고정)
  const sortedGates = getSortedGates('gate');
  
  // 효율성 통계
  const stats = getEfficiencyStats();
  
  // 최고/최저 효율 관문
  const extremes = getEfficiencyExtremes();

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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              더보기 효율 계산기
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              레이드별 더보기 보상 효율성을 실시간 시세 기준으로 분석합니다.
            </p>
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

        {/* 가격 정보 상태 */}
        {priceUpdateInfo && (
          <div className={`flex items-center gap-2 p-3 rounded-lg mb-6 ${
            isOutdated 
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
          }`}>
            <Clock size={16} />
            <span className="text-sm">
              {isOutdated 
                ? '가격 정보가 오래되었습니다. 새로고침을 권장합니다.'
                : `가격 정보: ${priceUpdateInfo.lastUpdate || '오늘'} 기준`
              }
            </span>
          </div>
        )}

        {/* 레이드 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            레이드 선택
          </label>
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

        {/* 난이도 및 기타 옵션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* 난이도 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              난이도
            </label>
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


          {/* 필터 (향후 확장용) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              필터
            </label>
            <div className="flex items-center h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              <Filter size={16} className="mr-2" />
              <span className="text-sm">전체 표시</span>
            </div>
          </div>
        </div>
      </div>

      {/* 효율성 통계 요약 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={16} className="text-blue-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">전체 효율</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.overallEfficiency >= 0 ? '+' : ''}{stats.overallEfficiency.toFixed(1)}%
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">이익 관문</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.profitableGates}/{stats.totalGates}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-orange-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">총 순이익</span>
            </div>
            <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {stats.totalProfit >= 0 ? '+' : ''}{formatNumber(stats.totalProfit)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <SortAsc size={16} className="text-purple-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">평균 효율</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.averageEfficiency >= 0 ? '+' : ''}{stats.averageEfficiency.toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* 최고/최저 효율 하이라이트 */}
      {extremes && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">🏆 최고 효율 관문</h3>
            <div className="text-sm text-green-700 dark:text-green-300">
              <strong>{extremes.bestGate.name}</strong> - {extremes.bestGate.efficiency >= 0 ? '+' : ''}{extremes.bestGate.efficiency.toFixed(1)}%
              <br />순이익: {formatNumber(extremes.bestGate.profit)}골드
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">⚠️ 최저 효율 관문</h3>
            <div className="text-sm text-red-700 dark:text-red-300">
              <strong>{extremes.worstGate.name}</strong> - {extremes.worstGate.efficiency >= 0 ? '+' : ''}{extremes.worstGate.efficiency.toFixed(1)}%
              <br />순이익: {formatNumber(extremes.worstGate.profit)}골드
            </div>
          </div>
        </div>
      )}

      {/* 관문 카드 목록 */}
      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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