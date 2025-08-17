import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MarketPrice from './pages/MarketPrice';
import Dashboard from './pages/Dashboard';
import CharacterDetail from './pages/CharacterDetail';
import Roster from './pages/Roster';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 메인 대시보드 */}
          <Route path="/" element={<Dashboard />} />
          
          {/* 캐릭터 상세 정보 페이지 */}
          <Route path="/character/:characterName" element={<CharacterDetail />} />
          
          {/* 시세 분석 페이지 */}
          <Route path="/market" element={<MarketPrice />} />
          
          {/* 원정대 페이지 */}
          <Route path="/roster" element={<Roster />} />
          
          {/* 404 페이지는 메인 대시보드로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
