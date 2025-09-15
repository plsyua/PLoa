import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Clock, X, Star, ChevronDown, Sun, Moon, User } from 'lucide-react';
import useSearchHistory from '../../hooks/useSearchHistory';
import useFavorites from '../../hooks/useFavorites';
import useTheme from '../../hooks/useTheme';
import { getIcon } from '../../data/icons';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const favoritesRef = useRef(null);
  const { searchHistory, removeFromHistory } = useSearchHistory();
  const { favorites, removeFromFavorites } = useFavorites();
  const { toggleTheme, isDark } = useTheme();
  
  // 현재 경로에 따른 활성 상태 확인
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname === path) return true;
    return false;
  };

  // 클릭 외부 감지로 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 검색 드롭다운 닫기
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      
      // 즐겨찾기 드롭다운 닫기
      if (favoritesRef.current && !favoritesRef.current.contains(event.target)) {
        setShowFavorites(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // 캐릭터 검색 처리
  const handleSearch = (e, characterData = null) => {
    if (e) e.preventDefault();
    
    const targetName = typeof characterData === 'string' ? characterData : characterData?.name || searchTerm.trim();
    if (!targetName) return;
    
    // 페이지 이동 (검색 기록은 성공한 검색에서만 추가)
    navigate(`/character/${encodeURIComponent(targetName)}`);
    setSearchTerm('');
    setShowDropdown(false);
  };

  // 검색창 포커스 시 드롭다운 표시
  const handleInputFocus = () => {
    if (searchHistory.length > 0) {
      setShowDropdown(true);
    }
  };

  // 검색어 변경 시 드롭다운 표시/숨김 처리
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (searchHistory.length > 0 && !showDropdown) {
      setShowDropdown(true);
    }
  };

  // 검색 기록에서 특정 항목 제거
  const handleRemoveHistory = (e, characterName) => {
    e.stopPropagation();
    removeFromHistory(characterName);
  };

  // 즐겨찾기에서 캐릭터로 이동
  const handleFavoriteClick = (characterName) => {
    navigate(`/character/${encodeURIComponent(characterName)}`);
    setShowFavorites(false);
  };

  // 즐겨찾기에서 특정 항목 제거
  const handleRemoveFavorite = (e, characterName) => {
    e.stopPropagation();
    removeFromFavorites(characterName);
  };
  
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
      {/* 상단: 로고 + 검색창 */}
      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6">
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            PLOA
          </Link>

          {/* 즐겨찾기 드롭다운 */}
          <div className="relative" ref={favoritesRef}>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <Star size={14} />
              <span>즐겨찾기</span>
              <ChevronDown size={14} />
            </button>
            
            {showFavorites && (
              <div className="absolute top-full left-0 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-b shadow-lg z-50 mt-1">
                {favorites.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-500 text-center">
                    즐겨찾기가 없습니다
                  </div>
                ) : (
                  favorites.map((favorite, index) => {
                    const classIcon = getIcon('CHARACTER', favorite.className);
                    return (
                      <div
                        key={index}
                        onClick={() => handleFavoriteClick(favorite.name)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                      >
                        {/* 캐릭터 아이콘 */}
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center border border-gray-400 dark:border-gray-500 overflow-hidden flex-shrink-0">
                          {classIcon ? (
                            <img 
                              src={classIcon} 
                              alt={favorite.className}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <User 
                            className="w-4 h-4 text-gray-600 dark:text-gray-300" 
                            style={{ display: classIcon ? 'none' : 'flex' }}
                          />
                        </div>
                        
                        {/* 캐릭터 정보 */}
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-900 dark:text-white font-medium truncate">{favorite.name}</div>
                          {(favorite.serverName || favorite.className) && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {[favorite.serverName, favorite.className].filter(Boolean).join(' • ')}
                              {favorite.itemLevel > 0 && ` • ${favorite.itemLevel}`}
                            </div>
                          )}
                        </div>
                        
                        {/* 제거 버튼 */}
                        <button
                          onClick={(e) => handleRemoveFavorite(e, favorite.name)}
                          className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
          
          <div className="relative">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder="캐릭터 검색"
                className="w-64 h-9 px-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="h-9 px-3 bg-gray-200 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center"
              >
                <Search size={16} />
              </button>
            </form>
            
            {/* 검색 기록 드롭다운 */}
            {showDropdown && searchHistory.length > 0 && (
              <div 
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 border-t-0 rounded-b shadow-lg z-50"
              >
                {searchHistory.map((characterName, index) => (
                  <div
                    key={index}
                    onClick={() => handleSearch(null, characterName)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Clock size={14} />
                    <span className="flex-1">{characterName}</span>
                    <button
                      onClick={(e) => handleRemoveHistory(e, characterName)}
                      className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 하단: 네비게이션 메뉴 */}
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center justify-end gap-6 text-sm text-gray-600 dark:text-gray-300">
            <Link 
              to="/" 
              className={`hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-1 relative ${
                isActive('/') ? 'text-gray-900 dark:text-white font-medium' : ''
              }`}
            >
              홈
              {isActive('/') && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>}
            </Link>
            <Link 
              to="/scheduler" 
              className={`hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-1 relative ${
                isActive('/scheduler') ? 'text-gray-900 dark:text-white font-medium' : ''
              }`}
            >
              스케줄러
              {isActive('/scheduler') && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>}
            </Link>
            <Link 
              to="/market" 
              className={`hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-1 relative ${
                isActive('/market') ? 'text-gray-900 dark:text-white font-medium' : ''
              }`}
            >
              시세
              {isActive('/market') && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>}
            </Link>
            <Link 
              to="/utility" 
              className={`hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-1 relative ${
                isActive('/utility') ? 'text-gray-900 dark:text-white font-medium' : ''
              }`}
            >
              유틸리티
              {isActive('/utility') && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>}
            </Link>
            <Link 
              to="/party-search" 
              className={`hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-1 relative ${
                isActive('/party-search') ? 'text-gray-900 dark:text-white font-medium' : ''
              }`}
            >
              파티 검색
              {isActive('/party-search') && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>}
            </Link>
            
            {/* 테마 토글 버튼 */}
            <button
              onClick={toggleTheme}
              className="hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1 flex items-center justify-center"
              title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;