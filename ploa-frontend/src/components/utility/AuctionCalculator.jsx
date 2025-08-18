import { useState, useEffect, useCallback } from 'react';
import { Calculator, Users } from 'lucide-react';

const AuctionCalculator = () => {
  const [itemValue, setItemValue] = useState('');
  const [partySize, setPartySize] = useState(8);
  const [results, setResults] = useState(null);

  const calculateAuction = useCallback(() => {
    if (!itemValue || itemValue <= 0) return;

    const value = parseInt(itemValue);
    
    // 손익분기점 계산: 입찰자 이득 = 다른 사람들 이득이 되는 지점
    // (아이템가치 × 0.95) - 입찰가 = 입찰가 × 0.95 ÷ (파티원수 - 1)
    // 풀이: breakEvenBid = (value * 0.95) / (1 + 0.95 / (partySize - 1))
    const breakEvenPoint = Math.floor((value * 0.95) / (1 + (0.95 / (partySize - 1))));
    
    // 최대 실용 입찰가: 다른 사람들이 상회 입찰할 유인이 없는 최대 입찰가
    // 조건: (아이템시세 × 0.95) - (입찰가×1.1) ≤ (입찰가 × 0.95) ÷ (파티원수-1)
    // 정리: 입찰가 × (1.1 + 0.95/(파티원수-1)) ≤ 아이템시세 × 0.95
    // 입찰가 ≤ (아이템시세 × 0.95) / (1.1 + 0.95/(파티원수-1))
    const maxPracticalBid = Math.floor((value * 0.95) / (1.1 + (0.95 / (partySize - 1))));
    
    // 손익분기점 기준 상대적 비율 (유리한 옵션만)
    const bidMargins = [0, -5, -10, -15, -20]; // 손익분기점 대비 %
    
    const allBidOptions = bidMargins.map(margin => {
      const bidAmount = Math.floor(breakEvenPoint * (1 + margin / 100));
      
      // 분배금 = 입찰가 × 0.95 ÷ (파티원수 - 1) - 입찰자는 분배금 못 받음
      const distributionPerPerson = Math.floor((bidAmount * 0.95) / (partySize - 1));
      
      // 판매차익 = (아이템가치 × 0.95) - 입찰가 (판매 시 5% 수수료 제외)
      const saleProfit = Math.floor(value * 0.95) - bidAmount;
      
      // 상대적 이득 = 판매차익 - 분배금 (다른 사람들 대비 얼마나 더/덜 받는지)
      const relativeAdvantage = saleProfit - distributionPerPerson;
      
      return {
        margin,
        bidAmount,
        distributionPerPerson,
        saleProfit,
        relativeAdvantage,
        saleCommission: Math.floor(value * 0.05) // 판매 수수료
      };
    });

    // 10% 상회 입찰 제한을 만족하는 옵션만 필터링
    const bidOptions = allBidOptions.filter(option => option.bidAmount <= maxPracticalBid);

    setResults({
      itemValue: value,
      bidOptions,
      breakEvenPoint,
      maxPracticalBid
    });
  }, [itemValue, partySize]);

  // 아이템 시세 입력 및 파티 인원 변경 시 자동 계산
  useEffect(() => {
    if (itemValue >= 50) {
      calculateAuction();
    } else {
      setResults(null); // 50골드 미만일 때는 결과 숨김
    }
  }, [itemValue, partySize, calculateAuction]);

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
          입찰 시 손익분기점, 안전 입찰가를 계산합니다
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
              min="0"
              step="1"
              value={itemValue}
              onChange={(e) => setItemValue(e.target.value)}
              placeholder="50골드 이상 입력"
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

      </div>

      {/* 결과 표시 */}
      {results && (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              계산 결과
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">최근 거래가</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {results.itemValue.toLocaleString()}G
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">판매 수수료 (5%)</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  -{results.bidOptions[0].saleCommission.toLocaleString()}G
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">손익분기점</div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {results.breakEvenPoint.toLocaleString()}G
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">안전 입찰가</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {results.maxPracticalBid.toLocaleString()}G
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 사용법 안내 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📖 사용법
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>• 경매할 아이템의 현재 시세를 입력하세요</li>
          <li>• 파티 인원 수를 선택하세요 (4명/8명/16명)</li>
          <li>• 손익분기점 이상 입찰 시 다른 사람들보다 손해를 봅니다</li>
        </ul>
      </div>
    </div>
  );
};

export default AuctionCalculator;