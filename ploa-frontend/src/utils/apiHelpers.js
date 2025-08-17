// API 관련 헬퍼 함수들
import { ERROR_MESSAGES } from './constants';

// API 에러 처리 및 메시지 변환
export const handleApiError = (error) => {
  // 네트워크 에러
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // HTTP 상태코드별 처리
  switch (error.response.status) {
    case 429:
      return ERROR_MESSAGES.API_LIMIT;
    case 404: 
      return ERROR_MESSAGES.CHARACTER_NOT_FOUND;
    case 400:
      return ERROR_MESSAGES.INVALID_INPUT;
    case 401:
      return 'API 인증이 실패했습니다.';
    case 403:
      return 'API 접근 권한이 없습니다.';
    case 500:
      return '서버 내부 오류가 발생했습니다.';
    case 502:
      return '게이트웨이 오류가 발생했습니다.';
    case 503:
      return '서비스가 일시적으로 이용할 수 없습니다.';
    default:
      return error.response.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};

// HTML 문자열을 안전하게 정리하는 함수
export const sanitizeHtml = (htmlString) => {
  if (!htmlString || typeof htmlString !== 'string') return '';
  
  return htmlString
    // 로스트아크 특정 태그들을 Tailwind 클래스로 변환
    .replace(/<FONT COLOR='#99ff99'>/g, '<span class="text-green-400 font-semibold">')
    .replace(/<FONT COLOR='#ff9999'>/g, '<span class="text-red-400 font-semibold">')
    .replace(/<FONT COLOR='#ffff99'>/g, '<span class="text-yellow-400 font-semibold">')
    .replace(/<FONT COLOR='#9999ff'>/g, '<span class="text-blue-400 font-semibold">')
    .replace(/<FONT COLOR='#A9D0F5'>/g, '<span class="text-blue-300 font-medium">')
    .replace(/<FONT COLOR='#FFD200'>/g, '<span class="text-yellow-400 font-semibold">')
    .replace(/<\/FONT>/g, '</span>')
    .replace(/<BR>/g, '<br/>')
    .replace(/<P ALIGN='CENTER'>/g, '<p class="text-center">')
    .replace(/<\/P>/g, '</p>')
    // 스킬 이름 등 대괄호 텍스트 스타일링
    .replace(/\[([^\]]+)\]/g, '<span class="text-cyan-400 font-medium">[$1]</span>');
};

// 툴팁 JSON 데이터 파싱 함수
export const parseTooltipJson = (tooltipString) => {
  if (!tooltipString) return null;
  
  try {
    return JSON.parse(tooltipString);
  } catch (error) {
    console.error('툴팁 JSON 파싱 실패:', error);
    return null;
  }
};

// 가격 히스토리에서 유효한 데이터 선택 함수
export const selectValidPriceHistory = (historyArray) => {
  if (!historyArray || historyArray.length === 0) return null;
  
  // 1순위: 거래 완료된 데이터 (TradeRemainCount === 0)
  let selectedHistory = historyArray.find(h => h.TradeRemainCount === 0);
  
  // 2순위: 실제 통계 데이터가 있는 항목
  if (!selectedHistory) {
    selectedHistory = historyArray.find(h => 
      h.Stats && h.Stats.some(stat => stat.AvgPrice > 0 || stat.TradeCount > 0)
    );
  }
  
  // 3순위: 첫 번째 항목
  if (!selectedHistory) {
    selectedHistory = historyArray[0];
  }
  
  return selectedHistory;
};

// 검색 옵션 정리 함수 (빈 값 제거)
export const cleanSearchOptions = (options) => {
  const cleaned = {};
  
  Object.keys(options).forEach(key => {
    const value = options[key];
    
    // null, undefined, 빈 문자열 제외
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value;
    }
  });
  
  return cleaned;
};

// API 재시도 함수 (지수 백오프 적용)
export const retryApiCall = async (apiFunction, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiFunction();
    } catch (error) {
      lastError = error;
      
      // 마지막 시도가 아니면 대기 후 재시도
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError;
};

// 디바운스 함수 (검색 입력 지연 처리용)
export const debounce = (func, delay) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// URL 쿼리 파라미터 변환 함수
export const objectToQueryParams = (obj) => {
  const params = new URLSearchParams();
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, value);
    }
  });
  
  return params.toString();
};