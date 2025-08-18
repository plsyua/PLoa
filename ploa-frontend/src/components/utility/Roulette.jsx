import { useState } from 'react';
import { RotateCw, Plus, Trash2, Play, Trophy, RefreshCw } from 'lucide-react';

const Roulette = () => {
  const [items, setItems] = useState(['', '']);
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);

  const addItem = () => {
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

  const startNewSpin = () => {
    const validItems = items.filter(item => item.trim() !== '');
    
    // 랜덤 회전: 5~6.9바퀴 + 랜덤 각도 (시계방향만)
    const spins = Math.random() * 1.9 + 5; // 5.0~6.9바퀴
    const randomAngle = Math.floor(Math.random() * 360); // 0-359도
    const totalRotation = (spins * 360) + randomAngle; // 항상 양수 (시계방향)
    
    setRotation(totalRotation);

    // 애니메이션 후 결과 계산
    setTimeout(() => {
      // 최종 회전 각도 계산 (0-360도 범위로 정규화)
      const finalAngle = totalRotation % 360;
      
      // 각 섹션의 각도 계산
      const sectionAngle = 360 / validItems.length;
      
      // 화살표가 가리키는 섹션 계산 (12시 방향 기준)
      // SVG 섹션이 -90도부터 시작하므로 이를 고려하여 계산
      const adjustedAngle = (finalAngle + 90) % 360; // 90도 오프셋 보정
      const selectedIndex = Math.floor(adjustedAngle / sectionAngle) % validItems.length;
      
      setResult(validItems[selectedIndex]);
      setIsSpinning(false);
      setHasSpun(true); // 첫 회전 완료 표시
    }, 3000);
  };

  const spinRoulette = () => {
    const validItems = items.filter(item => item.trim() !== '');
    if (validItems.length === 0) return;

    setIsSpinning(true);
    setResult(null);

    if (hasSpun) {
      // 다시 돌리기: 즉시 0도로 리셋 후 새로운 회전
      setRotation(0);
      setTimeout(() => startNewSpin(), 100); // 짧은 지연 후 새 회전
    } else {
      // 첫 번째 회전: 바로 시작
      startNewSpin();
    }
  };

  const resetAll = () => {
    setItems(['', '']);
    setResult(null);
    setIsSpinning(false);
    setRotation(0);
    setHasSpun(false);
  };

  const addPresetItems = (preset) => {
    switch (preset) {
      case 'raid':
        setItems(['발탄', '비아키스', '쿠크세이튼', '아브렐슈드', '일리아칸', '카멘']);
        break;
      case 'content':
        setItems(['로스트아크', '발로란트', '리그 오브 레전드', '오버워치', '던전앤파이터']);
        break;
      case 'food':
        setItems(['치킨', '패스트푸드', '분식', '한식', '중식', '일식']);
        break;
      default:
        break;
    }
    setResult(null);
    setRotation(0);
    setHasSpun(false);
  };

  const validItems = items.filter(item => item.trim() !== '');
  const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 
    'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-orange-400'
  ];

  return (
    <div className="space-y-6">
      {/* 룰렛 헤더 */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
          <RotateCw size={32} className="text-orange-600 dark:text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          룰렛
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          회전하는 룰렛으로 하나를 선택합니다
        </p>
      </div>

      {/* 미리 설정된 항목들 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🎯 빠른 설정
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => addPresetItems('raid')}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm"
          >
            군단장 레이드
          </button>
          <button
            onClick={() => addPresetItems('content')}
            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
          >
            게임 선택
          </button>
          <button
            onClick={() => addPresetItems('food')}
            className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm"
          >
            음식 메뉴
          </button>
        </div>
      </div>

      {/* 룰렛 휠 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6">
            {/* 룰렛 컨테이너 */}
            <div className="relative inline-block">
              {/* 화살표 포인터 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-red-500"></div>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-red-500"></div>
                </div>
              </div>
              
              {/* 룰렛 원판 */}
              <div 
                className="relative"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
                }}
              >
                <svg
                  width="320"
                  height="320"
                  viewBox="0 0 320 320"
                  className="rounded-full border-4 border-gray-300 dark:border-gray-600 shadow-lg"
                >
                  {validItems.length > 0 ? (
                    // 항목이 있을 때: 기존 룰렛 섹션 렌더링
                    validItems.map((item, index) => {
                      const angle = 360 / validItems.length;
                      const startAngle = index * angle - 90; // -90도로 시작점을 12시 방향으로
                      const endAngle = startAngle + angle;
                      const color = colors[index % colors.length];
                      
                      // 원의 중심과 반지름
                      const centerX = 160;
                      const centerY = 160;
                      const radius = 150;
                      
                      // 시작점과 끝점 계산
                      const startX = centerX + radius * Math.cos(startAngle * Math.PI / 180);
                      const startY = centerY + radius * Math.sin(startAngle * Math.PI / 180);
                      const endX = centerX + radius * Math.cos(endAngle * Math.PI / 180);
                      const endY = centerY + radius * Math.sin(endAngle * Math.PI / 180);
                      
                      // 큰 호인지 작은 호인지 결정
                      const largeArcFlag = angle > 180 ? 1 : 0;
                      
                      // SVG path 생성
                      const pathData = [
                        `M ${centerX} ${centerY}`, // 중심으로 이동
                        `L ${startX} ${startY}`, // 시작점으로 선 그리기
                        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // 호 그리기
                        'Z' // 경로 닫기
                      ].join(' ');
                      
                      // 텍스트 위치 계산 (반지름의 60% 지점)
                      const textAngle = startAngle + angle / 2;
                      const textRadius = radius * 0.6;
                      const textX = centerX + textRadius * Math.cos(textAngle * Math.PI / 180);
                      const textY = centerY + textRadius * Math.sin(textAngle * Math.PI / 180);
                      
                      // Tailwind 색상을 실제 hex 색상으로 변환
                      const colorMap = {
                        'bg-red-400': '#f87171',
                        'bg-blue-400': '#60a5fa',
                        'bg-green-400': '#4ade80',
                        'bg-yellow-400': '#facc15',
                        'bg-purple-400': '#c084fc',
                        'bg-pink-400': '#f472b6',
                        'bg-indigo-400': '#818cf8',
                        'bg-orange-400': '#fb923c'
                      };
                      
                      return (
                        <g key={index}>
                          {/* 섹션 */}
                          <path
                            d={pathData}
                            fill={colorMap[color]}
                            stroke="#ffffff"
                            strokeWidth="1"
                          />
                          {/* 텍스트 */}
                          <text
                            x={textX}
                            y={textY}
                            fill="white"
                            fontSize="14"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                          >
                            {item.length > 8 ? item.substring(0, 8) + '...' : item}
                          </text>
                        </g>
                      );
                    })
                  ) : (
                    // 항목이 없을 때: 2개 기본 섹션으로 표시
                    ['', ''].map((item, index) => {
                      const angle = 360 / 2; // 2등분 (180도씩)
                      const startAngle = index * angle - 90; // -90도로 시작점을 12시 방향으로
                      const endAngle = startAngle + angle;
                      const color = colors[index % colors.length];
                      
                      // 원의 중심과 반지름
                      const centerX = 160;
                      const centerY = 160;
                      const radius = 150;
                      
                      // 시작점과 끝점 계산
                      const startX = centerX + radius * Math.cos(startAngle * Math.PI / 180);
                      const startY = centerY + radius * Math.sin(startAngle * Math.PI / 180);
                      const endX = centerX + radius * Math.cos(endAngle * Math.PI / 180);
                      const endY = centerY + radius * Math.sin(endAngle * Math.PI / 180);
                      
                      // 큰 호인지 작은 호인지 결정
                      const largeArcFlag = angle > 180 ? 1 : 0;
                      
                      // SVG path 생성
                      const pathData = [
                        `M ${centerX} ${centerY}`, // 중심으로 이동
                        `L ${startX} ${startY}`, // 시작점으로 선 그리기
                        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // 호 그리기
                        'Z' // 경로 닫기
                      ].join(' ');
                      
                      // Tailwind 색상을 실제 hex 색상으로 변환
                      const colorMap = {
                        'bg-red-400': '#f87171',
                        'bg-blue-400': '#60a5fa',
                        'bg-green-400': '#4ade80',
                        'bg-yellow-400': '#facc15',
                        'bg-purple-400': '#c084fc',
                        'bg-pink-400': '#f472b6',
                        'bg-indigo-400': '#818cf8',
                        'bg-orange-400': '#fb923c'
                      };
                      
                      return (
                        <g key={`empty-${index}`}>
                          {/* 섹션 */}
                          <path
                            d={pathData}
                            fill={colorMap[color]}
                            stroke="#ffffff"
                            strokeWidth="1"
                          />
                          {/* 빈 상태에서는 텍스트 표시하지 않음 */}
                        </g>
                      );
                    })
                  )}
                </svg>
              </div>
            </div>

            {/* 스핀 버튼 */}
            <div className="mt-8">
              <button
                onClick={spinRoulette}
                disabled={isSpinning || validItems.length === 0}
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                {isSpinning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    돌리는 중...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    {hasSpun ? '다시 돌리기!' : '룰렛 돌리기!'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      {/* 항목 입력 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            📝 항목
          </h3>
          <div className="flex gap-2">
            <button
              onClick={addItem}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm flex items-center gap-1"
            >
              <Plus size={14} />
              추가
            </button>
            <button
              onClick={resetAll}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm flex items-center gap-1"
            >
              <RefreshCw size={14} />
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
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

      {/* 결과 표시 */}
      {result && !isSpinning && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-8 border border-orange-200 dark:border-orange-700 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
            <Trophy size={32} className="text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            🎉 룰렛 결과!
          </h3>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-4">
            {result}
          </div>
        </div>
      )}

      {/* 사용법 안내 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📖 사용법
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>• 룰렛에 넣을 항목들을 입력하세요</li>
          <li>• 빠른 설정 버튼으로 미리 준비된 항목들을 사용할 수 있습니다</li>
          <li>• 추가 버튼으로 더 많은 항목을 추가할 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
};

export default Roulette;