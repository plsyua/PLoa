import { useState, useEffect } from 'react';

/**
 * 테마 관리 커스텀 훅
 * 다크/라이트 테마 전환 기능을 제공
 */
const useTheme = () => {
  const [theme, setTheme] = useState('dark'); // 기본값은 다크 테마
  const STORAGE_KEY = 'ploa_theme';

  // 컴포넌트 마운트 시 저장된 테마 설정 로드
  useEffect(() => {
    try {
      // 로컬스토리지에서 테마 설정 확인
      const storedTheme = localStorage.getItem(STORAGE_KEY);
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme);
        applyTheme(storedTheme);
      } else {
        // 저장된 설정이 없으면 시스템 다크모드 설정 확인
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        setTheme(initialTheme);
        applyTheme(initialTheme);
      }
    } catch (error) {
      console.error('테마 설정 로드 실패:', error);
      // 오류 발생 시 다크 테마로 기본 설정
      setTheme('dark');
      applyTheme('dark');
    }
  }, []);

  /**
   * HTML 요소에 테마 클래스 적용
   * @param {string} newTheme - 적용할 테마 ('dark' 또는 'light')
   */
  const applyTheme = (newTheme) => {
    const html = document.documentElement;
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  /**
   * 테마 전환 함수
   */
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    setTheme(newTheme);
    applyTheme(newTheme);
    
    // 로컬스토리지에 저장
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('테마 설정 저장 실패:', error);
    }
  };

  /**
   * 특정 테마로 설정
   * @param {string} newTheme - 설정할 테마 ('dark' 또는 'light')
   */
  const setThemeMode = (newTheme) => {
    if (newTheme !== 'dark' && newTheme !== 'light') {
      console.warn('유효하지 않은 테마:', newTheme);
      return;
    }

    setTheme(newTheme);
    applyTheme(newTheme);
    
    // 로컬스토리지에 저장
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('테마 설정 저장 실패:', error);
    }
  };

  /**
   * 시스템 다크모드 설정 감지 및 자동 적용
   */
  const useSystemTheme = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    setThemeMode(systemTheme);
    
    // 로컬스토리지에서 설정 제거 (시스템 설정 따르도록)
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('테마 설정 삭제 실패:', error);
    }
  };

  return {
    theme,
    toggleTheme,
    setThemeMode,
    useSystemTheme,
    isDark: theme === 'dark'
  };
};

export default useTheme;