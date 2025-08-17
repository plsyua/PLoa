import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, BarChart3, RefreshCw, Settings } from 'lucide-react';
import { getMarketOptions, searchMarketItems, getItemPriceHistory } from '../services/lostarkApi';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import parse from 'html-react-parser';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import GradeTag from '../components/ui/GradeTag';
import { MarketItemsSkeleton } from '../components/common/SkeletonLoader';
import { getMarketGradeStyle, getGradeBorderColor } from '../utils/formatters';

const MarketPrice = () => {
  // 검색 관련 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(50000); // 강화 재료를 기본값으로 설정
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedClass, setSelectedClass] = useState(''); // 클래스 필터 추가
  const [marketOptions, setMarketOptions] = useState(null);

  // 검색 결과 관련 상태
  const [marketItems, setMarketItems] = useState([]); // 현재 페이지 아이템들
  const [totalCount, setTotalCount] = useState(0);
  
  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 가격 히스토리 관련 상태
  const [selectedItem, setSelectedItem] = useState(null);
  const [priceHistory, setPriceHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // 🆕 툴팁 관련 상태
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [itemTooltipData, setItemTooltipData] = useState(null); // API 툴팁 데이터
  const [tooltipLoading, setTooltipLoading] = useState(false);  // 툴팁 로딩 상태

  // 컴포넌트 마운트 시 거래소 옵션 로드 및 초기 검색
  useEffect(() => {
    loadMarketOptions();
  }, []);

  // 거래소 옵션 로드 완료 후 초기 검색 실행
  useEffect(() => {
    if (marketOptions) {
      handleSearch(); // 강화 재료 카테고리로 초기 검색
    }
  }, [marketOptions]);

  // 거래소 검색 옵션 불러오기 (카테고리, 등급, 클래스 목록 등)
  const loadMarketOptions = async () => {
    try {
      const options = await getMarketOptions();
      setMarketOptions(options);
    } catch (error) {
      console.error('거래소 옵션 로드 실패:', error);
    }
  };

  // 검색 실행 함수
  const handleSearch = async (e = null, page = 1) => {
    // 폼 이벤트가 있다면 기본 동작 방지
    if (e) e.preventDefault();
    
    console.log(`=== 검색 시작 ===`);
    console.log(`페이지: ${page}, 카테고리: ${selectedCategory}, 등급: ${selectedGrade}, 클래스: ${selectedClass}`);
    
    // 새로운 검색이면 기존 데이터 초기화
    if (e || page === 1) {
      console.log('기존 데이터 초기화');
      setMarketItems([]);
      setSelectedItem(null);
      setPriceHistory(null);
      setCurrentPage(1);
    }

    setLoading(true);

    try {
      // 검색 옵션 설정
      const searchOptions = {
        Sort: "RECENT_PRICE",
        CategoryCode: selectedCategory,
        ItemGrade: selectedGrade,
        CharacterClass: selectedClass, // 클래스 필터 추가
        ItemName: searchTerm,
        PageNo: page, // API는 1부터 시작
        SortCondition: "ASC"
      };

      console.log('검색 옵션:', searchOptions);
      
      // API 호출
      const result = await searchMarketItems(searchOptions);
      let items = result.Items || [];
      
      console.log(`API 원본 결과: ${items.length}개 아이템`);
      
      // 결과 설정
      setMarketItems(items);
      setTotalCount(result.TotalCount || 0);
      setCurrentPage(page);
      
    } catch (error) {
      console.error('검색 실패:', error);
      // 에러 시에도 데이터 초기화
      setMarketItems([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 시 - API 호출로 해당 페이지 데이터 가져오기
  const handlePageChange = (newPage) => {
    console.log(`페이지 변경: ${currentPage} → ${newPage}`);
    handleSearch(null, newPage);
  };

  // 아이템 클릭해서 가격 히스토리 보기
  const loadPriceHistory = async (item) => {
    setHistoryLoading(true);
    setSelectedItem(item);
    
    try {
      const history = await getItemPriceHistory(item.Id);
      console.log('가격 히스토리 원본:', history);
      
      if (history && history.length > 0) {
        // 🔥 실제 거래 데이터가 있는 아이템을 우선 선택
        let selectedHistory = null;
        
        // 1단계: TradeRemainCount=0인 아이템 찾기 (실제 거래 완료된 데이터)
        selectedHistory = history.find(h => h.TradeRemainCount === 0);
        
        // 2단계: 없으면 Stats에 실제 데이터가 있는 아이템 찾기
        if (!selectedHistory) {
          selectedHistory = history.find(h => 
            h.Stats && h.Stats.some(stat => stat.AvgPrice > 0 || stat.TradeCount > 0)
          );
        }
        
        // 3단계: 그래도 없으면 첫 번째 아이템 사용
        if (!selectedHistory) {
          selectedHistory = history[0];
        }
        
        setPriceHistory(selectedHistory);
        console.log('선택된 가격 히스토리:', selectedHistory);
        console.log('TradeRemainCount:', selectedHistory.TradeRemainCount);
      } else {
        console.log('가격 히스토리 없음');
        setPriceHistory(null);
      }
    } catch (error) {
      console.error('가격 히스토리 로드 실패:', error);
      setPriceHistory(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  // 🔥 아이템 툴팁 데이터 로드 함수
  const loadItemTooltip = async (item) => {
    setTooltipLoading(true);
    try {
      // 아이템별 상세 정보 API 호출 (response_markets-items-{itemId}.json 형태)
      const tooltipData = await getItemPriceHistory(item.Id);
      if (tooltipData && tooltipData.length > 0) {
        // ToolTip 데이터가 있는 아이템 찾기
        const itemWithTooltip = tooltipData.find(data => data.ToolTip);
        if (itemWithTooltip && itemWithTooltip.ToolTip) {
          try {
            // JSON 문자열을 파싱하여 툴팁 데이터 추출
            const parsedTooltip = JSON.parse(itemWithTooltip.ToolTip);
            setItemTooltipData(parsedTooltip);
          } catch (parseError) {
            console.error('툴팁 JSON 파싱 실패:', parseError);
            setItemTooltipData(null);
          }
        }
      }
    } catch (error) {
      console.error('아이템 툴팁 로드 실패:', error);
      setItemTooltipData(null);
    } finally {
      setTooltipLoading(false);
    }
  };

// 🚀 초간단 HTML 파서 (html-react-parser 사용)
const parseHtmlTooltip = (htmlText) => {
  if (!htmlText) return <div>툴팁 데이터가 없습니다.</div>;

  // HTML 전처리만 최소화
  const processedHtml = htmlText
    .replace(/<FONT COLOR='([^']+)'[^>]*>/gi, '<span style="color: $1">')
    .replace(/<FONT SIZE='([^']+)'[^>]*>/gi, '<span style="font-size: $1px; font-weight: 600">')
    .replace(/<\/FONT>/gi, '</span>')
    .replace(/<BR\s*\/?>/gi, '<br/>')
    .replace(/획득 시 원정대 귀속/g, '획득 시 원정대 귀속<br/>')
    .replace(/\|거래/g, '거래')  // 🔥 이 줄 추가! |거래 → 거래
    .replace(/\|/g, '');

  // html-react-parser가 모든 HTML을 안전하게 React로 변환
  return (
    <div className="leading-relaxed text-sm">
      {parse(processedHtml)}
    </div>
  );
};

// 가격 포맷팅 (천 단위 콤마, 소수점 제거)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(Math.floor(price));
  };

  // 가격 변동 표시 로직
  const getPriceChangeDisplay = (current, yesterday, recent) => {
    if (!current || current === 0) {
      return { amount: 0, percent: 0, hasChange: false };
    }
    
    let comparePrice = yesterday;
    
    // 어제 가격이 없거나 0이면 최근 가격 사용
    if ((!yesterday || yesterday === 0) && recent && recent > 0) {
      comparePrice = recent;
    }
    
    if (!comparePrice || comparePrice === 0) {
      return { amount: 0, percent: 0, hasChange: false };
    }
    
    const amount = current - comparePrice;
    const percent = ((current - comparePrice) / comparePrice * 100);
    
    return { 
      amount: Math.abs(amount), 
      percent: Math.abs(percent), 
      hasChange: Math.abs(percent) > 0.1, // 0.1% 이상만 변동으로 간주
      isIncrease: current > comparePrice
    };
  };

  // 아이템 등급별 색상
  // 색상 함수는 utils/formatters.js에서 import하여 사용
  
  // 페이지네이션 계산
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* 헤더 컴포넌트 */}
      <Header />

      <div className="max-w-[1400px] mx-auto px-3 py-8">
        {/* 검색 섹션 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 size={24} className="text-blue-500 dark:text-blue-400" />
              거래소 시세 검색
            </h2>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* 카테고리 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">카테고리</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {marketOptions?.Categories?.map((category) => (
                    <option key={category.Code} value={category.Code}>
                      {category.CodeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* 등급 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">등급</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체</option>
                  {marketOptions?.ItemGrades?.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* 클래스 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">클래스</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체</option>
                  {marketOptions?.Classes?.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              {/* 아이템명 검색 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">아이템명</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="아이템명을 입력하세요"
                    className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                  >
                    {loading ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
                    검색
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* 검색 결과 */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* 아이템 목록 - 3/5 공간 차지 (60%) */}
          <div className="xl:col-span-3 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">검색 결과</h3>
              <div className="flex items-center gap-4">
                {/* 결과 정보 */}
                {totalCount > 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    총 {formatPrice(totalCount)}개 중 {startItem}-{endItem}번째 
                    <span className="text-gray-500 dark:text-gray-500"> (페이지당 {pageSize}개)</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* 로딩 상태 */}
            {loading && <MarketItemsSkeleton />}

            {/* 아이템 목록 */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {marketItems.map((item, index) => {
                // 가격 변동 정보 계산
                const changeInfo = getPriceChangeDisplay(item.CurrentMinPrice, item.YDayAvgPrice, item.RecentPrice);
                const isSelected = selectedItem?.Id === item.Id;
                
                return (
                  <div
                    key={`${item.Id}-${currentPage}-${index}`}
                    onClick={() => loadPriceHistory(item)}
                    className={`p-3 rounded-lg cursor-pointer border-l-4 transition-all duration-200 ${getMarketGradeStyle(item.Grade)} ${
                      isSelected 
                        ? 'bg-blue-600/20 shadow-lg ring-2 ring-blue-500/50' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* 아이템 아이콘 - 툴팁 기능 추가 */}
                      <div 
                        className={`w-8 h-8 bg-gray-600 rounded border overflow-hidden flex-shrink-0 relative ${getGradeBorderColor(item.Grade)}`}
                        onMouseEnter={(e) => {
                        setHoveredItem(item);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipPosition({
                          x: rect.right + 10,
                          y: rect.top
                        });
                        // 🔥 API 툴팁 데이터 로드 추가
                        loadItemTooltip(item);
                      }}
                        onMouseLeave={() => {
                          setHoveredItem(null);
                          setItemTooltipData(null); // 🔥 툴팁 데이터도 초기화 추가
                        }}
                      >
                        {item.Icon && (
                          <img src={item.Icon} alt={item.Name} className="w-full h-full object-cover" />
                        )}
                      </div>

                      {/* 아이템 정보 */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm truncate ${getMarketGradeStyle(item.Grade).split(' ')[0]}`}>
                          {item.Name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-600 dark:text-gray-300">현재가:</span>
                          <span className="text-gray-900 dark:text-white font-semibold">{formatPrice(item.CurrentMinPrice)}G</span>
                          
                          {/* 가격 변동 */}
                          {changeInfo.hasChange && (
                            <>
                              {changeInfo.isIncrease ? 
                                <TrendingUp size={16} className="text-red-400" /> : 
                                <TrendingDown size={16} className="text-blue-400" />
                              }
                              <span className={changeInfo.isIncrease ? 'text-red-400' : 'text-blue-400'}>
                                {changeInfo.isIncrease ? '+' : '-'}{changeInfo.percent.toFixed(1)}%
                              </span>
                              <span className={`text-xs ${changeInfo.isIncrease ? 'text-red-400' : 'text-blue-400'}`}>
                                ({changeInfo.isIncrease ? '+' : '-'}{formatPrice(changeInfo.amount)}G)
                              </span>
                            </>
                          )}
                        </div>
                        
                        {/* 추가 정보 */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {item.YDayAvgPrice > 0 && (
                            <span>어제: {formatPrice(item.YDayAvgPrice)}G</span>
                          )}
                          {item.RecentPrice > 0 && item.RecentPrice !== item.CurrentMinPrice && (
                            <span>최근: {formatPrice(item.RecentPrice)}G</span>
                          )}
                          {item.TradeRemainCount !== null && (
                            <span>거래: {item.TradeRemainCount}회</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 🖱️ 아이템 툴팁 - API 데이터 기반 */}
            {hoveredItem && (
              <div
                className="fixed z-50 pointer-events-none"
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`,
                  transform: 'translateY(-50%)'
                }}
              >
                <div className="bg-gray-900 border border-gray-600 rounded-lg shadow-2xl p-4 max-w-md">
                  {/* 툴팁 로딩 상태 */}
                  {tooltipLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-400 text-sm">정보 로딩 중...</span>
                    </div>
                  ) : itemTooltipData ? (
                    /* 🔥 API 툴팁 데이터 표시 */
                    <div className="space-y-3">
                      {/* 아이템 이름 (Element_000) */}
                      {itemTooltipData.Element_000?.value && (
                        <div className="text-center">
                          <h4 className={`font-semibold text-sm ${getMarketGradeStyle(hoveredItem.Grade).split(' ')[0]}`}>
                            {parseHtmlTooltip(itemTooltipData.Element_000.value)}
                          </h4>
                        </div>
                      )}

                      {/* 아이템 기본 정보 (Element_001) */}
                      {itemTooltipData.Element_001?.value && (
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-700 rounded border overflow-hidden flex-shrink-0">
                            {hoveredItem.Icon && (
                              <img 
                                src={hoveredItem.Icon} 
                                alt={hoveredItem.Name} 
                                className="w-full h-full object-cover" 
                              />
                            )}
                          </div>
                          <div className="text-xs space-y-1">
                            {itemTooltipData.Element_001.value.leftStr0 && (
                              <div className="text-gray-300">
                                {parseHtmlTooltip(itemTooltipData.Element_001.value.leftStr0)}
                              </div>
                            )}
                            {itemTooltipData.Element_001.value.leftStr2 && (
                              <div className="text-gray-400">
                                {parseHtmlTooltip(itemTooltipData.Element_001.value.leftStr2)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 기본 설명들 (Element_002 ~ Element_004) */}
                      {[2, 3, 4].map(index => {
                        const element = itemTooltipData[`Element_00${index}`];
                        if (element?.value && typeof element.value === 'string') {
                          const cleanText = parseHtmlTooltip(element.value);
                          if (cleanText && cleanText !== '|거래가능' && cleanText !== '|거래 불가') {
                            return (
                              <div key={index} className="text-xs text-gray-400 border-b border-gray-700 pb-2">
                                {cleanText}
                              </div>
                            );
                          }
                        }
                        return null;
                      })}

                      {/* 주요 설명 (Element_006, Element_007) */}
                      {[6, 7].map(index => {
                        const element = itemTooltipData[`Element_00${index}`];
                        if (element?.value && typeof element.value === 'string') {
                          const cleanText = parseHtmlTooltip(element.value);
                          if (cleanText) {
                            return (
                              <div key={index} className="text-xs text-gray-300 bg-gray-800 rounded p-2">
                                {cleanText}
                              </div>
                            );
                          }
                        }
                        return null;
                      })}

                      {/* 가격 정보 (기존 정보 유지) */}
                      <div className="border-t border-gray-700 pt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">현재 최저가:</span>
                          <span className="text-white font-semibold">{formatPrice(hoveredItem.CurrentMinPrice)}G</span>
                        </div>
                        
                        {hoveredItem.YDayAvgPrice > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">어제 평균:</span>
                            <span className="text-gray-300">{formatPrice(hoveredItem.YDayAvgPrice)}G</span>
                          </div>
                        )}

                        {hoveredItem.TradeRemainCount !== null && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">거래 가능:</span>
                            <span className={`font-medium ${
                              hoveredItem.TradeRemainCount > 0 ? 'text-green-400' : 'text-gray-500'
                            }`}>
                              {hoveredItem.TradeRemainCount}회
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">묶음 수량:</span>
                          <span className="text-gray-300">{hoveredItem.BundleCount}개</span>
                        </div>
                      </div>

                      {/* 액션 안내 */}
                      <div className="border-t border-gray-700 pt-2">
                        <p className="text-xs text-gray-500 text-center">
                          클릭하여 가격 변동 확인
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* 기본 툴팁 (API 데이터 로드 실패 시) */
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gray-700 rounded border overflow-hidden">
                          {hoveredItem.Icon && (
                            <img src={hoveredItem.Icon} alt={hoveredItem.Name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <h4 className={`font-semibold text-sm ${getMarketGradeStyle(hoveredItem.Grade).split(' ')[0]}`}>
                            {hoveredItem.Name}
                          </h4>
                          <div className={`text-xs px-2 py-1 rounded border ${getMarketGradeStyle(hoveredItem.Grade)}`}>
                            {hoveredItem.Grade}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">현재 최저가:</span>
                          <span className="text-white font-semibold">{formatPrice(hoveredItem.CurrentMinPrice)}G</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">묶음 수량:</span>
                          <span className="text-gray-300">{hoveredItem.BundleCount}개</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* 검색 결과 없음 */}
            {marketItems.length === 0 && !loading && (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                검색 결과가 없습니다.
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && !loading && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  이전
                </button>
                
                <div className="flex items-center gap-1">
                  {/* 페이지 번호들 */}
                  {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (page > totalPages) return null;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 py-1 rounded text-sm ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  다음
                </button>
              </div>
            )}
          </div>

          {/* 가격 변동 그래프 - 2/5 공간 차지 (40%) */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">가격 변동</h3>
            
            {/* 히스토리 로딩 */}
            {historyLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* 선택된 아이템의 가격 히스토리 */}
            {selectedItem && priceHistory && !historyLoading && (
              <div className="space-y-4">
                <div className="border-b border-gray-300 dark:border-gray-700 pb-4">
                  <h4 className="text-gray-900 dark:text-white font-medium text-sm">{selectedItem.Name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">최근 14일 가격 변동</p>
                  <div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                    <p>현재 최저가: {formatPrice(selectedItem.CurrentMinPrice)}G</p>
                    {selectedItem.TradeRemainCount !== null && (
                      <p>거래 가능: {selectedItem.TradeRemainCount}회</p>
                    )}
                  </div>
                </div>

                {/* 📊 가격 & 거래량 차트 */}
                <div className="space-y-4">
                  {priceHistory.Stats && priceHistory.Stats.length > 0 ? (
                    <>
                      {/* 📈 복합 차트 (Bar + Line) */}
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white">14일 가격 & 거래량 추이</h5>
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                              <span className="text-gray-700 dark:text-gray-300">거래량</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-blue-400 rounded"></div>
                              <span className="text-gray-700 dark:text-gray-300">평균가격</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Recharts 복합 차트 */}
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                              data={priceHistory.Stats.slice().reverse().map(stat => ({
                                date: `${stat.Date.split('-')[1]}/${stat.Date.split('-')[2]}`, // 7/01, 7/02 형식
                                fullDate: stat.Date,
                                price: stat.AvgPrice,
                                volume: stat.TradeCount,
                                hasData: stat.AvgPrice > 0 || stat.TradeCount > 0
                              }))}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              {/* 그리드 */}
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              
                              {/* X축 (날짜) */}
                              <XAxis 
                                dataKey="date" 
                                stroke="#9CA3AF"
                                fontSize={10}
                                tick={{ fill: '#9CA3AF' }}
                              />
                              
                              {/* Y축 (거래량 - 왼쪽) */}
                              <YAxis 
                                yAxisId="volume"
                                orientation="left"
                                stroke="#FBBF24"
                                fontSize={10}
                                tick={{ fill: '#FBBF24' }}
                                tickFormatter={(value) => `${value}`}
                              />
                              
                              {/* Y축 (가격 - 오른쪽) */}
                              <YAxis 
                                yAxisId="price"
                                orientation="right"
                                stroke="#60A5FA"
                                fontSize={10}
                                tick={{ fill: '#60A5FA' }}
                                tickFormatter={(value) => formatPrice(value)}
                              />
                              
                              {/* 툴팁 */}
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#1F2937', 
                                  border: '1px solid #374151',
                                  borderRadius: '6px',
                                  color: '#F9FAFB'
                                }}
                                formatter={(value, name) => {
                                  if (name === 'price') {
                                    return [`${formatPrice(value)}G`, '평균가격'];
                                  }
                                  if (name === 'volume') {
                                    return [`${formatPrice(value)}회`, '거래량'];
                                  }
                                  return [value, name];
                                }}
                                labelFormatter={(label) => `날짜: 2025/${label}`}
                              />
                              
                              {/* 📊 거래량 바 차트 */}
                              <Bar 
                                yAxisId="volume"
                                dataKey="volume" 
                                fill="#FBBF24"
                                fillOpacity={0.7}
                                radius={[2, 2, 0, 0]}
                              />
                              
                              {/* 📈 가격 라인 차트 */}
                              <Line 
                                yAxisId="price"
                                type="monotone" 
                                dataKey="price" 
                                stroke="#60A5FA"
                                strokeWidth={3}
                                dot={{ 
                                  fill: '#60A5FA', 
                                  strokeWidth: 2, 
                                  stroke: '#1E40AF',
                                  r: 4 
                                }}
                                activeDot={{ 
                                  r: 6, 
                                  fill: '#3B82F6',
                                  stroke: '#1E40AF',
                                  strokeWidth: 2 
                                }}
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      {/* 📋 상세 거래 내역 (간소화) */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">상세 거래 내역</h5>
                        <div className="space-y-1 max-h-64 overflow-y-auto">
                          {priceHistory.Stats.filter(stat => stat.AvgPrice > 0 || stat.TradeCount > 0).map((stat, index) => {
                            const prevStat = priceHistory.Stats[index + 1];
                            const changePercent = prevStat && prevStat.AvgPrice > 0 ? 
                              ((stat.AvgPrice - prevStat.AvgPrice) / prevStat.AvgPrice * 100) : 0;
                            
                            return (
                              <div key={index} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{stat.Date}</span>
                                <div className="text-right">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-900 dark:text-white font-semibold">{formatPrice(stat.AvgPrice)}G</span>
                                    {Math.abs(changePercent) > 0.1 && (
                                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                        changePercent > 0 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                      }`}>
                                        {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-gray-600 dark:text-gray-400 mt-0.5">
                                    거래: {formatPrice(stat.TradeCount)}회
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                      가격 히스토리 데이터가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 아이템 선택 안내 */}
            {!selectedItem && (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm">
                아이템을 선택하면 가격 변동을 확인할 수 있습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPrice;