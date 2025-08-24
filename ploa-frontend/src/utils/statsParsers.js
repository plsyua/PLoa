// 캐릭터 스탯 파싱 유틸리티 함수들

// 표시할 스탯 타입들
export const DISPLAY_STATS = ['치명', '특화', '신속', '제압', '인내', '숙련', '최대 생명력', '공격력'];

// 150 이상 조건이 적용되는 스탯들
export const FILTERED_STATS = ['치명', '특화', '신속', '제압', '인내', '숙련'];

/**
 * API 스탯 데이터에서 표시할 스탯만 필터링하여 반환
 * @param {Array} statsData - API에서 받은 Stats 배열
 * @returns {Array} 필터링된 스탯 배열
 */
export const parseCharacterStats = (statsData) => {
  if (!statsData || !Array.isArray(statsData)) {
    return [];
  }

  // 필요한 스탯만 필터링
  const relevantStats = statsData.filter(stat => 
    DISPLAY_STATS.includes(stat.Type)
  );

  // 150 이상 조건 적용 및 정렬
  const filteredStats = relevantStats.filter(stat => {
    if (FILTERED_STATS.includes(stat.Type)) {
      // 치명, 특화, 신속, 제압, 인내, 숙련은 150 이상만
      const value = parseInt(stat.Value.replace(/,/g, ''), 10);
      return value >= 150;
    } else {
      // 최대 생명력, 공격력은 조건 없이 표시
      return true;
    }
  });

  // 스탯 순서 정렬 (DISPLAY_STATS 순서대로)
  filteredStats.sort((a, b) => {
    const aIndex = DISPLAY_STATS.indexOf(a.Type);
    const bIndex = DISPLAY_STATS.indexOf(b.Type);
    return aIndex - bIndex;
  });

  return filteredStats;
};

/**
 * 스탯 값을 포맷팅하여 반환 (콤마 추가)
 * @param {string} value - 스탯 값
 * @returns {string} 포맷팅된 값
 */
export const formatStatValue = (value) => {
  if (!value) return '0';
  
  // 숫자로 변환 후 다시 콤마 추가
  const numValue = parseInt(value.replace(/,/g, ''), 10);
  return numValue.toLocaleString();
};