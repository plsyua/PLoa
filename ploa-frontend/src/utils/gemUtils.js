// 보석 관련 유틸리티 함수들
import { parseGemTooltip } from './gemParsers';

// 보석 이름에서 주요 키워드 추출
export const extractGemKeyword = (gemName) => {
  if (!gemName) return '';
  
  // "n레벨 ㅇㅇ의 보석" 형태에서 키워드 추출
  const gemNamePattern = /(\d+)레벨\s*(.+?)의?\s*보석/;
  const match = gemName.match(gemNamePattern);
  
  if (match && match[2]) {
    const gemTypeName = match[2].trim().replace(/\s*\([^)]*\).*$/, '');
    
    // 일반적인 보석 키워드 매핑
    const keywordMap = {
      // 겁화 (데미지)
      '겁화': '겁',
      '겁': '겁',
      
      // 작열 (쿨감)
      '작열': '작',
      '작': '작',

      // 멸화 (데미지)
      '멸화': '멸',
      '멸': '멸',    
      
      // 홍염 (쿨감)
      '홍염': '홍',
      '홍': '홍',
      
      // 기타 보석들
      '광휘': '광',
      '정기': '정',
      '풍요': '풍',
      '우명': '우',
      '진군': '진',
      '열정': '열'
    };
    
    // 정확한 매칭 먼저 시도
    if (keywordMap[gemTypeName]) {
      return keywordMap[gemTypeName];
    }
    
    // 부분 매칭 시도
    for (const [keyword, abbreviation] of Object.entries(keywordMap)) {
      if (gemTypeName.includes(keyword)) {
        return abbreviation;
      }
    }
    
    // 매핑되지 않은 경우 보석 타입명의 첫 글자 반환
    return gemTypeName.charAt(0);
  }
  
  // 기존 방식으로 폴백
  const keywordMap = {
    '겁화': '겁', '겁': '겁',
    '작열': '작', '작': '작',
    '멸화': '멸', '멸': '멸',    
    '홍염': '홍', '홍': '홍'
  };
  
  for (const [keyword, abbreviation] of Object.entries(keywordMap)) {
    if (gemName.includes(keyword)) {
      return abbreviation;
    }
  }
  
  // 최후의 폴백
  return gemName.charAt(0);
};

// 보석 이름에서 전체 종류명 추출 (확대 모드용)
export const extractGemTypeName = (gemName) => {
  if (!gemName) return '';
  
  // "n레벨 ㅇㅇ의 보석" 형태에서 전체 종류명 추출
  const gemNamePattern = /(\d+)레벨\s*(.+?)의?\s*보석/;
  const match = gemName.match(gemNamePattern);
  
  if (match && match[2]) {
    return match[2].trim().replace(/\s*\([^)]*\).*$/, ''); // 멸화, 겁화, 작열, 광휘 등
  }
  
  // 폴백: 알려진 보석 타입 찾기
  const gemTypes = ['겁화', '멸화', '작열', '홍염', '광휘', '정기', '풍요', '우명', '진군', '열정'];
  for (const type of gemTypes) {
    if (gemName.includes(type)) {
      return type;
    }
  }
  
  return '';
};

// 보석 이름에서 레벨 추출
export const extractGemLevel = (gemName) => {
  if (!gemName) return 0;
  
  const levelPattern = /(\d+)레벨/;
  const match = gemName.match(levelPattern);
  
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  return 0;
};

// 보석 타입 분류 (데미지/쿨다운)
export const getGemType = (gemName) => {
  if (!gemName) return 'unknown';
  
  const damageKeywords = ['겁화', '멸화'];
  const cooldownKeywords = ['작열', '홍염'];
  
  for (const keyword of damageKeywords) {
    if (gemName.includes(keyword)) {
      return 'damage';
    }
  }
  
  for (const keyword of cooldownKeywords) {
    if (gemName.includes(keyword)) {
      return 'cooldown';
    }
  }
  
  return 'unknown';
};

// 보석 타입별 색상
export const getGemTypeColor = (type) => {
  switch (type) {
    case 'damage':
      return 'text-red-400 bg-red-900/30';
    case 'cooldown':
      return 'text-blue-400 bg-blue-900/30';
    default:
      return 'text-gray-400 bg-gray-900/30';
  }
};

// 보석 타입별 테두리 색상
export const getGemTypeBorderColor = (type) => {
  switch (type) {
    case 'damage':
      return 'border-red-400';
    case 'cooldown':
      return 'border-blue-400';
    default:
      return 'border-gray-400';
  }
};

/**
 * 툴팁 데이터를 활용한 개선된 보석 키워드 추출
 * @param {string} gemName - 보석명
 * @param {string} tooltip - 보석 툴팁 데이터
 * @returns {string} 추출된 키워드
 */
export const extractGemKeywordFromTooltip = (gemName, tooltip, gem = null) => {
  const parsedData = parseGemTooltip(tooltip, gem);
  
  // 툴팁에서 스킬명을 추출한 경우 스킬명의 첫 글자들 사용
  if (parsedData.isValid && parsedData.skillName) {
    // 스킬명이 2글자 이상인 경우 첫 2글자, 아니면 첫 글자
    return parsedData.skillName.length >= 2 
      ? parsedData.skillName.substring(0, 2)
      : parsedData.skillName.charAt(0);
  }
  
  // 툴팁 파싱이 실패한 경우 기존 방식 사용
  return extractGemKeyword(gemName);
};

/**
 * 툴팁 데이터를 활용한 개선된 보석 타입 분류
 * @param {string} gemName - 보석명
 * @param {string} tooltip - 보석 툴팁 데이터
 * @returns {string} 보석 타입 ('damage', 'cooldown', 'unknown')
 */
export const getGemTypeFromTooltip = (gemName, tooltip, gem = null) => {
  const parsedData = parseGemTooltip(tooltip, gem);
  
  // 툴팁에서 타입을 정확히 분류한 경우
  if (parsedData.isValid && parsedData.gemType !== 'unknown') {
    return parsedData.gemType;
  }
  
  // 지원 효과 보석 폴백 처리
  if (gem && gem.Description && Array.isArray(gem.Description)) {
    const hasSupport = gem.Description.some(desc => desc.includes('지원 효과'));
    if (hasSupport) {
      return 'damage'; // 지원 효과 → 피해 분류
    }
  }
  
  // 툴팁 파싱이 실패한 경우 기존 방식 사용
  return getGemType(gemName);
};

/**
 * 보석 데이터에서 표시용 정보 추출
 * @param {Object} gem - 보석 객체 (Name, Icon, Level, Tooltip 포함)
 * @returns {Object} 표시용 보석 정보
 */
export const getGemDisplayInfo = (gem) => {
  if (!gem) {
    return {
      name: '',
      keyword: '',
      skillName: '',
      skillNameHtml: '',
      effects: [],
      effectsHtml: [],
      type: 'unknown',
      typeColor: 'text-gray-400 bg-gray-900/30',
      level: 0,
      hasTooltipData: false
    };
  }
  
  const parsedData = parseGemTooltip(gem.Tooltip, gem);
  const gemType = getGemTypeFromTooltip(gem.Name, gem.Tooltip, gem);
  const keyword = extractGemKeywordFromTooltip(gem.Name, gem.Tooltip, gem);
  
  // 레벨은 이름에서 추출하거나 API Level 속성 사용
  const level = extractGemLevel(gem.Name) || gem.Level || 0;
  
  // 키워드만 표시 (예: "멸", "광")
  const levelKeyword = keyword || (level > 0 ? `${level}급` : '');
  
  return {
    name: gem.Name || '',
    keyword,
    gemTypeName: extractGemTypeName(gem.Name), // 멸화, 겁화, 작열, 광휘 등
    skillName: parsedData.skillName || '',
    skillNameHtml: parsedData.skillNameHtml || '',
    effects: parsedData.effects || [],
    effectsHtml: parsedData.effectsHtml || [],
    jobClass: parsedData.jobClass || '',
    type: gemType,
    typeColor: getGemTypeColor(gemType),
    level,
    levelKeyword, // "멸", "광" 형태 (키워드만)
    hasTooltipData: parsedData.isValid
  };
};

/**
 * 보석 배열에서 통계 정보를 계산
 * @param {Array} gems - 보석 배열
 * @returns {Object} 보석 통계 정보
 */
export const calculateGemStats = (gems) => {
  if (!gems || gems.length === 0) {
    return {
      damageCount: 0,
      cooldownCount: 0,
      totalBasicAttack: 0,
      damageGems: [],
      cooldownGems: [],
      otherGems: []
    };
  }

  let damageCount = 0;
  let cooldownCount = 0;
  let totalBasicAttack = 0;
  const damageGems = [];
  const cooldownGems = [];
  const otherGems = [];

  gems.forEach(gem => {
    const gemInfo = getGemDisplayInfo(gem);
    
    // 피해/쿨감 타입별 분류 및 개수 계산
    if (gemInfo.type === 'damage') {
      damageCount++;
      damageGems.push(gem);
    } else if (gemInfo.type === 'cooldown') {
      cooldownCount++;
      cooldownGems.push(gem);
    } else {
      otherGems.push(gem);
    }
    
    // 기본 공격력 효과 합산
    if (gemInfo.effects && gemInfo.effects.length > 0) {
      gemInfo.effects.forEach(effect => {
        const basicAttackMatch = effect.match(/기본\s*공격력\s*([\d.]+)%\s*증가/);
        if (basicAttackMatch) {
          totalBasicAttack += parseFloat(basicAttackMatch[1]);
        }
      });
    }
  });

  return {
    damageCount,
    cooldownCount,
    totalBasicAttack: Math.round(totalBasicAttack * 100) / 100, // 소수점 2자리까지
    damageGems,
    cooldownGems,
    otherGems
  };
};