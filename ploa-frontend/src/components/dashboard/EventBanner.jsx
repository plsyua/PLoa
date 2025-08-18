import { useState, useEffect } from 'react';
import { Calendar, Gift, ArrowRight } from 'lucide-react';
import { getEvents } from '../../services/lostarkApi';
import LoadingSpinner from '../common/LoadingSpinner';

// 이벤트 배너 컴포넌트
const EventBanner = () => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 이벤트 로드
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const eventsData = await getEvents();
      
      // 첫 번째 이벤트를 메인 배너로 사용
      if (eventsData && eventsData.length > 0) {
        const event = eventsData[0];
        setCurrentEvent({
          id: 1,
          title: event.Title,
          startDate: event.StartDate ? new Date(event.StartDate).toLocaleDateString('ko-KR') : '',
          endDate: event.EndDate ? new Date(event.EndDate).toLocaleDateString('ko-KR') : '',
          image: event.Thumbnail || null,
          link: event.Link
        });
      } else {
        // 이벤트가 없을 때 기본 데이터
        setCurrentEvent({
          id: 1,
          title: "진행 중인 이벤트",
          description: "현재 진행 중인 이벤트를 확인해보세요!",
          startDate: "",
          endDate: "",
          image: null,
          link: "https://lostark.game.onstove.com/News/Event/Now"
        });
      }
    } catch (err) {
      console.error('이벤트 로드 실패:', err);
      setError('이벤트 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/80 dark:to-purple-900/80 rounded-lg p-6 border border-blue-200/50 dark:border-blue-700/50">
        <div className="py-12">
          <LoadingSpinner size="lg" color="white" text="이벤트 정보 로딩 중..." />
        </div>
      </div>
    );
  }

  if (error || !currentEvent) {
    return (
      <div className="bg-gradient-to-r from-gray-100/80 to-gray-200/80 dark:from-gray-900/80 dark:to-gray-800/80 rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-center py-8">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mb-3">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 dark:text-red-400 mb-2 text-sm leading-relaxed max-w-md mx-auto">
              {error || '이벤트 정보를 불러올 수 없습니다.'}
            </p>
          </div>
          <button 
            onClick={loadEvents}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/80 dark:to-purple-900/80 rounded-lg p-6 border border-blue-200/50 dark:border-blue-700/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* 이벤트 헤더 */}
          <div className="flex items-center gap-2 mb-3">
            <Gift size={20} className="text-yellow-400" />
            <span className="text-sm text-yellow-400 font-medium">진행 중인 이벤트</span>
          </div>

          {/* 이벤트 제목 */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {currentEvent.title}
          </h2>

          {/* 이벤트 설명 */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
            {currentEvent.description}
          </p>

          {/* 이벤트 기간 */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={16} />
              <span>시작: {currentEvent.startDate} 06:00</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={16} />
              <span>종료: {currentEvent.endDate} 05:59</span>
            </div>
          </div>
          
          {/* CTA 버튼 */}
          <button 
            onClick={() => window.open(currentEvent.link, '_blank')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            이벤트 참여하기
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 이벤트 이미지 */}
        <div className="hidden md:block w-85 h-25 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg ml-6 flex-shrink-0 overflow-hidden">
          {currentEvent.image ? (
            <img 
              src={currentEvent.image} 
              alt={currentEvent.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // 이미지 로드 실패 시 기본 아이콘 표시
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 ${currentEvent.image ? 'hidden' : ''}`}>
            <Gift size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBanner;