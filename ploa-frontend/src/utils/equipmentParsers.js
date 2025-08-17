// 장비 관련 툴팁 파싱 유틸리티 함수들

/**
 * 상급 재련 수치 추출 함수
 * @param {string} tooltip - 장비 툴팁 JSON 문자열
 * @returns {string|null} - 재련 수치 또는 null
 */
export const getRefiningLevel = (tooltip) => {
  if (!tooltip) return null;
  
  try {
    const tooltipData = JSON.parse(tooltip);
    
    // 여러 Element를 확인하여 상급 재련 정보 찾기
    for (let i = 0; i <= 20; i++) {
      const elementKey = `Element_${String(i).padStart(3, '0')}`;
      const element = tooltipData[elementKey];
      
      if (element && element.value && typeof element.value === 'string') {
        // [상급 재련] 패턴 찾기
        const match = element.value.match(/\[상급 재련\].*?<FONT COLOR='#FFD200'>(\d+)<\/FONT>단계/);
        if (match) {
          return match[1];
        }
      }
    }
  } catch (error) {
    console.error('툴팁 파싱 에러:', error);
  }
  return null;
};

/**
 * 품질값에서 qualityValue 추출 함수
 * @param {string} tooltip - 장비 툴팁 JSON 문자열
 * @returns {number} - 품질값 (0-100)
 */
export const getQualityValue = (tooltip) => {
  if (!tooltip) return 0;
  
  try {
    const tooltipData = JSON.parse(tooltip);
    const element001 = tooltipData.Element_001;
    if (element001 && element001.value && element001.value.qualityValue !== undefined) {
      return element001.value.qualityValue;
    }
  } catch (error) {
    console.error('품질값 파싱 에러:', error);
  }
  return 0;
};

/**
 * 품질값에 따른 배경색 반환 함수
 * @param {number} quality - 품질값 (0-100)
 * @returns {string} - Tailwind CSS 클래스명
 */
export const getQualityBgColor = (quality) => {
  if (quality === 100) return 'bg-orange-500'; // 완벽 (100)
  if (quality >= 90) return 'bg-purple-500';   // 상급 (90-99)
  if (quality >= 70) return 'bg-blue-500';     // 고급 (70-89)
  if (quality >= 30) return 'bg-green-500';    // 중급 (30-69)
  if (quality >= 10) return 'bg-yellow-500';   // 하급 (10-29)
  if (quality >= 1) return 'bg-red-500';       // 최하급 (1-9)
  return 'bg-gray-500'; // 0
};

/**
 * 아이템 레벨 추출 함수
 * @param {string} tooltip - 아이템 툴팁 JSON 문자열
 * @returns {number|null} - 아이템 레벨 또는 null
 */
export const getItemLevel = (tooltip) => {
  if (!tooltip) return null;
  
  try {
    const tooltipData = JSON.parse(tooltip);
    
    // Element_001에서 leftStr2의 아이템 레벨 추출
    if (tooltipData.Element_001 && tooltipData.Element_001.value && tooltipData.Element_001.value.leftStr2) {
      const leftStr2 = tooltipData.Element_001.value.leftStr2;
      const match = leftStr2.match(/아이템 레벨 (\d+)/);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    
    // 다른 Element에서도 확인
    for (let i = 0; i <= 10; i++) {
      const elementKey = `Element_${String(i).padStart(3, '0')}`;
      const element = tooltipData[elementKey];
      
      if (element && element.value && typeof element.value === 'string') {
        const match = element.value.match(/아이템 레벨 (\d+)/);
        if (match) {
          return parseInt(match[1], 10);
        }
      }
    }
  } catch (error) {
    console.error('아이템 레벨 파싱 에러:', error);
  }
  
  return null;
};

/**
 * 초월 레벨 추출 함수
 * @param {string} tooltip - 장비 툴팁 JSON 문자열
 * @returns {string|null} - 초월 레벨 또는 null
 */
export const getTranscendenceLevel = (tooltip) => {
  if (!tooltip) return null;
  
  try {
    const tooltipData = JSON.parse(tooltip);
    
    // 여러 Element를 확인하여 초월 정보 찾기
    for (let i = 0; i <= 20; i++) {
      const elementKey = `Element_${String(i).padStart(3, '0')}`;
      const element = tooltipData[elementKey];
      
      if (element && element.value) {
        // IndentStringGroup 타입에서 topStr 확인
        if (element.type === 'IndentStringGroup' && element.value.Element_000 && element.value.Element_000.topStr) {
          const topStr = element.value.Element_000.topStr;
          if (topStr.includes('[초월]')) {
            // 다양한 패턴 시도
            let match = topStr.match(/\[초월\].*?<img[^>]*><\/img>(\d+)/);
            if (!match) {
              match = topStr.match(/\[초월\].*?<img[^>]*>(\d+)/);
            }
            if (!match) {
              match = topStr.match(/vspace\s*=\s*['"]-?\d+['"][^>]*><\/img>(\d+)/);
            }
            if (match) {
              return match[1];
            }
          }
        }
        
        // 일반 문자열에서도 확인
        if (typeof element.value === 'string') {
          const match = element.value.match(/\[초월\].*?<img[^>]*>(\d+)/);
          if (match) {
            return match[1];
          }
        }
      }
    }
  } catch (error) {
    console.error('초월 레벨 파싱 에러:', error);
  }
  return null;
};