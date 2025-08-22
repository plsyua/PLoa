import { useState } from 'react';
import { Gift, Plus, Trash2, Shuffle, Trophy } from 'lucide-react';

const RandomPicker = () => {
  const [items, setItems] = useState(['', '']);
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const addItem = () => {
    // 최대 16개까지만 추가 가능
    if (items.length >= 16) return;
    setItems([...items, '']);
  };

  const removeItem = (index) => {
    if (items.length > 2) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const updateItem = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const pickRandom = () => {
    const validItems = items.filter(item => item.trim() !== '');
    if (validItems.length === 0) return;

    setIsSpinning(true);
    setResult(null);
    setShowModal(false);

    // 스피닝 애니메이션 효과
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * validItems.length);
      setResult(validItems[randomIndex]);
      setIsSpinning(false);
      setShowModal(true);
    }, 1500);
  };

  const resetAll = () => {
    setItems(['', '']);
    setResult(null);
    setIsSpinning(false);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const addPresetItems = (preset) => {
    switch (preset) {
      case 'raid':
        setItems(['발탄', '비아키스', '쿠크세이튼', '아브렐슈드', '일리아칸', '카멘']);
        break;
      case 'kazeroth':
        setItems(['서막: 에키드나', '1막: 에기르', '2막: 아브렐슈드', '3막: 모르둠', '4막: 아르모체', '종막: 카제로스']);
        break;
      case 'calendar':
        setItems(['모험 섬', '카오스게이트', '필드 보스', '태초의 섬']);
        break;
      case 'food':
        setItems(['치킨', '햄부기', '분식', '한식', '중식', '일식']);
        break;
      case 'party4':
        setItems(['1파티 1번', '1파티 2번', '1파티 3번', '1파티 4번']);
        break;
      case 'party8':
        setItems(['1파티 1번', '1파티 2번', '1파티 3번', '1파티 4번', '2파티 1번', '2파티 2번', '2파티 3번', '2파티 4번']);
        break;
      case 'party16':
        setItems(['1파티 1번', '1파티 2번', '1파티 3번', '1파티 4번', '2파티 1번', '2파티 2번', '2파티 3번', '2파티 4번', '3파티 1번', '3파티 2번', '3파티 3번', '3파티 4번', '4파티 1번', '4파티 2번', '4파티 3번', '4파티 4번']);
        break;
      default:
        break;
    }
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* 제비뽑기 헤더 */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
          <Gift size={32} className="text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          제비뽑기
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          여러 항목 중에서 랜덤으로 하나를 선택합니다
        </p>
      </div>

      {/* 미리 설정된 항목들 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          빠른 설정
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => addPresetItems('raid')}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm"
          >
            군단장 레이드
          </button>
          <button
            onClick={() => addPresetItems('kazeroth')}
            className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors text-sm"
          >
            카제로스 레이드
          </button>
          <button
            onClick={() => addPresetItems('calendar')}
            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
          >
            캘린더
          </button>
          <button
            onClick={() => addPresetItems('food')}
            className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm"
          >
            음식 메뉴
          </button>
          <button
            onClick={() => addPresetItems('party4')}
            className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm"
          >
            몰아주기(4인)
          </button>
          <button
            onClick={() => addPresetItems('party8')}
            className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors text-sm"
          >
            몰아주기(8인)
          </button>
          <button
            onClick={() => addPresetItems('party16')}
            className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors text-sm"
          >
            몰아주기(16인)
          </button>
        </div>
      </div>

      {/* 항목 입력 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            항목
          </h3>
          <div className="flex gap-2">
            <button
              onClick={pickRandom}
              disabled={items.filter(item => item.trim() !== '').length < 2 || isSpinning}
              className="px-6 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-base flex items-center gap-2"
            >
              {isSpinning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  뽑는 중
                </>
              ) : (
                <>
                  <Shuffle size={18} />
                  뽑기 시작
                </>
              )}
            </button>
            <button
              onClick={addItem}
              disabled={items.length >= 16}
              className="px-6 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-base flex items-center gap-2"
            >
              <Plus size={18} />
              추가
            </button>
            <button
              onClick={resetAll}
              className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-base flex items-center gap-2"
            >
              <Trash2 size={18} />
              초기화
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium w-8">
                {index + 1}.
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={`항목 ${index + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              {items.length > 2 && (
                <button
                  onClick={() => removeItem(index)}
                  className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* 결과 모달 */}
      {showModal && result && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
              <Trophy size={32} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              당첨!
            </h3>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
              {result}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              아무곳이나 클릭하면 닫힙니다
            </p>
          </div>
        </div>
      )}

      {/* 사용법 안내 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📖 사용법
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>• 제비뽑기할 항목들을 입력하세요</li>
          <li>• 빠른 설정 버튼으로 미리 준비된 항목들을 사용할 수 있습니다</li>
          <li>• 추가 버튼으로 더 많은 항목을 추가할 수 있습니다 (최대 16개)</li>
        </ul>
      </div>
    </div>
  );
};

export default RandomPicker;