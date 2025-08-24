import { useState, useEffect } from 'react';

/**
 * 검색 기록 관리 커스텀 훅
 * 최근 검색한 캐릭터명 7개를 로컬스토리지에 저장/관리
 */
const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const STORAGE_KEY = 'ploa_search_history';
  const MAX_HISTORY_SIZE = 7;

  // 컴포넌트 마운트 시 로컬스토리지에서 검색 기록 로드
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // 배열이고 유효한 데이터인지 검증
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
          setSearchHistory(parsed);
        }
      }
    } catch (error) {
      console.error('검색 기록 로드 실패:', error);
      // 오류 발생 시 빈 배열로 초기화
      setSearchHistory([]);
    }
  }, []);

  // 검색 기록 실시간 업데이트를 위한 이벤트 리스너
  useEffect(() => {
    const handleSearchHistoryUpdate = (event) => {
      setSearchHistory(event.detail);
    };

    window.addEventListener('searchHistoryUpdate', handleSearchHistoryUpdate);
    return () => {
      window.removeEventListener('searchHistoryUpdate', handleSearchHistoryUpdate);
    };
  }, []);

  /**
   * 새로운 검색어를 기록에 추가
   * @param {string} characterName - 검색한 캐릭터명
   */
  const addToHistory = (characterName) => {
    if (!characterName || typeof characterName !== 'string') {
      return;
    }

    // 문자열 앞뒤 공백 제거
    const trimmedName = characterName.trim();
    if (!trimmedName) {
      return;
    }

    setSearchHistory(prevHistory => {
      // 중복 제거: 이미 존재하는 캐릭터명이면 기존 위치에서 제거
      const filteredHistory = prevHistory.filter(name => name !== trimmedName);
      
      // 새로운 검색어를 맨 앞에 추가하고 최대 7개로 제한
      const newHistory = [trimmedName, ...filteredHistory].slice(0, MAX_HISTORY_SIZE);
      
      // 로컬스토리지에 저장
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        // 실시간 업데이트를 위한 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('searchHistoryUpdate', { detail: newHistory }));
      } catch (error) {
        console.error('검색 기록 저장 실패:', error);
      }
      
      return newHistory;
    });
  };

  /**
   * 특정 검색어를 기록에서 제거
   * @param {string} characterName - 제거할 캐릭터명
   */
  const removeFromHistory = (characterName) => {
    setSearchHistory(prevHistory => {
      const newHistory = prevHistory.filter(name => name !== characterName);
      
      // 로컬스토리지 업데이트
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        // 실시간 업데이트를 위한 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('searchHistoryUpdate', { detail: newHistory }));
      } catch (error) {
        console.error('검색 기록 저장 실패:', error);
      }
      
      return newHistory;
    });
  };

  /**
   * 검색 기록의 닉네임을 정확한 닉네임으로 업데이트
   * @param {string} oldName - 기존 닉네임 (대소문자 부정확)
   * @param {string} correctName - 정확한 닉네임
   */
  const updateCharacterName = (oldName, correctName) => {
    if (!oldName || !correctName || oldName === correctName) {
      return;
    }

    setSearchHistory(prevHistory => {
      const index = prevHistory.findIndex(name => name.toLowerCase() === oldName.toLowerCase());
      if (index === -1) {
        return prevHistory;
      }

      const newHistory = [...prevHistory];
      newHistory[index] = correctName;

      // 로컬스토리지에 저장
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        // 실시간 업데이트를 위한 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('searchHistoryUpdate', { detail: newHistory }));
      } catch (error) {
        console.error('검색 기록 저장 실패:', error);
      }

      return newHistory;
    });
  };

  /**
   * 모든 검색 기록 초기화
   */
  const clearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('검색 기록 삭제 실패:', error);
    }
  };

  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    updateCharacterName
  };
};

export default useSearchHistory;