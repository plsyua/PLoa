import { useState, useEffect } from 'react';

/**
 * 즐겨찾기 관리 커스텀 훅
 * 캐릭터 즐겨찾기 추가/제거/조회 기능을 제공
 * 실시간 동기화를 위한 커스텀 이벤트 시스템 포함
 */
const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const STORAGE_KEY = 'ploa_favorites';
  const CUSTOM_EVENT = 'ploa-favorites-changed';

  /**
   * 로컬스토리지에서 즐겨찾기 목록 로드
   */
  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // 배열이고 유효한 데이터인지 검증
        if (Array.isArray(parsed) && parsed.every(item => 
          typeof item === 'object' && 
          typeof item.name === 'string' && 
          typeof item.timestamp === 'number'
        )) {
          setFavorites(parsed);
          return;
        }
      }
      setFavorites([]);
    } catch (error) {
      console.error('즐겨찾기 로드 실패:', error);
      setFavorites([]);
    }
  };

  // 컴포넌트 마운트 시 즐겨찾기 로드 및 이벤트 리스너 등록
  useEffect(() => {
    // 초기 로드
    loadFavorites();

    // 커스텀 이벤트 리스너 등록 (같은 창 내 컴포넌트 간 동기화)
    const handleFavoritesChanged = () => {
      loadFavorites();
    };
    
    window.addEventListener(CUSTOM_EVENT, handleFavoritesChanged);

    // 로컬스토리지 이벤트 리스너 등록 (다른 탭/창 간 동기화)
    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY) {
        loadFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 클린업 함수
    return () => {
      window.removeEventListener(CUSTOM_EVENT, handleFavoritesChanged);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /**
   * 캐릭터를 즐겨찾기에 추가
   * @param {string} characterName - 즐겨찾기에 추가할 캐릭터명
   * @param {string} serverName - 캐릭터 서버명 (선택사항)
   * @param {string} className - 캐릭터 직업명 (선택사항)
   * @param {number} itemLevel - 캐릭터 아이템레벨 (선택사항)
   */
  const addToFavorites = (characterName, serverName = '', className = '', itemLevel = 0) => {
    if (!characterName || typeof characterName !== 'string') {
      return;
    }

    const trimmedName = characterName.trim();
    if (!trimmedName) {
      return;
    }

    setFavorites(prevFavorites => {
      // 중복 체크: 이미 즐겨찾기에 있는지 확인
      const isAlreadyFavorite = prevFavorites.some(fav => fav.name === trimmedName);
      if (isAlreadyFavorite) {
        return prevFavorites;
      }

      // 새로운 즐겨찾기 항목 생성
      const newFavorite = {
        name: trimmedName,
        serverName: serverName || '',
        className: className || '',
        itemLevel: itemLevel || 0,
        timestamp: Date.now()
      };

      // 새로운 즐겨찾기를 맨 앞에 추가
      const newFavorites = [newFavorite, ...prevFavorites];

      // 로컬스토리지에 저장
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
        
        // 커스텀 이벤트 발생으로 다른 컴포넌트에 변경사항 알림
        window.dispatchEvent(new CustomEvent(CUSTOM_EVENT, { 
          detail: { type: 'add', characterName: trimmedName } 
        }));
      } catch (error) {
        console.error('즐겨찾기 저장 실패:', error);
      }

      return newFavorites;
    });
  };

  /**
   * 캐릭터를 즐겨찾기에서 제거
   * @param {string} characterName - 제거할 캐릭터명
   */
  const removeFromFavorites = (characterName) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(fav => fav.name !== characterName);

      // 로컬스토리지 업데이트
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
        
        // 커스텀 이벤트 발생으로 다른 컴포넌트에 변경사항 알림
        window.dispatchEvent(new CustomEvent(CUSTOM_EVENT, { 
          detail: { type: 'remove', characterName } 
        }));
      } catch (error) {
        console.error('즐겨찾기 저장 실패:', error);
      }

      return newFavorites;
    });
  };

  /**
   * 특정 캐릭터가 즐겨찾기에 있는지 확인
   * @param {string} characterName - 확인할 캐릭터명
   * @returns {boolean} 즐겨찾기 여부
   */
  const isFavorite = (characterName) => {
    return favorites.some(fav => fav.name === characterName);
  };

  /**
   * 즐겨찾기 목록 전체 초기화
   */
  const clearFavorites = () => {
    setFavorites([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      
      // 커스텀 이벤트 발생으로 다른 컴포넌트에 변경사항 알림
      window.dispatchEvent(new CustomEvent(CUSTOM_EVENT, { 
        detail: { type: 'clear' } 
      }));
    } catch (error) {
      console.error('즐겨찾기 삭제 실패:', error);
    }
  };

  /**
   * 즐겨찾기 정보 업데이트 (서버명, 직업명, 아이템레벨 등)
   * @param {string} characterName - 업데이트할 캐릭터명
   * @param {object} updateData - 업데이트할 데이터
   */
  const updateFavorite = (characterName, updateData) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.map(fav => {
        if (fav.name === characterName) {
          return { ...fav, ...updateData, timestamp: Date.now() };
        }
        return fav;
      });

      // 로컬스토리지 업데이트
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
        
        // 커스텀 이벤트 발생으로 다른 컴포넌트에 변경사항 알림
        window.dispatchEvent(new CustomEvent(CUSTOM_EVENT, { 
          detail: { type: 'update', characterName, updateData } 
        }));
      } catch (error) {
        console.error('즐겨찾기 업데이트 실패:', error);
      }

      return newFavorites;
    });
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    updateFavorite
  };
};

export default useFavorites;