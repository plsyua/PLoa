import axios from 'axios';

const API_KEY = import.meta.env.VITE_LOSTARK_API_KEY;
const API_URL = import.meta.env.VITE_LOSTARK_API_URL;

const lostarkApi = axios.create({
  baseURL: API_URL,
  headers: {
    'authorization': `bearer ${API_KEY}`,
    'accept': 'application/json',
  },
});

// 캐릭터 프로필
export const getCharacterProfile = async (characterName) => {
  try {
    const response = await lostarkApi.get(`/armories/characters/${characterName}/profiles`);
    return response.data;
  } catch (error) {
    console.error('캐릭터 프로필 조회 실패:', error);
    throw error;
  }
};

// 장비 정보
export const getCharacterEquipment = async (characterName) => {
  try {
    const response = await lostarkApi.get(`/armories/characters/${characterName}/equipment`);
    return response.data;
  } catch (error) {
    console.error('장비 정보 조회 실패:', error);
    throw error;
  }
};

// 각인 정보
export const getCharacterEngravings = async (characterName) => {
  try {
    const response = await lostarkApi.get(`/armories/characters/${characterName}/engravings`);
    return response.data;
  } catch (error) {
    console.error('각인 정보 조회 실패:', error);
    throw error;
  }
};

// 보석 정보
export const getCharacterGems = async (characterName) => {
  try {
    const response = await lostarkApi.get(`/armories/characters/${characterName}/gems`);
    return response.data;
  } catch (error) {
    console.error('보석 정보 조회 실패:', error);
    throw error;
  }
};

// 스킬 정보
export const getCharacterSkills = async (characterName) => {
  try {
    const response = await lostarkApi.get(`/armories/characters/${characterName}/combat-skills`);
    return response.data;
  } catch (error) {
    console.error('스킬 정보 조회 실패:', error);
    throw error;
  }
};

// 수집품 정보
export const getCharacterCollectibles = async (characterName) => {
  try {
    const response = await lostarkApi.get(`/armories/characters/${characterName}/collectibles`);
    return response.data;
  } catch (error) {
    console.error('수집품 정보 조회 실패:', error);
    throw error;
  }
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
  try {
    const response = await lostarkApi.get(`/characters/${characterName}/siblings`);
    return response.data;
  } catch (error) {
    console.error('원정대 캐릭터 조회 실패:', error);
    throw error;
  }
};

