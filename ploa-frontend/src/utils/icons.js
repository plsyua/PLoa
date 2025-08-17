// 로스트아크 공식 아이콘 URL 관리

/**
 * 로스트아크 공식 CDN 아이콘들
 * 카테고리별로 분류하여 관리
 */
export const LOSTARK_ICONS = {
  // 시스템 관련 아이콘
  SYSTEM: {
    TRANSCENDENCE: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/ico_tooltip_transcendence.png',
    // 추가 시스템 아이콘들은 여기에...
  },
  
  // 캐릭터 관련 아이콘
  CHARACTER: {
    // 전사
    슬레이어: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/berserker_female_s.png',
    발키리: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/holyknight_female_s.png',
    홀리나이트: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/holyknight_s.png',
    워로드: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/warlord_s.png',
    디스트로이어: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/destroyer_s.png',
    버서커: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/berserker_s.png',
    // 마법사
    바드: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/bard_s.png',
    소서리스: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/elemental_master_s.png',
    서머너: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/summoner_s.png',
    아르카나: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/arcana_s.png',
    // 무도가
    브레이커: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/infighter_male_s.png',
    창술사: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/lance_master_s.png',
    배틀마스터: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/battle_master_s.png',
    인파이터: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/infighter_s.png',
    스트라이커: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/battle_master_male_s.png',
    기공사: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/force_master_s.png',
    // 헌터
    건슬링어: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/devil_hunter_female_s.png',
    데빌헌터: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/devil_hunter_s.png',
    스카우터: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/scouter_s.png',
    블래스터: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/blaster_s.png',
    호크아이: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/hawk_eye_s.png',
    // 암살자
    소울이터: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/soul_eater_s.png',
    블레이드: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/blade_s.png',
    리퍼: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/reaper_s.png',
    데모닉: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/demonic_s.png',
    // 스페셜리스트
    도화가: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/yinyangshi_s.png',
    기상술사: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/weather_artist_s.png',
    환수사: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/alchemist_s.png',
  },
  
  // 아이템 관련 아이콘
  ITEMS: {
    // 아이템 관련 아이콘들은 여기에...
  },
  
  // UI 관련 아이콘
  UI: {
    // UI 관련 아이콘들은 여기에...
  }
};

/**
 * 아이콘 URL을 안전하게 가져오는 유틸리티 함수
 * @param {string} category - 아이콘 카테고리 (SYSTEM, CHARACTER, ITEMS, UI)
 * @param {string} name - 아이콘 이름
 * @returns {string|null} - 아이콘 URL 또는 null
 */
export const getIcon = (category, name) => {
  try {
    return LOSTARK_ICONS[category]?.[name] || null;
  } catch (iconError) {
    console.warn(`아이콘을 찾을 수 없습니다: ${category}.${name}`, iconError);
    return null;
  }
};

/**
 * 모든 아이콘 카테고리 목록 반환
 * @returns {string[]} - 카테고리 이름 배열
 */
export const getIconCategories = () => {
  return Object.keys(LOSTARK_ICONS);
};

/**
 * 특정 카테고리의 모든 아이콘 이름 반환
 * @param {string} category - 아이콘 카테고리
 * @returns {string[]} - 아이콘 이름 배열
 */
export const getIconNames = (category) => {
  return Object.keys(LOSTARK_ICONS[category] || {});
};