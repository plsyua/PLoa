import { useState } from 'react';
import Header from '../components/layout/Header';
import AuctionCalculator from '../components/utility/AuctionCalculator';
import RandomPicker from '../components/utility/RandomPicker';
import { Calculator, Gift } from 'lucide-react';

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
          <nav className="flex gap-4 justify-start py-6">
            <button
              onClick={() => setActiveTab('auction')}
              className={`py-3 px-6 rounded-lg font-semibold text-base flex items-center gap-3 transition-all duration-200 shadow-sm border-2 ${
                activeTab === 'auction'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md'
              }`}
            >
              <Calculator size={20} />
              경매 계산기
            </button>
            <button
              onClick={() => setActiveTab('random')}
              className={`py-3 px-6 rounded-lg font-semibold text-base flex items-center gap-3 transition-all duration-200 shadow-sm border-2 ${
                activeTab === 'random'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md'
              }`}
            >
              <Gift size={20} />
              제비뽑기
            </button>
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div>
          {activeTab === 'auction' && <AuctionCalculator />}
          {activeTab === 'random' && <RandomPicker />}
        </div>
      </div>
    </div>
  );
};

export default Utility;