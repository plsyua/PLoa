# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🧑‍💻 개발자 역할 및 작업 가이드라인

너는 PLoa 프로젝트의 **1인 풀스택 개발자**로서 다음 역할을 담당:
- 프론트엔드/백엔드 개발
- 배포 및 유지보수  
- 운영 및 모니터링
- **코드의 중요한 부분에는 이해하기 쉽게 한글 주석 필수**

### 📁 작업 환경
- **프로젝트 루트**: `\\wsl.localhost\Ubuntu\home\master\PLoa`
- **파일 읽기 시**: `/mnt/c/` 경로 사용 (WSL 환경)
- **모든 파일 생성/수정은 위 폴더 기준으로 진행**

### 📝 작업 진행 방식
1. **파일 작성**: 3-5개 섹션으로 나누어 하나씩 write → edit 순서로 진행
2. **파일 수정**: 3-5개 섹션으로 나누어 순차적으로 edit
3. **docs 폴더**: 꼭 필요한 내용만 포함하여 용량 최소화
4. **project_plan.md**: 작업 진행 시마다 업데이트 (사용자 시간 기준)
5. **'정리' 명령어**: 현재까지 작업 상황을 project_plan.md에 업데이트

## 🎯 프로젝트 개요

**PLoa (Project Lost Ark Analytics)**는 로스트아크 게임 데이터 분석 플랫폼입니다.

### 현재 상태 (2025년 8월)
- **MVP 완성도**: 100%
- **주요 완성 기능**: 캐릭터 검색, 시세 분석, 골드 계산기, 원정대 시스템
- **다음 목표**: 마리샵 효율 분석 → 스펙업 우선순위 추천

### 핵심 목표
- 로스트아크 유저의 시간 절약 및 재화 효율성 향상
- 실시간 게임 데이터 분석 및 시각화
- 직관적인 UI/UX로 복잡한 게임 정보 제공

## 🛠 기술 스택 & 아키텍처

### Frontend (ploa-frontend/)
```javascript
React 19.1.0 + Vite 5.4.0          // 메인 프레임워크
TailwindCSS 3.4.17                 // 스타일링 (라이트/다크 테마)
React Router DOM 7.6.3             // 라우팅
Recharts 3.1.0                     // 차트 라이브러리
Lucide React 0.525.0               // 아이콘
axios 1.10.0                       // HTTP 클라이언트
html-react-parser 5.2.5            // HTML 파싱
```

### Backend/Proxy (현재)
```javascript
Express 4.21.2                     // 프록시 서버
axios 1.11.0                       // API 통신
cors 2.8.5                         // CORS 처리
```

### 개발 환경
- **Node.js**: v21.7.3, **npm**: 10.5.0
- **OS**: WSL2 Ubuntu
- **IDE**: VS Code

## 🚀 개발 명령어

### React Frontend (ploa-frontend/)
```bash
npm run dev        # 개발 서버 실행
npm run build      # 프로덕션 빌드
npm run preview    # 빌드 미리보기
npm run lint       # 린트 체크
```

### Proxy Server (root/)
```bash
npm start          # 프록시 서버 실행
npm run dev        # 개발 모드 (자동 재시작)
```

## 🔗 Lost Ark Open API 연동

### API 설정
- **API Key**: `VITE_LOSTARK_API_KEY` 환경변수
- **Base URL**: `VITE_LOSTARK_API_URL` 환경변수
- **Rate Limit**: 100 requests/minute
- **Headers**: `authorization: bearer ${API_KEY}`, `accept: application/json`

### 주요 API 함수 (`src/services/lostarkApi.js`)
```javascript
// 캐릭터 정보
getCharacterProfile()      // 기본 프로필
getCharacterEquipment()    // 장비 정보
getCharacterEngravings()   // 각인 정보
getCharacterGems()         // 보석 정보
getCharacterSkills()       // 스킬 정보
getCharacterCollectibles() // 수집품 진행도
getCharacterSiblings()     // 원정대 정보

// 시장 정보
getMarketOptions()         // 시장 카테고리
searchMarketItems()        // 아이템 검색
getItemPriceHistory()      // 가격 히스토리
```

## 📂 프로젝트 구조

```
PLoa/
├── ploa-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── character/     # CollectiblesProgress
│   │   │   ├── common/        # LoadingSpinner, ErrorMessage
│   │   │   ├── dashboard/     # EventBanner, NoticeSection, QuickStats
│   │   │   ├── layout/        # Header
│   │   │   └── ui/            # GradeTag
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # 메인 대시보드
│   │   │   ├── CharacterDetail.jsx    # 캐릭터 상세 (4개 탭)
│   │   │   ├── MarketPrice.jsx        # 시세 검색
│   │   │   └── Utilities.jsx          # 유틸리티 (계산기, 룰렛)
│   │   ├── services/          # lostarkApi.js
│   │   ├── hooks/             # useApi, useLocalStorage, etc.
│   │   ├── utils/             # formatters, constants, parsers
│   │   └── types/             # 타입 정의
│   └── package.json
├── CLAUDE.md
├── project_plan.md
└── 다양한 API 응답 예제 JSON 파일들
```

## 🎨 UI/UX 디자인 시스템

### 색상 시스템
```javascript
// 아이템 등급별 색상 (GRADE_COLORS)
에스더: 'text-cyan-400'
고대: 'text-gray-900 dark:text-white' 
유물: 'text-orange-400'
전설: 'text-yellow-400'
영웅: 'text-purple-400'
희귀: 'text-blue-400'
고급: 'text-green-400'
일반: 'text-gray-600 dark:text-gray-400'
```

### 테마 시스템
- **라이트 모드**: `bg-white text-gray-900`
- **다크 모드**: `bg-gray-800 text-white`
- **테마 토글**: useTheme 훅으로 로컬스토리지 연동

### 레이아웃 패턴
- **카드 기반**: `bg-white dark:bg-gray-800 rounded-lg border`
- **그리드 시스템**: 반응형 1/2/3/4 컬럼
- **탭 인터페이스**: 상세 정보 표시
- **로딩 상태**: 스피너 애니메이션

## 💾 데이터 처리 가이드

### API 응답 파싱
```javascript
// HTML 툴팁 파싱 (html-react-parser 사용)
import parse from 'html-react-parser';

// JSON 툴팁 데이터 파싱
const tooltipData = JSON.parse(item.tooltip);

// 아이템 등급별 스타일링
const gradeClass = GRADE_COLORS[item.grade] || GRADE_COLORS['일반'];
```

### 주요 파싱 모듈
- **equipmentParsers.js**: 장비 정보 (재련, 초월, 품질, 엘릭서)
- **braceletParsers.js**: 팔찌 이중 옵션 파싱
- **gemParsers.js**: 보석 툴팁 파싱 및 효과 요약
- **accessoryShortener.js**: 장신구 연마 효과 축약

### 수집품 API 구조
```javascript
// /armories/characters/{characterName}/collectibles
{
  "Type": "수집품 타입명",
  "Icon": "아이콘 URL",
  "Point": 현재_획득_수,
  "MaxPoint": 최대_획득_가능수,
  "CollectiblePoints": [
    {
      "PointName": "개별_수집품명", 
      "Point": 개별_획득_수,
      "MaxPoint": 개별_최대수
    }
  ]
}
```

## 📋 개발 가이드라인

### 코딩 스타일
```javascript
// 네이밍 규칙
함수/변수: camelCase
컴포넌트: PascalCase  
파일명: PascalCase (컴포넌트), camelCase (유틸리티)

// 주석 (중요 로직에 한글 주석 필수)
// 캐릭터 검색 API 호출 및 결과 처리
const handleCharacterSearch = async (characterName) => {
  // ...
};
```

### 커밋 메시지 규칙
```bash
[타입]: 간단한 설명

# 타입별 예시
feat: 마리샵 효율 분석 기능 추가
fix: 캐릭터 검색 시 API 에러 수정  
docs: README 파일 업데이트
style: 헤더 컴포넌트 스타일 수정
refactor: 유틸리티 함수 모듈화
```

### 브랜치 전략
```bash
main                           # 메인 브랜치
├── feature/mari-shop         # 새 기능 개발
├── fix/character-search-bug  # 버그 수정
└── docs/api-update          # 문서 업데이트
```

## 🔧 자주 사용하는 패턴

### 컴포넌트 구조
```jsx
import React, { useState, useEffect } from 'react';
import { LoadingSpinner, ErrorMessage } from '../common';

const ComponentName = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API 호출 로직
  // 상태 관리 로직
  // 이벤트 핸들러

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      {/* 컴포넌트 내용 */}
    </div>
  );
};

export default ComponentName;
```

### 에러 처리
```javascript
try {
  const response = await lostarkApi.getCharacterProfile(characterName);
  setData(response);
} catch (error) {
  console.error('API 호출 실패:', error);
  setError('캐릭터 정보를 불러올 수 없습니다.');
}
```

## 🎯 현재 진행 상황 및 다음 단계

### ✅ 완료된 주요 기능
- 캐릭터 검색 시스템 (프로필/장비/스킬/보석/수집품/원정대)
- 시세 검색 및 차트 시각화
- 주간 골드 계산기 (원정대 기반)
- 라이트/다크 테마 시스템
- 사용자 편의 기능 (최근 검색, 즐겨찾기)

### 🔄 다음 개발 목표
1. **마리샵 효율 분석** - 상품별 골드 대비 효율성 계산
2. **스펙업 우선순위 추천** - ROI 기반 강화 가이드
3. **성능 최적화** - React.memo, useMemo 적용

## 📚 참고 자료

- **아이콘 참조**: https://lostark.game.onstove.com/ItemDictionary
- **API 문서**: 프로젝트 지식에 포함된 API 정보 활용
- **현재 상태**: project_plan.md 파일 참조

---

**💡 개발 시 주의사항**
- API 요청 제한 (100 req/min) 고려
- 모든 상태 변경 시 로딩/에러 처리 필수
- 컴포넌트 재사용성을 고려한 모듈화
- 접근성과 반응형 디자인 고려