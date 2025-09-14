import axios from 'axios';
import { apiCache } from '../utils/apiCache';

// 개발 환경에서는 Vite 프록시 사용, 프로덕션에서는 직접 API 호출
const isDevelopment = import.meta.env.DEV;
const API_KEY = import.meta.env.VITE_LOSTARK_API_KEY;
const API_URL = import.meta.env.VITE_LOSTARK_API_URL;

const lostarkApi = axios.create({
  baseURL: isDevelopment ? '/api' : API_URL,
  headers: isDevelopment ? {
    'accept': 'application/json',
  } : {
    'authorization': `bearer ${API_KEY}`,
    'accept': 'application/json',
  },
});

// 캐시를 적용한 API 요청 헬퍼 함수
const cachedApiRequest = async (endpoint, characterName, errorMessage) => {
  const cacheKey = apiCache.generateKey(endpoint, { characterName });

  // 1. 캐시된 데이터 확인
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // 2. 진행 중인 요청 확인 (중복 요청 방지)
  const pendingRequest = apiCache.getPendingRequest(cacheKey);
  if (pendingRequest) {
    return pendingRequest;
  }

  // 3. 새로운 API 요청
  const requestPromise = (async () => {
    try {
      const response = await lostarkApi.get(endpoint);
      const data = response.data;
      
      // 4. 성공한 데이터를 캐시에 저장
      apiCache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error(errorMessage, error);
      throw error;
    }
  })();

  // 5. 진행 중인 요청으로 등록 후 반환
  return apiCache.setPendingRequest(cacheKey, requestPromise);
};

// 캐릭터 프로필
export const getCharacterProfile = async (characterName) => {
  return cachedApiRequest(
    `/armories/characters/${characterName}/profiles`,
    characterName,
    '캐릭터 프로필 조회 실패:'
  );
};

// 장비 정보
export const getCharacterEquipment = async (characterName) => {
  return cachedApiRequest(
    `/armories/characters/${characterName}/equipment`,
    characterName,
    '장비 정보 조회 실패:'
  );
};

// 각인 정보
export const getCharacterEngravings = async (characterName) => {
  return cachedApiRequest(
    `/armories/characters/${characterName}/engravings`,
    characterName,
    '각인 정보 조회 실패:'
  );
};

// 보석 정보
export const getCharacterGems = async (characterName) => {
  return cachedApiRequest(
    `/armories/characters/${characterName}/gems`,
    characterName,
    '보석 정보 조회 실패:'
  );
};

// 스킬 정보
export const getCharacterSkills = async (characterName) => {
  return cachedApiRequest(
    `/armories/characters/${characterName}/combat-skills`,
    characterName,
    '스킬 정보 조회 실패:'
  );
};

// 수집품 정보
export const getCharacterCollectibles = async (characterName) => {
  return cachedApiRequest(
    `/armories/characters/${characterName}/collectibles`,
    characterName,
    '수집품 정보 조회 실패:'
  );
};

// 아크 패시브 정보
export const getCharacterArkPassive = async (characterName) => {
  try {
    const response = await lostarkApi.get(`/armories/characters/${characterName}/arkpassive`);
    return response.data;
  } catch (error) {
    console.error('아크 패시브 정보 조회 실패:', error);
    throw error;
  }
};

// 거래소 검색 옵션 조회
export const getMarketOptions = async () => {
  try {
    const response = await lostarkApi.get('/markets/options');
    return response.data;
  } catch (error) {
    console.error('거래소 옵션 조회 실패:', error);
    throw error;
  }
};

// 거래소 아이템 검색
export const searchMarketItems = async (searchOptions) => {
  try {
    const response = await lostarkApi.post('/markets/items', searchOptions);
    return response.data;
  } catch (error) {
    console.error('거래소 아이템 검색 실패:', error);
    throw error;
  }
};

// 개별 아이템 시세 조회 (가격 변동 그래프용)
export const getItemPriceHistory = async (itemId) => {
  try {
    const response = await lostarkApi.get(`/markets/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('아이템 시세 조회 실패:', error);
    throw error;
  }
};

// 공지사항 조회
export const getNotices = async (searchText = '', type = '') => {
  try {
    const params = {};
    if (searchText) params.searchText = searchText;
    if (type) params.type = type;
    
    const response = await lostarkApi.get('/news/notices', { params });
    return response.data;
  } catch (error) {
    console.error('공지사항 조회 실패:', error);
    throw error;
  }
};

// 이벤트 목록 조회
export const getEvents = async () => {
  try {
    const response = await lostarkApi.get('/news/events');
    return response.data;
  } catch (error) {
    console.error('이벤트 조회 실패:', error);
    throw error;
  }
};

// 원정대 캐릭터 목록 조회
export const getCharacterSiblings = async (characterName) => {
  return cachedApiRequest(
    `/characters/${characterName}/siblings`,
    characterName,
    '원정대 캐릭터 조회 실패:'
  );
};

