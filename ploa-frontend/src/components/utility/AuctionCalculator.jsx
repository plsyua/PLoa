import { useState } from 'react';
import { Calculator, Users, DollarSign, TrendingUp } from 'lucide-react';

const AuctionCalculator = () => {
  const [itemValue, setItemValue] = useState('');
  const [partySize, setPartySize] = useState(8);
  const [results, setResults] = useState(null);

  const calculateAuction = () => {
    if (!itemValue || itemValue <= 0) return;

    const value = parseInt(itemValue);
    const goldPerPerson = Math.floor(value / partySize);
    const remainder = value % partySize;
    const winnerPays = goldPerPerson * (partySize - 1);
    const profitPerPerson = goldPerPerson - (value - winnerPays) / partySize;

    setResults({
      itemValue: value,
      goldPerPerson,
      remainder,
      winnerPays,
      profitPerPerson: Math.floor(profitPerPerson)
    });
  };

  return (
    <div className="space-y-6">
      {/* 계산기 헤더 */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <Calculator size={32} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          경매 계산기
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          아이템 경매에서 최적의 분배 금액을 계산합니다
        </p>
      </div>

      {/* 입력 폼 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 아이템 가치 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              최근 거래가
            </label>
            <input
              type="number"
              value={itemValue}
              onChange={(e) => setItemValue(e.target.value)}
              placeholder="금액 입력"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 파티 인원 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Users size={16} className="inline mr-2" />
              파티 인원
            </label>
            <div className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 flex overflow-hidden">
              <button
                type="button"
                onClick={() => setPartySize(4)}
                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                  partySize === 4
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                4명
              </button>
              <div className="w-px bg-gray-300 dark:bg-gray-600"></div>
              <button
                type="button"
                onClick={() => setPartySize(8)}
                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                  partySize === 8
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                8명
              </button>
              <div className="w-px bg-gray-300 dark:bg-gray-600"></div>
              <button
                type="button"
                onClick={() => setPartySize(16)}
                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                  partySize === 16
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                16명
              </button>
            </div>
          </div>
        </div>

        {/* 계산 버튼 */}
        <div className="mt-6">
          <button
            onClick={calculateAuction}
            disabled={!itemValue || itemValue <= 0}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <TrendingUp size={20} />
            경매 계산하기
          </button>
        </div>
      </div>

      {/* 결과 표시 */}
      {results && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            계산 결과
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">입찰 금액</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {results.winnerPays.toLocaleString()}G
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">1인당 분배 금액</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {results.goldPerPerson.toLocaleString()}G
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 <strong>설명:</strong> 낙찰자는 {results.winnerPays.toLocaleString()}G를 지불하고, 
              나머지 {partySize - 1}명은 각각 {results.goldPerPerson.toLocaleString()}G를 받습니다.
              {results.remainder > 0 && ` (나머지 ${results.remainder}G는 별도 처리)`}
            </p>
          </div>
        </div>
      )}

      {/* 사용법 안내 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📖 사용법
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>• 경매에서 낙찰받을 아이템의 시세를 입력하세요</li>
          <li>• 파티 인원 수를 선택하세요</li>
          <li>• 계산 결과에 따라 골드를 분배하세요</li>
          <li>• 낙찰자는 표시된 금액을 지불하고, 나머지 파티원은 분배금을 받습니다</li>
        </ul>
      </div>
    </div>
  );
};

export default AuctionCalculator;