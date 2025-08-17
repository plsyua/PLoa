// 특정 깨달음 2티어 키워드 상수
export const SPECIAL_ENLIGHTENMENT_KEYWORDS = ['활력', '절실한 구원', '만개', '축복의 오라'];

/**
 * arkPassive 데이터에서 특정 깨달음 2티어를 가지고 있는지 체크
 * @param {Object} arkPassiveData - 아크 패시브 API 응답 데이터
 * @returns {boolean} 특정 깨달음을 가지고 있으면 true, 그렇지 않으면 false
 */
export const hasSpecialEnlightenment = (arkPassiveData) => {
  if (!arkPassiveData?.Effects) return false;
  
  return arkPassiveData.Effects.some(effect => 
    effect.Name.includes('깨달음') && 
    effect.Description?.includes('2티어') &&
    SPECIAL_ENLIGHTENMENT_KEYWORDS.some(keyword => effect.Description.includes(keyword))
  );
};

/**
 * 전투력 색상을 결정하는 함수
 * @param {Object} arkPassiveData - 아크 패시브 API 응답 데이터
 * @returns {string} 특정 깨달음이 있으면 초록색, 그 외에는 빨간색 CSS 클래스
 */
export const getCombatPowerColor = (arkPassiveData) => {
  return hasSpecialEnlightenment(arkPassiveData) ? 'text-green-400' : 'text-red-400';
};