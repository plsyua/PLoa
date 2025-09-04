/**
 * ==================================================================================
 * 🚀 PLoa 강화 계산기 사전 데이터 생성 스크립트 🚀
 * ==================================================================================
 * 
 * 📋 목적:
 * - 로스트아크 강화 계산기의 실시간 몬테카를로 시뮬레이션(10,000회)을 제거
 * - 모든 강화 구간과 옵션 조합을 사전 계산하여 JSON 파일로 저장
 * - 계산 시간을 10초 → 0.01초로 1000배 성능 향상
 * 
 * ⚡ 빠른 실행 (clear 후에도 바로 사용):
 * ```bash
 * cd /home/plsyua/PLoa/ploa-frontend
 * node src/data/generateEnhancementData.js
 * ```
 * 
 * 📊 데이터 규모:
 * - 총 960개 조합 (16레벨 × 4옵션 × 2타입 × 15구간)
 * - 시뮬레이션 반복: 50,000회 (높은 정확도)
 * - 예상 소요 시간: 30-60분
 * - 출력 파일 크기: ~50MB
 * 
 * 🎯 생성되는 데이터:
 * - 파일: /home/plsyua/PLoa/ploa-frontend/src/data/enhancementPrecomputedData.json
 * - 구조: { "10_25_weapon_true_true": { upper25, median, lower25, guaranteed } }
 * - 각 시나리오별 재료량과 골드 비용 포함
 * 
 * 🔧 기술적 세부사항:
 * - 강화 구간: 10→11부터 24→25까지 모든 조합
 * - 장비 타입: weapon(무기), armor(방어구)
 * - 옵션: books(책), breaths(숨결) 사용 여부 4가지 조합
 * - 시나리오: 상위25%, 중앙값, 하위25%, 장인의기운100%
 * 
 * 🚦 실행 중 진행 상황:
 * - 콘솔에서 "처리 중: 키값 (진행수/960)" 형태로 실시간 표시
 * - Ctrl+C로 중단 가능 (부분 데이터는 저장되지 않음)
 * 
 * 📝 다음 단계 (데이터 생성 완료 후):
 * 1. EnhancementCalculator.jsx에서 simulateEquipmentEnhancement 함수 제거
 * 2. 사전 계산된 데이터 조회하는 getPrecomputedData 함수로 교체
 * 3. 실시간 시뮬레이션 완전 제거하여 즉시 응답 구현
 * 
 * ⚠️ 주의사항:
 * - 높은 CPU 사용률로 시스템이 느려질 수 있음
 * - 메모리 4GB 이상 권장
 * - 백그라운드 실행: `nohup node src/data/generateEnhancementData.js &`
 * 
 * ==================================================================================
 */

import { 
  ENHANCEMENT_RATES, 
  BOOK_BONUS, 
  MATERIAL_COSTS 
} from './enhancementData.js';

// 시뮬레이션 반복 횟수
const ITERATIONS = 50000;

/**
 * 시도 차수별 확률 계산 (실패 누적 보너스 포함)
 */
const calculateAttemptRate = (baseRate, attemptCount) => {
  const failureBonus = baseRate * Math.min(attemptCount - 1, 10) * 0.1;
  return baseRate + failureBonus;
};

/**
 * 책 보너스 확률 계산
 */
const getBookBonus = (level, useBooks) => {
  if (!useBooks) return 0;
  return BOOK_BONUS[level] || 0;
};

/**
 * 숨결 보너스 확률 계산
 */
const getBreathBonus = (level, baseRate, useBreaths) => {
  if (!useBreaths) return 0;
  if (level >= 24) return 1.0;
  return baseRate;
};

/**
 * 최종 시도 확률 계산
 */
const calculateFinalRate = (level, attemptCount, useBooks, useBreaths) => {
  const baseRate = ENHANCEMENT_RATES[level] || 0;
  const attemptRate = calculateAttemptRate(baseRate, attemptCount);
  const bookBonus = getBookBonus(level, useBooks);
  const breathBonus = getBreathBonus(level, baseRate, useBreaths);
  
  return attemptRate + bookBonus + breathBonus;
};

/**
 * 장인의 기운 누적 계산
 */
const calculateArtisanEnergy = (finalRate) => {
  return Math.floor(finalRate / 2.15 * 100) / 100;
};

/**
 * 개별 강화 구간 시뮬레이션
 */
const simulateEnhancementRange = (startLevel, endLevel, equipmentType, useBooks, useBreaths) => {
  const results = [];
  
  for (let sim = 0; sim < ITERATIONS; sim++) {
    let level = startLevel;
    let artisanEnergy = 0;
    let totalMaterials = {
      '운명의 수호석': 0,
      '운명의 파괴석': 0,
      '운명의 돌파석': 0,
      '아비도스 융화 재료': 0,
      '운명의 파편': 0,
      '용암의 숨결': 0,
      '빙하의 숨결': 0,
      '야금술 : 업화 [11-14]': 0,
      '야금술 : 업화 [15-18]': 0,
      '야금술 : 업화 [19-20]': 0,
      '재봉술 : 업화 [11-14]': 0,
      '재봉술 : 업화 [15-18]': 0,
      '재봉술 : 업화 [19-20]': 0,
      '장인의 야금술 : 1단계': 0,
      '장인의 야금술 : 2단계': 0,
      '장인의 재봉술 : 1단계': 0,
      '장인의 재봉술 : 2단계': 0
    };
    let totalGold = 0;

    while (level < endLevel) {
      const nextLevel = level + 1;
      let attemptCount = 1;
      let success = false;

      while (!success) {
        const finalRate = calculateFinalRate(nextLevel, attemptCount, useBooks, useBreaths);
        
        if (artisanEnergy >= 100) {
          success = true;
          artisanEnergy = 0;
        } else {
          const random = Math.random() * 100;
          if (random < finalRate) {
            success = true;
            artisanEnergy = 0;
          } else {
            artisanEnergy += calculateArtisanEnergy(finalRate);
            attemptCount++;
          }
        }

        // 재료 소모량 추가
        const materialCost = MATERIAL_COSTS[equipmentType][nextLevel];
        if (materialCost) {
          if (equipmentType === 'weapon') {
            totalMaterials['운명의 파괴석'] += materialCost['파괴석'] || 0;
          } else {
            totalMaterials['운명의 수호석'] += materialCost['수호석'] || 0;
          }
          
          totalMaterials['운명의 돌파석'] += materialCost['돌파석'] || 0;
          totalMaterials['아비도스 융화 재료'] += materialCost['아비도스'] || 0;
          totalMaterials['운명의 파편'] += materialCost['운명의 파편'] || 0;
          totalGold += materialCost['골드'] || 0;
          
          if (useBreaths) {
            if (equipmentType === 'weapon') {
              totalMaterials['용암의 숨결'] += materialCost['숨결'] || 0;
            } else {
              totalMaterials['빙하의 숨결'] += materialCost['숨결'] || 0;
            }
          }
          
          if (useBooks && BOOK_BONUS[nextLevel]) {
            if (equipmentType === 'weapon') {
              if (nextLevel <= 14) {
                totalMaterials['야금술 : 업화 [11-14]'] += materialCost['책'] || 0;
              } else if (nextLevel <= 18) {
                totalMaterials['야금술 : 업화 [15-18]'] += materialCost['책'] || 0;
              } else {
                totalMaterials['야금술 : 업화 [19-20]'] += materialCost['책'] || 0;
              }
            } else {
              if (nextLevel <= 14) {
                totalMaterials['재봉술 : 업화 [11-14]'] += materialCost['책'] || 0;
              } else if (nextLevel <= 18) {
                totalMaterials['재봉술 : 업화 [15-18]'] += materialCost['책'] || 0;
              } else {
                totalMaterials['재봉술 : 업화 [19-20]'] += materialCost['책'] || 0;
              }
            }
          }
        }
      }

      level = nextLevel;
    }

    results.push({ materials: totalMaterials, gold: totalGold });
  }

  return results;
};

/**
 * 장인의 기운 100% 확정 강화 비용 계산
 */
const calculateGuaranteedCost = (startLevel, endLevel, equipmentType, useBooks, useBreaths) => {
  let totalMaterials = {
    '운명의 수호석': 0,
    '운명의 파괴석': 0,
    '운명의 돌파석': 0,
    '아비도스 융화 재료': 0,
    '운명의 파편': 0,
    '용암의 숨결': 0,
    '빙하의 숨결': 0,
    '야금술 : 업화 [11-14]': 0,
    '야금술 : 업화 [15-18]': 0,
    '야금술 : 업화 [19-20]': 0,
    '재봉술 : 업화 [11-14]': 0,
    '재봉술 : 업화 [15-18]': 0,
    '재봉술 : 업화 [19-20]': 0,
    '장인의 야금술 : 1단계': 0,
    '장인의 야금술 : 2단계': 0,
    '장인의 재봉술 : 1단계': 0,
    '장인의 재봉술 : 2단계': 0
  };
  let totalGold = 0;

  for (let level = startLevel + 1; level <= endLevel; level++) {
    let artisanEnergy = 0;
    let attemptCount = 1;

    // 장인의 기운 100% 도달까지
    while (artisanEnergy < 100) {
      const finalRate = calculateFinalRate(level, attemptCount, useBooks, useBreaths);
      artisanEnergy += calculateArtisanEnergy(finalRate);
      
      const materialCost = MATERIAL_COSTS[equipmentType][level];
      if (materialCost) {
        if (equipmentType === 'weapon') {
          totalMaterials['운명의 파괴석'] += materialCost['파괴석'] || 0;
        } else {
          totalMaterials['운명의 수호석'] += materialCost['수호석'] || 0;
        }
        
        totalMaterials['운명의 돌파석'] += materialCost['돌파석'] || 0;
        totalMaterials['아비도스 융화 재료'] += materialCost['아비도스'] || 0;
        totalMaterials['운명의 파편'] += materialCost['운명의 파편'] || 0;
        totalGold += materialCost['골드'] || 0;
        
        if (useBreaths) {
          if (equipmentType === 'weapon') {
            totalMaterials['용암의 숨결'] += materialCost['숨결'] || 0;
          } else {
            totalMaterials['빙하의 숨결'] += materialCost['숨결'] || 0;
          }
        }
        
        if (useBooks && BOOK_BONUS[level]) {
          if (equipmentType === 'weapon') {
            if (level <= 14) {
              totalMaterials['야금술 : 업화 [11-14]'] += materialCost['책'] || 0;
            } else if (level <= 18) {
              totalMaterials['야금술 : 업화 [15-18]'] += materialCost['책'] || 0;
            } else {
              totalMaterials['야금술 : 업화 [19-20]'] += materialCost['책'] || 0;
            }
          } else {
            if (level <= 14) {
              totalMaterials['재봉술 : 업화 [11-14]'] += materialCost['책'] || 0;
            } else if (level <= 18) {
              totalMaterials['재봉술 : 업화 [15-18]'] += materialCost['책'] || 0;
            } else {
              totalMaterials['재봉술 : 업화 [19-20]'] += materialCost['책'] || 0;
            }
          }
        }
      }
      attemptCount++;
    }

    // 확정 성공 시도
    const finalMaterialCost = MATERIAL_COSTS[equipmentType][level];
    if (finalMaterialCost) {
      if (equipmentType === 'weapon') {
        totalMaterials['운명의 파괴석'] += finalMaterialCost['파괴석'] || 0;
      } else {
        totalMaterials['운명의 수호석'] += finalMaterialCost['수호석'] || 0;
      }
      
      totalMaterials['운명의 돌파석'] += finalMaterialCost['돌파석'] || 0;
      totalMaterials['아비도스 융화 재료'] += finalMaterialCost['아비도스'] || 0;
      totalMaterials['운명의 파편'] += finalMaterialCost['운명의 파편'] || 0;
      totalGold += finalMaterialCost['골드'] || 0;
      
      if (useBreaths) {
        if (equipmentType === 'weapon') {
          totalMaterials['용암의 숨결'] += finalMaterialCost['숨결'] || 0;
        } else {
          totalMaterials['빙하의 숨결'] += finalMaterialCost['숨결'] || 0;
        }
      }
      
      if (useBooks && BOOK_BONUS[level]) {
        if (equipmentType === 'weapon') {
          if (level <= 14) {
            totalMaterials['야금술 : 업화 [11-14]'] += finalMaterialCost['책'] || 0;
          } else if (level <= 18) {
            totalMaterials['야금술 : 업화 [15-18]'] += finalMaterialCost['책'] || 0;
          } else {
            totalMaterials['야금술 : 업화 [19-20]'] += finalMaterialCost['책'] || 0;
          }
        } else {
          if (level <= 14) {
            totalMaterials['재봉술 : 업화 [11-14]'] += finalMaterialCost['책'] || 0;
          } else if (level <= 18) {
            totalMaterials['재봉술 : 업화 [15-18]'] += finalMaterialCost['책'] || 0;
          } else {
            totalMaterials['재봉술 : 업화 [19-20]'] += finalMaterialCost['책'] || 0;
          }
        }
      }
    }
  }

  return { materials: totalMaterials, gold: totalGold };
};

/**
 * 시나리오별 통계 계산
 */
const calculateScenarios = (results) => {
  const totalGoldResults = results.map(r => r.gold).sort((a, b) => a - b);
  const totalResults = totalGoldResults.length;
  
  const getPercentile = (percentile) => {
    const index = Math.floor(totalResults * percentile);
    const targetGold = totalGoldResults[index];
    return results.find(r => r.gold === targetGold);
  };
  
  return {
    upper25: getPercentile(0.25),
    median: getPercentile(0.5),
    lower25: getPercentile(0.75)
  };
};

/**
 * 모든 강화 데이터 생성
 */
const generateAllEnhancementData = () => {
  const enhancementData = {};
  const equipmentTypes = ['weapon', 'armor'];
  const optionCombinations = [
    { books: false, breaths: false },
    { books: true, breaths: false },
    { books: false, breaths: true },
    { books: true, breaths: true }
  ];
  
  console.log('강화 데이터 생성 시작...');
  let totalCombinations = 0;
  let processedCombinations = 0;
  
  // 전체 조합 수 계산
  for (let start = 10; start <= 24; start++) {
    for (let end = start + 1; end <= 25; end++) {
      totalCombinations += equipmentTypes.length * optionCombinations.length;
    }
  }
  
  for (let start = 10; start <= 24; start++) {
    for (let end = start + 1; end <= 25; end++) {
      for (const equipmentType of equipmentTypes) {
        for (const options of optionCombinations) {
          const key = `${start}_${end}_${equipmentType}_${options.books}_${options.breaths}`;
          
          console.log(`처리 중: ${key} (${++processedCombinations}/${totalCombinations})`);
          
          // 시뮬레이션 실행
          const results = simulateEnhancementRange(start, end, equipmentType, options.books, options.breaths);
          const scenarios = calculateScenarios(results);
          
          // 장인의 기운 100% 확정 비용 계산
          const guaranteed = calculateGuaranteedCost(start, end, equipmentType, options.books, options.breaths);
          
          enhancementData[key] = {
            ...scenarios,
            guaranteed
          };
        }
      }
    }
  }
  
  console.log('강화 데이터 생성 완료!');
  return enhancementData;
};

// 메인 실행 (Node.js에서만)
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  const fs = await import('fs');
  const data = generateAllEnhancementData();
  
  fs.writeFileSync(
    './src/data/enhancementPrecomputedData.json', 
    JSON.stringify(data, null, 2)
  );
  
  console.log('데이터가 enhancementPrecomputedData.json에 저장되었습니다.');
}

export { generateAllEnhancementData };