# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

너는 1인 웹사이트 개발 프로젝트를 진행하는 프론트엔드/백엔드 풀스택 개발자야.
개발 및 배포, 유지보수와 운영까지 진행할거고, 코드의 중요한 부분에는 이해하기 쉽게 주석을 달아줘.

1. 프로젝트 루트 폴더는 \\wsl.localhost\Ubuntu\home\master\PLoa 이고, 폴더 및 파일 생성과 수정은 이 폴더에 대해 진행해줘.

2. 작업이 진행될 때마다, 그에 맞게 project_plan.md 파일을 업데이트해.

3. 파일을 write할 때는 3~5개의 섹션으로 나누어 먼저 하나를 write하고 나머지는 edit로 추가해. 파일을 edit할 때는 3~5개의 섹션으로 나누어 순차적으로 하나씩 진행해.

4. docs 폴더에 파일을 업데이트하거나 생성할 때, 꼭 필요한 내용만 넣어서 용량을 최소화 해.

5. '정리' 라고 입력하면 현재까지의 작업 진행상황을 project_plan.md 파일에 업데이트해. 날짜는 사용자 시간에 맞춰서 작성.

6. api 관련 정보는 프로젝트 지식에 전부 들어있어. 필요한 부분이 있으면 요청해.

7. 아이콘이 필요할 땐 https://lostark.game.onstove.com/ItemDictionary 링크를 참조해.

8. 작업환경이 WSL이라 Windows 경로를 읽어야 하니 제시한 파일 경로를 read 할땐 /mnt/c/ 경로를 사용해.


## Project Overview

PLoa is a Lost Ark AI-based data analysis platform that helps users with market prices, character specs, and collectible tracking. It's a React-based Single Page Application (SPA) that integrates with the Lost Ark Open API to provide real-time game data analysis.

**Main Goals:**
- Time-saving utilities for Lost Ark players
- Real-time market price tracking and analysis
- Character information and build analysis
- Collectible progress tracking and visualization

## Architecture

The project is structured as a **React application** located in `PLoa/ploa-frontend/`:
- **Frontend**: React 19.1.0 + Vite 5.4.0 + TailwindCSS 3.4.17 + Lucide React 0.525.0
- **API Integration**: Direct calls to Lost Ark Open API using axios 1.10.0
- **State Management**: React hooks (useState, useEffect)
- **Styling**: TailwindCSS with light/dark theme design
- **Charts**: Recharts 3.1.0 for data visualization
- **Routing**: React Router DOM 7.6.3
- **HTML Parsing**: html-react-parser 5.2.5

## Development Commands

**React Frontend (ploa-frontend/):**
```bash
# Development server
npm run dev

# Production build
npm run build  

# Lint check
npm run lint

# Preview production build
npm run preview
```

**Proxy Server (root/):**
```bash
# Start proxy server
npm start

# Development with auto-restart
npm run dev
```

## Development Environment

- **Node.js**: v21.7.3
- **npm**: 10.5.0
- **OS**: WSL2 Ubuntu (Linux 6.6.87.2-microsoft-standard-WSL2)
- **Platform**: Windows with WSL integration

## Lost Ark Open API Integration

The application integrates with the Lost Ark Open API through `/src/services/lostarkApi.js`:

**API Requirements:**
- API Key: Stored in `VITE_LOSTARK_API_KEY` environment variable
- Base URL: Stored in `VITE_LOSTARK_API_URL` environment variable 
- Rate Limit: 100 requests per minute
- Headers: `authorization: bearer ${API_KEY}` and `accept: application/json`

**Available API Functions:**
- `getCharacterProfile()` - Basic character stats and info
- `getCharacterEquipment()` - Equipment details and upgrades
- `getCharacterEngravings()` - Engraving effects (uses ArkPassiveEffects)
- `getCharacterGems()` - Gem information with damage/cooldown classification
- `getCharacterSkills()` - Combat skills and tripods
- `getCharacterCollectibles()` - Collectible progress tracking (모코코 씨앗, 섬의 마음, 거인의 심장 등)
- `getMarketOptions()` - Market search categories and filters
- `searchMarketItems()` - Market item search with pagination
- `getItemPriceHistory()` - Price history for specific items

## Key Components Structure

**Main Pages:**
- `src/App.jsx` - Main app component, currently renders MarketPrice only
- `src/pages/MarketPrice.jsx` - Market price search and visualization with charts
- `src/pages/CharacterDetail.jsx` - Character information lookup with tabbed interface

**Component Features:**
- **MarketPrice**: Search filters, pagination, price history charts, item tooltips
- **CharacterDetail**: Character profile display, equipment/engravings/gems/skills/collectibles tabs with detailed tooltips and HTML parsing

**Data Processing:**
- HTML tooltip parsing from API responses using `html-react-parser`
- Complex tooltip data extraction from JSON strings
- Item grade-based color coding and styling
- Gem classification (damage vs cooldown reduction)
- Collectibles progress calculation (Point/MaxPoint ratios for completion tracking)

### Collectibles API Details

**Endpoint**: `/armories/characters/{characterName}/collectibles`

**Response Structure**: Array of collectible categories with the following format:
```json
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

**Available Collectible Types:**
- **모코코 씨앗** (1,474개) - Region-based mokoko seed collection
- **섬의 마음** (104개) - Island soul collection from various islands
- **위대한 미술품** (60개) - Great artworks numbered #1-#60
- **거인의 심장** (15개) - Giant's hearts from raid bosses and activities
- **이그네아의 징표** (20개) - Ignea tokens from adventure tome completion
- **항해 모험물** (49개) - Sailing adventure items from ocean exploration
- **세계수의 잎** (118개) - World tree leaves numbered #1-#118

## UI/UX Patterns

**Design System:**
- Dark theme with gray-800/900 backgrounds
- Grade-based color coding (에스더=cyan, 고대=white, 유물=orange, 전설=yellow, 영웅=purple, 희귀=blue, 고급=green, 기타=gray)
- Card-based layouts with rounded corners and borders
- Tabbed interfaces for detailed information
- Loading states with spin animations
- Responsive grid layouts (1/2/3/4 columns based on screen size)

**Icon Usage:**
- Lucide React icons throughout the interface
- Contextual icons for different data types (User, Crown, Trophy, Package, Star, Gem, etc.)

## Data Handling Notes

**API Response Processing:**
- Equipment tooltips contain complex HTML that needs parsing
- Gem effects are stored in JSON tooltip format requiring parsing
- Engraving descriptions use HTML color tags that need conversion to Tailwind classes
- Market items have grade-based styling and trade status indicators
- Character stats use item level ranges for color coding

**Error Handling:**
- API rate limiting awareness (100 req/min)
- Graceful fallbacks for missing data
- Console error logging for debugging
- User-friendly error messages

## Testing

No specific test framework is configured. When implementing tests, follow React testing best practices and check for any testing setup in package.json.
