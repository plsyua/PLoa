import { memo } from 'react';
import { formatNumber, formatDecimalPrice } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Minus, Package, Coins } from 'lucide-react';

// 효율성에 따른 색상 클래스
const getEfficiencyColor = (efficiency, isProfit) => {
  if (!isProfit || efficiency < 0) return 'text-red-500 bg-red-50 dark:bg-red-900/20';
  if (efficiency >= 50) return 'text-green-500 bg-green-50 dark:bg-green-900/20';
  if (efficiency >= 20) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
  return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
};

// 효율성 아이콘
const getEfficiencyIcon = (efficiency, isProfit) => {
  if (!isProfit || efficiency < 0) return <TrendingDown size={16} />;
  if (efficiency >= 20) return <TrendingUp size={16} />;
  return <Minus size={16} />;
};

// 재료 아이템 컴포넌트
const MaterialItem = memo(({ material, onToggleCheck }) => {
  const { name, quantity, unitPrice, totalValue, isAvailable, category, isChecked = true } = material;
  
  // '고유' 카테고리 재료는 수량만 표시 (가격 정보 없음)
  if (category === '고유') {
    return (
      <div className={`flex items-center gap-2 py-1.5 px-2 rounded bg-gray-50 dark:bg-gray-700/50 ${!isChecked ? 'opacity-50' : ''}`}>
        <Package size={12} className="text-gray-400 flex-shrink-0" />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
          {name}
        </span>
        <div className="ml-auto text-xs font-medium text-gray-600 dark:text-gray-400">
          {quantity}개
        </div>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onToggleCheck(name, e.target.checked)}
          className="w-3 h-3 ml-2 flex-shrink-0"
        />
      </div>
    );
  }
  
  // 일반 재료는 기존 방식으로 표시 (가격 포함)
  return (
    <div className={`flex items-center justify-between py-1.5 px-2 rounded bg-gray-50 dark:bg-gray-700/50 ${!isChecked ? 'opacity-50' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Package size={12} className="text-gray-400 flex-shrink-0" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
            {name}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {quantity}개 × {isAvailable ? formatDecimalPrice(isChecked ? unitPrice : 0) : '가격 없음'}골드
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-2">
        <div className={`text-sm font-semibold ${isAvailable && isChecked ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
          {formatNumber(isChecked ? totalValue : 0)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">골드</div>
      </div>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onToggleCheck(name, e.target.checked)}
        className="w-3 h-3 ml-2 flex-shrink-0"
      />
    </div>
  );
});

// 관문 카드 컴포넌트
const RaidGateCard = ({ gate, raidName, difficulty, onMaterialToggle }) => {
  const {
    gateId,
    name,
    totalValue,
    moreRewardCost,
    profit,
    efficiency,
    isProfit,
    materialDetails
  } = gate;

  const efficiencyColorClass = getEfficiencyColor(efficiency, isProfit);
  const efficiencyIcon = getEfficiencyIcon(efficiency, isProfit);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-200">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {raidName} • {difficulty === 'normal' ? '노말' : '하드'}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-semibold ${efficiencyColorClass}`}>
          {efficiencyIcon}
          <span>{efficiency >= 0 ? '+' : ''}{efficiency.toFixed(1)}%</span>
        </div>
      </div>

      {/* 비용 및 수익 요약 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">총 가치</div>
          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {formatNumber(totalValue)}골드
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">더보기 비용</div>
          <div className="text-sm font-semibold text-orange-600 dark:text-orange-400">
            {formatNumber(moreRewardCost)}골드
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">순이익</div>
          <div className={`text-sm font-semibold ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {profit >= 0 ? '+' : ''}{formatNumber(profit)}골드
          </div>
        </div>
      </div>

      {/* 재료 상세 리스트 */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 mb-2">
          <Coins size={14} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            더보기 보상 재료
          </span>
        </div>
        {materialDetails.map((material, index) => (
          <MaterialItem 
            key={`${material.name}-${index}`} 
            material={material} 
            onToggleCheck={(materialName, isChecked) => 
              onMaterialToggle && onMaterialToggle(gateId, materialName, isChecked)
            }
          />
        ))}
      </div>

      {/* 효율성 표시 바 */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>효율성</span>
          <span>{efficiency >= 0 ? '이익' : '손실'}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isProfit 
                ? efficiency >= 50 ? 'bg-green-500' : efficiency >= 20 ? 'bg-yellow-500' : 'bg-orange-500'
                : 'bg-red-500'
            }`}
            style={{
              width: `${Math.min(Math.abs(efficiency), 100)}%`,
              minWidth: Math.abs(efficiency) > 0 ? '4px' : '0'
            }}
          />
        </div>
      </div>

      {/* 가격 정보 없음 경고 (고유 카테고리 제외) */}
      {materialDetails.some(material => !material.isAvailable && material.category !== '고유') && (
        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-400">
          ⚠️ 일부 재료의 가격 정보가 없습니다. 효율성이 부정확할 수 있습니다.
        </div>
      )}
    </div>
  );
};

export default memo(RaidGateCard);