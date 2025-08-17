import { useState, useCallback } from 'react';

// API 호출 상태 관리를 위한 커스텀 훅
const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API 호출 실행 함수
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      setData(result);
      
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('API 호출 실패:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  // 데이터와 에러 초기화
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // 에러만 초기화  
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    clearError
  };
};

export default useApi;