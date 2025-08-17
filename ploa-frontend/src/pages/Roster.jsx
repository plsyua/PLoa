import { useState, useEffect } from 'react';
import { User, Crown, Trophy, Star, Gem } from 'lucide-react';

// 서버 목록 정의
const SERVERS = [
  '루페온', '실리안', '아만', '카마인', '카제로스', '아브렐슈드', '카단', '니나브'
];

// 임시 캐릭터 데이터 (실제로는 API에서 가져올 예정)
const MOCK_CHARACTERS = [
  { 
    server: '실리안', 
    name: '졸숙아', 
    class: '창술사', 
    level: 'Lv.70', 
    itemLevel: '1700.00', 
    guild: '꼴북',
    icon: '/icons/lancemaster.png' // 실제 아이콘 경로
  },
  { 
    server: '실리안', 
    name: '과일빙', 
    class: '창술사', 
    level: 'Lv.70', 
    itemLevel: '1702.50', 
    guild: '꼴북',
    icon: '/icons/lancemaster.png'
  },
  { 
    server: '실리안', 
    name: '과일상', 
    class: '창술사', 
    level: 'Lv.70', 
    itemLevel: '1700.83', 
    guild: '꼴북',
    icon: '/icons/lancemaster.png'
  },
  { 
    server: '실리안', 
    name: '승용', 
    class: '화수', 
    level: 'Lv.70', 
    itemLevel: '1682.50', 
    guild: '꼴북',
    icon: '/icons/summoner.png'
  }
];

const Roster = () => {
  const [characters, setCharacters] = useState([]);
  const [weeklyGold] = useState(548000); // 임시 값
  const [loading] = useState(false);

  useEffect(() => {
    // 임시 데이터 로드
    setCharacters(MOCK_CHARACTERS);
  }, []);

  // 서버별 캐릭터 그룹화
  const charactersByServer = characters.reduce((acc, character) => {
    if (!acc[character.server]) {
      acc[character.server] = [];
    }
    acc[character.server].push(character);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 주간 골드 획득량 헤더 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h1 className="text-2xl font-bold text-white">원정대</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-300">주간 골드 획득량:</span>
              <span className="text-yellow-500 font-bold text-xl">
                {weeklyGold.toLocaleString()} G
              </span>
              <span className="text-gray-400">(임시)</span>
            </div>
          </div>
        </div>

        {/* 서버별 캐릭터 목록 */}
        <div className="space-y-6">
          {SERVERS.map(server => {
            const serverCharacters = charactersByServer[server];
            
            // 해당 서버에 캐릭터가 없으면 표시하지 않음
            if (!serverCharacters || serverCharacters.length === 0) {
              return null;
            }

            return (
              <div key={server} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">{server}</h2>
                  <span className="text-blue-400">보유 캐릭터 {serverCharacters.length}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {serverCharacters.map((character, index) => (
                    <div 
                      key={`${character.server}-${character.name}-${index}`}
                      className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* 캐릭터 아이콘 */}
                        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center border border-gray-500">
                          <User className="w-6 h-6 text-gray-300" />
                        </div>
                        
                        {/* 캐릭터 정보 */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">{character.level}</span>
                            <span className="text-blue-400 font-medium">{character.class}</span>
                          </div>
                          <div className="text-lg font-bold text-white mb-1">
                            {character.name}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Gem className="w-4 h-4 text-yellow-500" />
                            <span className="text-yellow-500 font-medium">
                              {character.itemLevel}
                            </span>
                          </div>
                          {character.guild && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-purple-400" />
                              <span className="text-purple-400 text-sm">
                                {character.guild}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 캐릭터가 없을 때 */}
        {characters.length === 0 && !loading && (
          <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
            <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">등록된 캐릭터가 없습니다.</p>
            <p className="text-gray-500 text-sm mt-2">
              캐릭터를 추가하여 원정대를 관리해보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roster;