// 보석 툴팁 파싱 관련 유틸리티 함수들

/**
 * 로스트아크 색상 코드를 Tailwind CSS 클래스로 매핑
 */
const COLOR_MAPPING = {
  // 로스트아크 기본 색상들
  '#E3C7A1': 'text-yellow-400',     // 골드/황금색 (일반적인 강조 색상)
  '#FFFFFF': 'text-white',          // 흰색 (기본 텍스트)
  '#FFFF00': 'text-yellow-300',     // 노란색 (레벨, 수치 강조)
  '#FFA500': 'text-orange-400',     // 주황색 (중요 정보)
  '#FF6B6B': 'text-red-400',        // 빨간색 (데미지, 중요 경고)
  '#6B9AFF': 'text-blue-400',       // 파란색 (쿨다운, 기능)
  '#9AFF6B': 'text-green-400',      // 초록색 (버프, 긍정 효과)
  '#FF6BFF': 'text-purple-400',     // 보라색 (특수 효과)
  '#CCCCCC': 'text-gray-300',       // 회색 (보조 텍스트)
  '#99FF99': 'text-green-300',      // 연한 초록 (각인 긍정 효과)
  '#FF9999': 'text-red-300',        // 연한 빨강 (각인 부정 효과)
  
  // 등급별 색상
  '#B45F04': 'text-orange-600',     // 고급 (초록)
  '#1E40AF': 'text-blue-600',       // 희귀 (파랑)
  '#7C3AED': 'text-purple-600',     // 영웅 (보라)
  '#EAB308': 'text-yellow-500',     // 전설 (노랑)
  '#EA580C': 'text-orange-500',     // 유물 (주황)
  '#F8FAFC': 'text-slate-100',      // 고대 (흰색)
  '#06B6D4': 'text-cyan-400',       // 에스더 (청록)
};

/**
 * HTML 태그를 Tailwind CSS 클래스로 변환
 * @param {string} htmlText - 변환할 HTML 텍스트
 * @returns {string} Tailwind CSS가 적용된 HTML
 */
export const convertHtmlToTailwind = (htmlText) => {
  if (!htmlText || typeof htmlText !== 'string') {
    return '';
  }

  let convertedText = htmlText;

  // 완전하지 않은 태그나 잘못된 형식 제거
  convertedText = convertedText.replace(/<[^>]*$/g, ''); // 끝나지 않은 태그 제거
  convertedText = convertedText.replace(/^[^<]*>/g, ''); // 시작 부분의 잘못된 태그 제거
  
  // FONT 태그 변환 (색상 포함)
  convertedText = convertedText.replace(/<FONT[^>]*COLOR=['"]([^'"]*)['"'][^>]*>/gi, (match, color) => {
    const tailwindClass = COLOR_MAPPING[color.toUpperCase()] || 'text-gray-300';
    return `<span class="${tailwindClass}">`;
  });

  // FONT 태그 닫기
  convertedText = convertedText.replace(/<\/FONT>/gi, '</span>');

  // P 태그 변환
  convertedText = convertedText.replace(/<P[^>]*ALIGN=['"]CENTER['"][^>]*>/gi, '<div class="text-center">');
  convertedText = convertedText.replace(/<P[^>]*>/gi, '<div>');
  convertedText = convertedText.replace(/<\/P>/gi, '</div>');

  // BR 태그 유지
  convertedText = convertedText.replace(/<BR\s*\/?>/gi, '<br>');

  // 기타 알려진 태그들 제거 (안전성을 위해)
  convertedText = convertedText.replace(/<\/?(?:SPAN|DIV|B|I|U)[^>]*>/gi, '');
  
  // 불완전한 태그 제거 (예: "<" 단독으로 남은 경우)
  convertedText = convertedText.replace(/<(?![a-zA-Z/])/g, '&lt;');
  convertedText = convertedText.replace(/(?<![a-zA-Z])>/g, '&gt;');

  // 연속된 공백 및 줄바꿈 정리
  convertedText = convertedText.replace(/\s+/g, ' ').trim();

  return convertedText;
};

/**
 * HTML에서 순수 텍스트만 추출
 * @param {string} htmlText - HTML 텍스트
 * @returns {string} 순수 텍스트
 */
export const extractPlainText = (htmlText) => {
  if (!htmlText || typeof htmlText !== 'string') {
    return '';
  }
  
  return htmlText
    .replace(/<[^>]*>/g, '') // 모든 HTML 태그 제거
    .replace(/&nbsp;/g, ' ') // HTML 엔티티 변환
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ') // 연속된 공백 정리
    .trim();
};

/**
 * 보석 툴팁 데이터를 파싱하여 스킬명과 효과를 추출
 * @param {string} tooltip - 보석의 툴팁 데이터 (JSON 문자열)
 * @param {Object} gem - 보석 전체 데이터 (Description, Option 포함)
 * @returns {Object} 파싱된 보석 정보
 */
export const parseGemTooltip = (tooltip, gem = null) => {
  try {
    // 기본 구조 초기화
    const result = {
      skillName: '',
      skillNameHtml: '',
      skillIcon: '',
      effects: [],
      effectsHtml: [],
      gemType: 'unknown',
      level: 0,
      jobClass: '',
      isValid: false
    };

    if (!tooltip) {
      return result;
    }

    // JSON 파싱 시도
    let tooltipData;
    try {
      tooltipData = JSON.parse(tooltip);
    } catch (jsonError) {
      console.warn('보석 툴팁 JSON 파싱 실패:', jsonError);
      return result;
    }

    // 전체 구조 로그 (디버깅용)
    if (import.meta.env?.DEV) {
      console.log('보석 툴팁 전체 구조:', tooltipData);
      console.log('Element 키들:', Object.keys(tooltipData));
    }

    // 모든 Element들을 순회하며 보석 효과 찾기
    let effectText = null;
    let foundElement = null;
    
    for (const [key, element] of Object.entries(tooltipData)) {
      if (key.startsWith('Element_') && element && element.type === 'ItemPartBox' && element.value) {
        // Element_001을 찾아보기
        if (element.value.Element_001 && typeof element.value.Element_001 === 'string') {
          const text = element.value.Element_001;
          // 직업명과 스킬명이 포함된 텍스트 찾기 (지원 효과 포함)
          if (text.includes('[') && text.includes(']') && (text.includes('피해') || text.includes('재사용') || text.includes('지원 효과'))) {
            effectText = text;
            foundElement = key;
            if (import.meta.env?.DEV) {
              console.log(`보석 효과 발견 - ${key}:`, text);
            }
            break;
          }
        }
      }
    }

    // IndentStringGroup 타입 처리 (세레나데 등 지원 보석)
    if (!effectText) {
      for (const [key, element] of Object.entries(tooltipData)) {
        if (key.startsWith('Element_') && element && element.type === 'IndentStringGroup' && element.value) {
          // Element_000.contentStr에서 스킬명들 찾기
          if (element.value.Element_000 && element.value.Element_000.contentStr) {
            const contentStr = element.value.Element_000.contentStr;
            let skillNames = [];
            
            // contentStr의 모든 Element에서 스킬명 추출
            for (const [subKey, subElement] of Object.entries(contentStr)) {
              if (subKey.startsWith('Element_') && subElement && subElement.contentStr) {
                const skillText = extractPlainText(subElement.contentStr);
                if (skillText.includes('[') && skillText.includes(']')) {
                  skillNames.push(skillText);
                }
              }
            }
            
            if (skillNames.length > 0) {
              // 세레나데 등 지원 스킬로 인식 - 별도 처리
              result.jobClass = '세레나데';
              result.skillName = skillNames.length > 1 ? '세레나데' : skillNames[0].replace(/^\[[^\]]+\]\s*/, '');
              result.gemType = 'damage'; // 지원 보석을 피해 타입으로 분류
              
              // Description과 Option에서 효과 추출
              const effectsSet = new Set();
              
              if (gem) {
                // Description에서 지원 효과 추출 (["지원 효과 6.00 % 증가"])
                if (gem.Description && Array.isArray(gem.Description)) {
                  gem.Description.forEach(desc => {
                    if (desc.includes('지원 효과')) {
                      effectsSet.add(desc.trim());
                    }
                  });
                }
                
                // Option에서 기본 공격력 효과 추출 ("기본 공격력 0.45% 증가")
                if (gem.Option && gem.Option.includes('기본 공격력')) {
                  effectsSet.add(gem.Option.trim());
                }
              }
              
              // 효과를 result에 설정
              result.effects = Array.from(effectsSet);
              result.isValid = true;
              
              if (import.meta.env?.DEV) {
                console.log(`지원 보석 효과 발견 - ${key}:`, skillNames, result.effects);
              }
              
              // 기존 로직을 건너뛰기 위해 특별 처리
              return result;
            }
          }
        }
      }
    }

    if (effectText && typeof effectText === 'string') {
      // HTML 태그 제거하여 순수 텍스트 추출
      const plainText = extractPlainText(effectText);
      
      if (plainText) {
        // 직업명 추출 (대괄호 안)
        const jobMatch = plainText.match(/\[([^\]]+)\]/);
        if (jobMatch) {
          result.jobClass = jobMatch[1];
        }
        
        // 스킬명 추출 (직업명 다음부터 "피해", "재사용", 또는 "지원 효과" 전까지)
        if (result.jobClass) {
          const afterJob = plainText.substring(plainText.indexOf(']') + 1).trim();
          const beforeEffect = afterJob.split(/\s*(피해|재사용|지원\s*효과)/)[0].trim();
          result.skillName = beforeEffect;
        }
        
        // 모든 효과 추출 (주 효과 + 추가 효과) - 중복 제거
        const effectsSet = new Set(); // 중복 제거를 위한 Set
        
        // 피해 증가 효과
        const damageMatches = plainText.matchAll(/피해\s*([\d.]+)%\s*증가/g);
        for (const match of damageMatches) {
          const percentage = parseFloat(match[1]);
          result.gemType = 'damage';
          effectsSet.add(`피해 ${percentage}% 증가`);
        }
        
        // 재사용 대기시간 감소 효과
        const cooldownMatches = plainText.matchAll(/재사용\s*대기시간\s*([\d.]+)%\s*감소/g);
        for (const match of cooldownMatches) {
          const percentage = parseFloat(match[1]);
          result.gemType = 'cooldown';
          effectsSet.add(`재사용 대기시간 ${percentage}% 감소`);
        }
        
        // 지원 효과 증가 (세레나데 등 지원 스킬)
        const supportMatches = plainText.matchAll(/지원\s*효과\s*([\d.]+)\s*%\s*증가/g);
        for (const match of supportMatches) {
          const percentage = parseFloat(match[1]);
          result.gemType = 'damage'; // 지원 효과를 피해 타입으로 분류
          effectsSet.add(`지원 효과 ${percentage}% 증가`);
        }
        
        // 기본 공격력 증가 효과 (우선 처리)
        const basicAttackMatches = plainText.matchAll(/기본\s*공격력\s*([\d.]+)%\s*증가/g);
        for (const match of basicAttackMatches) {
          const percentage = parseFloat(match[1]);
          effectsSet.add(`기본 공격력 ${percentage}% 증가`);
        }
        
        // 일반 공격력 증가 효과 (기본 공격력이 없는 경우만)
        if (!Array.from(effectsSet).some(effect => effect.includes('기본 공격력'))) {
          const attackMatches = plainText.matchAll(/(?<!기본\s*)공격력\s*([\d.]+)%\s*증가/g);
          for (const match of attackMatches) {
            const percentage = parseFloat(match[1]);
            effectsSet.add(`공격력 ${percentage}% 증가`);
          }
        }
        
        // Set을 배열로 변환
        result.effects = Array.from(effectsSet);
        
        // HTML 버전 저장 (색상 정보 포함)
        const convertedHtml = convertHtmlToTailwind(effectText);
        result.skillNameHtml = convertedHtml;
        result.effectsHtml.push(convertedHtml);
        
        result.isValid = !!(result.skillName && result.jobClass && result.effects.length > 0);
        
        if (import.meta.env?.DEV) {
          console.log('파싱 결과:', {
            jobClass: result.jobClass,
            skillName: result.skillName,
            effects: result.effects,
            isValid: result.isValid,
            htmlVersion: convertedHtml
          });
        }
      }
    }
    
    // 파싱 실패 시 로깅 (개발 환경에서만)
    if (!result.isValid && import.meta.env?.DEV) {
      console.warn('보석 툴팁 파싱 실패:', { 
        foundElement,
        effectText: effectText || 'Not found'
      });
    }

    // 보석 타입 분류 (효과 내용을 기반으로)
    if (result.effects.length > 0) {
      const effectTextStr = result.effects.join(' ');
      if (effectTextStr.includes('피해') && effectTextStr.includes('증가')) {
        result.gemType = 'damage';
      } else if (effectTextStr.includes('쿨타임') && effectTextStr.includes('감소')) {
        result.gemType = 'cooldown';
      }
    }

    // 유효성 검사
    result.isValid = !!(result.skillName || result.effects.length > 0);

    return result;
  } catch (error) {
    console.error('보석 툴팁 파싱 중 오류 발생:', error);
    return {
      skillName: '',
      skillNameHtml: '',
      skillIcon: '',
      effects: [],
      effectsHtml: [],
      gemType: 'unknown',
      level: 0,
      jobClass: '',
      isValid: false
    };
  }
};

/**
 * 보석 효과 텍스트를 짧게 요약
 * @param {Array} effects - 효과 배열
 * @returns {string} 요약된 효과 문자열
 */
export const summarizeGemEffects = (effects) => {
  if (!effects || effects.length === 0) {
    return '';
  }
  
  const summaries = effects.map(effect => {
    // 피해 증가 패턴 (예: "피해 44.00% 증가")
    const damageMatch = effect.match(/피해\s*(\d+(?:\.\d+)?)%\s*증가/);
    if (damageMatch) {
      return `피해 +${damageMatch[1]}%`;
    }
    
    // 쿨타임 감소 패턴 (예: "쿨타임 12.0% 감소")
    const cooldownMatch = effect.match(/쿨타임\s*(\d+(?:\.\d+)?)%\s*감소/);
    if (cooldownMatch) {
      return `쿨감 -${cooldownMatch[1]}%`;
    }
    
    // 기능 공격력 증가 패턴
    const funcPowerMatch = effect.match(/기능\s*공격력\s*(\d+(?:\.\d+)?)%\s*증가/);
    if (funcPowerMatch) {
      return `기공 +${funcPowerMatch[1]}%`;
    }
    
    // 기타 효과는 원본 반환 (최대 20자)
    return effect.length > 20 ? effect.substring(0, 20) + '...' : effect;
  });
  
  return summaries.join(', ');
};

/**
 * 간소화된 보석 툴팁 생성 (축소 모드용)
 * @param {Object} gemData - 파싱된 보석 데이터
 * @param {boolean} includeHtml - HTML 스타일링 포함 여부
 * @returns {string} 간소화된 툴팁 문자열
 */
export const generateSimpleGemTooltip = (gemData, includeHtml = false, gemName = '') => {
  // 파싱이 성공한 경우 확대 모드와 동일한 표기 방식 사용
  if (gemData.hasTooltipData && gemData.skillName && gemData.effects.length > 0) {
    if (includeHtml) {
      return `<span class="text-yellow-400">${gemData.skillName}</span> <span class="text-white">${gemData.effects.join(', ')}</span>`;
    }
    return `${gemData.skillName} ${gemData.effects.join(', ')}`;
  }
  
  // 파싱이 실패한 경우 폴백 로직
  if (gemName) {
    // 보석명에서 HTML 태그 제거하여 표시
    const cleanName = extractPlainText(gemName);
    if (includeHtml) {
      return `<span class="text-white">${cleanName}</span>`;
    }
    return cleanName;
  }
  
  // 최후의 폴백
  if (includeHtml) {
    return '<span class="text-gray-400">보석 정보 없음</span>';
  }
  return '보석 정보 없음';
};

/**
 * 파싱된 보석 데이터에서 툴팁용 상세 정보 생성 (HTML 스타일링 포함)
 * @param {Object} gemData - 파싱된 보석 데이터
 * @param {string} gemName - 보석명
 * @returns {string} 툴팁용 HTML 문자열
 */
export const generateGemTooltipContent = (gemData, gemName) => {
  if (!gemData.isValid) {
    return `<div class="text-white font-medium">${gemName}</div>`;
  }
  
  // 간소화된 툴팁 사용
  const simpleTooltip = generateSimpleGemTooltip(gemData);
  if (simpleTooltip) {
    return `<div class="text-white font-medium">${simpleTooltip}</div>`;
  }
  
  // 폴백: 기본 정보 표시
  let content = '';
  
  if (gemData.skillName) {
    content += `<div class="text-white font-medium mb-1">${gemData.skillName}</div>`;
  }
  
  if (gemData.effects.length > 0) {
    content += '<div class="text-gray-300 text-sm mt-1">';
    gemData.effects.forEach(effect => {
      content += `<div>${effect}</div>`;
    });
    content += '</div>';
  }
  
  return content || `<div class="text-white font-medium">${gemName}</div>`;
};