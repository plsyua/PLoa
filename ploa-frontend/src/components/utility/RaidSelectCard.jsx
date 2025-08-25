import { memo } from 'react';

// 레이드 선택 카드 컴포넌트
const RaidSelectCard = ({ raid, isSelected, onClick }) => {
  const { id, name, category, iconUrl } = raid;

  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 hover:shadow-lg ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* 아이콘 영역 - 현재는 placeholder */}
        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          {iconUrl ? (
            <img 
              src={iconUrl} 
              alt={`${name} 아이콘`}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                // 이미지 로드 실패 시 placeholder 유지
                e.target.style.display = 'none';
              }}
            />
          ) : (
            // 커스텀 아이콘 자리 - 현재는 빈 공간
            <div className="w-full h-full rounded-lg bg-gray-300 dark:bg-gray-600 border-2 border-dashed border-gray-400 dark:border-gray-500 flex items-center justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">icon</span>
            </div>
          )}
        </div>

        {/* 레이드 정보 */}
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-base mb-1 transition-colors ${
            isSelected
              ? 'text-blue-900 dark:text-blue-100'
              : 'text-gray-900 dark:text-white'
          }`}>
            {name}
          </div>
          <div className={`text-sm transition-colors ${
            isSelected
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {category}
          </div>
        </div>

        {/* 선택 표시 */}
        {isSelected && (
          <div className="flex-shrink-0">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default memo(RaidSelectCard);