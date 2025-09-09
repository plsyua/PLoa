import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { User, ExternalLink, TrendingUp, Shield, Swords, Crown, Calendar } from 'lucide-react';
import { getCharacterProfile, getCharacterSiblings } from '../services/lostarkApi';
import { getIcon } from '../data/icons';

// 레이드별 아이템레벨 요구사항 데이터 (contentData.js 기준)
const RAID_REQUIREMENTS = {
  // 군단장 레이드
  '발탄 노말': 1415,
  '발탄 하드': 1430,
  '비아키스 노말': 1430,
  '비아키스 하드': 1460,
  '쿠크세이튼 노말': 1475,
  '아브렐슈드 노말': 1490,
  '아브렐슈드 하드': 1540,
  '일리아칸 노말': 1580,
  '일리아칸 하드': 1600,
  '카멘 노말': 1610,
  '카멘 하드': 1630,
  
  // 어비스 던전
  '카양겔 노말': 1540,
  '카양겔 하드': 1580,
  '상아탑 노말': 1600,
  '상아탑 하드': 1620,
  
  // 에픽 레이드
  '베히모스 노말': 1640,
  
  // 카제로스 레이드
  '서막 에키드나 노말': 1620,
  '서막 에키드나 하드': 1640,
  '1막 에기르 노말': 1660,
  '1막 에기르 하드': 1680,
  '2막 아브렐슈드 노말': 1670,
  '2막 아브렐슈드 하드': 1690,
  '3막 모르둠 노말': 1680,
  '3막 모르둠 하드': 1700,
  '4막 아르모체 노말': 1700,
  '4막 아르모체 하드': 1720,
  '종막 카제로스 노말': 1710,
  '종막 카제로스 하드': 1730,
};

// 외부 사이트 링크 생성
const generateExternalLinks = (characterName) => {
  return {
    lostarkInfo: `https://lostark.game.onstove.com/Profile/Character/${encodeURIComponent(characterName)}`,
    loawa: `https://loawa.com/char/${encodeURIComponent(characterName)}`,
    lostarkDiary: `https://lostark-diary.com/character/${encodeURIComponent(characterName)}`,
  };
};

const CharacterCard = ({ characterName, onCharacterClick }) => {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expeditionData, setExpeditionData] = useState([]);

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 캐릭터 기본 정보 가져오기
        const profile = await getCharacterProfile(characterName);
        if (!profile) {
          throw new Error('캐릭터를 찾을 수 없습니다');
        }

        setCharacterData(profile);

        // 원정대 정보 가져오기
        try {
          const siblings = await getCharacterSiblings(characterName);
          if (siblings && Array.isArray(siblings)) {
            setExpeditionData(siblings);
          }
        } catch (siblingError) {
          console.warn('원정대 정보 로드 실패:', siblingError);
        }

      } catch (err) {
        console.error('캐릭터 데이터 로드 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (characterName) {
      fetchCharacterData();
    }
  }, [characterName]);

  // 레이드 참가 가능한 캐릭터 수 계산
  const getEligibleCharacters = (requiredItemLevel) => {
    return expeditionData.filter(char => {
      const itemLevel = parseFloat(char.ItemMaxLevel?.replace(',', '') || '0');
      return itemLevel >= requiredItemLevel;
    }).length;
  };

  // 외부 링크
  const externalLinks = generateExternalLinks(characterName);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600 dark:text-gray-400">캐릭터 정보 로딩 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-300 dark:border-red-600 p-6">
        <div className="flex items-center gap-3 mb-3">
          <User className="w-8 h-8 text-red-500" />
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">{characterName}</h3>
        </div>
        <ErrorMessage message={error} />
        <div className="mt-4 flex gap-2 flex-wrap">
          {Object.entries(externalLinks).map(([siteName, url]) => (
            <a
              key={siteName}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              <ExternalLink size={12} />
              {siteName === 'lostarkInfo' ? '로스트아크' : siteName === 'loawa' ? '로아와' : '로아일기'}
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (!characterData) return null;

  const classIcon = getIcon('CHARACTER', characterData.CharacterClassName);
  const combatLevel = parseInt(characterData.CharacterLevel || '0');
  const itemLevel = parseFloat(characterData.ItemMaxLevel?.replace(',', '') || '0');
  const expeditionLevel = parseInt(characterData.ExpeditionLevel || '0');

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500"
      onClick={() => onCharacterClick(characterName)}
    >
      {/* 캐릭터 기본 정보 헤더 */}
      <div className="flex items-center gap-4 mb-4">
        {/* 캐릭터 아이콘 */}
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
          {classIcon ? (
            <img 
              src={classIcon} 
              alt={characterData.CharacterClassName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <User 
            className="w-6 h-6 text-gray-500 dark:text-gray-400" 
            style={{ display: classIcon ? 'none' : 'flex' }}
          />
        </div>

        {/* 캐릭터 기본 정보 */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {characterData.CharacterName}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>{characterData.ServerName}</span>
            <span>•</span>
            <span>{characterData.CharacterClassName}</span>
            {characterData.GuildName && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Shield size={12} />
                  {characterData.GuildName}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 클릭 안내 */}
        <div className="text-right">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">클릭하여 상세보기</span>
        </div>
      </div>

      {/* 레벨 및 전투력 정보 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Crown size={16} className="text-yellow-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">원정대</span>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            Lv.{expeditionLevel}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <User size={16} className="text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">전투레벨</span>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            Lv.{combatLevel}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Swords size={16} className="text-red-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">아이템레벨</span>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {itemLevel.toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">원정대원</span>
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {expeditionData.length}명
          </div>
        </div>
      </div>

      {/* 외부 사이트 링크 */}
      <div className="flex gap-2 flex-wrap mb-4">
        <a
          href={externalLinks.lostarkInfo}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-sm rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
        >
          <ExternalLink size={12} />
          로스트아크
        </a>
        <a
          href={externalLinks.loawa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
        >
          <ExternalLink size={12} />
          로아와
        </a>
        <a
          href={externalLinks.lostarkDiary}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
        >
          <ExternalLink size={12} />
          로아일기
        </a>
      </div>

      {/* 레이드 참가 가능 정보 */}
      {expeditionData.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              레이드 참가 가능 캐릭터 수
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(RAID_REQUIREMENTS).map(([raidName, requiredLevel]) => {
              const eligibleCount = getEligibleCharacters(requiredLevel);
              const isEligible = eligibleCount > 0;
              
              return (
                <div
                  key={raidName}
                  className={`text-xs px-2 py-1 rounded flex items-center justify-between ${
                    isEligible
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  }`}
                >
                  <span>{raidName}</span>
                  <span className="font-medium">{eligibleCount}명</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nicknames, originalImage } = location.state || {};

  // OCR로 인식된 닉네임이 없으면 자동 검색 페이지로 리다이렉트
  useEffect(() => {
    if (!nicknames || nicknames.length === 0) {
      navigate('/auto-search');
    }
  }, [nicknames, navigate]);

  // 캐릭터 클릭 시 상세 정보로 이동
  const handleCharacterClick = (characterName) => {
    navigate(`/character/${encodeURIComponent(characterName)}`);
  };

  if (!nicknames || nicknames.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            검색 결과
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            인식된 {nicknames.length}명의 캐릭터 정보입니다. 캐릭터를 클릭하면 상세 정보를 확인할 수 있습니다.
          </p>
        </div>

        {/* 원본 이미지 미리보기 (옵션) */}
        {originalImage && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">원본 이미지</h2>
            <img
              src={originalImage}
              alt="분석한 이미지"
              className="max-w-full max-h-64 mx-auto rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>
        )}

        {/* 캐릭터 카드 리스트 */}
        <div className="space-y-6">
          {nicknames.map((nickname, index) => (
            <CharacterCard
              key={`${nickname}-${index}`}
              characterName={nickname}
              onCharacterClick={handleCharacterClick}
            />
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            💡 <strong>알림:</strong> 캐릭터 정보는 로스트아크 공식 API에서 가져온 실시간 데이터입니다. 
            일부 캐릭터는 비공개 설정으로 인해 정보가 제한될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;