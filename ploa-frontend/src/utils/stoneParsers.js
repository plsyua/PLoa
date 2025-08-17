// 어빌리티 스톤 관련 툴팁 파싱 유틸리티 함수들

/**
 * 어빌리티 스톤 각인 정보 추출 함수
 * @param {string} tooltip - 어빌리티 스톤 툴팁 JSON 문자열
 * @returns {Array} - 각인 정보 배열
 */
export const getAbilityStoneEngravings = (tooltip) => {
  if (!tooltip) return [];
  
  try {
    const tooltipData = JSON.parse(tooltip);
    const engravings = [];
    
    // 모든 Element를 확인하여 어빌리티 스톤 각인 정보 찾기
    for (let i = 0; i <= 20; i++) {
      const elementKey = `Element_${String(i).padStart(3, '0')}`;
      const element = tooltipData[elementKey];
      
      if (element && element.type === 'IndentStringGroup' && element.value) {
        const elementValue = element.value.Element_000;
        if (elementValue && elementValue.contentStr) {
          // 각 contentStr Element 확인
          Object.values(elementValue.contentStr).forEach(item => {
            if (item.contentStr) {
              // [각인명] ... Lv.숫자 패턴 매칭
              const pattern = /\[<FONT[^>]*>([^<]+)<\/FONT>\].*?Lv\.(\d+)/g;
              let match;
              
              while ((match = pattern.exec(item.contentStr)) !== null) {
                const engravingName = match[1];
                const level = match[2];
                
                // 레벨이 0이 아닌 경우만 추가
                if (parseInt(level) > 0) {
                  engravings.push({
                    name: engravingName,
                    level: level,
                    fullText: item.contentStr
                  });
                }
              }
            }
          });
        }
      }
    }
    
    return engravings;
  } catch (error) {
    console.error('어빌리티 스톤 각인 파싱 에러:', error);
  }
  return [];
};

/**
 * 어빌리티 스톤 각인들을 이름별 레벨로 매핑하는 함수
 * @param {Array} equipmentData - 장비 데이터 배열
 * @returns {Object} - 각인 이름을 키로, 레벨을 값으로 하는 객체
 */
export const mapAbilityStoneEngravings = (equipmentData) => {
  if (!equipmentData) return {};
  
  const stoneEngravingsMap = {};
  
  // 어빌리티 스톤 아이템들 찾기
  const abilityStones = equipmentData.filter(item => item.Type?.includes('스톤'));
  
  abilityStones.forEach(stone => {
    const engravings = getAbilityStoneEngravings(stone.Tooltip);
    engravings.forEach(engraving => {
      // 각인 이름을 키로 하여 레벨 저장 (여러 스톤이 있을 경우 합산)
      const currentLevel = stoneEngravingsMap[engraving.name] || 0;
      stoneEngravingsMap[engraving.name] = currentLevel + parseInt(engraving.level);
    });
  });
  
  return stoneEngravingsMap;
};