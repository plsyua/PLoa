import { memo } from 'react';
import { formatNumber } from '../../utils/formatters';
import { MaterialIcon, GoldIcon, ChestIcon } from '../common/MaterialComponents';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// 효율성에 따른 색상 클래스
const getEfficiencyColor = (efficiency, isProfit) => {
  if (!isProfit || efficiency < 0) return 'text-red-500 bg-red-50 dark:bg-red-900/20';
  return 'text-green-500 bg-green-50 dark:bg-green-900/20';
};

// 효율성 아이콘
const getEfficiencyIcon = (efficiency, isProfit) => {
  if (!isProfit || efficiency < 0) return <TrendingDown size={16} />;
  if (efficiency >= 20) return <TrendingUp size={16} />;
  return <Minus size={16} />;
};

// 총합 재료 아이템 컴포넌트 (TotalSummaryCard 전용)
const TotalMaterialItem = memo(({ material }) => {
  const { name, quantity, totalValue, category } = material;
  
  // '고유' 카테고리 재료는 수량만 표시 (가격 정보 없음)
  if (category === '고유') {
    return (
      <div className="flex items-center gap-2 py-1.5 px-2 rounded bg-gray-50 dark:bg-gray-700/50">
        <div className="relative flex-shrink-0">
          <MaterialIcon materialName={name} />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
          {name}
        </span>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-400">
          {quantity}개
        </div>
      </div>
    );
  }
  
  // 일반 재료는 총합계 표시 (가격 포함)
  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-gray-50 dark:bg-gray-700/50">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-shrink-0">
            <MaterialIcon materialName={name} />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {name}
          </span>
          <div className="whitespace-nowrap">
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {quantity}개
            </span>
          </div>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-2">
        <div className="flex items-center gap-1">
          <div className="text-base font-semibold text-gray-900 dark:text-white">
            {formatNumber(totalValue)}
          </div>
          <GoldIcon />
        </div>
      </div>
    </div>
  );
});

// 총합 카드 컴포넌트
const TotalSummaryCard = ({ allGates, raidName, difficulty }) => {
  // 모든 관문 데이터 통합 계산
  const calculateTotalSummary = () => {
    if (!allGates || allGates.length === 0) {
      return {
        totalValue: 0,
        totalCost: 0,
        totalProfit: 0,
        totalEfficiency: 0,
        isProfit: false,
        aggregatedMaterials: []
      };
    }

    let totalValue = 0;
    let totalCost = 0;
    const materialMap = new Map();

    // 각 관문별 데이터 합산
    allGates.forEach(gate => {
      totalValue += gate.totalValue || 0;
      totalCost += gate.moreRewardCost || 0;

      // 재료별 수량과 가치 합산
      if (gate.materialDetails) {
        gate.materialDetails.forEach(material => {
          const key = material.name;
          if (materialMap.has(key)) {
            const existing = materialMap.get(key);
            existing.quantity += material.quantity || 0;
            existing.totalValue += (material.isChecked !== false ? material.totalValue || 0 : 0);
          } else {
            materialMap.set(key, {
              name: material.name,
              quantity: material.quantity || 0,
              totalValue: material.isChecked !== false ? material.totalValue || 0 : 0,
              category: material.category || '일반',
              isAvailable: material.isAvailable !== false
            });
          }
        });
      }
    });

    const totalProfit = totalValue - totalCost;
    const totalEfficiency = totalCost > 0 ? ((totalProfit / totalCost) * 100) : 0;
    const isProfit = totalProfit >= 0;

    // 재료 배열로 변환 (가치 높은 순으로 정렬)
    const aggregatedMaterials = Array.from(materialMap.values())
      .sort((a, b) => b.totalValue - a.totalValue);

    return {
      totalValue,
      totalCost,
      totalProfit,
      totalEfficiency,
      isProfit,
      aggregatedMaterials
    };
  };

  const summary = calculateTotalSummary();
  const efficiencyColorClass = getEfficiencyColor(summary.totalEfficiency, summary.isProfit);
  const efficiencyIcon = getEfficiencyIcon(summary.totalEfficiency, summary.isProfit);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-500 dark:border-blue-400 p-4 hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              전체 관문
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {raidName} • {difficulty === 'normal' ? '노말' : '하드'}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-semibold ${efficiencyColorClass}`}>
          {efficiencyIcon}
          <span>{summary.totalEfficiency >= 0 ? '+' : ''}{summary.totalEfficiency.toFixed(1)}%</span>
        </div>
      </div>

      {/* 비용 및 수익 요약 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">총 가치</div>
          <div className="text-base font-semibold text-blue-600 dark:text-blue-400">
            {formatNumber(summary.totalValue)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">더보기 비용</div>
          <div className="text-base font-semibold text-orange-600 dark:text-orange-400">
            {formatNumber(summary.totalCost)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">순이익</div>
          <div className={`text-base font-semibold ${summary.isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            <div className="flex items-center gap-1 justify-center">
              <span>{summary.totalProfit >= 0 ? '+' : ''}{formatNumber(summary.totalProfit)}</span>
              <GoldIcon />
            </div>
          </div>
        </div>
      </div>

      {/* 통합 재료 리스트 */}
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <ChestIcon />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            더보기 보상 목록
          </span>
        </div>
        {summary.aggregatedMaterials.length > 0 ? (
          summary.aggregatedMaterials.map((material, index) => (
            <TotalMaterialItem 
              key={`${material.name}-${index}`} 
              material={material} 
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
            통합할 재료 데이터가 없습니다.
          </div>
        )}
      </div>

    </div>
  );
};

export default memo(TotalSummaryCard);