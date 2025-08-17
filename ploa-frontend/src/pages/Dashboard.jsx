import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Header from '../components/layout/Header';
import EventBanner from '../components/dashboard/EventBanner';
import NoticeSection from '../components/dashboard/NoticeSection';
import QuickStats from '../components/dashboard/QuickStats';

// 메인 대시보드 페이지
const Dashboard = () => {
  const [characterName, setCharacterName] = useState('');
  const navigate = useNavigate();

  // 캐릭터 검색 처리
  const handleSearch = (e) => {
    e.preventDefault();
    if (!characterName.trim()) return;

    // 캐릭터 상세 페이지로 이동
    navigate(`/character/${encodeURIComponent(characterName.trim())}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 컴포넌트 */}
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 이벤트 배너 */}
        <div className="mb-8">
          <EventBanner />
        </div>

        {/* 캐릭터 검색 섹션 */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">캐릭터 검색</h2>
            
            <form onSubmit={handleSearch} className="flex gap-3 mb-4">
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="캐릭터명을 입력하세요"
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!characterName.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                <Search size={18} />
                검색
              </button>
            </form>

          </div>
        </div>

        {/* 빠른 통계 */}
        <div className="mb-8">
          <QuickStats />
        </div>

        {/* 공지사항 섹션 */}
        <div className="mb-8">
          <NoticeSection />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;