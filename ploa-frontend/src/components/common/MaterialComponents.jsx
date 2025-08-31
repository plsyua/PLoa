import { memo } from 'react';
import { formatNumber } from '../../utils/formatters';
import { getMaterialIcon, getIcon } from '../../data/icons';
import { Package, Coins } from 'lucide-react';

// 재료 아이콘 컴포넌트
export const MaterialIcon = memo(({ materialName }) => {
  const iconUrl = getMaterialIcon(materialName);
  
  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={`${materialName} 아이콘`}
        className="w-5 h-5 flex-shrink-0"
        onError={(e) => {
          // 아이콘 로드 실패 시 Package 아이콘으로 fallback
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
    );
  }
  
  // fallback: Package 아이콘
  return <Package size={20} className="text-gray-400 flex-shrink-0" />;
});

// 골드 아이콘 컴포넌트
export const GoldIcon = memo(() => {
  const goldIconUrl = getIcon('SYSTEM', '골드');
  
  if (goldIconUrl) {
    return (
      <img
        src={goldIconUrl}
        alt="골드 아이콘"
        className="w-4 h-4 flex-shrink-0"
        onError={(e) => {
          // 아이콘 로드 실패 시 "골드" 텍스트로 fallback
          const fallbackText = document.createElement('span');
          fallbackText.textContent = '골드';
          fallbackText.className = 'text-xs text-gray-500 dark:text-gray-400';
          e.target.parentNode.replaceChild(fallbackText, e.target);
        }}
      />
    );
  }
  
  // fallback: "골드" 텍스트
  return <span className="text-sm text-gray-500 dark:text-gray-400">골드</span>;
});

// 더보기 상자 아이콘 컴포넌트
export const ChestIcon = memo(() => {
  const chestIconUrl = getIcon('SYSTEM', '더보기 상자');
  
  if (chestIconUrl) {
    return (
      <img
        src={chestIconUrl}
        alt="더보기 상자 아이콘"
        className="w-4 h-4 flex-shrink-0"
        onError={(e) => {
          // 아이콘 로드 실패 시 Coins 아이콘으로 fallback
          const fallbackIcon = document.createElement('div');
          fallbackIcon.innerHTML = '<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg>';
          e.target.parentNode.replaceChild(fallbackIcon.firstChild, e.target);
        }}
      />
    );
  }
  
  // fallback: Coins 아이콘
  return <Coins size={16} className="text-gray-400" />;
});

// 재료 아이템 컴포넌트 (강화 계산기용)
export const MaterialItem = memo(({ material }) => {
  const { name, quantity, totalValue, category } = material;
  
  // '고유' 카테고리 재료는 수량만 표시 (가격 정보 없음)
  if (category === '고유') {
    return (
      <div className="flex items-center gap-2 py-1.5 px-2 rounded bg-gray-50 dark:bg-gray-700/50">
        <div className="relative flex-shrink-0">
          <MaterialIcon materialName={name} />
          <Package size={20} className="text-gray-400 flex-shrink-0" style={{ display: 'none' }} />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
          {name}
        </span>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-400">
          {formatNumber(quantity)}개
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
            <Package size={20} className="text-gray-400 flex-shrink-0" style={{ display: 'none' }} />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {name}
          </span>
          <div className="whitespace-nowrap">
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {formatNumber(quantity)}개
            </span>
          </div>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-2">
        <div className="flex items-center gap-1">
          <div className="text-base font-semibold text-gray-900 dark:text-white">
            {formatNumber(Math.round(totalValue))}
          </div>
          <GoldIcon />
        </div>
      </div>
    </div>
  );
});