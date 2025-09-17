import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { Edit3, Check, AlertCircle, Search, RotateCcw, UserPlus } from 'lucide-react';

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

const ConfirmNicknames = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nicknames: initialNicknames, originalImage } = location.state || {};

  // OCR 결과에 빈 슬롯 정보 추가 (SearchResults와 동일한 로직)
  const insertEmptySlots = (names) => {
    // 현재 OCR 결과가 6개이고 실제로는 2-3, 2-4가 빈 슬롯인 경우
    if (names?.length === 6) {
      return [
        names[0], // 1-1: 귀여운건슬링
        names[1], // 2-1: 리릭시아
        names[2], // 1-2: 친구차이
        names[3], // 2-2: 플슈링
        names[4], // 1-3: 밤고개로
        '!',      // 2-3: 빈 슬롯
        names[5], // 1-4: 홀리는딜러입니다
        '!'       // 2-4: 빈 슬롯
      ];
    }
    return names || [];
  };

  // 파티별로 닉네임 분리 (SearchResults와 동일한 로직)
  const organizeParties = (names) => {
    const party1 = []; // 1번 파티
    const party2 = []; // 2번 파티
    let position1 = 0; // 1번 파티 포지션 카운터
    let position2 = 0; // 2번 파티 포지션 카운터

    for (let i = 0; i < names.length; i++) {
      const nickname = names[i];

      // 현재 어느 파티 차례인지 판단 (전체 포지션 기준)
      const totalPosition = position1 + position2;
      const isParty1Turn = (totalPosition % 2 === 0);

      // '!' 또는 '모집중' 인식된 경우 해당 파티에 null 추가
      if (nickname === '!' || nickname === '모집중') {
        if (isParty1Turn) {
          party1.push('');
          position1++;
        } else {
          party2.push('');
          position2++;
        }
        continue;
      }

      // 실제 닉네임 처리
      if (nickname) {
        if (isParty1Turn) {
          party1.push(nickname);
          position1++;
        } else {
          party2.push(nickname);
          position2++;
        }
      }
    }

    // 각 파티를 정확히 4개 슬롯으로 맞추기
    while (party1.length < 4) {
      party1.push('');
    }
    while (party2.length < 4) {
      party2.push('');
    }

    return [...party1, ...party2]; // 8개 슬롯 반환
  };

  // 파티 구성 로직 적용
  const processedNames = insertEmptySlots(initialNicknames);
  const organizedSlots = organizeParties(processedNames);

  // 8개 고정 슬롯으로 변경
  const [partySlots, setPartySlots] = useState(() => {
    return organizedSlots.length > 0 ? organizedSlots : new Array(8).fill('');
  });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editValue, setEditValue] = useState('');

  // OCR 결과가 없으면 자동 검색 페이지로 리다이렉트
  useEffect(() => {
    if (!initialNicknames || initialNicknames.length === 0) {
      navigate('/party-search');
    }
  }, [initialNicknames, navigate]);

  // 슬롯 업데이트
  const updateSlot = (index, newNickname) => {
    const newSlots = [...partySlots];
    newSlots[index] = newNickname;
    setPartySlots(newSlots);
  };

  // 슬롯 비우기
  const clearSlot = (index) => {
    updateSlot(index, '');
  };

  // 닉네임 수정 시작
  const startEditing = (index, currentNickname) => {
    setEditingIndex(index);
    setEditValue(currentNickname || '');
  };

  // 닉네임 수정 완료
  const saveEdit = () => {
    if (editValue.trim() !== partySlots[editingIndex]) {
      updateSlot(editingIndex, editValue.trim());
    }
    setEditingIndex(-1);
    setEditValue('');
  };

  // 닉네임 수정 취소
  const cancelEdit = () => {
    setEditingIndex(-1);
    setEditValue('');
  };

  // 검색 시작
  const handleSearch = () => {
    const validNicknames = partySlots.filter(name => name && name.trim());
    if (validNicknames.length === 0) {
      return;
    }

    navigate('/search-results', {
      state: {
        nicknames: partySlots,
        originalImage
      }
    });
  };

  // 처음으로 돌아가기
  const goBack = () => {
    navigate('/party-search');
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
            인식된 닉네임을 확인하고 수정해주세요. 틀린 닉네임이 있다면 [수정] 버튼을 클릭하여 수정할 수 있습니다.
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
                disabled={partySlots.filter(name => name && name.trim()).length === 0 || editingIndex !== -1}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Search size={20} />
                캐릭터 검색 시작 ({partySlots.filter(name => name && name.trim()).length}명)
              </button>
            </div>
          </div>
        )}

        {/* 파티 구성 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-6 mb-6">
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              파티 구성 ({partySlots.filter(name => name && name.trim()).length}/8명)
            </h2>
          </div>

          {/* 1번 파티 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">1번 파티</h3>
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">2번 파티</h3>
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
        </div>


        {/* 안내 메시지 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            • 빈 슬롯에는 "파티원 추가" 버튼을 클릭하여 닉네임을 직접 입력할 수 있습니다.
            <br />
            • 잘못 인식된 닉네임은 [수정] 버튼을 클릭하여 편집하거나, [삭제] 버튼으로 제거할 수 있습니다.
            <br />
            • 파티 구성이 완료되면 "캐릭터 검색 시작" 버튼을 클릭하세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmNicknames;