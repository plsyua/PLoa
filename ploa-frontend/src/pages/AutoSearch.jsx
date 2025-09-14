import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { Upload, Image as ImageIcon, Search, Users, ExternalLink, Keyboard } from 'lucide-react';

const AutoSearch = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ocrResults, setOcrResults] = useState(null);

  // 클립보드 붙여넣기 이벤트 처리
  const handlePaste = useCallback((e) => {
    e.preventDefault();

    const items = e.clipboardData?.items;
    if (!items) return;

    // 클립보드에서 이미지 찾기
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          handleFile(file);
          return;
        }
      }
    }

    // 이미지가 없으면 안내 메시지
    setError('클립보드에 이미지가 없습니다. 스크린샷을 먼저 캡처해주세요.');
  }, []);

  // 페이지 전체에 paste 이벤트 리스너 등록
  useEffect(() => {
    const handleGlobalPaste = (e) => {
      // 입력 필드에서 paste 이벤트가 발생한 경우는 제외
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      handlePaste(e);
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [handlePaste]);

  // 드래그 앤 드롭 이벤트 처리
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // 파일 드롭 처리
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  // 파일 선택 처리
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // 파일 처리 공통 함수
  const handleFile = (file) => {
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    setUploadedImage(file);
    setError(null);
    setOcrResults(null);

    // 이미지 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // OCR 처리 시작
  const handleOCRProcess = async () => {
    if (!uploadedImage) return;

    setLoading(true);
    setError(null);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('image', uploadedImage);

      // OCR API 호출
      const response = await fetch('/api/ocr-nicknames', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`OCR 처리 실패: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.nicknames && result.nicknames.length > 0) {
        // 닉네임 확인 페이지로 이동
        navigate('/confirm-nicknames', {
          state: {
            nicknames: result.nicknames,
            originalImage: imagePreview
          }
        });
      } else {
        setError('닉네임을 찾을 수 없습니다. 이미지를 다시 확인해주세요.');
      }
    } catch (err) {
      console.error('OCR 처리 오류:', err);
      setError('OCR 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 이미지 초기화
  const resetImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setOcrResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            자동 검색
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            로스트아크 대기실 스크린샷을 업로드하면 자동으로 닉네임을 인식하여 캐릭터 정보를 검색합니다.
          </p>
        </div>

        {/* 이미지 업로드 영역 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ImageIcon size={24} />
            이미지 업로드
          </h2>

          {!imagePreview ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                이미지를 드래그하여 업로드하거나
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                클릭하여 파일을 선택하세요
              </p>
              <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <Keyboard size={16} className="text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  또는 스크린샷 캡처 후 <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">Ctrl+V</kbd>로 붙여넣기
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                파일 선택
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                지원 형식: JPG, PNG, GIF (최대 10MB) | 클립보드 이미지 지원
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 이미지 미리보기 */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <img
                  src={imagePreview}
                  alt="업로드된 이미지"
                  className="max-w-full max-h-96 mx-auto rounded-lg border border-gray-300 dark:border-gray-600"
                />
              </div>
              
              {/* 버튼 영역 */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={resetImage}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  다시 선택
                </button>
                <button
                  onClick={handleOCRProcess}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      닉네임 인식 중...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      닉네임 인식 시작
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* 사용법 안내 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <Users size={20} />
            사용법 안내
          </h3>
          <div className="space-y-2 text-blue-800 dark:text-blue-200">
            <p>1. <strong>스크린샷 촬영:</strong> 로스트아크 대기실 또는 파티 모집 화면을 캡처하세요.</p>
            <p>2. <strong>이미지 업로드:</strong> 다음 중 한 가지 방법을 선택하세요.</p>
            <div className="ml-4 space-y-1 text-sm">
              <p>• 파일 드래그앤드롭 또는 파일 선택 버튼</p>
              <p>• <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-xs">Ctrl+V</kbd> 키로 클립보드 이미지 붙여넣기 (캡처 도구 사용 후)</p>
            </div>
            <p>3. <strong>닉네임 인식:</strong> '닉네임 인식 시작' 버튼을 클릭하면 자동으로 닉네임을 추출합니다.</p>
            <p>4. <strong>결과 확인:</strong> 인식된 닉네임들의 종합 정보를 확인하고, 원하는 캐릭터를 선택하세요.</p>
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800/30 rounded border border-blue-300 dark:border-blue-600">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>팁:</strong> 닉네임이 선명하게 보이는 고해상도 스크린샷을 사용하면 더 정확한 결과를 얻을 수 있습니다.
              Windows는 <strong>Snipping Tool</strong>, macOS는 <strong>Command+Shift+4</strong> 사용을 권장합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoSearch;