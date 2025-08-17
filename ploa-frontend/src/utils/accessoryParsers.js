// 장신구 관련 툴팁 파싱 유틸리티 함수들

/**
 * 장신구 연마 효과 추출 함수
 * @param {string} tooltip - 장신구 툴팁 JSON 문자열
 * @returns {Array} - 연마 효과 배열
 */
export const getAccessoryPolishEffects = (tooltip) => {
  if (!tooltip) return [];
  
  // 장신구 타입 확인 함수
  const getAccessoryType = (tooltip) => {
    try {
      const tooltipData = JSON.parse(tooltip);
      const element001 = tooltipData.Element_001;
      if (element001 && element001.value && element001.value.leftStr0) {
        const typeStr = element001.value.leftStr0;
        if (typeStr.includes('목걸이')) return '목걸이';
        if (typeStr.includes('귀걸이')) return '귀걸이';
        if (typeStr.includes('반지')) return '반지';
        if (typeStr.includes('팔찌')) return '팔찌';
      }
    } catch (error) {
      console.error('장신구 타입 확인 에러:', error);
    }
    return null;
  };
  
  // 연마 효과 등급 정의 (장신구별 정확한 기준)
  const getEffectGrade = (effectText, accessoryType) => {
    // 목걸이 기준
    if (accessoryType === '목걸이') {
      if (effectText.includes('추가 피해')) {
        const match = effectText.match(/\+(\d+\.\d+)%/);
        if (match) {
          const value = parseFloat(match[1]);
          if (value >= 2.60) return { grade: '상', color: 'text-orange-400' };
          if (value >= 1.60) return { grade: '중', color: 'text-purple-400' };
          if (value >= 0.70) return { grade: '하', color: 'text-blue-400' };
        }
      }
      if (effectText.includes('적에게 주는 피해')) {
        const match = effectText.match(/\+(\d+\.\d+)%/);
        if (match) {
          const value = parseFloat(match[1]);
          if (value >= 2.00) return { grade: '상', color: 'text-orange-400' };
          if (value >= 1.20) return { grade: '중', color: 'text-purple-400' };
          if (value >= 0.55) return { grade: '하', color: 'text-blue-400' };
        }
      }
      if (effectText.includes('공격력') && !effectText.includes('무기')) {
        const match = effectText.match(/\+(\d+)/);
        if (match) {
          const value = parseInt(match[1]);
          if (value >= 390) return { grade: '상', color: 'text-orange-400' };
          if (value >= 195) return { grade: '중', color: 'text-purple-400' };
          if (value >= 80) return { grade: '하', color: 'text-blue-400' };
        }
      }
      if (effectText.includes('무기 공격력')) {
        const match = effectText.match(/\+(\d+)/);
        if (match) {
          const value = parseInt(match[1]);
          if (value >= 960) return { grade: '상', color: 'text-orange-400' };
          if (value >= 480) return { grade: '중', color: 'text-purple-400' };
          if (value >= 195) return { grade: '하', color: 'text-blue-400' };
        }
      }
      if (effectText.includes('세레나데') || effectText.includes('신앙') || effectText.includes('조화')) {
        const match = effectText.match(/\+(\d+\.\d+)%/);
        if (match) {
          const value = parseFloat(match[1]);
          if (value >= 6.00) return { grade: '상', color: 'text-orange-400' };
          if (value >= 3.60) return { grade: '중', color: 'text-purple-400' };
          if (value >= 1.60) return { grade: '하', color: 'text-blue-400' };
        }
      }
      if (effectText.includes('낙인력')) {
        const match = effectText.match(/\+(\d+\.\d+)%/);
        if (match) {
          const value = parseFloat(match[1]);
          if (value >= 8.00) return { grade: '상', color: 'text-orange-400' };
          if (value >= 4.80) return { grade: '중', color: 'text-purple-400' };
          if (value >= 2.15) return { grade: '하', color: 'text-blue-400' };
        }
      }
    }
    
    // 귀걸이 기준
    if (accessoryType === '귀걸이') {
      // 공격력 (퍼센트)
      if (effectText.includes('공격력') && !effectText.includes('무기') && effectText.includes('%')) {
        const match = effectText.match(/\+(\d+\.\d+)%/);
        if (match) {
          const value = parseFloat(match[1]);
          if (value >= 1.55) return { grade: '상', color: 'text-orange-400' };
          if (value >= 0.95) return { grade: '중', color: 'text-purple-400' };
          if (value >= 0.40) return { grade: '하', color: 'text-blue-400' };
        }
      }
      // 공격력 (절대값)
      if (effectText.includes('공격력') && !effectText.includes('무기') && !effectText.includes('%')) {
        const match = effectText.match(/\+(\d+)/);
        if (match) {
          const value = parseInt(match[1]);
          if (value >= 390) return { grade: '상', color: 'text-orange-400' };
          if (value >= 195) return { grade: '중', color: 'text-purple-400' };
          if (value >= 80) return { grade: '하', color: 'text-blue-400' };
        }
      }
      // 무기 공격력 (퍼센트)
      if (effectText.includes('무기 공격력') && effectText.includes('%')) {
        const match = effectText.match(/\+(\d+\.\d+)%/);
        if (match) {
          const value = parseFloat(match[1]);
          if (value >= 3.00) return { grade: '상', color: 'text-orange-400' };
          if (value >= 1.80) return { grade: '중', color: 'text-purple-400' };
          if (value >= 0.80) return { grade: '하', color: 'text-blue-400' };
        }
      }
      // 무기 공격력 (절대값)
      if (effectText.includes('무기 공격력') && !effectText.includes('%')) {
        const match = effectText.match(/\+(\d+)/);
        if (match) {
          const value = parseInt(match[1]);
          if (value >= 960) return { grade: '상', color: 'text-orange-400' };
          if (value >= 480) return { grade: '중', color: 'text-purple-400' };
          if (value >= 195) return { grade: '하', color: 'text-blue-400' };
        }
      }
      // 파티원 회복 효과
      if (effectText.includes('파티원') && effectText.includes('회복 효과')) {
        const match = effectText.match(/\+(\d+\.\d+)%/);
        if (match) {
          const value = parseFloat(match[1]);
          if (value >= 3.50) return { grade: '상', color: 'text-orange-400' };
          if (value >= 2.10) return { grade: '중', color: 'text-purple-400' };
          if (value >= 0.95) return { grade: '하', color: 'text-blue-400' };
        }
      }
      // 파티원 보호막 효과
      if (effectText.includes('파티원') && effectText.includes('보호막 효과')) {
        const match = effectText.match(/\+(\d+\.\d+)%/);
        if (match) {
          const value = parseFloat(match[1]);
          if (value >= 3.50) return { grade: '상', color: 'text-orange-400' };
          if (value >= 2.10) return { grade: '중', color: 'text-purple-400' };
          if (value >= 0.95) return { grade: '하', color: 'text-blue-400' };
        }
      }
    }
    
    // 반지 기준
    if (accessoryType === '반지') {
      // 치명타 적중률
      if (effectText.includes('치명타 적중률')) {
        const match = effectText.match(/\+(\d+\.\d+)%/);
        if (match) {
          const value = parseFloat(match[1]);
          if (value >= 1.55) return { grade: '상', color: 'text-orange-400' };
          if (value >= 0.95) return { grade: '중', color: 'text-purple-400' };
          if (value >= 0.40) return { grade: '하', color: 'text-blue-400' };
        }
      }
      // 치명타 피해
      if (effectText.includes('치명타 피해')) {
        const match = effectText.match(/\+(\d+\.\d+)%/);
        if (match) {
          const value = parseFloat(match[1]);
          if (value >= 4.00) return { grade: '상', color: 'text-orange-400' };
          if (value >= 2.40) return { grade: '중', color: 'text-purple-400' };
          if (value >= 1.10) return { grade: '하', color: 'text-blue-400' };
        }
      }
      // 공격력 (절대값)
      if (effectText.includes('공격력') && !effectText.includes('무기') && !effectText.includes('%')) {
        const match = effectText.match(/\+(\d+)/);
        if (match) {
          const value = parseInt(match[1]);
          if (value >= 390) return { grade: '상', color: 'text-orange-400' };
          if (value >= 195) return { grade: '중', color: 'text-purple-400' };
          if (value >= 80) return { grade: '하', color: 'text-blue-400' };
        }
      }
      // 무기 공격력 (절대값)
      if (effectText.includes('무기 공격력') && !effectText.includes('%')) {
        const match = effectText.match(/\+(\d+)/);
        if (match) {
          const value = parseInt(match[1]);
          if (value >= 960) return { grade: '상', color: 'text-orange-400' };
          if (value >= 480) return { grade: '중', color: 'text-purple-400' };
          if (value >= 195) return { grade: '하', color: 'text-blue-400' };
        }
      }
      // 아군 피해량 강화 효과
      if (effectText.includes('아군 피해량 강화 효과')) {
        const match = effectText.match(/\+(\d+\.\d+)%/);
        if (match) {
          const value = parseFloat(match[1]);
          if (value >= 7.50) return { grade: '상', color: 'text-orange-400' };
          if (value >= 4.50) return { grade: '중', color: 'text-purple-400' };
          if (value >= 2.00) return { grade: '하', color: 'text-blue-400' };
        }
      }
      // 아군 공격력 강화 효과
      if (effectText.includes('아군 공격력 강화 효과')) {
        const match = effectText.match(/\+(\d+\.\d+)%/);
        if (match) {
          const value = parseFloat(match[1]);
          if (value >= 5.00) return { grade: '상', color: 'text-orange-400' };
          if (value >= 3.00) return { grade: '중', color: 'text-purple-400' };
          if (value >= 1.35) return { grade: '하', color: 'text-blue-400' };
        }
      }
    }

    return null;
  };

  const accessoryType = getAccessoryType(tooltip);
  const effects = [];

  try {
    const tooltipData = JSON.parse(tooltip);
    
    // 모든 Element를 확인하여 연마 효과 찾기
    for (let i = 0; i <= 30; i++) {
      const elementKey = `Element_${String(i).padStart(3, '0')}`;
      const element = tooltipData[elementKey];
      
      if (element && element.type === 'ItemPartBox' && element.value) {
        // Element_000에서 "연마 효과" 체크
        if (element.value.Element_000 && element.value.Element_000.includes('연마 효과')) {
          // Element_001에 연마 효과 내용이 있음
          const effectContent = element.value.Element_001;
          if (effectContent) {
            // HTML 태그 제거하고 효과 텍스트만 추출
            const cleanText = effectContent
              .replace(/<img[^>]*>/g, '') // img 태그 제거
              .replace(/<\/img>/g, '') // 종료 img 태그도 제거
              .replace(/<br>/g, '|') // br을 구분자로 변경
              .replace(/<FONT[^>]*>/g, '') // FONT 시작 태그 제거
              .replace(/<\/FONT>/g, '') // FONT 종료 태그 제거
              .split('|') // 구분자로 분할
              .map(effect => effect.trim())
              .filter(effect => effect.length > 0);
            
            cleanText.forEach(effect => {
              if (effect) {
                const gradeInfo = getEffectGrade(effect, accessoryType);
                effects.push({
                  text: effect,
                  grade: gradeInfo?.grade || null,
                  gradeColor: gradeInfo?.color || null,
                  fullText: effectContent
                });
              }
            });
          }
        }
      }
    }
    
    return effects;
  } catch (error) {
    console.error('장신구 연마 효과 파싱 에러:', error);
  }
  return [];
};