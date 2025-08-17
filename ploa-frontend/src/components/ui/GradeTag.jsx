// 아이템 등급별 스타일링 태그 컴포넌트
import { GRADE_COLORS } from '../../utils/constants.js';
const GradeTag = ({ 
  grade, 
  size = 'sm', // 'xs', 'sm', 'md'
  className = ''
}) => {
  // constants.js의 GRADE_COLORS를 기준으로 스타일 가져오기
  const getGradeStyle = (itemGrade) => {
    return GRADE_COLORS[itemGrade] || GRADE_COLORS['일반'];
  };
  
  // 크기별 스타일 설정
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs', 
    md: 'px-3 py-1.5 text-sm'
  };
  
  const styles = getGradeStyle(grade);
  
  return (
    <span 
      className={`
        inline-block rounded font-medium border
        ${styles.bg} ${styles.text} ${styles.border}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {grade}
    </span>
  );
};

// 유틸리티 함수들은 utils/formatters.js로 이동됨
// 필요시 formatters.js에서 import하여 사용

export default GradeTag;