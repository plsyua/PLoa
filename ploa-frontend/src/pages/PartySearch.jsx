import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { Upload, Image as ImageIcon, Search, Users, Check, RotateCcw, UserPlus } from 'lucide-react';

// 파티 슬롯 카드 컴포넌트
const PartySlotCard = ({ index, nickname, onUpdate, onClear, onStartEdit, isEditing, editValue, onEditChange, onSaveEdit, onCancelEdit, onKeyPress }) => {
  const partyNumber = Math.floor(index / 4) + 1;
  const slotNumber = (index % 4) + 1;
  const isEmpty = !nickname || nickname.trim() === '';

  return (
    <div className={`
      border-2 rounded-lg p-4 min-h-[120px] transition-all duration-200
      ${isEmpty 
        ? 'border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800' 
        : 'border-solid border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
      }
    `}>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {partyNumber}파티 {slotNumber}번
        </div>
        {!isEmpty && (
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => onStartEdit(index, nickname)}
              className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded border border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              수정
            </button>
            <button
              onClick={() => onClear(index)}
              className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded border border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              삭제
            </button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            onKeyDown={onKeyPress}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="닉네임을 입력하세요"
            autoFocus
          />
          <div className="flex gap-1">
            <button
              onClick={onSaveEdit}
              className="flex-1 p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="저장"
            >
              <Check size={16} className="mx-auto" />
            </button>
            <button
              onClick={onCancelEdit}
              className="flex-1 p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="취소"
            >
              <RotateCcw size={16} className="mx-auto" />
            </button>
          </div>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center h-full">
          <button 
            onClick={() => onStartEdit(index, '')}
            className="text-base text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            파티원 추가
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-base font-medium text-gray-900 dark:text-white truncate">
            {nickname}
          </span>
        </div>
      )}
    </div>
  );
};

const PartySearch = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 수동 입력 파티 슬롯 상태
  const [partySlots, setPartySlots] = useState(() => new Array(8).fill(''));
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editValue, setEditValue] = useState('');

  // 클립보드 붙여넣기 이벤트 처리
  const handlePaste = useCallback((e) => {
    e.preventDefault();

    const items = e.clipboardData?.items;
    if (!items) return;

    // 클립보드에서 이미지 찾기
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          handleFile(file);
          return;
        }
      }
    }

    // 이미지가 없으면 안내 메시지
    setError('클립보드에 이미지가 없습니다. 스크린샷을 먼저 캡처해주세요.');
  }, []);

  // 페이지 전체에 paste 이벤트 리스너 등록
  useEffect(() => {
    const handleGlobalPaste = (e) => {
      // 입력 필드에서 paste 이벤트가 발생한 경우는 제외
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      handlePaste(e);
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [handlePaste]);

  // 드래그 앤 드롭 이벤트 처리
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // 파일 드롭 처리
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  // 파일 선택 처리
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // 파일 처리 공통 함수
  const handleFile = (file) => {
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    setUploadedImage(file);
    setError(null);

    // 이미지 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // OCR 처리 시작
  const handleOCRProcess = async () => {
    if (!uploadedImage) return;

    setLoading(true);
    setError(null);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('image', uploadedImage);

      // OCR API 호출
      const response = await fetch('/api/ocr-nicknames', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`처리 실패: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.nicknames && result.nicknames.length > 0) {
        // 닉네임 확인 페이지로 이동
        navigate('/confirm-nicknames', {
          state: {
            nicknames: result.nicknames,
            originalImage: imagePreview
          }
        });
      } else {
        setError('닉네임을 찾을 수 없습니다. 이미지를 다시 확인해주세요.');
      }
    } catch (err) {
      console.error('처리 오류:', err);
      setError('처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 이미지 초기화
  const resetImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setError(null);
  };

  // 수동 입력 파티 슬롯 관리 함수들
  const updateSlot = (index, newNickname) => {
    const newSlots = [...partySlots];
    newSlots[index] = newNickname;
    setPartySlots(newSlots);
  };

  const clearSlot = (index) => {
    updateSlot(index, '');
  };

  const startEditing = (index, currentNickname) => {
    setEditingIndex(index);
    setEditValue(currentNickname || '');
  };

  const saveEdit = () => {
    if (editValue.trim() !== partySlots[editingIndex]) {
      updateSlot(editingIndex, editValue.trim());
    }
    setEditingIndex(-1);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingIndex(-1);
    setEditValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // 수동 입력 검색 시작
  const handleManualSearch = () => {
    const validNicknames = partySlots.filter(name => name && name.trim());
    if (validNicknames.length === 0) {
      setError('검색할 닉네임을 최소 1개 이상 입력해주세요.');
      return;
    }

    navigate('/search-results', {
      state: {
        nicknames: partySlots,
        originalImage: null
      }
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            파티 검색
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            대기실 스크린샷을 업로드하면 자동으로 닉네임을 인식하여 캐릭터 정보를 검색합니다. (1920x1080 기준)</p>
          <p className="text-gray-600 dark:text-gray-400">
            하단에서 수동 검색도 가능합니다.</p>
        </div>

        {/* 이미지 업로드 영역 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ImageIcon size={24} />
            이미지 업로드❗주의: 파티 대기실 창을 최상단으로 이동하세요.
          </h2>

          {!imagePreview ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                드래그 & 드롭 혹은 클릭하여 파일 선택
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                또는 <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">Alt + PrtScr</kbd> 후 <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">Ctrl + V</kbd> 로 붙여넣기
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                파일 선택
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                * 클립보드 이미지 지원
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 이미지 미리보기 */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <img
                  src={imagePreview}
                  alt="업로드된 이미지"
                  className="max-w-full max-h-96 mx-auto rounded-lg border border-gray-300 dark:border-gray-600"
                />
              </div>
              
              {/* 버튼 영역 */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={resetImage}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  다시 선택
                </button>
                <button
                  onClick={handleOCRProcess}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      닉네임 인식 중...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      닉네임 인식 시작
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* 사용법 안내 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <Users size={20} />
            간단 사용법
          </h3>
          <div className="space-y-2 text-blue-800 dark:text-blue-200">
            <p>1. 파티에 입장, 대기실 창을 최상단으로 드래그. <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-xs">Alt + PrtScr</kbd> 로 전체 화면 캡처.</p>
            <p>2. <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-xs">Ctrl + V</kbd> 로 클립보드 붙여넣기.</p>
            <p>3. '닉네임 인식 시작' 버튼을 클릭하면 자동으로 닉네임을 추출합니다.</p>
            <p>4. 인식된 닉네임들이 정확한지 확인하고, 종합 정보를 확인하세요.</p>
          </div>
        </div>

        {/* 수동 파티 입력 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              수동 검색 ({partySlots.filter(name => name && name.trim()).length}/8명)
            </h2>
            <button
              onClick={handleManualSearch}
              disabled={partySlots.filter(name => name && name.trim()).length === 0 || editingIndex !== -1}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Search size={20} />
              캐릭터 검색 시작 ({partySlots.filter(name => name && name.trim()).length}명)
            </button>
          </div>

          {/* 1번 파티 */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {partySlots.slice(0, 4).map((nickname, index) => (
                <PartySlotCard
                  key={index}
                  index={index}
                  nickname={nickname}
                  onUpdate={updateSlot}
                  onClear={clearSlot}
                  onStartEdit={startEditing}
                  isEditing={editingIndex === index}
                  editValue={editValue}
                  onEditChange={setEditValue}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  onKeyPress={handleKeyPress}
                />
              ))}
            </div>
          </div>

          {/* 2번 파티 */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {partySlots.slice(4, 8).map((nickname, index) => (
                <PartySlotCard
                  key={index + 4}
                  index={index + 4}
                  nickname={nickname}
                  onUpdate={updateSlot}
                  onClear={clearSlot}
                  onStartEdit={startEditing}
                  isEditing={editingIndex === (index + 4)}
                  editValue={editValue}
                  onEditChange={setEditValue}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  onKeyPress={handleKeyPress}
                />
              ))}
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="mt-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 p-4">
            <p className="text-green-800 dark:text-green-200 text-sm">
              • 빈 슬롯에는 "파티원 추가" 버튼을 클릭하여 닉네임을 직접 입력할 수 있습니다.
              <br />
              • 잘못 입력된 닉네임은 [수정] 버튼을 클릭하여 편집하거나, [삭제] 버튼으로 제거할 수 있습니다.
              <br />
              • 파티 구성이 완료되면 "캐릭터 검색 시작" 버튼을 클릭하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartySearch;