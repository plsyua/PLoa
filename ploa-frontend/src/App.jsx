import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MarketPrice from './pages/MarketPrice';
import Dashboard from './pages/Dashboard';
import CharacterDetail from './pages/CharacterDetail';
import Utility from './pages/Utility';
import Scheduler from './pages/Scheduler';
import PartySearch from './pages/PartySearch';
import ConfirmNicknames from './pages/ConfirmNicknames';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 메인 대시보드 */}
          <Route path="/" element={<Dashboard />} />
          
          {/* 캐릭터 상세 정보 페이지 */}
          <Route path="/character/:characterName" element={<CharacterDetail />} />
          
          {/* 스케줄러 페이지 */}
          <Route path="/scheduler" element={<Scheduler />} />
          
          {/* 시세 분석 페이지 */}
          <Route path="/market" element={<MarketPrice />} />
          
          {/* 유틸리티 페이지 */}
          <Route path="/utility" element={<Utility />} />
          
          {/* 파티 검색 페이지 */}
          <Route path="/party-search" element={<PartySearch />} />

          {/* 닉네임 확인 페이지 */}
          <Route path="/confirm-nicknames" element={<ConfirmNicknames />} />

          {/* 검색 결과 페이지 */}
          <Route path="/search-results" element={<SearchResults />} />
          
          {/* 404 페이지는 메인 대시보드로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
