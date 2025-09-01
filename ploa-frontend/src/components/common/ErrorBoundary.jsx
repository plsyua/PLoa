import React from 'react';
import { RefreshCw } from 'lucide-react';

// React Error Boundary 컴포넌트 - 컴포넌트 크래시를 잡아서 안전하게 처리
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // 에러가 발생하면 상태를 업데이트하여 fallback UI를 렌더링합니다
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 로깅 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary가 에러를 감지했습니다:', error);
      console.error('에러 정보:', errorInfo);
    }
  }

  handleRetry = () => {
    // 에러 상태를 리셋하여 컴포넌트를 다시 렌더링 시도
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      // 에러 발생 시 표시할 fallback UI
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              {this.props.title || '오류가 발생했습니다'}
            </h3>
            <p className="text-red-700 dark:text-red-300 text-sm">
              {this.props.message || '컴포넌트를 불러오는 중 문제가 발생했습니다. 다시 시도해보세요.'}
            </p>
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/40 rounded text-xs text-red-800 dark:text-red-200 text-left overflow-auto">
                <strong>에러 세부사항:</strong><br />
                {this.state.error.message}
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              다시 시도
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;