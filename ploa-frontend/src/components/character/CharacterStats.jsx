import React from 'react';
import { parseCharacterStats, formatStatValue } from '../../utils/statsParsers';

// 캐릭터 스탯 표시 컴포넌트
const CharacterStats = ({ characterData }) => {
  // 스탯 데이터가 없으면 렌더링하지 않음
  if (!characterData?.Stats || !Array.isArray(characterData.Stats)) {
    return null;
  }

  // 표시할 스탯 필터링
  const filteredStats = parseCharacterStats(characterData.Stats);

  // 표시할 스탯이 없으면 렌더링하지 않음
  if (filteredStats.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-400/50">
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        {filteredStats.map((stat, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-400">{stat.Type}</span>
            <span className="text-white font-medium">{formatStatValue(stat.Value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterStats;