// API 요청 캐시 시스템
// 메모리 캐시 + LocalStorage 영구 캐시 조합

class APICache {
  constructor() {
    this.memoryCache = new Map(); // 메모리 캐시 (빠른 접근)
    this.pendingRequests = new Map(); // 중복 요청 방지용
    this.CACHE_DURATION = 10 * 60 * 1000; // 10분 (밀리초)
    this.STORAGE_PREFIX = 'ploa_api_cache_';
  }

  // 캐시 키 생성 (API 엔드포인트 + 파라미터 기반)
  generateKey(endpoint, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${endpoint}${paramString ? `_${paramString}` : ''}`;
  }

  // 캐시된 데이터 가져오기 (메모리 우선, 없으면 LocalStorage)
  get(key) {
    // 1. 메모리 캐시 확인
    const memoryData = this.memoryCache.get(key);
    if (memoryData && this.isValid(memoryData)) {
      return memoryData.data;
    }

    // 2. LocalStorage 캐시 확인
    try {
      const storageKey = this.STORAGE_PREFIX + key;
      const storageData = localStorage.getItem(storageKey);
      if (storageData) {
        const parsed = JSON.parse(storageData);
        if (this.isValid(parsed)) {
          // LocalStorage에서 가져온 데이터를 메모리 캐시에도 저장
          this.memoryCache.set(key, parsed);
          return parsed.data;
        } else {
          // 만료된 데이터 제거
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.warn('캐시 데이터 읽기 실패:', error);
    }

    return null;
  }

  // 캐시에 데이터 저장 (메모리 + LocalStorage)
  set(key, data) {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION
    };

    // 메모리 캐시에 저장
    this.memoryCache.set(key, cacheEntry);

    // LocalStorage에 저장 (에러 시 무시)
    try {
      const storageKey = this.STORAGE_PREFIX + key;
      localStorage.setItem(storageKey, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn('캐시 데이터 저장 실패:', error);
    }
  }

  // 캐시 데이터 유효성 검사
  isValid(cacheEntry) {
    if (!cacheEntry || !cacheEntry.expiresAt) {
      return false;
    }
    return Date.now() < cacheEntry.expiresAt;
  }

  // 중복 요청 방지를 위한 Promise 관리
  getPendingRequest(key) {
    return this.pendingRequests.get(key);
  }

  setPendingRequest(key, promise) {
    this.pendingRequests.set(key, promise);
    
    // 요청 완료 후 pending에서 제거
    promise.finally(() => {
      this.pendingRequests.delete(key);
    });

    return promise;
  }

  // 특정 키의 캐시 삭제
  delete(key) {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + key);
    } catch (error) {
      console.warn('캐시 데이터 삭제 실패:', error);
    }
  }

  // 특정 패턴의 캐시 삭제 (예: 특정 캐릭터의 모든 데이터)
  deletePattern(pattern) {
    // 메모리 캐시에서 삭제
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    }

    // LocalStorage에서 삭제
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX) && key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.warn('패턴 캐시 삭제 실패:', error);
    }
  }

  // 만료된 캐시 정리
  cleanup() {
    const now = Date.now();

    // 메모리 캐시 정리
    for (const [key, entry] of this.memoryCache.entries()) {
      if (!this.isValid(entry)) {
        this.memoryCache.delete(key);
      }
    }

    // LocalStorage 정리
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            if (!this.isValid(parsed)) {
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      console.warn('캐시 정리 실패:', error);
    }
  }

  // 전체 캐시 초기화
  clear() {
    this.memoryCache.clear();
    this.pendingRequests.clear();

    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.warn('전체 캐시 초기화 실패:', error);
    }
  }

  // 캐시 통계
  getStats() {
    return {
      memorySize: this.memoryCache.size,
      pendingRequests: this.pendingRequests.size,
      cacheDuration: this.CACHE_DURATION / 1000 / 60 + ' minutes'
    };
  }
}

// 전역 캐시 인스턴스
export const apiCache = new APICache();

// 페이지 로드 시 만료된 캐시 정리
apiCache.cleanup();

// 주기적으로 캐시 정리 (5분마다)
setInterval(() => {
  apiCache.cleanup();
}, 5 * 60 * 1000);

export default apiCache;