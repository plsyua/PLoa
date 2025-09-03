// 로스트아크 공식 아이콘 URL 관리

// 로컬 아이콘 import
import arkgridCoreIcon from '../assets/images/chara_contents/arkgrid_core.webp';
import goldIcon from '../assets/images/etc/gold.webp';
import chestIcon from '../assets/images/etc/chest.webp';

/**
 * 로스트아크 공식 CDN 아이콘들
 * 카테고리별로 분류하여 관리
 */
export const LOSTARK_ICONS = {
  // 시스템 관련 아이콘
  SYSTEM: {
    TRANSCENDENCE: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/ico_tooltip_transcendence.png',
    '골드': goldIcon,
    '더보기 상자': chestIcon,
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
    // 재료 아이템 아이콘들
    MATERIALS: {
      // 강화재료 - 파괴석 계열
      '파괴석 결정': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_6_105.png',
      '파괴강석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_10_58.png',
      '정제된 파괴강석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_11_15.png',
      '운명의 파괴석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/use_12_88.png',
      
      // 강화재료 - 수호석 계열  
      '수호석 결정': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_6_104.png',
      '수호강석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_10_59.png',
      '정제된 수호강석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_11_16.png',
      '운명의 수호석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/use_12_89.png',
      
      // 강화재료 - 돌파석 계열
      '위대한 명예의 돌파석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_7_156.png',
      '경이로운 명예의 돌파석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_7_157.png',
      '찬란한 명예의 돌파석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_11_17.png',
      '운명의 돌파석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/use_12_85.png',
      '융합 돌파석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/use/use_7_173.png',
      '심화 돌파석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/use/use_7_171.png',
      '농축 돌파석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/use/use_11_18.png',
      '순환 돌파석': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/use/use_12_87.png',
      
      // 강화재료 - 파편 계열
      '명예의 파편': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_8_227.png',
      '운명의 파편': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/use_12_93.png',
      
      // 강화재료 - 강화서 계열
      '야금술 : 업화 [11-14]': 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_218.png',
      '야금술 : 업화 [15-18]': 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_218.png',
      '야금술 : 업화 [19-20]': 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_218.png',
      '재봉술 : 업화 [11-14]': 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_219.png',
      '재봉술 : 업화 [15-18]': 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_219.png',
      '재봉술 : 업화 [19-20]': 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_219.png',
      '장인의 야금술 : 1단계': 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_242.png',
      '장인의 야금술 : 2단계': 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_244.png',
      '장인의 재봉술 : 1단계': 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_243.png',
      '장인의 재봉술 : 2단계': 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_245.png',
      
      // 강화재료 - 숨결 계열
      '용암의 숨결': 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_171.png',
      '빙하의 숨결': 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_172.png',

      // 강화재료 - 융화 재료
      '아비도스 융화 재료': 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_86.png',
      
      // 고유 재료들 - 각 레이드별
      '마수의 뼈': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_3_101.png',
      '욕망의 날개': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_3_124.png',
      '광기의 나팔': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_10_19.png',
      '몽환의 사념': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_10_80.png',
      '쇠락의 눈동자': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_11_19.png',
      '어둠의 불': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_11_239.png',
      '마력의 샘물': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_11_237.png',
      '관조의 빛무리': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_10_163.png',
      '시련의 빛': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_10_164.png',
      '빛나는 지혜의 기운': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_3_67.png',
      '빛나는 지혜의 엘릭서': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_11_146.png',
      '베히모스의 비늘': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_12_67.png',
      '아그리스의 비늘': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_12_53.png',
      '알키오네의 눈': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_12_54.png',
      '업화의 쐐기돌': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_12_180.png',
      '카르마의 잔영': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_12_222.png',
      '낙뢰의 뿔': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_13_24.png',
      '우뢰의 뇌옥': 'https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_13_25.png',
      '아크 그리드 코어': arkgridCoreIcon,
    },
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

/**
 * 재료 이름으로 아이콘 URL을 가져오는 함수
 * @param {string} materialName - 재료 이름
 * @returns {string|null} - 아이콘 URL 또는 null (fallback 처리용)
 */
export const getMaterialIcon = (materialName) => {
  try {
    const iconUrl = LOSTARK_ICONS.ITEMS?.MATERIALS?.[materialName];
    // 빈 문자열이거나 null/undefined인 경우 null 반환 (fallback 처리)
    return iconUrl && iconUrl.trim() !== '' ? iconUrl : null;
  } catch (error) {
    console.warn(`재료 아이콘을 찾을 수 없습니다: ${materialName}`, error);
    return null;
  }
};