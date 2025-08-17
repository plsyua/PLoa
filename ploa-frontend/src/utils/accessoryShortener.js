// 장신구 연마 효과 줄임말 변환 유틸리티

// 효과명 줄임말 매핑
const EFFECT_SHORT_MAP = {
  '무기 공격력': '무공',
  '치명타 적중률': '치적',
  '치명타 피해': '치피',
  '추가 피해': '추피',
  '아군 공격력 강화 효과': '아공강',
  '아군 피해량 강화 효과': '아피강',
  '파티원 회복 효과': '회복',
  '파티원 보호막 효과': '보호막',
  '적에게 주는 피해': '적주피',
  '세레나데, 신앙, 조화 게이지 획득량': '서폿 아덴',
  '공격력': '공'
};

// 등급별 색상 매핑
const GRADE_COLOR_MAP = {
  '상': 'text-orange-400',
  '중': 'text-purple-400', 
  '하': 'text-blue-400'
};

/**
 * 장신구 연마 효과 텍스트를 줄임말로 변환
 * @param {string} effectText - 원본 효과 텍스트
 * @param {string} grade - 효과 등급 ('상', '중', '하')
 * @returns {object} - {shortText: string, colorClass: string}
 */
export const shortenAccessoryEffect = (effectText, grade) => {
  if (!effectText) return { shortText: '', colorClass: 'text-gray-400' };
  
  let shortText = effectText;
  
  // 효과명을 줄임말로 변환
  for (const [fullName, shortName] of Object.entries(EFFECT_SHORT_MAP)) {
    if (effectText.includes(fullName)) {
      // 수치 추출 (백분율 또는 숫자)
      const percentMatch = effectText.match(/(\+?\d+\.?\d*)%/);
      const numberMatch = effectText.match(/(\+?\d+\.?\d*)/);
      
      if (percentMatch) {
        shortText = `${shortName} ${percentMatch[1]}%`;
        break;
      } else if (numberMatch) {
        shortText = `${shortName} ${numberMatch[1]}`;
        break;
      }
    }
  }
  
  // 등급별 색상 적용
  const colorClass = GRADE_COLOR_MAP[grade] || 'text-gray-400';
  
  return { shortText, colorClass };
};

/**
 * 장신구 타입 확인 (팔찌 제외)
 * @param {string} itemType - 아이템 타입
 * @returns {boolean} - 줄임말 적용 대상 여부
 */
export const shouldShortenAccessory = (itemType) => {
  const targetTypes = ['목걸이', '귀걸이', '반지'];
  return targetTypes.some(type => itemType?.includes(type));
};