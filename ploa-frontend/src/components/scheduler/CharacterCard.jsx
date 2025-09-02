import { User, CheckSquare, Square } from 'lucide-react';
import { DAILY_CONTENT, WEEKLY_CONTENT, ABYSS_DUNGEON_CONTENT, LEGION_RAID_CONTENT, EPIC_RAID_CONTENT, KAZEROTH_RAID_CONTENT } from '../../data/contentData';
import { getRaidDifficultyInfo } from '../../utils/difficultyUtils';
import { isContentAvailableToday } from '../../utils/dateUtils';

const CharacterCard = ({ character, onUpdateSchedule, isManageMode }) => {
  
  // 완료 상태 토글 (일일 컨텐츠 - 체크박스)
  const toggleDailyContent = (contentId) => {
    const currentState = character.schedule[contentId]?.completed || false;
    
    onUpdateSchedule(character.id, contentId, { 
      completed: !currentState,
      lastUpdated: new Date().toISOString()
    });
  };

  // 완료 상태 토글 (주간/군단장/에픽 컨텐츠 - true/false 또는 카운터)
  const toggleWeeklyContent = (contentId, increment = null) => {
    const weeklyContent = Object.values(WEEKLY_CONTENT).find(c => c.id === contentId);
    const scheduleData = character.schedule[contentId];
    
    if (weeklyContent && weeklyContent.maxCount > 1) {
      // 주간 컨텐츠 중 maxCount가 1보다 크면 카운터로 처리
      const currentCount = scheduleData?.completed || 0;
      let newCount;
      
      if (increment === true) {
        newCount = Math.min(currentCount + 1, weeklyContent.maxCount);
      } else if (increment === false) {
        newCount = Math.max(currentCount - 1, 0);
      } else {
        // 기본 토글 (사용하지 않음)
        newCount = currentCount;
      }
      
      onUpdateSchedule(character.id, contentId, {
        completed: newCount,
        lastUpdated: new Date().toISOString()
      });
    } else {
      // 나머지는 모두 체크박스로 처리 (주간 maxCount=1, 군단장, 에픽)
      const currentState = scheduleData?.completed || false;
      
      onUpdateSchedule(character.id, contentId, {
        completed: !currentState,
        lastUpdated: new Date().toISOString()
      });
    }
  };

  // 진행률 계산 (UI에 표시되는 컨텐츠만 포함)
  const calculateProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    // 1. 일일 컨텐츠 (오늘 진행 가능한 것만)
    Object.values(DAILY_CONTENT)
      .filter(content => isContentAvailableToday(content))
      .forEach(content => {
        const scheduleData = character.schedule[content.id];
        totalTasks += 1;
        if (scheduleData?.completed) completedTasks += 1;
      });

    // 2. 주간 컨텐츠 (주간 에포나)
    Object.values(WEEKLY_CONTENT).forEach(content => {
      const scheduleData = character.schedule[content.id];
      if (content.maxCount > 1) {
        totalTasks += content.maxCount;
        completedTasks += scheduleData?.completed || 0;
      } else {
        totalTasks += 1;
        if (scheduleData?.completed) completedTasks += 1;
      }
    });

    // 3. 엔드 컨텐츠 (UI와 동일한 로직으로 상위 3개만)
    const allRaids = [
      ...Object.values(ABYSS_DUNGEON_CONTENT),
      ...Object.values(LEGION_RAID_CONTENT), 
      ...Object.values(EPIC_RAID_CONTENT),
      ...Object.values(KAZEROTH_RAID_CONTENT)
    ];
    
    const eligibleRaids = allRaids
      .map(raidData => {
        const { difficulty, canParticipate } = getRaidDifficultyInfo(character.itemLevel, raidData);
        return { raidData, difficulty, canParticipate };
      })
      .filter(item => item.canParticipate)
      .sort((a, b) => (b.difficulty?.minLevel || 0) - (a.difficulty?.minLevel || 0))
      .slice(0, 3);

    eligibleRaids.forEach(({ difficulty }) => {
      const scheduleData = character.schedule[difficulty.id];
      totalTasks += 1;
      if (scheduleData?.completed) completedTasks += 1;
    });

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const progress = calculateProgress();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      {/* 캐릭터 헤더 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center border border-gray-400 dark:border-gray-500 overflow-hidden">
          {character.classIcon ? (
            <img 
              src={character.classIcon} 
              alt={character.className}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <User 
            className="w-6 h-6 text-gray-600 dark:text-gray-300" 
            style={{ display: character.classIcon ? 'none' : 'flex' }}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white">{character.name}</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {[character.serverName, character.className, `Lv.${character.itemLevel}`]
              .filter(Boolean)
              .join(' • ')}
          </div>
        </div>
      </div>

      {/* 관리 모드 알림 */}
      {isManageMode && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            관리 모드: 컨텐츠를 클릭하여 추가/제거할 수 있습니다
          </p>
        </div>
      )}

      {/* 일일 컨텐츠 */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">일일 컨텐츠</h4>
        <div className="space-y-1">
          {Object.values(DAILY_CONTENT)
            .filter(content => isContentAvailableToday(content)) // 오늘 진행 가능한 컨텐츠만 표시
            .map(content => {
              const scheduleData = character.schedule[content.id] || { completed: false };
              const isCompleted = scheduleData.completed || false;
              
              return (
                <div key={content.id} className="flex items-center gap-2 text-sm">
                  <button
                    onClick={() => toggleDailyContent(content.id)}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    {isCompleted ? <CheckSquare size={18} className="text-green-500" /> : <Square size={18} />}
                  </button>
                  <span className={`${isCompleted ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {content.name}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* 주간 컨텐츠 */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">주간 컨텐츠</h4>
        <div className="space-y-1">
          {Object.values(WEEKLY_CONTENT).map(content => {
            const scheduleData = character.schedule[content.id] || { completed: content.maxCount > 1 ? 0 : false };
            
            if (content.maxCount > 1) {
              // 카운터형 (주간 에포나 등)
              const completed = scheduleData.completed || 0;
              
              return (
                <div key={content.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{content.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWeeklyContent(content.id, false)}
                      disabled={completed === 0}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[3rem] text-center">
                      {completed}/{content.maxCount}
                    </span>
                    <button
                      onClick={() => toggleWeeklyContent(content.id, true)}
                      disabled={completed >= content.maxCount}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            } else {
              // 체크박스형 (군단장 레이드 등)
              const isCompleted = scheduleData.completed;
              
              return (
                <div key={content.id} className="flex items-center gap-2 text-sm">
                  <button
                    onClick={() => toggleWeeklyContent(content.id)}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    {isCompleted ? <CheckSquare size={18} className="text-green-500" /> : <Square size={18} />}
                  </button>
                  <span className={`${isCompleted ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {content.name}
                  </span>
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* 엔드 컨텐츠 */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">엔드 컨텐츠</h4>
        <div className="space-y-1">
          {(() => {
            // 모든 레이드 컨텐츠 수집
            const allRaids = [
              ...Object.values(ABYSS_DUNGEON_CONTENT),
              ...Object.values(LEGION_RAID_CONTENT), 
              ...Object.values(EPIC_RAID_CONTENT),
              ...Object.values(KAZEROTH_RAID_CONTENT)
            ];
            
            // 각 레이드별로 최적 난이도 계산 및 필터링
            const eligibleRaids = allRaids
              .map(raidData => {
                const { difficulty, canParticipate, lowestRequiredLevel } = getRaidDifficultyInfo(character.itemLevel, raidData);
                return { 
                  raidData, 
                  difficulty, 
                  canParticipate, 
                  lowestRequiredLevel,
                  minLevel: difficulty ? difficulty.minLevel : lowestRequiredLevel
                };
              })
              .filter(item => item.canParticipate)
              .sort((a, b) => b.minLevel - a.minLevel) // 레벨 높은 순
              .slice(0, 3); // 상위 3개만
              
            return eligibleRaids.map(({ raidData, difficulty }) => {
              const scheduleData = character.schedule[difficulty.id] || { completed: false };
              const isCompleted = scheduleData.completed;
              
              return (
                <div key={raidData.id} className="flex items-center gap-2 text-sm">
                  <button
                    onClick={() => toggleWeeklyContent(difficulty.id)}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    {isCompleted ? <CheckSquare size={18} className="text-green-500" /> : <Square size={18} />}
                  </button>
                  <div className="flex items-center gap-2">
                    <span className={`${isCompleted ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {difficulty.name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      difficulty.difficulty === 'hard' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {difficulty.difficulty === 'hard' ? '하드' : '노말'}
                    </span>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* 진행률 표시 */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">진행률</span>
          <span className="text-gray-900 dark:text-white font-medium">{progress}%</span>
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;