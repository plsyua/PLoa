import { AlertTriangle, RefreshCw } from 'lucide-react';

// 에러 메시지 표시 컴포넌트
const ErrorMessage = ({
  title = '오류가 발생했습니다',
  message = '잠시 후 다시 시도해주세요.',
  showRetry = false,
  onRetry = null,
  className = ''
}) => {
  return (
    <div className={`bg-red-900/50 border border-red-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {/* 에러 아이콘 */}
        <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1">
          {/* 에러 제목 */}
          <h4 className="text-red-200 font-medium mb-1">{title}</h4>
          
          {/* 에러 메시지 */}
          <p className="text-red-300 text-sm">{message}</p>
          
          {/* 재시도 버튼 (선택사항) */}
          {showRetry && onRetry && (
            <button 
              onClick={onRetry}
              className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              <RefreshCw size={14} />
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;