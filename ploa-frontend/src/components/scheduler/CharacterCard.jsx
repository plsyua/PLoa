import { User, CheckSquare, Square, Trash2, Users } from 'lucide-react';
import { DAILY_CONTENT, WEEKLY_CONTENT, ABYSS_DUNGEON_CONTENT, LEGION_RAID_CONTENT, EPIC_RAID_CONTENT, KAZEROTH_RAID_CONTENT } from '../../data/contentData';
import { getRaidDifficultyInfo } from '../../utils/difficultyUtils';
import { isContentAvailableToday } from '../../utils/dateUtils';
import { RAID_DATA } from '../../data/raidData';
import { getIcon } from '../../data/icons';

const CharacterCard = ({ character, onUpdateSchedule, onRemoveCharacter, isManageMode, onDragStart, onDragEnd, isDragging, transformStyle = {}, isMoving = false }) => {
  
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

  // 골드 계산 (엔드 컨텐츠 레이드만 포함)
  const calculateGoldInfo = () => {
    let totalGold = 0;
    let remainingGold = 0;

    // 엔드 컨텐츠 (UI와 동일한 로직으로 상위 3개만)
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

    eligibleRaids.forEach(({ raidData, difficulty }) => {
      const scheduleData = character.schedule[difficulty.id];

      // raidData.js에서 해당 레이드의 클리어 골드 정보 가져오기
      const raid = RAID_DATA[raidData.id];
      if (raid && raid.gates) {
        // 각 관문의 클리어 골드 합산 (해당 난이도)
        const difficultyKey = difficulty.difficulty === 'hard' ? 'hard' : 'normal';
        raid.gates.forEach(gate => {
          const clearGold = gate.clearGold?.[difficultyKey] || 0;
          totalGold += clearGold;

          // 미완료된 경우 남은 골드에 추가
          if (!scheduleData?.completed) {
            remainingGold += clearGold;
          }
        });
      }
    });

    return {
      totalGold,
      remainingGold,
      percentage: totalGold > 0 ? Math.round(((totalGold - remainingGold) / totalGold) * 100) : 0,
      remainingPercentage: totalGold > 0 ? Math.round((remainingGold / totalGold) * 100) : 0
    };
  };

  const goldInfo = calculateGoldInfo();
  const goldIcon = getIcon('SYSTEM', '골드');

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 relative will-change-transform ${
        isManageMode ? 'cursor-grab hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200' : ''
      } ${
        isDragging ? 'opacity-60 scale-105 z-50 cursor-grabbing shadow-2xl border-blue-400 dark:border-blue-500' : ''
      } ${
        isMoving ? 'z-10 shadow-lg' : ''
      } ${
        transformStyle.className || ''
      }`}
      style={{
        transform: transformStyle.transform || '',
        transition: isDragging 
          ? 'opacity 0.2s ease-out, transform 0.2s ease-out' 
          : isMoving 
            ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'all 0.2s ease-in-out',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        userSelect: 'none'
      }}
      draggable={isManageMode}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', character.id);
        e.dataTransfer.setData('application/json', JSON.stringify({ 
          characterId: character.id, 
          characterName: character.name 
        }));
        
        if (onDragStart) {
          onDragStart(character, e);
        }
      }}
      onDragEnd={onDragEnd}
    >
      {/* 관리 모드에서 삭제 버튼 */}
      {isManageMode && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // 드래그 이벤트와 충돌 방지
            onRemoveCharacter(character.id);
          }}
          onMouseDown={(e) => e.stopPropagation()} // 마우스 다운 이벤트도 차단
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 hover:text-red-600 hover:bg-red-100 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-full transition-colors z-20"
          title="캐릭터 삭제"
          draggable={false} // 버튼 자체는 드래그 불가
        >
          <Trash2 size={16} />
        </button>
      )}
      

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
            {[character.className, `Lv.${character.itemLevel}`]
              .filter(Boolean)
              .join(' • ')}
          </div>
        </div>
      </div>


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
                    onClick={(e) => {
                      if (isManageMode) {
                        e.stopPropagation();
                      }
                      toggleDailyContent(content.id);
                    }}
                    onMouseDown={(e) => isManageMode && e.stopPropagation()}
                    className="text-gray-400 hover:text-blue-500"
                    draggable={false}
                  >
                    {isCompleted ? <CheckSquare size={18} className="text-green-500" /> : <Square size={18} />}
                  </button>
                  <span className={`${isCompleted ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {content.name}
                  </span>
                  {content.shared && (
                    <Users size={14} className="text-blue-500 dark:text-blue-400" title="계정 공유 컨텐츠" />
                  )}
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
                      onClick={(e) => {
                        if (isManageMode) {
                          e.stopPropagation();
                        }
                        toggleWeeklyContent(content.id, false);
                      }}
                      onMouseDown={(e) => isManageMode && e.stopPropagation()}
                      disabled={completed === 0}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      draggable={false}
                    >
                      -
                    </button>
                    <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[3rem] text-center">
                      {completed}/{content.maxCount}
                    </span>
                    <button
                      onClick={(e) => {
                        if (isManageMode) {
                          e.stopPropagation();
                        }
                        toggleWeeklyContent(content.id, true);
                      }}
                      onMouseDown={(e) => isManageMode && e.stopPropagation()}
                      disabled={completed >= content.maxCount}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      draggable={false}
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
                    onClick={(e) => {
                      if (isManageMode) {
                        e.stopPropagation();
                      }
                      toggleWeeklyContent(content.id);
                    }}
                    onMouseDown={(e) => isManageMode && e.stopPropagation()}
                    className="text-gray-400 hover:text-blue-500"
                    draggable={false}
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
            // 모든 레이드 컨텐츠 수집 (선언 순서의 반대 - 최신 컨텐츠 우선)
            const allRaids = [
              ...Object.values(KAZEROTH_RAID_CONTENT).reverse(),
              ...Object.values(EPIC_RAID_CONTENT).reverse(),
              ...Object.values(LEGION_RAID_CONTENT).reverse(), 
              ...Object.values(ABYSS_DUNGEON_CONTENT).reverse()
            ];
            
            // 각 레이드별로 최적 난이도 계산 및 필터링
            const eligibleRaids = allRaids
              .map(raidData => {
                const { difficulty, canParticipate } = getRaidDifficultyInfo(character.itemLevel, raidData);
                return { 
                  raidData, 
                  difficulty, 
                  canParticipate
                };
              })
              .filter(item => item.canParticipate)
              .slice(0, 3); // 선언 순서대로 상위 3개만
              
            return eligibleRaids.map(({ raidData, difficulty }) => {
              const scheduleData = character.schedule[difficulty.id] || { completed: false };
              const isCompleted = scheduleData.completed;
              
              return (
                <div key={raidData.id} className="flex items-center gap-2 text-sm">
                  <button
                    onClick={(e) => {
                      if (isManageMode) {
                        e.stopPropagation();
                      }
                      toggleWeeklyContent(difficulty.id);
                    }}
                    onMouseDown={(e) => isManageMode && e.stopPropagation()}
                    className="text-gray-400 hover:text-blue-500"
                    draggable={false}
                  >
                    {isCompleted ? <CheckSquare size={18} className="text-green-500" /> : <Square size={18} />}
                  </button>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      difficulty.difficulty === 'hard'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {difficulty.difficulty === 'hard' ? '하드' : '노말'}
                    </span>
                    <span className={`${isCompleted ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {difficulty.name}
                    </span>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* 골드 표시 */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">광산</span>
          <div className="flex items-center gap-1">
            <span className={`text-gray-900 dark:text-white font-medium ${
              goldInfo.remainingGold === 0 ? 'line-through text-green-600 dark:text-green-400' : ''
            }`}>
              {goldInfo.remainingGold.toLocaleString()} / {goldInfo.totalGold.toLocaleString()}
            </span>
            {goldIcon && (
              <img
                src={goldIcon}
                alt="골드"
                className="w-4 h-4"
              />
            )}
          </div>
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              goldInfo.remainingGold === 0 ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${goldInfo.remainingPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;