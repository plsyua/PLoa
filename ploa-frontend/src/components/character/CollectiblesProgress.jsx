import { Heart, Map, Palette, Crown, Star, Compass, Leaf } from 'lucide-react';

// 수집품 진행도 시각화 컴포넌트
const CollectiblesProgress = ({ collectiblesData }) => {
  // 수집품 아이콘 매핑
  const getCollectibleIcon = (type) => {
    const iconMap = {
      '모코코 씨앗': Map,
      '섬의 마음': Heart,
      '위대한 미술품': Palette,
      '거인의 심장': Heart,
      '이그네아의 징표': Crown,
      '항해 모험물': Compass,
      '세계수의 잎': Leaf
    };
    return iconMap[type] || Star;
  };

  // 진행도 색상 계산
  const getProgressColor = (percentage) => {
    if (percentage === 100) return 'bg-cyan-500';    // 완료 시 에스더 색상
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 진행도 텍스트 색상
  const getProgressTextColor = (percentage) => {
    if (percentage === 100) return 'text-cyan-400';  // 완료 시 에스더 색상
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 70) return 'text-blue-400';
    if (percentage >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!collectiblesData || collectiblesData.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-8">
        수집품 정보가 없습니다.
      </div>
    );
  }

  // 전체 진행도 계산 - 각 수집품의 퍼센트를 평균내어 계산
  const individualPercentages = collectiblesData.map(item => 
    item.MaxPoint > 0 ? (item.Point / item.MaxPoint) * 100 : 0
  );
  const overallPercentage = individualPercentages.length > 0 ? 
    Math.floor(individualPercentages.reduce((sum, percentage) => sum + percentage, 0) / individualPercentages.length) : 0;

  return (
    <div className="space-y-6">
      {/* 전체 진행도 요약 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">전체 수집품 진행도</h3>
          <span className={`text-lg font-bold ${getProgressTextColor(overallPercentage)}`}>
            {overallPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(overallPercentage)}`}
            style={{ width: `${overallPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* 개별 수집품 진행도 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collectiblesData.map((collectible, index) => {
          const percentage = collectible.MaxPoint > 0 ? 
            Math.floor((collectible.Point / collectible.MaxPoint) * 100) : 0;
          const IconComponent = getCollectibleIcon(collectible.Type);

          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 relative overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* 전체 배경 아이콘 */}
              <div className="absolute inset-0 opacity-85 pointer-events-none flex items-center justify-center">
                {collectible.Icon ? (
                  <img 
                    src={collectible.Icon} 
                    alt={collectible.Type}
                    className="w-full h-full object-cover scale-125"
                  />
                ) : (
                  <IconComponent size={200} className="text-gray-600 scale-125" />
                )}
              </div>
              
              {/* 텍스트 가독성을 위한 오버레이 */}
              <div className="absolute inset-0 bg-gray-900/60 dark:bg-gray-800/60 pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  {collectible.Icon ? (
                    <img 
                      src={collectible.Icon} 
                      alt={collectible.Type}
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <IconComponent size={20} className="text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-gray-900 dark:text-white font-bold text-sm">{collectible.Type}</h4>
                    <div className="text-right">
                      <span className={`text-xs font-black ${getProgressTextColor(percentage)} block`}>
                        {percentage}%
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                        {collectible.Point.toLocaleString()} / {collectible.MaxPoint.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 진행도 바 */}
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 relative z-10">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollectiblesProgress;