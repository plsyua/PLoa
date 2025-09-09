# PLoa (Project Lost Ark Analytics)

로스트아크 게임 데이터 분석 플랫폼 - React + Vite 기반 프론트엔드

## 🎯 주요 기능

- **캐릭터 검색**: 로스트아크 공식 API를 통한 캐릭터 정보 조회
- **시세 분석**: 아이템 가격 정보 및 히스토리 조회
- **유틸리티**: 경매 계산기, 강화 계산기, 더보기 효율 분석
- **스케줄러**: 캐릭터별 일일/주간 컨텐츠 관리
- **🆕 자동 검색**: OCR 기반 대기실 스크린샷 닉네임 인식

## 🚀 설치 및 실행

### 기본 설치
```bash
# 프론트엔드 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

### 📷 자동 검색 기능 추가 설정

자동 검색 기능을 사용하려면 추가 설정이 필요합니다.

#### 1. 백엔드 서버 설정
```bash
# 프로젝트 루트에서 백엔드 의존성 설치
cd ../
npm install  # multer 등 OCR API 의존성

# 백엔드 서버 실행
npm start    # http://localhost:3001
```

#### 2. Python OCR 환경 설정
```bash
# 시스템 패키지 설치 (Ubuntu/WSL)
sudo apt update
sudo apt install tesseract-ocr tesseract-ocr-kor python3-venv

# Python 가상환경 생성
python3 -m venv ocr_env
source ocr_env/bin/activate

# OCR 패키지 설치
pip install opencv-python pytesseract pillow py-hanspell
```

#### 3. 권한 설정
```bash
chmod +x ocr_script.py
chmod +x ocr_test_mock.py
```

## 🔧 자동 검색 기능 사용법

1. **브라우저 접속**: `http://localhost:5173` (또는 5174)
2. **'자동 검색' 탭 클릭**: 헤더 우측의 자동 검색 메뉴
3. **이미지 업로드**: 로스트아크 대기실/파티 모집 스크린샷 업로드
4. **닉네임 인식**: '닉네임 인식 시작' 버튼 클릭
5. **검색 결과 확인**: 인식된 닉네임들의 종합 정보 페이지
6. **상세 정보**: 원하는 캐릭터 클릭하여 상세 정보 확인

### 📋 검색 결과 정보
- **캐릭터 기본 정보**: 닉네임, 서버, 직업, 길드
- **레벨 정보**: 원정대 레벨, 전투 레벨, 아이템 레벨
- **원정대 정보**: 전체 캐릭터 수 및 개별 정보
- **레이드 참가 가능**: 28개 레이드별 참가 가능 캐릭터 수
- **외부 링크**: 로스트아크 공식, 로아와, 로아일기

## 🛠 기술 스택

- **Frontend**: React 19.1.0 + Vite 5.4.0
- **Styling**: TailwindCSS 3.4.17
- **Routing**: React Router DOM 7.6.3
- **Charts**: Recharts 3.1.0
- **Icons**: Lucide React 0.525.0
- **HTTP Client**: axios 1.10.0
- **Backend**: Express 4.21.2 + Python OCR

## 🔍 OCR 기술 스택

- **이미지 처리**: OpenCV (전처리, 크기 조정, 필터링)
- **텍스트 인식**: Tesseract OCR (한글+영문 동시 지원)
- **맞춤법 검사**: py-hanspell (한글 닉네임 교정)
- **파이프라인**: ROI 크롭 → 확대 → Grayscale → Binary → 형태학적 연산

## 🐛 문제 해결

### OCR 관련
- **인식률이 낮은 경우**: 고해상도 스크린샷 사용, 닉네임이 선명하게 보이는 이미지 업로드
- **py-hanspell 설치 오류**: GitHub에서 수동 다운로드 후 `pip install .`로 설치
- **Tesseract 오류**: `sudo apt install tesseract-ocr-kor` 한글 언어팩 설치

### 일반적인 오류
- **포트 충돌**: 프론트엔드는 5173/5174, 백엔드는 3001 포트 사용
- **API 오류**: .env 파일의 로스트아크 API 키 확인
- **CORS 오류**: 백엔드 서버가 실행 중인지 확인

## 📁 프로젝트 구조

```
ploa-frontend/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── character/       # 캐릭터 관련 컴포넌트
│   │   ├── common/          # 공통 컴포넌트
│   │   ├── dashboard/       # 대시보드 컴포넌트
│   │   ├── layout/          # 레이아웃 컴포넌트
│   │   └── ui/              # UI 컴포넌트
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── AutoSearch.jsx   # 🆕 자동 검색 페이지
│   │   ├── SearchResults.jsx # 🆕 검색 결과 페이지
│   │   ├── Dashboard.jsx    # 메인 대시보드
│   │   ├── CharacterDetail.jsx # 캐릭터 상세 정보
│   │   ├── MarketPrice.jsx  # 시세 조회
│   │   ├── Utility.jsx      # 유틸리티
│   │   └── Scheduler.jsx    # 스케줄러
│   ├── services/            # API 서비스
│   ├── hooks/               # 커스텀 훅
│   ├── utils/               # 유틸리티 함수
│   └── data/                # 정적 데이터
└── package.json
```

## 🔗 관련 링크

- [로스트아크 공식 API](https://developer-lostark.game.onstove.com/)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
- [OpenCV Python](https://opencv.org/)

---

## React + Vite 설정

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
