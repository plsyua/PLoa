// 로딩 스피너 컴포넌트 - 다양한 크기와 스타일 지원
const LoadingSpinner = ({ 
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  color = 'blue', // 'blue', 'white', 'gray'
  className = '',
  text = null // 로딩 텍스트 (선택사항)
}) => {
  // 크기별 스타일 설정
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  // 색상별 스타일 설정
  const colorClasses = {
    blue: 'border-blue-500',
    white: 'border-white',
    gray: 'border-gray-400'
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* 스피너 */}
      <div 
        className={`animate-spin rounded-full border-2 border-transparent border-t-2 ${sizeClasses[size]} ${colorClasses[color]}`}
      ></div>
      
      {/* 로딩 텍스트 (선택사항) */}
      {text && (
        <p className="mt-2 text-sm text-gray-400">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;