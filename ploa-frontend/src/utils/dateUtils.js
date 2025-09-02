// 날짜 및 요일 관련 유틸리티 함수

/**
 * 특정 컨텐츠가 오늘 진행 가능한지 확인
 * @param {Object} content - 컨텐츠 객체 (availableDays 속성 포함)
 * @param {Date} currentDate - 현재 날짜 (선택사항, 기본값은 현재 시간)
 * @returns {boolean} 진행 가능 여부
 */
export const isContentAvailableToday = (content, currentDate = new Date()) => {
  // availableDays 속성이 없으면 모든 날 가능
  if (!content.availableDays || !Array.isArray(content.availableDays)) {
    return true;
  }
  
  const currentDay = currentDate.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
  return content.availableDays.includes(currentDay);
};

/**
 * 현재 요일을 한글로 반환
 * @param {Date} date - 날짜 (선택사항, 기본값은 현재 시간)
 * @returns {string} 요일 문자열
 */
export const getDayOfWeekKorean = (date = new Date()) => {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return days[date.getDay()];
};

/**
 * 컨텐츠의 진행 가능한 요일을 한글로 반환
 * @param {Object} content - 컨텐츠 객체 (availableDays 속성 포함)
 * @returns {string} 진행 가능한 요일 문자열
 */
export const getContentAvailableDaysKorean = (content) => {
  if (!content.availableDays || !Array.isArray(content.availableDays)) {
    return '매일';
  }
  
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const availableDayNames = content.availableDays.map(dayIndex => dayNames[dayIndex]);
  return availableDayNames.join(', ');
};

/**
 * 오늘을 기준으로 다음 진행 가능한 날짜 계산
 * @param {Object} content - 컨텐츠 객체 (availableDays 속성 포함)
 * @param {Date} currentDate - 현재 날짜 (선택사항, 기본값은 현재 시간)
 * @returns {Date|null} 다음 진행 가능한 날짜, 매일 가능하면 null
 */
export const getNextAvailableDate = (content, currentDate = new Date()) => {
  if (!content.availableDays || !Array.isArray(content.availableDays)) {
    return null; // 매일 가능
  }
  
  const current = new Date(currentDate);
  current.setHours(0, 0, 0, 0); // 시간 부분 초기화
  
  // 최대 7일 후까지 검색
  for (let i = 1; i <= 7; i++) {
    const checkDate = new Date(current);
    checkDate.setDate(current.getDate() + i);
    
    if (content.availableDays.includes(checkDate.getDay())) {
      return checkDate;
    }
  }
  
  return null;
};