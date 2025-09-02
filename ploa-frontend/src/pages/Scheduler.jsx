import { useState } from 'react';
import { Plus, Calendar, RotateCcw, AlertCircle, Settings } from 'lucide-react';
import Header from '../components/layout/Header';
import CharacterCard from '../components/scheduler/CharacterCard';
import useScheduler from '../hooks/useScheduler';

const Scheduler = () => {
  const { 
    characters, 
    loading, 
    addCharacter, 
    removeCharacter, 
    updateSchedule, 
    resetAllSchedules 
  } = useScheduler();
  
  const [selectedView, setSelectedView] = useState('character'); // 'character' or 'expedition'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [addError, setAddError] = useState('');
  const [isManageMode, setIsManageMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

        {/* 뷰 선택 및 액션 버튼 */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedView('character')}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedView === 'character'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              캐릭터별 보기
            </button>
            <button
              onClick={() => setSelectedView('expedition')}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedView === 'expedition'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              원정대별 보기
            </button>
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
            <button
              onClick={() => setShowAddModal(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              캐릭터 추가
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onUpdateSchedule={updateSchedule}
                isManageMode={isManageMode}
              />
            ))}
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
              onKeyPress={(e) => {
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
    </div>
  );
};

export default Scheduler;