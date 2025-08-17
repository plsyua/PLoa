// 아크 패시브 관련 툴팁 파싱 유틸리티 함수들

/**
 * 아크 패시브 설명 파싱 함수
 * @param {string} description - 아크 패시브 설명
 * @returns {string} - 파싱된 설명 (티어와 스킬 정보)
 */
export const parseArkPassiveDescription = (description) => {
  if (!description) return '';
  // Description에서 티어와 스킬 정보 추출
  const tierMatch = description.match(/(\d+)티어/);
  const skillMatch = description.match(/<FONT[^>]*>([^<]+)<\/FONT>(?!.*티어)/);
  
  let result = '';
  if (tierMatch) result += `T${tierMatch[1]} `;
  if (skillMatch) result += skillMatch[1];
  
  return result.trim();
};

/**
 * 아크 패시브 포인트 색상 반환
 * @param {string} name - 포인트명
 * @returns {string} - Tailwind CSS 클래스명
 */
export const getArkPassivePointColor = (name) => {
  if (name.includes('진화')) return 'bg-orange-600 text-orange-100';
  if (name.includes('깨달음')) return 'bg-blue-600 text-blue-100';
  if (name.includes('도약')) return 'bg-green-600 text-green-100';
  return 'bg-purple-600 text-purple-100';
};

/**
 * 아크 패시브 포인트 레벨 추출
 * @param {string} description - 포인트 설명
 * @returns {string} - 랭크와 레벨 정보
 */
export const getArkPassivePointLevel = (description) => {
  // Description에서 랭크와 레벨 정보 추출
  if (!description) return '';
  const match = description.match(/(\d+)랭크\s*(\d+)레벨/);
  return match ? `${match[1]}랭크 ${match[2]}레벨` : '';
};