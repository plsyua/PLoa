# 🎯 PLoa (Project Lost Ark Analytics)

**로스트아크 게임 데이터 분석 플랫폼**

PLoa는 로스트아크 유저들이 보다 효율적으로 게임을 즐길 수 있도록 도움을 주는 웹 애플리케이션입니다. 캐릭터 정보 조회, 시장 시세 분석, 각종 계산기 기능을 통해 게임 내 의사결정을 지원합니다.

## ✨ 주요 기능

- 🔍 **캐릭터 검색**: 장비, 각인, 보석, 스킬 정보 상세 조회 (아이템 레벨 1640+ 필터링)
- 📊 **시장 시세**: 실시간 아이템 가격 조회 및 히스토리 분석  
- 🧮 **계산기**: 골드 효율, 강화 확률, 각종 게임 내 수치 계산
- 📈 **원정대 시스템**: 여러 캐릭터 통합 관리
- 📱 **CLOVA OCR 기능**: 스크린샷 기반 자동 닉네임 인식 및 검색
- ⚡ **API 캐싱 시스템**: 메모리 + LocalStorage 이중 캐싱으로 50-80% 성능 향상
- 🎨 **향상된 UI/UX**: 레이드 아이콘 통합 및 직관적인 인터페이스

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
- **NAVER CLOVA OCR** (고성능 한국어 특화 OCR 엔진)
- **Sharp** (서버사이드 이미지 처리 및 ROI 크롭)
- **Express Multer** (이미지 업로드 처리)
- **실시간 API 캐싱** (중복 요청 방지 및 성능 최적화)

---

## 🚀 개발환경 초기화

새로운 개발 환경에서 PLoa를 실행하기 위한 단계별 가이드입니다.

### 📋 필수 소프트웨어

시작하기 전에 다음 소프트웨어들이 설치되어 있어야 합니다:

- **Node.js** v21.7.3 이상 
- **npm** v10.5.0 이상
- **Git** (버전 관리)
- **VS Code** (권장 IDE)
- **NAVER Cloud Platform 계정** (OCR 기능 선택사항)

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

#### 4. NAVER CLOVA OCR API 설정

OCR 기능을 사용하려면 NAVER CLOVA OCR API 키가 필요합니다.

**API 키 발급:**
1. [NAVER Cloud Platform](https://www.ncloud.com/)에서 회원가입
2. Console > AI·Application > OCR > General OCR 서비스 신청
3. API 키 발급 (X-NCP-APIGW-API-KEY-ID, X-NCP-APIGW-API-KEY)

**환경변수 설정:**
```bash
# 루트 디렉토리에 .env 파일 생성
touch .env
```

**.env 파일 내용:**
```bash
# NAVER CLOVA OCR API 설정
NAVER_OCR_API_URL=https://naveropenapi.apigw.ntruss.com/vision/v1/ocr
NAVER_OCR_SECRET_KEY=발급받은_SECRET_KEY

# Lost Ark API 설정 (ploa-frontend/.env)
VITE_LOSTARK_API_KEY=발급받은_Lost_Ark_API_키
VITE_LOSTARK_API_URL=https://developer-lostark.game.onstove.com
```

> **💡 참고**: 
> - OCR 기능을 사용하지 않아도 기본적인 캐릭터 검색은 가능합니다.
> - CLOVA OCR은 한국어 인식률이 매우 높아 게임 닉네임 인식에 최적화되어 있습니다.
> - API 사용량에 따라 과금될 수 있으니 NAVER Cloud Platform 요금 정책을 확인하세요.

### 🔑 환경변수 설정

Lost Ark Open API와 NAVER CLOVA OCR API를 사용하기 위해 환경변수를 설정해야 합니다.

#### 1. Lost Ark API 키 발급
1. [Lost Ark 개발자 포털](https://developer-lostark.game.onstove.com/)에 접속
2. 회원가입 후 API 키 발급 요청
3. 승인 후 API 키 확인

#### 2. NAVER CLOVA OCR API 키 발급 (선택사항)
1. [NAVER Cloud Platform](https://www.ncloud.com/)에서 회원가입
2. Console > AI·Application > OCR > General OCR 서비스 신청
3. API 키 발급 (X-NCP-APIGW-API-KEY-ID, X-NCP-APIGW-API-KEY)

#### 3. 환경변수 파일 생성
```bash
# 루트 디렉토리에 .env 파일 생성
touch .env

# 프론트엔드 .env 파일 생성
cd ploa-frontend
touch .env
cd ..
```

#### 4. .env 파일 설정
**루트 디렉토리 .env:**
```bash
# NAVER CLOVA OCR API 설정 (선택사항)
NAVER_OCR_API_URL=https://naveropenapi.apigw.ntruss.com/vision/v1/ocr
NAVER_OCR_SECRET_KEY=발급받은_SECRET_KEY
```

**ploa-frontend/.env:**
```bash
# Lost Ark API 설정
VITE_LOSTARK_API_KEY=발급받은_Lost_Ark_API_키
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
│   │   │   └── utility/       # 계산기 등 유틸리티 컴포넌트
│   │   ├── pages/             # 페이지 컴포넌트
│   │   ├── services/          # API 호출 로직 (lostarkApi.js)
│   │   ├── hooks/             # React 커스텀 훅
│   │   ├── utils/             # 유틸리티 함수 (apiCache.js 포함)
│   │   ├── data/              # 레이드 데이터 및 아이콘 정의
│   │   └── assets/            # 정적 자산 (레이드 아이콘 포함)
│   ├── package.json           # 프론트엔드 의존성
│   └── vite.config.js         # Vite 설정
├── 📁 cropped_images/          # CLOVA OCR 처리된 이미지 저장
├── 📁 ocr_responses/          # CLOVA OCR API 응답 저장
├── 📁 uploads/                # 업로드된 원본 이미지
├── 📄 proxy-server.js         # Express 프록시 서버 + CLOVA OCR 연동
├── 📄 package.json           # 서버 의존성
├── 📄 .env                    # 환경변수 (미포함, 직접 설정 필요)
├── 📄 CLAUDE.md              # AI 개발 가이드
└── 📄 project_plan.md        # 프로젝트 계획서
```

### 🔧 주요 파일 설명

- **proxy-server.js**: Lost Ark API 프록시, CLOVA OCR 연동, 이미지 업로드 처리
- **ploa-frontend/src/services/lostarkApi.js**: Lost Ark API 호출 함수들 (캐싱 시스템 포함)
- **ploa-frontend/src/utils/apiCache.js**: API 요청 캐싱 시스템 (메모리 + LocalStorage)
- **ploa-frontend/src/data/raidData.js**: 레이드 데이터 및 아이콘 정의
- **ploa-frontend/src/pages/SearchResults.jsx**: 캐릭터 검색 결과 및 레이드 참여 가능 현황
- **CLAUDE.md**: AI 개발 보조 시 참고할 프로젝트 가이드라인

---

## ⚡ 성능 최적화 시스템

### API 캐싱 시스템
PLoa는 고도로 최적화된 API 캐싱 시스템을 통해 Lost Ark API 요청을 효율적으로 관리합니다.

#### 캐싱 전략
- **이중 캐싱**: 메모리 캐시 (빠른 접근) + LocalStorage (영구 저장)
- **캐시 유효기간**: 10분 (게임 데이터 업데이트 주기 고려)
- **중복 요청 방지**: 동일한 API 요청이 진행 중일 때 Promise 공유
- **자동 정리**: 만료된 캐시는 주기적으로 자동 정리

#### 성능 향상
- **API 요청 감소**: 50-80% 요청 수 감소
- **응답 속도**: 캐시된 데이터는 즉시 반환
- **사용자 경험**: 로딩 시간 단축 및 부드러운 네비게이션

#### 캐시 관리
```javascript
// 캐시 통계 확인
import { apiCache } from './utils/apiCache';
console.log(apiCache.getStats());

// 특정 캐릭터 캐시 삭제
apiCache.deletePattern('캐릭터명');

// 전체 캐시 초기화
apiCache.clear();
```

### 캐릭터 필터링 최적화
- **아이템 레벨 필터**: 1640+ 캐릭터만 표시하여 관련성 높은 정보 제공
- **레이드 자격 계산**: 실시간으로 참여 가능한 레이드 목록 표시

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
**NAVER CLOVA OCR 관련 문제 해결:**

```bash
# 1. API 키 설정 확인
echo $NAVER_OCR_SECRET_KEY

# 2. 네트워크 연결 테스트
curl -X POST "https://naveropenapi.apigw.ntruss.com/vision/v1/ocr" \
  -H "X-NCP-APIGW-API-KEY: $NAVER_OCR_SECRET_KEY" \
  -H "Content-Type: application/json"

# 3. 로그 확인
npm start  # 프록시 서버 실행 후 로그 확인
```

**폴백 모드:**
- CLOVA OCR API가 설정되지 않아도 모의 닉네임 데이터로 기능 테스트 가능
- 실제 OCR 기능은 API 키 설정 후 사용 가능
- API 호출 실패 시 자동으로 모의 닉네임 반환

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