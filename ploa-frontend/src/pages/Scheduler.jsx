import { useState } from 'react';
import { Plus, Calendar, RotateCcw, AlertCircle, Settings, Users } from 'lucide-react';
import Header from '../components/layout/Header';
import CharacterCard from '../components/scheduler/CharacterCard';
import useScheduler from '../hooks/useScheduler';
import { getCharacterSiblings } from '../services/lostarkApi';

const Scheduler = () => {
  const { 
    characters, 
    loading, 
    addCharacter, 
    removeCharacter, 
    updateSchedule, 
    resetAllSchedules,
    // 드래그 앤 드롭 관련
    draggedCharacter,
    dragOverIndex,
    dragPreviewIndex,
    isAnimating,
    movingCards,
    gridColumns,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    getCardTransform
  } = useScheduler();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [addError, setAddError] = useState('');
  const [isManageMode, setIsManageMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState(null);
  const [showExpeditionModal, setShowExpeditionModal] = useState(false);
  const [expeditionCharacterName, setExpeditionCharacterName] = useState('');
  const [expeditionCharacters, setExpeditionCharacters] = useState([]);
  const [selectedExpeditionChars, setSelectedExpeditionChars] = useState([]);
  const [expeditionLoading, setExpeditionLoading] = useState(false);
  const [expeditionError, setExpeditionError] = useState('');

  // 캐릭터 추가 처리
  const handleAddCharacter = async () => {
    if (!newCharacterName.trim()) return;
    
    setAddError('');
    try {
      await addCharacter(newCharacterName.trim());
      setShowAddModal(false);
      setNewCharacterName('');
    } catch (error) {
      setAddError(error.message);
    }
  };

  // 전체 리셋 확인 처리
  const handleResetConfirm = () => {
    resetAllSchedules();
    setShowResetConfirm(false);
  };

  // 캐릭터 삭제 확인 처리
  const handleDeleteCharacter = (characterId) => {
    const character = characters.find(char => char.id === characterId);
    setCharacterToDelete(character);
    setShowDeleteConfirm(true);
  };

  // 캐릭터 삭제 실행
  const handleDeleteConfirm = () => {
    if (characterToDelete) {
      removeCharacter(characterToDelete.id);
      setShowDeleteConfirm(false);
      setCharacterToDelete(null);
    }
  };

  // 원정대 불러오기 처리
  const handleExpeditionSearch = async () => {
    if (!expeditionCharacterName.trim()) return;
    
    setExpeditionError('');
    setExpeditionLoading(true);
    try {
      const siblings = await getCharacterSiblings(expeditionCharacterName.trim());
      setExpeditionCharacters(siblings);
      setSelectedExpeditionChars([]);
    } catch (error) {
      console.error('원정대 조회 실패:', error);
      setExpeditionError('원정대 정보를 불러올 수 없습니다.');
    } finally {
      setExpeditionLoading(false);
    }
  };

  // 원정대 캐릭터 선택/해제
  const toggleExpeditionCharacter = (character) => {
    const isSelected = selectedExpeditionChars.some(char => char.CharacterName === character.CharacterName);
    if (isSelected) {
      setSelectedExpeditionChars(prev => prev.filter(char => char.CharacterName !== character.CharacterName));
    } else {
      setSelectedExpeditionChars(prev => [...prev, character]);
    }
  };

  // 원정대 캐릭터 일괄 추가
  const handleAddExpeditionCharacters = async () => {
    if (selectedExpeditionChars.length === 0) return;
    
    setExpeditionLoading(true);
    try {
      for (const character of selectedExpeditionChars) {
        // 이미 추가된 캐릭터가 아닌 경우에만 추가
        if (!characters.some(char => char.name === character.CharacterName)) {
          await addCharacter(character.CharacterName);
        }
      }
      
      // 모달 닫기 및 상태 초기화
      setShowExpeditionModal(false);
      setExpeditionCharacterName('');
      setExpeditionCharacters([]);
      setSelectedExpeditionChars([]);
      setExpeditionError('');
    } catch (error) {
      console.error('원정대 캐릭터 추가 실패:', error);
      setExpeditionError('일부 캐릭터 추가에 실패했습니다.');
    } finally {
      setExpeditionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">스케줄러</h1>
          <p className="text-gray-600 dark:text-gray-400">
            캐릭터별 일일/주간 컨텐츠 진행 상황을 관리하세요
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              캐릭터 추가
            </button>
            <button
              onClick={() => setShowExpeditionModal(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Users size={16} />
              원정대 불러오기
            </button>
            {/* 관리 모드 안내 문구 */}
            {isManageMode && (
              <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  관리 모드: 캐릭터를 드래그하여 순서 변경, 삭제 버튼으로 삭제
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsManageMode(!isManageMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                isManageMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Settings size={16} />
              관리
            </button>
            {characters.length > 0 && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                <RotateCcw size={16} />
                전체 리셋
              </button>
            )}
          </div>
        </div>

        {/* 캐릭터 목록이 없을 때 */}
        {characters.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
            <Calendar size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              스케줄러에 캐릭터를 추가해보세요
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              일일/주간 컨텐츠 진행 상황을 체계적으로 관리할 수 있습니다
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus size={16} />
              첫 캐릭터 추가하기
            </button>
          </div>
        ) : (
          /* 캐릭터 그리드 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
            {characters.map((character, index) => {
              const transformStyle = isManageMode && draggedCharacter 
                ? getCardTransform(index, draggedCharacter.index, dragPreviewIndex, characters.length)
                : { transform: '', className: '' };
              
              const isMoving = movingCards.has(index);
              const isDragging = draggedCharacter?.character.id === character.id;

              return (
                <div
                  key={character.id}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`transition-all duration-200 ${
                    isManageMode && dragOverIndex === index && draggedCharacter?.index !== index
                      ? 'scale-105 transform bg-blue-50 dark:bg-blue-900/20 rounded-lg'
                      : ''
                  }`}
                  style={{
                    minHeight: isDragging ? '200px' : 'auto'
                  }}
                >
                  <CharacterCard
                    character={character}
                    onUpdateSchedule={updateSchedule}
                    onRemoveCharacter={handleDeleteCharacter}
                    isManageMode={isManageMode}
                    onDragStart={(character, e) => handleDragStart(character, index)}
                    onDragEnd={handleDragEnd}
                    isDragging={isDragging}
                    transformStyle={transformStyle}
                    isMoving={isMoving}
                  />
                </div>
              );
            })}
            
            {/* 드래그 중일 때 placeholder 표시 */}
            {isManageMode && draggedCharacter && gridColumns && (
              <div 
                className="absolute pointer-events-none z-0"
                style={{
                  gridColumn: `${(draggedCharacter.index % gridColumns) + 1}`,
                  gridRow: `${Math.floor(draggedCharacter.index / gridColumns) + 1}`,
                  width: '100%',
                  height: '100%'
                }}
              >
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-500 h-full opacity-50">
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 캐릭터 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">캐릭터 추가</h3>
            
            {/* 에러 메시지 */}
            {addError && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <AlertCircle size={16} className="text-red-500 dark:text-red-400" />
                <span className="text-sm text-red-700 dark:text-red-300">{addError}</span>
              </div>
            )}
            
            <input
              type="text"
              value={newCharacterName}
              onChange={(e) => {
                setNewCharacterName(e.target.value);
                setAddError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleAddCharacter();
                }
              }}
              placeholder="캐릭터명을 입력하세요"
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 mb-4"
              disabled={loading}
            />
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCharacterName('');
                  setAddError('');
                }}
                disabled={loading}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleAddCharacter}
                disabled={!newCharacterName.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '추가 중...' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 전체 리셋 확인 모달 */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">전체 리셋 확인</h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              정말로 모든 캐릭터의 스케줄을 리셋하시겠습니까?
              <br />
              <span className="text-sm text-red-600 dark:text-red-400">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleResetConfirm}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 캐릭터 삭제 확인 모달 */}
      {showDeleteConfirm && characterToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">캐릭터 삭제 확인</h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              <span className="font-medium text-gray-900 dark:text-white">{characterToDelete.name}</span> 캐릭터를 정말로 삭제하시겠습니까?
              <br />
              <span className="text-sm text-red-600 dark:text-red-400">
                모든 스케줄 데이터가 영구적으로 삭제됩니다.
              </span>
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setCharacterToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 원정대 불러오기 모달 */}
      {showExpeditionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[80vh] overflow-hidden flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">원정대 불러오기</h3>
            
            {/* 캐릭터명 입력 */}
            <div className="mb-4">
              <input
                type="text"
                value={expeditionCharacterName}
                onChange={(e) => {
                  setExpeditionCharacterName(e.target.value);
                  setExpeditionError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !expeditionLoading) {
                    handleExpeditionSearch();
                  }
                }}
                placeholder="원정대 캐릭터명을 입력하세요"
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={expeditionLoading}
              />
              <button
                onClick={handleExpeditionSearch}
                disabled={!expeditionCharacterName.trim() || expeditionLoading}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {expeditionLoading ? '검색 중...' : '검색'}
              </button>
            </div>

            {/* 에러 메시지 */}
            {expeditionError && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <AlertCircle size={16} className="text-red-500 dark:text-red-400" />
                <span className="text-sm text-red-700 dark:text-red-300">{expeditionError}</span>
              </div>
            )}

            {/* 원정대 캐릭터 목록 */}
            {expeditionCharacters.length > 0 && (
              <div className="flex-1 overflow-y-auto mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  원정대 캐릭터 목록 ({expeditionCharacters.length}명)
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {expeditionCharacters.map((character, index) => {
                    const isAlreadyAdded = characters.some(char => char.name === character.CharacterName);
                    const isSelected = selectedExpeditionChars.some(char => char.CharacterName === character.CharacterName);
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 border rounded-md transition-colors ${
                          isAlreadyAdded 
                            ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600' 
                            : isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => !isAlreadyAdded && toggleExpeditionCharacter(character)}
                            disabled={isAlreadyAdded}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                          />
                          <div>
                            <span className={`font-medium ${
                              isAlreadyAdded 
                                ? 'text-gray-500 dark:text-gray-400' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {character.CharacterName}
                            </span>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {[character.ServerName, character.CharacterClassName, `Lv.${Math.floor(parseFloat(character.ItemAvgLevel?.replace(',', '') || '0'))}`]
                                .filter(Boolean)
                                .join(' • ')}
                            </div>
                          </div>
                        </div>
                        {isAlreadyAdded && (
                          <span className="text-sm text-blue-600 dark:text-blue-400">이미 추가됨</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 버튼 영역 */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowExpeditionModal(false);
                  setExpeditionCharacterName('');
                  setExpeditionCharacters([]);
                  setSelectedExpeditionChars([]);
                  setExpeditionError('');
                }}
                disabled={expeditionLoading}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50"
              >
                취소
              </button>
              {selectedExpeditionChars.length > 0 && (
                <button
                  onClick={handleAddExpeditionCharacters}
                  disabled={expeditionLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {expeditionLoading ? '추가 중...' : `${selectedExpeditionChars.length}명 추가`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;