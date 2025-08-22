import { useState, useEffect, useRef } from 'react';
import { Calendar, Gift, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getEvents } from '../../services/lostarkApi';
import LoadingSpinner from '../common/LoadingSpinner';

// 이벤트 배너 컴포넌트
const EventBanner = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoSlideTimer = useRef(null);

  // 컴포넌트 마운트 시 이벤트 로드
  useEffect(() => {
    loadEvents();
  }, []);

  // 자동 슬라이드 기능
  useEffect(() => {
    if (events.length <= 1 || isHovered) return;

    autoSlideTimer.current = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === events.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => {
      if (autoSlideTimer.current) {
        clearInterval(autoSlideTimer.current);
      }
    };
  }, [events.length, isHovered]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (autoSlideTimer.current) {
        clearInterval(autoSlideTimer.current);
      }
    };
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const eventsData = await getEvents();
      
      // 이벤트 데이터 가공
      if (eventsData && eventsData.length > 0) {
        const formattedEvents = eventsData.map((event, index) => ({
          id: index + 1,
          title: event.Title,
          startDate: event.StartDate ? new Date(event.StartDate).toLocaleDateString('ko-KR') : '',
          endDate: event.EndDate ? new Date(event.EndDate).toLocaleDateString('ko-KR') : '',
          startDateObj: event.StartDate ? new Date(event.StartDate) : null,
          endDateObj: event.EndDate ? new Date(event.EndDate) : null,
          image: event.Thumbnail || null,
          link: event.Link
        }));

        // 이벤트 정렬: 시작일 최신순 → 종료일 빠른순
        const sortedEvents = formattedEvents.sort((a, b) => {
          // 날짜가 없는 이벤트는 맨 뒤로
          if (!a.startDateObj && !b.startDateObj) return 0;
          if (!a.startDateObj) return 1;
          if (!b.startDateObj) return -1;
          
          // 1차 정렬: 시작일 기준 내림차순 (최신이 먼저)
          const startDateDiff = b.startDateObj.getTime() - a.startDateObj.getTime();
          if (startDateDiff !== 0) return startDateDiff;
          
          // 2차 정렬: 종료일 기준 오름차순 (빠른 종료가 먼저)
          if (!a.endDateObj && !b.endDateObj) return 0;
          if (!a.endDateObj) return 1;
          if (!b.endDateObj) return -1;
          
          return a.endDateObj.getTime() - b.endDateObj.getTime();
        });

        setEvents(sortedEvents);
        setCurrentIndex(0);
      } else {
        // 이벤트가 없을 때 기본 데이터
        setEvents([{
          id: 1,
          title: "진행 중인 이벤트",
          description: "현재 진행 중인 이벤트를 확인해보세요!",
          startDate: "",
          endDate: "",
          image: null,
          link: "https://lostark.game.onstove.com/News/Event/Now"
        }]);
        setCurrentIndex(0);
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

  if (error || events.length === 0) {
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

  // 슬라이드 네비게이션 함수들
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // 터치 이벤트 처리
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && events.length > 1) {
      goToNext();
    }
    if (isRightSwipe && events.length > 1) {
      goToPrevious();
    }
  };


  return (
    <div 
      className="relative bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/80 dark:to-purple-900/80 rounded-lg p-6 border border-blue-200/50 dark:border-blue-700/50 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 메인 콘텐츠 - 텍스트 고정, 이미지만 슬라이드 */}
      <div className="flex items-start justify-between">
        {/* 고정 텍스트 영역 */}
        <div className="flex-1">
          {/* 이벤트 헤더 */}
          <div className="flex items-center gap-2 mb-3">
            <Gift size={20} className="text-yellow-400" />
            <span className="text-sm text-yellow-400 font-medium">진행 중인 이벤트</span>
          </div>

          {/* 이벤트 제목 */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {events[currentIndex]?.title}
          </h2>

          {/* 이벤트 설명 */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
            {events[currentIndex]?.description}
          </p>

          {/* 이벤트 기간 */}
          {events[currentIndex]?.startDate && (
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Calendar size={16} />
                <span>시작: {events[currentIndex].startDate} 06:00</span>
              </div>
            </div>
          )}
          {events[currentIndex]?.endDate && (
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Calendar size={16} />
                <span>종료: {events[currentIndex].endDate} 05:59</span>
              </div>
            </div>
          )}
          
          {/* CTA 버튼 */}
          <button 
            onClick={() => window.open(events[currentIndex]?.link, '_blank')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            이벤트 바로가기
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 슬라이드 이미지 영역 */}
        <div className="hidden md:block w-96 h-[183px] lg:w-[448px] lg:h-[214px] ml-6 flex-shrink-0 relative overflow-hidden rounded-lg">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {events.map((event) => (
              <div key={event.id} className="w-full h-full flex-shrink-0 bg-gray-200/50 dark:bg-gray-700/50">
                {event.image ? (
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 아이콘 표시
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 ${event.image ? 'hidden' : ''}`}>
                  <Gift size={32} />
                </div>
              </div>
            ))}
          </div>

          {/* 이미지 영역 내 화살표 버튼 (이벤트가 2개 이상일 때만 표시) */}
          {events.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 z-10 flex items-center justify-center"
                aria-label="이전 이벤트"
              >
                <ChevronLeft size={16} className="text-gray-700 dark:text-gray-300" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 z-10 flex items-center justify-center"
                aria-label="다음 이벤트"
              >
                <ChevronRight size={16} className="text-gray-700 dark:text-gray-300" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 도트 인디케이터 (이벤트가 2개 이상일 때만 표시) */}
      {events.length > 1 && (
        <div className="absolute bottom-2 left-4 flex items-center gap-2 bg-black/20 dark:bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-600 dark:bg-blue-400 scale-125' 
                  : 'bg-white/60 dark:bg-gray-400/60 hover:bg-white/90 dark:hover:bg-gray-300/90 hover:scale-110'
              }`}
              aria-label={`${index + 1}번째 이벤트로 이동`}
            />
          ))}
          
          {/* 현재 페이지 표시 */}
          <span className="ml-2 text-xs text-white/90 dark:text-gray-200/90 font-medium">
            {currentIndex + 1}/{events.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default EventBanner;