import { useState } from 'react';
import Header from '../components/layout/Header';
import AuctionCalculator from '../components/utility/AuctionCalculator';
import RandomPicker from '../components/utility/RandomPicker';
import Roulette from '../components/utility/Roulette';
import { Calculator, Gift, RotateCw } from 'lucide-react';

const Utility = () => {
  const [activeTab, setActiveTab] = useState('auction');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            유틸리티
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            로스트아크 플레이에 도움이 되는 다양한 도구들을 제공합니다.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('auction')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'auction'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Calculator size={16} />
              경매 계산기
            </button>
            <button
              onClick={() => setActiveTab('random')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'random'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Gift size={16} />
              제비뽑기
            </button>
            <button
              onClick={() => setActiveTab('roulette')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'roulette'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <RotateCw size={16} />
              룰렛
            </button>
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div>
          {activeTab === 'auction' && <AuctionCalculator />}
          {activeTab === 'random' && <RandomPicker />}
          {activeTab === 'roulette' && <Roulette />}
        </div>
      </div>
    </div>
  );
};

export default Utility;