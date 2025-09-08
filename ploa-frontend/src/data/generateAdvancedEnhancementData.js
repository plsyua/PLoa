/**
 * T4 상급 재련 사전 계산 데이터 생성 스크립트
 * 기존 일반 재련 데이터에 상급 재련 데이터 추가
 */

import enhancementPrecomputedData from './enhancementPrecomputedData.json' with { type: 'json' };

// T4 상급 재련 관련 데이터
const T4_SUCCESS_TABLE = {
  0: [0.8, 0.15, 0.05],   // 스크롤X, 숨결X (기본)
  1: [0.5, 0.3, 0.2],     // 숨결O만 (대성공 +0.15, 대성공x2 +0.15)
  2: [0.3, 0.45, 0.25],   // 스크롤O만 (대성공 +0.3, 대성공x2 +0.2)
  3: [0.2, 0.6, 0.4],     // 스크롤O, 숨결O (둘 다 효과 합산)
};

const BONUS_TABLE_1_20 = {
  갈라투르: 0.15,
  겔라르: 0.35,
  쿠훔바르: 0.15,
  테메르: 0.35,
  나베르: 0,
  에베르: 0,
};

const BONUS_TABLE_21_40 = {
  갈라투르: 0.125,
  겔라르: 0.25,
  쿠훔바르: 0.125,
  테메르: 0.25,
  나베르: 0.125,
  에베르: 0.125,
};

const ENHANCED_BONUS_TABLE = {
  갈라투르: 0.2,
  겔라르: 0.2,
  쿠훔바르: 0.2,
  테메르: 0.2,
  에베르: 0.2,
};

const MAX_EXP = 1000;
const ITERATIONS = 10000; // 상급 재련용 반복 횟수

/**
 * T4 상급 재료 비용 데이터
 * 
 * TODO: 현재는 모든 구간에 동일한 재료량을 적용하고 있으나,
 *       실제로는 구간별로 재료 소모량이 다름
 *       
 * 구간별 실제 재료 소모량 (시도당):
 * 1-10단계:   [실제 값 미확인 - 조사 필요]
 *   - 운명의 돌파석: ?개
 *   - 아비도스 융화 재료: ?개
 *   - 운명의 파편: ?개
 *   - 골드: ?골드
 * 
 * 11-20단계:  [실제 값 미확인 - 조사 필요]
 *   - 운명의 돌파석: ?개
 *   - 아비도스 융화 재료: ?개
 *   - 운명의 파편: ?개
 *   - 골드: ?골드
 * 
 * 21-30단계:  [실제 값 미확인 - 조사 필요]
 *   - 운명의 돌파석: ?개
 *   - 아비도스 융화 재료: ?개
 *   - 운명의 파편: ?개
 *   - 골드: ?골드
 * 
 * 31-40단계:  [실제 값 미확인 - 조사 필요]
 *   - 운명의 돌파석: ?개
 *   - 아비도스 융화 재료: ?개
 *   - 운명의 파편: ?개
 *   - 골드: ?골드
 * 
 * FIXME: 구간별 차등 적용 로직으로 변경 필요
 *        현재 구조: base (단일 객체)
 *        목표 구조: base_1_10, base_11_20, base_21_30, base_31_40 (구간별 객체)
 *        또는 함수형태로 (startLevel, endLevel) => materialCosts 반환
 */
const ADVANCED_MATERIAL_COSTS = {
  // 기본 재료 (임시: 모든 구간 공통 - 추후 구간별로 분리 필요)
  base: {
    '운명의 돌파석': 12,      // TODO: 구간별로 다른 값 적용 필요
    '아비도스 융화 재료': 8,  // TODO: 구간별로 다른 값 적용 필요
    '운명의 파편': 4000,      // TODO: 구간별로 다른 값 적용 필요
    '골드': 500,             // TODO: 구간별로 다른 값 적용 필요
  },
  // 장비별 스크롤 재료
  scrolls: {
    weapon: {
      1: '장인의 야금술 : 1단계',  // 1-20단계
      2: '장인의 야금술 : 2단계',  // 21-40단계
    },
    armor: {
      1: '장인의 재봉술 : 1단계',   // 1-20단계  
      2: '장인의 재봉술 : 2단계',   // 21-40단계
    },
  },
  // 숨결 재료
  breaths: {
    weapon: '용암의 숨결',
    armor: '빙하의 숨결',
  },
};

/**
 * 재료 조합을 T4 successTable 인덱스로 변환
 */
function getSuccessTableIndex(useScrolls, useBreaths) {
  if (!useScrolls && !useBreaths) return 0;  // 둘 다 사용 안함 (기본)
  if (useScrolls && useBreaths) return 3;    // 둘 다 사용 (최대 효과)
  if (useScrolls) return 2;                  // 스크롤만 사용
  return 1;  // 숨결만 사용
}

/**
 * T4 상급 재련 시뮬레이션 함수 (단일 시뮬레이션)
 */
function runAdvancedRefinementSimulation({
  normalSuccessTable,
  bonusSuccessTable, 
  enhancedBonusSuccessTable,
  bonusTable,
}) {
  // 누적 확률 테이블 생성
  const normalSuccess0 = normalSuccessTable[0];
  const normalSuccess1 = normalSuccess0 + normalSuccessTable[1];
  const normalProc = [normalSuccess0, normalSuccess1];

  const bonusSuccess0 = bonusSuccessTable[0];
  const bonusSuccess1 = bonusSuccess0 + bonusSuccessTable[1];
  const bonusProc = [bonusSuccess0, bonusSuccess1];

  const enhancedBonusSuccess0 = enhancedBonusSuccessTable[0];
  const enhancedBonusSuccess1 = enhancedBonusSuccess0 + enhancedBonusSuccessTable[1];
  const enhancedBonusProc = [enhancedBonusSuccess0, enhancedBonusSuccess1];

  // 경험치 획득 함수
  function getNormalExp(procTable) {
    const rand = Math.random();
    if (rand < procTable[0]) return 10;    // 성공
    if (rand < procTable[1]) return 20;    // 대성공
    return 40;  // 대성공x2
  }

  // 선조의 가호 확률 테이블
  const bonus0 = bonusTable.갈라투르;
  const bonus1 = bonus0 + bonusTable.겔라르;
  const bonus2 = bonus1 + bonusTable.쿠훔바르;
  const bonus3 = bonus2 + bonusTable.테메르;
  const bonus4 = bonus3 + bonusTable.나베르;

  // 선조의 가호 효과 처리
  function getBonus(prevExp, normalExp) {
    const rand = Math.random();
    if (rand < bonus0) {
      // 갈라투르 - 경험치 5배
      return { exp: prevExp + normalExp * 5, stack: 0 };
    }
    if (rand < bonus1) {
      // 겔라르 - 경험치 3배
      return { exp: prevExp + normalExp * 3, stack: 0 };
    }
    if (rand < bonus2) {
      // 쿠훔바르 - 경험치 30 추가, 구슬 재충전
      return { exp: prevExp + normalExp + 30, stack: 6 };
    }
    if (rand < bonus3) {
      // 테메르 - 경험치 10 추가, 다음 무료
      return { exp: prevExp + normalExp + 10, stack: 0, freeNext: true };
    }
    if (rand < bonus4) {
      // 나베르 - 구슬 재충전, 다음 강화
      return { exp: prevExp + normalExp, stack: 6, enhanceNextBonus: true };
    }
    // 에베르 - 1단계 상승 (100exp 단위로 올림)
    return {
      exp: Math.floor((prevExp + normalExp) / 100) * 100 + 100,
      stack: 0,
    };
  }

  // 강화된 선조의 가호 확률 테이블
  const enhancedBonus0 = ENHANCED_BONUS_TABLE.갈라투르;
  const enhancedBonus1 = enhancedBonus0 + ENHANCED_BONUS_TABLE.겔라르;
  const enhancedBonus2 = enhancedBonus1 + ENHANCED_BONUS_TABLE.쿠훔바르;
  const enhancedBonus3 = enhancedBonus2 + ENHANCED_BONUS_TABLE.테메르;

  // 강화된 선조의 가호 효과 처리
  function getEnhancedBonus(prevExp, normalExp) {
    const rand = Math.random();
    if (rand < enhancedBonus0) {
      // 갈라투르 - 경험치 7배
      return { exp: prevExp + normalExp * 7, stack: 0 };
    }
    if (rand < enhancedBonus1) {
      // 겔라르 - 경험치 5배
      return { exp: prevExp + normalExp * 5, stack: 0 };
    }
    if (rand < enhancedBonus2) {
      // 쿠훔바르 - 경험치 80 추가, 구슬 재충전
      return { exp: prevExp + normalExp + 80, stack: 6 };
    }
    if (rand < enhancedBonus3) {
      // 테메르 - 경험치 30 추가, 다음 무료
      return { exp: prevExp + normalExp + 30, stack: 0, freeNext: true };
    }
    // 에베르 - 2단계 상승
    return {
      exp: Math.floor((prevExp + normalExp) / 100) * 100 + 200,
      stack: 0,
    };
  }

  let stack = 0;
  let exp = 0;
  let enhanceNextBonus = false;
  let freeNext = false;

  let freeNormalTry = 0;
  let paidNormalTry = 0;
  let bonusTry = 0;
  let enhancedBonusTry = 0;

  while (exp < MAX_EXP) {
    if (stack === 6) {
      // 선조의 가호 발동
      if (enhanceNextBonus) {
        enhanceNextBonus = false;
        enhancedBonusTry += 1;
        
        const result = getEnhancedBonus(exp, getNormalExp(enhancedBonusProc));
        exp = result.exp;
        stack = result.stack;
        freeNext = !!result.freeNext;
      } else {
        bonusTry += 1;
        
        const result = getBonus(exp, getNormalExp(bonusProc));
        exp = result.exp;
        stack = result.stack;
        freeNext = !!result.freeNext;
        enhanceNextBonus = !!result.enhanceNextBonus;
      }
    } else {
      // 일반 시도
      if (freeNext) {
        freeNext = false;
        freeNormalTry += 1;
      } else {
        paidNormalTry += 1;
      }
      exp += getNormalExp(normalProc);
      stack += 1;
    }
  }

  return {
    freeNormalTry,
    paidNormalTry,
    bonusTry,
    enhancedBonusTry,
  };
}

/**
 * 상급 재련 구간별 시뮬레이션 실행
 */
function simulateAdvancedRefinement(startLevel, endLevel, equipmentType, useScrolls, useBreaths) {
  console.log(`상급 재련 시뮬레이션: ${startLevel}→${endLevel}, ${equipmentType}, 스크롤:${useScrolls}, 숨결:${useBreaths}`);
  
  // 재료 조합에 따른 successTable 인덱스 결정
  const tableIndex = getSuccessTableIndex(useScrolls, useBreaths);
  
  // 구간에 따른 bonusTable 선택
  const bonusTable = startLevel >= 20 ? BONUS_TABLE_21_40 : BONUS_TABLE_1_20;
  
  const results = [];
  
  for (let i = 0; i < ITERATIONS; i++) {
    const result = runAdvancedRefinementSimulation({
      normalSuccessTable: T4_SUCCESS_TABLE[tableIndex],
      bonusSuccessTable: T4_SUCCESS_TABLE[tableIndex],
      enhancedBonusSuccessTable: T4_SUCCESS_TABLE[tableIndex],
      bonusTable: bonusTable,
    });
    
    results.push(result);
  }
  
  // 평균 계산
  const avgResult = {
    freeNormalTry: 0,
    paidNormalTry: 0,
    bonusTry: 0,
    enhancedBonusTry: 0,
  };
  
  results.forEach(result => {
    avgResult.freeNormalTry += result.freeNormalTry;
    avgResult.paidNormalTry += result.paidNormalTry;
    avgResult.bonusTry += result.bonusTry;
    avgResult.enhancedBonusTry += result.enhancedBonusTry;
  });
  
  avgResult.freeNormalTry /= ITERATIONS;
  avgResult.paidNormalTry /= ITERATIONS;
  avgResult.bonusTry /= ITERATIONS;
  avgResult.enhancedBonusTry /= ITERATIONS;
  
  // 재료 계산
  const baseCost = ADVANCED_MATERIAL_COSTS.base;
  const materials = {
    '운명의 돌파석': Math.round(avgResult.paidNormalTry * baseCost['운명의 돌파석']),
    '아비도스 융화 재료': Math.round(avgResult.paidNormalTry * baseCost['아비도스 융화 재료']),
    '운명의 파편': Math.round(avgResult.paidNormalTry * baseCost['운명의 파편']),
  };
  
  let totalGold = Math.round(avgResult.paidNormalTry * baseCost['골드']);
  
  // 스크롤 재료 추가
  if (useScrolls) {
    const scrollType = startLevel >= 20 ? 2 : 1;
    const scrollMaterial = ADVANCED_MATERIAL_COSTS.scrolls[equipmentType][scrollType];
    materials[scrollMaterial] = Math.round(avgResult.paidNormalTry * 1); // 시도당 1개
  }
  
  // 숨결 재료 추가
  if (useBreaths) {
    const breathMaterial = ADVANCED_MATERIAL_COSTS.breaths[equipmentType];
    materials[breathMaterial] = Math.round(avgResult.paidNormalTry * 1); // 시도당 1개
  }
  
  return {
    materials: materials,
    gold: totalGold,
    attempts: Math.round(avgResult.paidNormalTry),
    totalAttempts: Math.round(avgResult.paidNormalTry + avgResult.freeNormalTry + avgResult.bonusTry + avgResult.enhancedBonusTry),
  };
}

/**
 * 모든 상급 재련 데이터 생성
 */
function generateAllAdvancedRefinementData() {
  const advancedData = {};
  
  // 상급 재련 구간: 0→10, 10→20, 20→30, 30→40
  const ranges = [
    [0, 10], [10, 20], [20, 30], [30, 40]
  ];
  
  // 장비 타입: weapon, armor
  const equipmentTypes = ['weapon', 'armor'];
  
  // 재료 조합: 스크롤 O/X × 숨결 O/X
  const materialCombinations = [
    { scrolls: false, breaths: false },
    { scrolls: true, breaths: false },
    { scrolls: false, breaths: true },
    { scrolls: true, breaths: true },
  ];
  
  let processedCount = 0;
  const totalCount = ranges.length * equipmentTypes.length * materialCombinations.length;
  
  console.log(`상급 재련 데이터 생성 시작... 총 ${totalCount}개 조합`);
  
  ranges.forEach(([start, end]) => {
    equipmentTypes.forEach(equipmentType => {
      materialCombinations.forEach(combination => {
        const key = `adv_${start}_${end}_${equipmentType}_${combination.scrolls}_${combination.breaths}`;
        
        console.log(`처리 중: ${key} (${++processedCount}/${totalCount})`);
        
        const result = simulateAdvancedRefinement(
          start, end, equipmentType, 
          combination.scrolls, combination.breaths
        );
        
        advancedData[key] = result;
      });
    });
  });
  
  console.log('상급 재련 데이터 생성 완료!');
  return advancedData;
}

// 메인 실행
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  const fs = await import('fs');
  
  console.log('기존 일반 재련 데이터 로드 중...');
  
  // 상급 재련 데이터 생성
  const advancedData = generateAllAdvancedRefinementData();
  
  // 기존 데이터와 상급 재련 데이터 병합
  const combinedData = {
    ...enhancementPrecomputedData,
    ...advancedData
  };
  
  // 새 파일로 저장
  fs.writeFileSync(
    './src/data/enhancementPrecomputedDataWithAdvanced.json',
    JSON.stringify(combinedData, null, 2)
  );
  
  console.log('통합 데이터가 enhancementPrecomputedDataWithAdvanced.json에 저장되었습니다.');
  console.log(`기존 데이터: ${Object.keys(enhancementPrecomputedData).length}개`);
  console.log(`상급 재련 데이터: ${Object.keys(advancedData).length}개`);
  console.log(`총 데이터: ${Object.keys(combinedData).length}개`);
}

export { generateAllAdvancedRefinementData };