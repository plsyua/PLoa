import { useState, useEffect } from 'react';

// localStorage와 연동되는 상태 관리 커스텀 훅
const useLocalStorage = (key, initialValue) => {
  // localStorage에서 값 읽기 또는 기본값 사용
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`localStorage 읽기 실패 (${key}):`, error);
      return initialValue;
    }
  });

  // 값 설정 함수
  const setValue = (value) => {
    try {
      // 함수가 전달된 경우 실행하여 새 값 계산
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      // localStorage에 저장
      if (valueToStore === undefined || valueToStore === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`localStorage 저장 실패 (${key}):`, error);
    }
  };

  // 값 제거 함수
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`localStorage 삭제 실패 (${key}):`, error);
    }
  };

  // 다른 탭에서 localStorage가 변경되었을 때 동기화
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`localStorage 동기화 실패 (${key}):`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;