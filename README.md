# 🎯 PLoa (Project Lost Ark Analytics)

**로스트아크 게임 데이터 분석 플랫폼**

PLoa는 로스트아크 유저들이 보다 효율적으로 게임을 즐길 수 있도록 도움을 주는 웹 애플리케이션입니다. 캐릭터 정보 조회, 시장 시세 분석, 각종 계산기 기능을 통해 게임 내 의사결정을 지원합니다.

## ✨ 주요 기능

- 🔍 **캐릭터 검색**: 장비, 각인, 보석, 스킬 정보 상세 조회
- 📊 **시장 시세**: 실시간 아이템 가격 조회 및 히스토리 분석  
- 🧮 **계산기**: 골드 효율, 강화 확률, 각종 게임 내 수치 계산
- 📈 **원정대 시스템**: 여러 캐릭터 통합 관리
- 📱 **OCR 기능**: 스크린샷 기반 자동 검색

## 🛠 기술 스택

### Frontend
- **React** 19.1.0 + **Vite** 5.4.0
- **TailwindCSS** 3.4.17 (라이트/다크 테마)
- **React Router DOM** 7.6.3
- **Recharts** 3.1.0 (차트 라이브러리)
- **Lucide React** 0.525.0 (아이콘)

### Backend/Proxy
- **Express** 4.21.2 (프록시 서버)
- **axios** 1.11.0 (HTTP 클라이언트)  
- **multer** 1.4.5-lts.1 (파일 업로드)
- **cors** 2.8.5 (CORS 처리)

### OCR 기능
- **Python** 3.x
- **pytesseract** (Tesseract OCR Python 래퍼)
- **OpenCV** (이미지 전처리)
- **Pillow** (이미지 처리)
- **hanspell** (한글 맞춤법 검사, 선택적)

---

## 🚀 개발환경 초기화

새로운 개발 환경에서 PLoa를 실행하기 위한 단계별 가이드입니다.

### 📋 필수 소프트웨어

시작하기 전에 다음 소프트웨어들이 설치되어 있어야 합니다:

- **Node.js** v21.7.3 이상 
- **npm** v10.5.0 이상
- **Git** (버전 관리)
- **Python** 3.x (OCR 기능용)
- **VS Code** (권장 IDE)

### 🔧 설치 및 설정

#### 1. 저장소 클론
```bash
git clone https://github.com/your-username/PLoa.git
cd PLoa
```

#### 2. 프록시 서버 설정 (루트 디렉토리)
```bash
# 의존성 설치
npm install

# 설치 확인 (선택사항)
npm list --depth=0
```

#### 3. 프론트엔드 설정
```bash
cd ploa-frontend
npm install
```

#### 4. OCR 기능을 위한 Python 환경 설정
```bash
# 프로젝트 루트로 이동
cd ..

# Python 가상환경 생성
python3 -m venv ocr_env

# 가상환경 활성화
source ocr_env/bin/activate  # Linux/Mac
# 또는 
ocr_env\Scripts\activate     # Windows

# OCR 라이브러리 설치
pip install opencv-python pytesseract pillow hanspell
```

> **💡 참고**: OCR 기능을 사용하지 않는다면 4단계는 건너뛸 수 있습니다.

### 🔑 환경변수 설정

Lost Ark Open API를 사용하기 위해 환경변수를 설정해야 합니다.

#### 1. API 키 발급
1. [Lost Ark 개발자 포털](https://developer-lostark.game.onstove.com/)에 접속
2. 회원가입 후 API 키 발급 요청
3. 승인 후 API 키 확인

#### 2. 환경변수 파일 생성
```bash
# ploa-frontend 디렉토리에서
cd ploa-frontend
touch .env
```

#### 3. .env 파일 설정
```bash
# .env 파일 내용
VITE_LOSTARK_API_KEY=여기에_발급받은_API_키_입력
VITE_LOSTARK_API_URL=https://developer-lostark.game.onstove.com
```

> **⚠️ 보안 주의**: .env 파일은 절대 Git에 커밋하지 마세요!

### 🏃‍♂️ 실행 방법

환경 설정이 완료되면 다음 명령어로 개발 서버를 실행할 수 있습니다.

#### 방법 1: 개별 실행
```bash
# 터미널 1: 프록시 서버 실행 (루트 디렉토리)
npm run dev

# 터미널 2: 프론트엔드 실행 (ploa-frontend 디렉토리)
cd ploa-frontend
npm run dev
```

#### 방법 2: 프로덕션 빌드
```bash
# 프론트엔드 빌드
cd ploa-frontend
npm run build

# 빌드 미리보기
npm run preview
```

### 🌐 접속 정보

- **프론트엔드**: http://localhost:5173
- **프록시 서버**: http://localhost:3001
- **API 요청 제한**: 100 requests/minute

---

## 📁 프로젝트 구조

```
PLoa/
├── 📁 ploa-frontend/          # React 프론트엔드
│   ├── src/
│   │   ├── components/        # 재사용 컴포넌트
│   │   │   ├── character/     # 캐릭터 관련 컴포넌트
│   │   │   ├── common/        # 공통 컴포넌트 (로딩, 에러)
│   │   │   ├── dashboard/     # 대시보드 컴포넌트
│   │   │   ├── layout/        # 레이아웃 컴포넌트
│   │   │   └── ui/            # UI 컴포넌트
│   │   ├── pages/             # 페이지 컴포넌트
│   │   ├── services/          # API 호출 로직
│   │   ├── hooks/             # React 커스텀 훅
│   │   ├── utils/             # 유틸리티 함수
│   │   └── types/             # TypeScript 타입 정의
│   ├── package.json           # 프론트엔드 의존성
│   └── vite.config.js         # Vite 설정
├── 📁 ocr_env/                # Python OCR 가상환경
├── 📄 proxy-server.js         # Express 프록시 서버
├── 📄 ocr_script.py          # OCR 스크립트
├── 📄 package.json           # 서버 의존성
├── 📄 CLAUDE.md              # AI 개발 가이드
└── 📄 project_plan.md        # 프로젝트 계획서
```

### 🔧 주요 파일 설명

- **proxy-server.js**: Lost Ark API 프록시 및 이미지 업로드 처리
- **ocr_script.py**: 스크린샷 OCR 처리 (Tesseract 활용)
- **ploa-frontend/src/services/lostarkApi.js**: Lost Ark API 호출 함수들
- **CLAUDE.md**: AI 개발 보조 시 참고할 프로젝트 가이드라인

---

## 🚨 문제 해결

### 자주 발생하는 문제들

#### 1. npm install 실패
```bash
# 캐시 정리 후 재시도
npm cache clean --force
npm install
```

#### 2. API 요청 실패
- API 키가 올바르게 설정되었는지 확인
- API 요청 제한(100 req/min) 초과 여부 확인
- Lost Ark 서버 점검 시간 확인

#### 3. OCR 기능 오류
**Tesseract OCR 엔진 시스템 설치가 필요합니다:**

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install tesseract-ocr tesseract-ocr-kor
sudo apt-get install libtesseract-dev

# macOS
brew install tesseract tesseract-lang

# Windows
# https://github.com/UB-Mannheim/tesseract/wiki 에서 installer 다운로드
```

**설치 확인:**
```bash
# Tesseract 버전 확인
tesseract --version

# 한글 언어팩 확인
tesseract --list-langs | grep kor
```

#### 4. 포트 충돌
- 프론트엔드(5173) 또는 프록시 서버(3001) 포트가 사용 중인 경우
- 다른 포트로 변경하거나 기존 프로세스 종료

---

## 📚 추가 자료

- [Lost Ark 개발자 포털](https://developer-lostark.game.onstove.com/)
- [React 공식 문서](https://react.dev/)
- [Vite 공식 문서](https://vitejs.dev/)
- [TailwindCSS 공식 문서](https://tailwindcss.com/)

---

## 📞 문의 및 기여

프로젝트에 대한 문의사항이나 기여를 원하시면 GitHub Issues를 통해 연락해 주세요.

**Happy Coding! 🎮⚔️**