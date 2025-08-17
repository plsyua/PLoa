import { TrendingUp, Users, Clock, Server } from 'lucide-react';

// 빠른 통계 정보 컴포넌트
const QuickStats = () => {
  // 임시 통계 데이터 (추후 실제 API 연동)
  const stats = [
    {
      id: 1,
      title: "오늘 검색된 캐릭터",
      value: "2,847",
      change: "+12%",
      positive: true,
      icon: Users,
      color: "text-blue-400"
    },
    {
      id: 2,
      title: "평균 아이템 레벨",
      value: "1,620",
      change: "+5%", 
      positive: true,
      icon: TrendingUp,
      color: "text-green-400"
    },
    {
      id: 3,
      title: "서버 응답시간",
      value: "127ms",
      change: "-8%",
      positive: true,
      icon: Clock,
      color: "text-yellow-400"
    },
    {
      id: 4,
      title: "API 상태",
      value: "정상",
      change: "99.9%",
      positive: true,
      icon: Server,
      color: "text-green-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        
        return (
          <div key={stat.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm">
            {/* 상단: 아이콘과 제목 */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <IconComponent size={18} className={stat.color} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</span>
              </div>
            </div>

            {/* 중간: 주요 수치 */}
            <div className="mb-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </span>
            </div>

            {/* 하단: 변화량 */}
            <div className="flex items-center gap-1">
              <span 
                className={`text-xs font-medium ${
                  stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">지난 24시간</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;