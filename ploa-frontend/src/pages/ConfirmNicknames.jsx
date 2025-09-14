import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { Edit3, Check, AlertCircle, Search, RotateCcw } from 'lucide-react';

const ConfirmNicknames = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nicknames: initialNicknames, originalImage } = location.state || {};

  const [nicknames, setNicknames] = useState(initialNicknames || []);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editValue, setEditValue] = useState('');

  // OCR 결과가 없으면 자동 검색 페이지로 리다이렉트
  useEffect(() => {
    if (!initialNicknames || initialNicknames.length === 0) {
      navigate('/auto-search');
    }
  }, [initialNicknames, navigate]);

  // 닉네임 수정 시작
  const startEditing = (index, currentNickname) => {
    setEditingIndex(index);
    setEditValue(currentNickname);
  };

  // 닉네임 수정 완료
  const saveEdit = () => {
    if (editValue.trim() && editValue.trim() !== nicknames[editingIndex]) {
      const updatedNicknames = [...nicknames];
      updatedNicknames[editingIndex] = editValue.trim();
      setNicknames(updatedNicknames);
    }
    setEditingIndex(-1);
    setEditValue('');
  };

  // 닉네임 수정 취소
  const cancelEdit = () => {
    setEditingIndex(-1);
    setEditValue('');
  };

  // 닉네임 삭제
  const removeNickname = (index) => {
    const updatedNicknames = nicknames.filter((_, i) => i !== index);
    setNicknames(updatedNicknames);
  };

  // 검색 시작
  const handleSearch = () => {
    if (nicknames.length === 0) {
      return;
    }

    navigate('/search-results', {
      state: {
        nicknames: nicknames.filter(name => name.trim()),
        originalImage
      }
    });
  };

  // 처음으로 돌아가기
  const goBack = () => {
    navigate('/auto-search');
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  if (!initialNicknames || initialNicknames.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            닉네임 확인
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            OCR로 인식된 닉네임을 확인하고 수정해주세요. 틀린 닉네임이 있다면 [수정] 버튼을 클릭하여 수정할 수 있습니다.
          </p>
        </div>

        {/* 원본 이미지 */}
        {originalImage && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">원본 이미지</h2>
            <img
              src={originalImage}
              alt="분석한 이미지"
              className="max-w-full max-h-64 mx-auto rounded-lg border border-gray-300 dark:border-gray-600 mb-4"
            />

            {/* 액션 버튼 */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={goBack}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <RotateCcw size={20} />
                다시 업로드
              </button>

              <button
                onClick={handleSearch}
                disabled={nicknames.length === 0 || editingIndex !== -1}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Search size={20} />
                캐릭터 검색 시작 ({nicknames.length}명)
              </button>
            </div>
          </div>
        )}

        {/* 닉네임 리스트 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-6 mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle size={24} className="text-yellow-500" />
              인식된 닉네임 ({nicknames.length}개)
            </h2>
          </div>

          <div className="space-y-3">
            {nicknames.map((nickname, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex-1">
                  {editingIndex === index ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="닉네임을 입력하세요"
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="저장"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="취소"
                      >
                        <RotateCcw size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-900 dark:text-white">
                        {nickname}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditing(index, nickname)}
                          className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded border border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => removeNickname(index)}
                          className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded border border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {nicknames.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              인식된 닉네임이 없습니다.
            </div>
          )}
        </div>


        {/* 안내 메시지 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            💡 <strong>사용법:</strong> 잘못 인식된 닉네임은 [수정] 버튼을 클릭하여 편집하거나, [삭제] 버튼으로 제거할 수 있습니다.
            모든 닉네임이 정확하다면 "캐릭터 검색 시작" 버튼을 클릭하세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmNicknames;