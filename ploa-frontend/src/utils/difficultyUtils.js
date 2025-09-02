// 캐릭터 레벨에 맞는 최적 난이도 계산 유틸리티

/**
 * 캐릭터 아이템 레벨에 맞는 가장 높은 난이도를 반환
 * @param {number} characterLevel - 캐릭터 아이템 레벨
 * @param {Array} difficulties - 난이도 배열 [{ id, name, minLevel }]
 * @returns {Object|null} - 참여 가능한 가장 높은 난이도 또는 null
 */
export const getHighestAvailableDifficulty = (characterLevel, difficulties) => {
  if (!difficulties || !Array.isArray(difficulties)) {
    return null;
  }

  // 참여 가능한 난이도들을 필터링하고 레벨 순으로 정렬
  const availableDifficulties = difficulties
    .filter(diff => characterLevel >= diff.minLevel)
    .sort((a, b) => b.minLevel - a.minLevel); // 높은 레벨부터 정렬

  // 가장 높은 난이도 반환 (없으면 null)
  return availableDifficulties.length > 0 ? availableDifficulties[0] : null;
};

/**
 * 군단장 레이드의 모든 참여 가능한 난이도 ID를 반환
 * @param {number} characterLevel - 캐릭터 아이템 레벨
 * @param {Object} legionRaidContent - 군단장 레이드 컨텐츠 객체
 * @returns {Array} - 참여 가능한 난이도 ID 배열
 */
export const getAvailableLegionRaidIds = (characterLevel, legionRaidContent) => {
  const availableIds = [];
  
  Object.values(legionRaidContent).forEach(raid => {
    const highestDifficulty = getHighestAvailableDifficulty(characterLevel, raid.difficulties);
    if (highestDifficulty) {
      availableIds.push(highestDifficulty.id);
    }
  });
  
  return availableIds;
};

/**
 * 특정 군단장 레이드의 최적 난이도 정보를 반환
 * @param {number} characterLevel - 캐릭터 아이템 레벨  
 * @param {Object} raidData - 특정 레이드 데이터
 * @returns {Object} - { difficulty, canParticipate, lowestRequiredLevel }
 */
export const getRaidDifficultyInfo = (characterLevel, raidData) => {
  if (!raidData || !raidData.difficulties) {
    return { difficulty: null, canParticipate: false, lowestRequiredLevel: null };
  }

  const highestDifficulty = getHighestAvailableDifficulty(characterLevel, raidData.difficulties);
  const lowestRequiredLevel = Math.min(...raidData.difficulties.map(d => d.minLevel));
  
  return {
    difficulty: highestDifficulty,
    canParticipate: !!highestDifficulty,
    lowestRequiredLevel
  };
};