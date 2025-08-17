// 엘릭서 관련 툴팁 파싱 유틸리티 함수들

/**
 * 엘릭서 연성 효과 추출 함수
 * @param {string} tooltip - 장비 툴팁 JSON 문자열
 * @returns {Array} - 엘릭서 효과 배열
 */
export const getElixirEffects = (tooltip) => {
  if (!tooltip) return [];
  
  // 엘릭서 키워드 목록 (길이 순으로 정렬하여 긴 키워드부터 매칭)
  const elixirKeywords = [
    // 기본 스탯
    '힘', '민첩', '지능', '무기 공격력', '공격력', '무력화', '마나',
    // 특수 효과
    '물약 중독', '방랑자', '생명의 축복', '탈출의 달인', '자원의 축복', '폭발물 달인', '회피의 달인',
    // 방어 스탯
    '마법 방어력', '물리 방어력', '받는 피해 감소', '최대 생명력',
    // 공격 효과
    '아군 강화', '아이덴티티 획득', '추가 피해', '치명타 피해',
    // 특수 피해
    '각성기 피해', '보스 피해', '보호막 강화', '회복 강화',
    // 연성 효과 (질서/혼돈 포함)
    '강맹', '달인', '선각자', '선봉대', '신념', '진군', '칼날 방패', '행운', '회심'
  ].sort((a, b) => b.length - a.length); // 길이 내림차순 정렬
  
  try {
    const tooltipData = JSON.parse(tooltip);
    const effects = [];
    
    // 모든 Element를 확인하여 엘릭서 정보 찾기
    for (let i = 0; i <= 20; i++) {
      const elementKey = `Element_${String(i).padStart(3, '0')}`;
      const element = tooltipData[elementKey];
      
      if (element && element.type === 'IndentStringGroup' && element.value) {
        const elementValue = element.value.Element_000;
        if (elementValue && elementValue.topStr && elementValue.topStr.includes('[엘릭서]')) {
          // 엘릭서 섹션 발견
          const contentStr = elementValue.contentStr;
          if (contentStr) {
            // 각 Element의 contentStr을 확인
            Object.values(contentStr).forEach(item => {
              if (item.contentStr) {
                // 정규식 패턴: [부위] 키워드 Lv.숫자 형태만 정확히 매칭
                const elixirPattern = /<FONT[^>]*>\[([^\]]+)\]<\/FONT>\s*([^<]+?)\s*<FONT[^>]*>Lv\.(\d+)<\/FONT>/g;
                let match;
                
                while ((match = elixirPattern.exec(item.contentStr)) !== null) {
                  const effectName = match[2].trim(); // 효과명 (힘, 공격력, 회심 (질서) 등)
                  const level = match[3];     // 레벨
                  
                  // 키워드 목록에 있는 효과만 추가
                  const isValidEffect = elixirKeywords.some(keyword => {
                    // 정확한 매칭
                    if (effectName === keyword) return true;
                    // 질서/혼돈 매칭
                    if (['강맹', '달인', '선각자', '선봉대', '신념', '진군', '칼날 방패', '행운', '회심'].includes(keyword)) {
                      return effectName === `${keyword} (질서)` || effectName === `${keyword} (혼돈)`;
                    }
                    return false;
                  });
                  
                  if (isValidEffect) {
                    effects.push({
                      name: effectName,
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
    }
    
    // 중복 제거 (같은 name+level 조합)
    const uniqueEffects = effects.filter((effect, index, self) => 
      index === self.findIndex(e => e.name === effect.name && e.level === effect.level)
    );
    
    return uniqueEffects;
  } catch (error) {
    console.error('엘릭서 효과 파싱 에러:', error);
  }
  return [];
};