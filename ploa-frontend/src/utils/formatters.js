// 숫자 포맷팅 및 색상 관련 유틸리티 함수들
import { GRADE_COLORS } from './constants.js';

// 숫자를 콤마로 구분하여 표시 (예: 1234 → 1,234)
// 골드 등 정수 단위는 소숫점 제거
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  return Math.round(Number(number)).toLocaleString();
};

// 개당 가격용 소숫점 포함 포맷팅 (예: 1234.56 → 1,234.56)
export const formatDecimalPrice = (number) => {
  if (number === null || number === undefined) return '0';
  return Number(number).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

// 골드 가격 포맷팅 (큰 수는 약어로 표시)
export const formatGold = (price) => {
  if (!price || price === 0) return '0';
  
  const num = Number(price);
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`; // 백만 단위
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`; // 천 단위
  }
  
  return formatNumber(num);
};


// 아이템 등급에 따른 색상 클래스 반환
export const getGradeColor = (grade) => {
  const gradeColors = GRADE_COLORS[grade] || GRADE_COLORS['일반'];
  return `${gradeColors.text} ${gradeColors.border}`;
};

// 아이템 등급에 따른 텍스트 색상만 반환
export const getGradeTextColor = (grade) => {
  return GRADE_COLORS[grade]?.text || GRADE_COLORS['일반'].text;
};

// 아이템 등급에 따른 보더 색상만 반환
export const getGradeBorderColor = (grade) => {
  return GRADE_COLORS[grade]?.border || GRADE_COLORS['일반'].border;
};

// 아이템 등급에 따른 배경 색상만 반환
export const getGradeBackgroundColor = (grade) => {
  return GRADE_COLORS[grade]?.bg || GRADE_COLORS['일반'].bg;
};

// 마켓에서 사용하는 풀 스타일 (text + border + bg)
export const getMarketGradeStyle = (grade) => {
  const gradeColors = GRADE_COLORS[grade] || GRADE_COLORS['일반'];
  return `${gradeColors.text} ${gradeColors.border} ${gradeColors.bg}`;
};

// 거래 횟수에 따른 라벨 텍스트
export const getTradeLabel = (tradeRemainCount) => {
  if (tradeRemainCount === null) {
    return '무제한 거래';
  } else if (tradeRemainCount === 0) {
    return '거래 후 교환 불가';
  } else {
    return `거래 ${tradeRemainCount}회 남음`;
  }
};

// 거래 횟수에 따른 색상 클래스
export const getTradeColor = (tradeRemainCount) => {
  if (tradeRemainCount === null) {
    return 'bg-green-600 text-white';   // 무제한 - 초록
  } else if (tradeRemainCount === 0) {
    return 'bg-red-600 text-white';     // 교환불가 - 빨강
  } else if (tradeRemainCount >= 3) {
    return 'bg-blue-600 text-white';    // 3회 이상 - 파랑
  } else if (tradeRemainCount >= 2) {
    return 'bg-yellow-600 text-white';  // 2회 - 노랑
  } else {
    return 'bg-orange-600 text-white';  // 1회 - 주황
  }
};

// 날짜 포맷팅 (예: 2025-07-22T10:30:00 → 2025-07-22 10:30)
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('날짜 포맷팅 실패:', error);
    return dateString;
  }
};

// 상대 시간 표시 (예: 2시간 전, 3일 전)
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMinutes < 1) {
      return '방금 전';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return formatDateTime(dateString);
    }
  } catch (error) {
    console.error('상대 시간 포맷팅 실패:', error);
    return dateString;
  }
};