import { memo, useState } from 'react';
import { formatNumber } from '../../utils/formatters';
import { getMaterialIcon, getIcon } from '../../data/icons';
import { Package, Coins } from 'lucide-react';

// 재료 아이콘 컴포넌트 (React 안전 방식으로 리팩토링)
export const MaterialIcon = memo(({ materialName }) => {
  const [imageError, setImageError] = useState(false);
  const iconUrl = getMaterialIcon(materialName);
  
  // 이미지 URL이 없거나 로드에 실패한 경우 fallback 아이콘 표시
  if (!iconUrl || imageError) {
    return <Package size={20} className="text-gray-400 flex-shrink-0" />;
  }
  
  return (
    <img
      src={iconUrl}
      alt={`${materialName} 아이콘`}
      className="w-5 h-5 flex-shrink-0"
      onError={() => setImageError(true)}
    />
  );
});

// 골드 아이콘 컴포넌트 (React 안전 방식으로 리팩토링)
export const GoldIcon = memo(() => {
  const [imageError, setImageError] = useState(false);
  const goldIconUrl = getIcon('SYSTEM', '골드');
  
  // 이미지 URL이 없거나 로드에 실패한 경우 fallback 텍스트 표시
  if (!goldIconUrl || imageError) {
    return <span className="text-sm text-gray-500 dark:text-gray-400">골드</span>;
  }
  
  return (
    <img
      src={goldIconUrl}
      alt="골드 아이콘"
      className="w-4 h-4 flex-shrink-0"
      onError={() => setImageError(true)}
    />
  );
});

// 더보기 상자 아이콘 컴포넌트 (React 안전 방식으로 리팩토링)
export const ChestIcon = memo(() => {
  const [imageError, setImageError] = useState(false);
  const chestIconUrl = getIcon('SYSTEM', '더보기 상자');
  
  // 이미지 URL이 없거나 로드에 실패한 경우 fallback 아이콘 표시
  if (!chestIconUrl || imageError) {
    return <Coins size={16} className="text-gray-400" />;
  }
  
  return (
    <img
      src={chestIconUrl}
      alt="더보기 상자 아이콘"
      className="w-4 h-4 flex-shrink-0"
      onError={() => setImageError(true)}
    />
  );
});

// 재료 아이템 컴포넌트 (강화 계산기용)
export const MaterialItem = memo(({ material }) => {
  const { name, quantity, totalValue, category } = material;
  
  // '고유' 카테고리 재료는 수량만 표시 (가격 정보 없음)
  if (category === '고유') {
    return (
      <div className="flex items-center gap-2 py-1.5 px-2 rounded bg-gray-50 dark:bg-gray-700/50">
        <MaterialIcon materialName={name} />
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
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <MaterialIcon materialName={name} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
          {name}
        </span>
        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
          {formatNumber(quantity)}개
        </span>
      </div>
      <div className="flex items-center gap-1 text-right flex-shrink-0 ml-2">
        <div className="text-base font-semibold text-gray-900 dark:text-white">
          {formatNumber(Math.round(totalValue))}
        </div>
        <GoldIcon />
      </div>
    </div>
  );
});