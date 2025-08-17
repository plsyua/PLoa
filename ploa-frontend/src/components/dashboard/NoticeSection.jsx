import { useState, useEffect } from 'react';
import { Bell, ExternalLink } from 'lucide-react';
import { getNotices } from '../../services/lostarkApi';
import LoadingSpinner from '../common/LoadingSpinner';

// 공지사항 섹션 컴포넌트
const NoticeSection = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 공지사항 로드
  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const noticesData = await getNotices();
      
      // 최근 5개 공지사항만 표시하고 타입 매핑
      const processedNotices = noticesData.slice(0, 5).map((notice, index) => ({
        id: index + 1,
        title: notice.Title,
        date: new Date(notice.Date).toLocaleDateString('ko-KR'),
        type: mapNoticeType(notice.Type),
        link: notice.Link
      }));
      
      setNotices(processedNotices);
    } catch (err) {
      console.error('공지사항 로드 실패:', err);
      setError('공지사항을 불러올 수 없습니다.');
      
      // 에러 시 기본 데이터 표시
      setNotices([
        {
          id: 1,
          title: "공지사항을 불러오는 중...",
          date: new Date().toLocaleDateString('ko-KR'),
          type: "공지",
          link: "https://lostark.game.onstove.com/News/Notice/List"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 로스트아크 API 타입을 한글로 매핑
  const mapNoticeType = (type) => {
    switch (type) {
      case '점검': return '점검';
      case '상점': return '상점';
      case '이벤트': return '이벤트';
      case '공지': return '공지';
      default: return '공지';
    }
  };

  // 공지 타입별 색상
  const getNoticeTypeColor = (type) => {
    switch (type) {
      case '점검': return 'bg-red-600 text-white';
      case '이벤트': return 'bg-blue-600 text-white';
      case '상점': return 'bg-purple-600 text-white';
      case '공지': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell size={20} className="text-blue-500 dark:text-blue-400" />
          공지사항
        </h3>
        <a 
          href="https://lostark.game.onstove.com/News/Notice/List"
          target="_blank"
          rel="noopener noreferrer" 
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
        >
          더보기 <ExternalLink size={14} />
        </a>
      </div>

      {/* 공지사항 리스트 */}
      <div className="space-y-2">
        {loading ? (
          <div className="py-8">
            <LoadingSpinner size="md" text="공지사항 로딩 중..." />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 dark:text-red-400 text-sm mb-2">{error}</p>
            <button 
              onClick={loadNotices}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : notices.length > 0 ? (
          notices.map((notice) => (
          <a
            key={notice.id}
            href={notice.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* 공지 타입 태그와 제목 */}
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded flex-shrink-0 ${getNoticeTypeColor(notice.type)}`}>
                    {notice.type}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
                    {notice.date}
                  </span>
                </div>
                
                {/* 공지 제목 */}
                <p className="text-gray-900 dark:text-white text-sm font-medium leading-5" 
                   style={{
                     display: '-webkit-box',
                     WebkitLineClamp: 2,
                     WebkitBoxOrient: 'vertical',
                     overflow: 'hidden'
                   }}
                   title={notice.title}
                >
                  {notice.title}
                </p>
              </div>
            </div>
          </a>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            공지사항이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeSection;