// 애플리케이션에서 사용하는 상수들

// API 관련 상수
export const API_CONFIG = {
  RATE_LIMIT: 100, // 분당 요청 제한
  TIMEOUT: 10000,  // 요청 타임아웃 (10초)
  RETRY_ATTEMPTS: 3 // 재시도 횟수
};

// 아이템 등급 목록
export const ITEM_GRADES = [
  '에스더',
  '고대',
  '유물', 
  '전설',
  '영웅',
  '희귀',
  '고급',
  '일반'
];

// 아이템 등급별 색상 매핑 (로스트아크 공식 색상 기준)
export const GRADE_COLORS = {
  '에스더': {
    text: 'text-cyan-400',
    bg: 'bg-cyan-900/30',
    border: 'border-cyan-400'
  },
  '고대': {
    text: 'text-gray-900 dark:text-white',
    bg: 'bg-white/20',
    border: 'border-white'
  },
  '유물': {
    text: 'text-orange-400',
    bg: 'bg-orange-900/30',
    border: 'border-orange-400'
  },
  '전설': {
    text: 'text-yellow-400',
    bg: 'bg-yellow-900/30',
    border: 'border-yellow-400'
  },
  '영웅': {
    text: 'text-purple-400',
    bg: 'bg-purple-900/30',
    border: 'border-purple-400'
  },
  '희귀': {
    text: 'text-blue-400',
    bg: 'bg-blue-900/30',
    border: 'border-blue-400'
  },
  '고급': {
    text: 'text-green-400',
    bg: 'bg-green-900/30',
    border: 'border-green-400'
  },
  '일반': {
    text: 'text-gray-800 dark:text-gray-100',
    bg: 'bg-gray-700/50',
    border: 'border-gray-500'
  }
};


// 페이지네이션 설정
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_VISIBLE_PAGES: 7
};

// 로스트아크 직업 목록
export const CHARACTER_CLASSES = [
  // 전사
  '워로드', '디스트로이어', '버서커', '홀리나이트', '슬레이어', '발키리',
  
  // 무도가  
  '배틀마스터', '인파이터', '기공사', '창술사', '스트라이커', '브레이커',
  
  // 헌터
  '데빌헌터', '블래스터', '호크아이', '스카우터', '건슬링어',
  
  // 마법사
  '바드', '서머너', '아르카나', '소서리스',
  
  // 암살자
  '블레이드', '데모닉', '리퍼', '소울이터',
  
  // 스페셜리스트
  '도화가', '기상술사', '환수사'
];

// 로컬 스토리지 키들
export const STORAGE_KEYS = {
  RECENT_SEARCHES: 'ploa_recent_searches',
  USER_PREFERENCES: 'ploa_user_preferences', 
  FAVORITE_CHARACTERS: 'ploa_favorite_characters',
  SEARCH_FILTERS: 'ploa_search_filters'
};

// 차트 색상 팔레트
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',    // blue-500
  SUCCESS: '#10B981',    // emerald-500  
  WARNING: '#F59E0B',    // amber-500
  DANGER: '#EF4444',     // red-500
  INFO: '#6366F1',       // indigo-500
  GRADIENT: [
    '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'
  ]
};

// 애니메이션 지연시간 (밀리초)
export const ANIMATION_DELAYS = {
  TOOLTIP_SHOW: 300,
  SEARCH_DEBOUNCE: 500,
  AUTO_REFRESH: 30000, // 30초
  NOTIFICATION: 3000   // 3초
};

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  API_LIMIT: 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
  CHARACTER_NOT_FOUND: '캐릭터를 찾을 수 없습니다.',
  INVALID_INPUT: '올바른 입력값을 확인해주세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.'
};