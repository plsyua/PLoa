import { useState } from 'react';
import { Heart, Map, Palette, Crown, Star, Compass, Leaf, X, Check } from 'lucide-react';

// 수집품 진행도 시각화 컴포넌트
// 수집품 상세 정보 데이터 (모코코 씨앗, 크림스네일의 해도 제외)
const COLLECTIBLE_DETAILS = {
  '거인의 심장': [
    { name: '첫 번째 거인의 심장', condition: '[퀘스트] 토토이크 - 흩어진 다섯 형제', type: 'quest' },
    { name: '두 번째 거인의 심장', condition: '[호감도] 트리시온 - 베아트리스', type: 'rapport' },
    { name: '세 번째 거인의 심장', condition: '[호감도] 슈테른 - 사샤', type: 'rapport' },
    { name: '네 번째 거인의 심장', condition: '[필드 보스] 머무른 시간의 호수 - 타르실라', type: 'boss' },
    { name: '다섯 번째 거인의 심장', condition: '[물물교환] 검은이빨의 주둔지 - 항해사 로사', type: 'exchange' },
    { name: '여섯 번째 거인의 심장', condition: '[물물교환] 해적마을 아틀라스 - 암거래 상인', type: 'exchange' },
    { name: '일곱 번째 거인의 심장', condition: '[평판] 두키 섬 - 두키왕을 잡아라', type: 'reputation' },
    { name: '여덟 번째 거인의 심장', condition: '[물물교환] 자유의 섬 - 검은이빨', type: 'exchange' },
    { name: '아홉 번째 거인의 심장', condition: '[호감도] 히프노스의 눈 - 칼바서스', type: 'rapport' },
    { name: '열 번째 거인의 심장', condition: '[타워] 타워 오브 쉐도우', type: 'tower' },
    { name: '열한 번째 거인의 심장', condition: '[평판] 푸른 바람의 섬 - 초원의 벌레', type: 'reputation' },
    { name: '열두 번째 거인의 심장', condition: '[퀘스트] 그림자 달 시장 - 마음을 쥔 정령', type: 'quest' },
    { name: '열세 번째 거인의 심장', condition: '[타워] 타워 오브 페이트', type: 'tower' },
    { name: '열네 번째 거인의 심장', condition: '[호감도] 속삭이는 작은 섬 - 니나브', type: 'rapport' },
    { name: '열다섯 번째 거인의 심장', condition: '[퀘스트] 지혜의 섬 - 열다섯 번째 심장', type: 'quest' }
  ],
  '섬의 마음': [
    { name: '고블린 섬의 마음', condition: '[상자] 고블린 판도라', type: 'box' },
    { name: '거대버섯 섬의 마음', condition: '[벌목] 거대버섯 섬 - 거대한 버섯', type: 'collectible' },
    { name: '토토실버 섬의 마음', condition: '[호감도] 토토실버 섬 - 토토장로', type: 'rapport' },
    { name: '토토피아 섬의 마음', condition: '[모험 퀘스트] 토토피아 실종사건', type: 'quest' },
    { name: '환각의 섬의 마음', condition: '[상자] 환각의 섬 전리품', type: 'box' },
    { name: '잠자는 노래의 섬의 마음', condition: '[상자] 잠자는 노래의 상자', type: 'box' },
    { name: '별빛 등대 섬의 마음', condition: '[모험 퀘스트] 별빛을 인도하는 선율', type: 'quest' },
    { name: '세월의 섬의 마음', condition: '[몬스터 처치] 세월의 섬 - 사브나크', type: 'monster' },
    { name: '볼라르 섬의 마음', condition: '[상자] 볼라르의 비밀 상자', type: 'box' },
    { name: '두키 섬의 마음', condition: '[몬스터 처치] 두키 섬 - 두키왕', type: 'monster' },
    { name: '갈망의 섬의 마음', condition: '[상자] 세티노의 비밀 가방', type: 'box' },
    { name: '비밀기지 X-301 섬의 마음', condition: '[몬스터 처치] X-301 제 7구역 - 실험체 타르마쿰', type: 'monster' },
    { name: '알트아이젠 섬의 마음', condition: '[필드 보스] 알트아이젠 - 솔 그랑데', type: 'boss' },
    { name: '칼트헤르츠 섬의 마음', condition: '[상자] 보답의 상자', type: 'box' },
    { name: '안개의 섬의 마음', condition: '[모험 퀘스트] 나쁜 장난!', type: 'quest' },
    { name: '얼음 미로의 섬의 마음', condition: '[모험 퀘스트] 따뜻한 온정의 횃불', type: 'quest' },
    { name: '얼음과 불의 섬의 마음', condition: '[필드 보스] 얼음과 불의 섬 - 브리아레오스', type: 'boss' },
    { name: '비키니 아일랜드 섬의 마음', condition: '[모험 퀘스트] 꿈이 가득한 섬으로', type: 'quest' },
    { name: '그림자의 섬의 마음', condition: '[퀘스트] 그림자의 섬 - 그림자의 각인', type: 'quest' },
    { name: '포르투나 섬의 마음', condition: '[일반 보상] 포르투나', type: 'reward' },
    { name: '에버그레이스의 둥지 섬의 마음', condition: '[모험 퀘스트] 바람 속에 반짝이는 금빛', type: 'quest' },
    { name: '스피다 섬의 마음', condition: '[몬스터 처치] 스피다 섬 - 고르카그로스', type: 'monster' },
    { name: '회상의 섬의 마음', condition: '[모험 퀘스트] 나의 빛, 나의 진실한 벗', type: 'quest' },
    { name: '포르페 섬의 마음', condition: '[몬스터 처치] 포르페 - 바투아크 진', type: 'monster' },
    { name: '페이토 섬의 마음', condition: '[모험 퀘스트] 고생 끝!', type: 'quest' },
    { name: '잊혀진 자들의 도시 섬의 마음', condition: '[일반 보상] 잊혀진 자들의 도시', type: 'reward' },
    { name: '검은이빨 주둔지 섬의 마음', condition: '[호감도] 검은이빨의 주둔지 - 검은이빨', type: 'rapport' },
    { name: '휴양지 그라비스 섬의 마음', condition: '[모험 퀘스트] 궁극의 휴양', type: 'quest' },
    { name: '외로운 섬 오페르 섬의 마음', condition: '[모험 퀘스트] 섬의 마음', type: 'quest' },
    { name: '해바라기 섬의 마음', condition: '[수집품] 위대한 미술품', type: 'collectible' },
    { name: '자유의 섬의 마음', condition: '[물물교환] 자유의 섬 - 비밀스러운 로사', type: 'exchange' },
    { name: '카마인의 주둔지 섬의 마음', condition: '[모험 퀘스트] [여정] 검고 창백한', type: 'quest' },
    { name: '죽음의 협곡 섬의 마음', condition: '[몬스터 처치] 죽음의 협곡 - 수신 아포라스', type: 'monster' },
    { name: '작은 행운의 섬의 마음', condition: '[상자] 작은 행운의 상자', type: 'box' },
    { name: '왜곡된 차원의 섬의 마음', condition: '[모험 퀘스트] 큐브의 비밀을 찾아', type: 'quest' },
    { name: '에라스모의 섬의 마음', condition: '[몬스터 처치] 에라스모의 섬 - 에라스모', type: 'monster' },
    { name: '포모나 섬의 마음', condition: '[모험 퀘스트] 연인들의 리라', type: 'quest' },
    { name: '도망자들의 마을 섬의 마음', condition: '[평판] 범죄자 검거', type: 'reputation' },
    { name: '메데이아 섬의 마음', condition: '[상자] 메데이아의 선물', type: 'box' },
    { name: '리베하임 섬의 마음', condition: '[호감도] 리베하임 - 연애 고수 헨리', type: 'rapport' },
    { name: '우거진 갈대의 섬의 마음', condition: '[상자] 갈대 숲의 보물 상자', type: 'box' },
    { name: '메투스 제도 섬의 마음', condition: '[모험 퀘스트] 무엇을 보았는가', type: 'quest' },
    { name: '해적마을 아틀라스 섬의 마음', condition: '[물물교환] 해적마을 아틀라스 - 암거래 상인', type: 'exchange' },
    { name: '지혜의 섬의 마음', condition: '[모험 퀘스트] 거인의 공명', type: 'quest' },
    { name: '신월의 섬의 마음', condition: '[물물교환] 신월의 섬 - 앨드리지', type: 'exchange' },
    { name: '고요의 섬의 마음', condition: '[모험 퀘스트] 복수는 나의 것', type: 'quest' },
    { name: '하얀파도 섬의 마음', condition: '[호감도] 하얀파도 섬 - 표류 소녀 엠마', type: 'rapport' },
    { name: '무법자의 섬의 마음', condition: '[일반 보상] 무법자의 섬', type: 'reward' },
    { name: '격류의 섬의 마음', condition: '[필드 보스] 격류의 섬 - 아우리온', type: 'boss' },
    { name: '나루니 섬의 마음', condition: '[모험 퀘스트] 나루니 꼬!', type: 'quest' },
    { name: '노토스 섬의 마음', condition: '[모험 퀘스트] 디디와 함께', type: 'quest' },
    { name: '몬테 섬의 마음', condition: '[상자] 몬테섬 참가상', type: 'box' },
    { name: '판다 푸푸 섬의 마음', condition: '[호감도] 판다 푸푸 섬 - 푸푸', type: 'rapport' },
    { name: '몽환의 섬의 마음', condition: '[평판] 신간 출판', type: 'reputation' },
    { name: '하모니 섬의 마음', condition: '[사용] 반짝이는 소리의 상자', type: 'use' },
    { name: '꿈꾸는 갈매기 섬의 마음', condition: '[모험 퀘스트] 이제 본업으로', type: 'quest' },
    { name: '부서진 빙하의 섬의 마음', condition: '[모험 퀘스트] 고요의 엘리지', type: 'quest' },
    { name: '블루홀 섬의 마음', condition: '[몬스터 처치] 블루홀 섬 - 이아르 카야', type: 'monster' },
    { name: '거북 섬의 마음', condition: '[모험 퀘스트] 바다로 가자', type: 'quest' },
    { name: '희망의 섬의 마음', condition: '[모험 퀘스트] 희생된 이들을 기억하자', type: 'quest' },
    { name: '로팡 섬의 마음', condition: '[모험 퀘스트] 사장과 미녀와 책장', type: 'quest' },
    { name: '고립된 영원의 섬의 마음', condition: '[호감도] 고립된 영원의 섬 - 마리', type: 'rapport' },
    { name: '히프노스의 눈 섬의 마음', condition: '[호감도] 히프노스의 눈 - 푸른 눈의 칼바서스', type: 'rapport' },
    { name: '지고의 섬의 마음', condition: '[호감도] 지고의 섬 - 에르제베트', type: 'rapport' },
    { name: '그릇된 욕망의 섬의 마음', condition: '[물물교환] 그릇된 욕망의 섬 - 승천하지 못한 자', type: 'exchange' },
    { name: '오르비스 섬의 마음', condition: '[필드 보스] 오르비스 섬 - 강림하신 호박신', type: 'boss' },
    { name: '에스텔라 섬의 마음', condition: '[일반 보상] 에스텔라', type: 'reward' },
    { name: '슬라임 아일랜드 섬의 마음', condition: '[슬라임 아일랜드] 일반 전투 - 몬스터', type: 'monster' },
    { name: '알라케르 섬의 마음', condition: '[모험 퀘스트] 최고의 치킨, 황금빛 치킨', type: 'quest' },
    { name: '기회의 섬의 마음', condition: '[상자] 강태공의 주머니', type: 'box' },
    { name: '태초의 섬의 마음', condition: '[대항해] 태초의 섬 - 배틀 아레나', type: 'voyage' },
    { name: '황금물결 섬의 마음', condition: '[일반 보상] 황금물결 섬', type: 'reward' },
    { name: '고요한 안식의 섬의 마음', condition: '[몬스터 처치] 고요한 안식의 섬 - 망령 군주', type: 'monster' },
    { name: '클럽 아비뉴 섬의 마음', condition: '[모험 퀘스트] 언브레이커블 비트', type: 'quest' },
    { name: '수라도 섬의 마음', condition: '[일반 퀘스트] 다시 나타난 강운', type: 'quest' },
    { name: '기약의 섬의 마음', condition: '[모험 퀘스트] [여정] 조각난 마음', type: 'quest' },
    { name: '황혼의 섬의 마음', condition: '[던전] 황혼의 섬 - 황혼의 섬 예배당 [노말]', type: 'dungeon' },
    { name: '아르곤 섬의 마음', condition: '[보상] 아르곤 - 섬 전역', type: 'reward' },
    { name: '환영 나비 섬의 마음', condition: '[몬스터 처치] 환영 나비 섬 - 아드린느', type: 'monster' },
    { name: '푸른 바람의 섬의 마음', condition: '[일반 퀘스트] 꽃의 파도에 묻혀', type: 'quest' },
    { name: '무릉도원 섬의 마음', condition: '[물물교환] 무릉도원', type: 'exchange' },
    { name: '아트로포스 섬의 마음', condition: '[상자] 소원 주머니', type: 'box' },
    { name: '발푸르기스 섬의 마음', condition: '[몬스터 처치] 발푸르기스의 밤 - 라사키엘', type: 'monster' },
    { name: '미지의 섬의 마음', condition: '[몬스터 처치] 미지의 섬 - 백의 야수왕', type: 'monster' },
    { name: '그림자달 시장 섬의 마음', condition: '[일반 퀘스트] 마음을 쥔 정령', type: 'quest' },
    { name: '페르마타 섬의 마음', condition: '[일반 보상] 바다의 요람 페르마타', type: 'reward' },
    { name: '지스브로이 섬의 마음', condition: '[평판] 지스브로이 안주 전문가', type: 'reputation' },
    { name: '두키 주식회사 섬의 마음', condition: '[일반 퀘스트] 반짝반짝, 한 자릿수 두키!', type: 'quest' },
    { name: '속삭이는 작은 섬의 마음', condition: '[호감도] 속삭이는 작은 섬 - 니나브', type: 'rapport' },
    { name: '비탄의 섬의 마음', condition: '[몬스터 처치] 탄식의 정원 - 망가진 스텔라', type: 'monster' },
    { name: '환죽도 섬의 마음', condition: '[호감도] 환죽도 - 진저웨일', type: 'rapport' },
    { name: '쿵덕쿵 아일랜드 섬의 마음', condition: '[몬스터 처치] 쿵덕쿵 아일랜드 - 슬라임', type: 'monster' },
    { name: '이스테르 섬의 마음', condition: '[평판] 가디언', type: 'reputation' },
    { name: '스노우팡 아일랜드 섬의 마음', condition: '[상자] 즐거운 눈싸움 기념 주머니', type: 'box' },
    { name: '모코모코 야시장 섬의 마음', condition: '[평판] 모코모코 야시장 이야기', type: 'reputation' },
    { name: '꿈꾸는 추억의 섬의 마음', condition: '[평판] 꿈꾸는 추억의 섬', type: 'reputation' },
    { name: '잔혹한 장난감 성 섬의 마음', condition: '[상자] 미로 정원 두근두근 상자', type: 'box' },
    { name: '모코콩 아일랜드 섬의 마음', condition: '[몬스터 처치] 모코콩 아일랜드 - 사악한 마녀 바바야바', type: 'monster' },
    { name: '라일라이 아일랜드 섬의 마음', condition: '[사용] 라일라이 아일랜드 축제 기념 상자', type: 'use' },
    { name: '프레테리아 섬의 마음', condition: '[평판] 프레테리아 - 성역 정화', type: 'reputation' },
    { name: '노틸러스의 흔적 섬의 마음', condition: '[대항해] 노틸러스의 흔적', type: 'voyage' },
    { name: '인디고 섬의 마음', condition: '[몬스터 처치] 인디고 섬 - 심해 나이아스 / 심해 드라이칸 / 심해의 마녀', type: 'monster' },
    { name: '버즐링 아일랜드 섬의 마음', condition: '[사용] 버즐링 아일랜드 레이스 보답 상자', type: 'use' },
    { name: '우르누잔의 섬의 마음', condition: '[사용] 우르누잔의 증표', type: 'use' }
  ],
  '위대한 미술품': [
    { name: '위대한 미술품 #1', condition: '[퀘스트] 해바라기 섬 - 그림자에 갇힌 예술가', type: 'quest' },
    { name: '위대한 미술품 #2', condition: '[원정대 영지] 무역 상인 - 일레인', type: 'estate' },
    { name: '위대한 미술품 #3', condition: '[수집품] 섬의 마음', type: 'collectible' },
    { name: '위대한 미술품 #4', condition: '[모험의 서] 루테란 동부', type: 'adventure_book' },
    { name: '위대한 미술품 #5', condition: '[모험의 서] 토토이크', type: 'adventure_book' },
    { name: '위대한 미술품 #6', condition: '[모험의 서] 애니츠', type: 'adventure_book' },
    { name: '위대한 미술품 #7', condition: '[모험의 서] 베른 북부', type: 'adventure_book' },
    { name: '위대한 미술품 #8', condition: '[모험의 서] 슈샤이어', type: 'adventure_book' },
    { name: '위대한 미술품 #9', condition: '[평판] 오즈혼 구릉지 - 저주받은 유적', type: 'reputation' },
    { name: '위대한 미술품 #10', condition: '[평판] 갈기파도 항구 - 항구의 운영을 책임진다', type: 'reputation' },
    { name: '위대한 미술품 #11', condition: '[수집품] 세계수의 잎', type: 'collectible' },
    { name: '위대한 미술품 #12', condition: '[물물교환] 검은이빨의 주둔지 - 항해사 로사', type: 'exchange' },
    { name: '위대한 미술품 #13', condition: '[퀘스트] 리베하임 - 아픈 만큼 성숙해진다', type: 'quest' },
    { name: '위대한 미술품 #14', condition: '[큐브]', type: 'cube' },
    { name: '위대한 미술품 #15', condition: '[큐브]', type: 'cube' },
    { name: '위대한 미술품 #16', condition: '[비밀 던전]', type: 'secret_dungeon' },
    { name: '위대한 미술품 #17', condition: '[타워]', type: 'tower' },
    { name: '위대한 미술품 #18', condition: '[평판] 칼트헤르츠 - 노예 해방', type: 'reputation' },
    { name: '위대한 미술품 #19', condition: '[평판] 자유의 섬 - 고고학자의 부탁', type: 'reputation' },
    { name: '위대한 미술품 #20', condition: '[물물교환] 별빛 등대의 섬 - 프랭크', type: 'exchange' },
    { name: '위대한 미술품 #21', condition: '[수집품] 거인의 심장', type: 'collectible' },
    { name: '위대한 미술품 #22', condition: '[수집품] 섬의 마음', type: 'collectible' },
    { name: '위대한 미술품 #23', condition: '[수집품] 항해 모험물', type: 'collectible' },
    { name: '위대한 미술품 #24', condition: '[큐브]', type: 'cube' },
    { name: '위대한 미술품 #25', condition: '[큐브]', type: 'cube' },
    { name: '위대한 미술품 #26', condition: '[비밀 던전]', type: 'secret_dungeon' },
    { name: '위대한 미술품 #27', condition: '[물물교환] 베른 신형 탐사선', type: 'exchange' },
    { name: '위대한 미술품 #28', condition: '[평판] 페르마타 - 페르마타의 진정한 매니저', type: 'reputation' },
    { name: '위대한 미술품 #29', condition: '[호감도] 히프노스의 눈 - 푸른 눈의 칼바서스', type: 'rapport' },
    { name: '위대한 미술품 #30', condition: '[모험의 서] 로헨델', type: 'adventure_book' },
    { name: '위대한 미술품 #31', condition: '[모험의 서] 욘', type: 'adventure_book' },
    { name: '위대한 미술품 #32', condition: '[수집품] 모코코 씨앗', type: 'collectible' },
    { name: '위대한 미술품 #33', condition: '[수집품] 거인의 심장', type: 'collectible' },
    { name: '위대한 미술품 #34', condition: '[물물교환] 아트로포스 - 검은 상인', type: 'exchange' },
    { name: '위대한 미술품 #35', condition: '[큐브]', type: 'cube' },
    { name: '위대한 미술품 #36', condition: '[큐브]', type: 'cube' },
    { name: '위대한 미술품 #37', condition: '[모험의 서] 페이튼', type: 'adventure_book' },
    { name: '위대한 미술품 #38', condition: '[수집품] 섬의 마음', type: 'collectible' },
    { name: '위대한 미술품 #39', condition: '[수집품] 항해 모험물', type: 'collectible' },
    { name: '위대한 미술품 #40', condition: '[큐브]', type: 'cube' },
    { name: '위대한 미술품 #41', condition: '[큐브]', type: 'cube' },
    { name: '위대한 미술품 #42', condition: '[비밀 던전]', type: 'secret_dungeon' },
    { name: '위대한 미술품 #43', condition: '[모험의 서] 파푸니카', type: 'adventure_book' },
    { name: '위대한 미술품 #44', condition: '[수집품] 모코코 씨앗', type: 'collectible' },
    { name: '위대한 미술품 #45', condition: '[큐브]', type: 'cube' },
    { name: '위대한 미술품 #46', condition: '[큐브]', type: 'cube' },
    { name: '위대한 미술품 #47', condition: '[비밀 던전]', type: 'secret_dungeon' },
    { name: '위대한 미술품 #48', condition: '[평판] 별모래 해변 - 노곤노곤 온천 아르바이트', type: 'reputation' },
    { name: '위대한 미술품 #49', condition: '[모험의 서] 베른 남부', type: 'adventure_book' },
    { name: '위대한 미술품 #50', condition: '[평판] 아빠와 딸의 여행', type: 'reputation' },
    { name: '위대한 미술품 #51', condition: '[비밀 던전] 베른 남부', type: 'secret_dungeon' },
    { name: '위대한 미술품 #52', condition: '[호감도] 칸다리아 영지 - 네리아', type: 'rapport' },
    { name: '위대한 미술품 #53', condition: '[큐브]', type: 'cube' },
    { name: '위대한 미술품 #54', condition: '[큐브]', type: 'cube' },
    { name: '위대한 미술품 #55', condition: '[타워] 타워 오브 데스티니', type: 'tower' },
    { name: '위대한 미술품 #56', condition: '[모험의 서] 로웬', type: 'adventure_book' },
    { name: '위대한 미술품 #57', condition: '[평판] 지상에서 온 별', type: 'reputation' },
    { name: '위대한 미술품 #58', condition: '[타워] 타워 오브 데스티니', type: 'tower' },
    { name: '위대한 미술품 #59', condition: '[큐브]', type: 'cube' },
    { name: '위대한 미술품 #60', condition: '[평판] 플레체 - 베디체 재단', type: 'reputation' }
  ],
  '항해 모험물': [
    { name: '모코코 버섯', condition: '[모험의 서] 토토이크', type: 'adventurebook' },
    { name: '라마', condition: '[원정대 영지] 무역 상인 - 덕현', type: 'trade' },
    { name: '붉은바다거북', condition: '[모험의 서] 파푸니카', type: 'adventurebook' },
    { name: '스타더스트', condition: '[원정대 영지] 무역 상인 - 아스티엘', type: 'trade' },
    { name: '바다꽃', condition: '[모험의 서] 애니츠', type: 'adventurebook' },
    { name: '스타후르츠', condition: '[원정대 영지] 무역 상인 - 투루', type: 'trade' },
    { name: '용과', condition: '[모험의 서] 욘', type: 'adventurebook' },
    { name: '맨드릴', condition: '[원정대 영지] 무역 상인 - 플로르', type: 'trade' },
    { name: '유령 도마뱀', condition: '[원정대 영지] 무역 상인 - 사하', type: 'trade' },
    { name: '오색앵무새', condition: '[모험의 서] 로헨델', type: 'adventurebook' },
    { name: '바람의 석판', condition: '[원정대 영지] 무역 상인 - 프라우케', type: 'trade' },
    { name: '반달 가면', condition: '[호감도] 칼라자 마을 - 비올레', type: 'affinity' },
    { name: '고대 지팡이', condition: '[호감도] 니아 마을 - 자하라', type: 'affinity' },
    { name: '고대 금화', condition: '[호감도] 니아 마을 - 리루', type: 'affinity' },
    { name: '잊혀진 호수', condition: '[호감도] 레이크바 - 장인 우르르', type: 'affinity' },
    { name: '크레바스', condition: '[호감도] 부서진 빙하의 섬 - 샐리', type: 'affinity' },
    { name: '불타는 얼음', condition: '[호감도] 이름 없는 협곡 - 페데리코', type: 'affinity' },
    { name: '고인돌', condition: '[물물교환] 시작의 땅 - 작살아귀 헌팅 길드선', type: 'exchange' },
    { name: '마법진', condition: '[호감도] 희망의 섬 - 네스', type: 'affinity' },
    { name: '난파선 잔해', condition: '[물물교환] 메마른 통로 - 작살아귀 헌팅 길드선', type: 'exchange' },
    { name: '참돌고래', condition: '[물물교환] 크로나 항구 - 작살아귀 헌팅 길드선', type: 'exchange' },
    { name: '극지 맘모스', condition: '[모험의 서] 슈샤이어', type: 'adventurebook' },
    { name: '붉은낙타', condition: '[모험의 서] 아르데타인', type: 'adventurebook' },
    { name: '유니콘', condition: '[호감도] 해상 낙원 페이토 - 타냐 벤텀', type: 'affinity' },
    { name: '유령 가오리', condition: '[대항해] 난파선', type: 'voyage' },
    { name: '세이렌', condition: '[대항해] 난파선', type: 'voyage' },
    { name: '달의 탑', condition: '[필드 보스] 알라케르', type: 'fieldboss' },
    { name: '신의 창', condition: '[물물교환] 갈기파도 항구 - 작살아귀 헌팅 길드선', type: 'exchange' },
    { name: '기에나 석상', condition: '[퀘스트] 하버크의 신기한 모험', type: 'quest' },
    { name: '오로라', condition: '[대항해] 난파선', type: 'voyage' },
    { name: '소용돌이', condition: '[물물교환] 항구도시 창천 - 작살아귀 헌팅 길드선', type: 'exchange' },
    { name: '침묵하는 섬', condition: '[모험의 서] 페이튼', type: 'adventurebook' },
    { name: '토토이끼 배', condition: '[대항해] 난파선', type: 'voyage' },
    { name: '북해의 눈', condition: '[물물교환] 얼어붙은 바다 - 작살아귀 헌팅 길드선', type: 'exchange' },
    { name: '남해의 눈', condition: '[일반 보상] 환각의 섬', type: 'reward' },
    { name: '죽은자의 눈', condition: '[몬스터 처치] 죽음의 협곡 - 수신 아포라스', type: 'monster' },
    { name: '의문의 상자', condition: '[몬스터 처치] 포르페 - 바투아크 진', type: 'monster' },
    { name: '해적의 의족', condition: '[일반 보상] 잠자는 노래의 섬', type: 'reward' },
    { name: '해적의 깃발', condition: '[일반 보상] 스피다 섬 - 고르카그로스', type: 'reward' },
    { name: '헤스티아호', condition: '[몬스터 처치] 알트아이젠 - 솔 그랑데', type: 'monster' },
    { name: '환영 나비', condition: '[몬스터 처치] 환영 나비 섬 - 아드린느', type: 'monster' },
    { name: '대왕 조개', condition: '[수집품] 섬의 마음', type: 'collection' },
    { name: '천 덮인 선수상', condition: '[몬스터 처치] 필드 보스 - 티파니', type: 'monster' },
    { name: '여인의 얼음 조각상', condition: '[수집품] 섬의 마음', type: 'collection' },
    { name: '눈썰매', condition: '[모험의 서] 베른 남부', type: 'adventurebook' },
    { name: '잃어버린 상선', condition: '[평판] 베른 마법학회', type: 'reputation' },
    { name: '심해 암석', condition: '[호감도] 벨리온 유적지 - 라하르트', type: 'affinity' },
    { name: '부서진 거대사슬', condition: '[평판] 대우림 - 무덤을 떠도는 이야기', type: 'reputation' },
    { name: '가디언의 상흔', condition: '[호감도] ? ? ? - ? ? ?', type: 'affinity' }
  ],
  '세계수의 잎': [
    { name: '세계수의 잎 #1', condition: '[가이드] 즐거운 생활 수집품 모으기', type: 'guide' },
    { name: '세계수의 잎 #2', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #3', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #4', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #5', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #6', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #7', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #8', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #9', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #10', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #11', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #12', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #13', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #14', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #15', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #16', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #17', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #18', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #19', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #20', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #21', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #22', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #23', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #24', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #25', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #26', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #27', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #28', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #29', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #30', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #31', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #32', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #33', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #34', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #35', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #36', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #37', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #38', condition: '[사용] 끈적이는 특수 부위', type: 'use' },
    { name: '세계수의 잎 #39', condition: '[사용] 신비한 고대 화산어', type: 'use' },
    { name: '세계수의 잎 #40', condition: '[사용] 고대 언어가 새겨진 상자', type: 'use' },
    { name: '세계수의 잎 #41', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #42', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #43', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #44', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #45', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #46', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #47', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #48', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #49', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #50', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #51', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #52', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #53', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #54', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #55', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #56', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #57', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #58', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #59', condition: '[생활] 식물채집 - 비밀의 열대 식물', type: 'life' },
    { name: '세계수의 잎 #60', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #61', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #62', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #63', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #64', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #65', condition: '[사용] 오래된 상자', type: 'use' },
    { name: '세계수의 잎 #66', condition: '[사용] 비밀 주머니 : 비법의 주머니', type: 'use' },
    { name: '세계수의 잎 #67', condition: '[사용] 루카의 작은 상자', type: 'use' },
    { name: '세계수의 잎 #68', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #69', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #70', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #71', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #72', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #73', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #74', condition: '[생활] 식물채집 - 비밀의 열대 식물', type: 'life' },
    { name: '세계수의 잎 #75', condition: '[사용] 비밀 주머니 : 부드러운 주머니', type: 'use' },
    { name: '세계수의 잎 #76', condition: '[사용] 비밀 주머니 : 빛나는 백금 주머니', type: 'use' },
    { name: '세계수의 잎 #77', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #78', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #79', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #80', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #81', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #82', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #83', condition: '[사용] 비밀 주머니 : 질긴 가죽 주머니', type: 'use' },
    { name: '세계수의 잎 #84', condition: '[사용] 비밀 주머니 : 신기한 마법 주머니', type: 'use' },
    { name: '세계수의 잎 #85', condition: '[사용] 비밀 주머니 : 보석 장식 주머니', type: 'use' },
    { name: '세계수의 잎 #86', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #87', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #88', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #89', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #90', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #91', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #92', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #93', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #94', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #95', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #96', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #97', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #98', condition: '[사용] 비밀 주머니 : 향기 나는 주머니', type: 'use' },
    { name: '세계수의 잎 #99', condition: '[생활] 벌목 - 깨어난 비밀의 나무', type: 'life' },
    { name: '세계수의 잎 #100', condition: '[사용] 비밀 주머니 : 반짝이는 주머니', type: 'use' },
    { name: '세계수의 잎 #101', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #102', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #103', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #104', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #105', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #106', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #107', condition: '[사용] 비밀 주머니 : 마력이 스민 주머니', type: 'use' },
    { name: '세계수의 잎 #108', condition: '[사용] 무지개 물고기', type: 'use' },
    { name: '세계수의 잎 #109', condition: '[사용] 다시 피어난 꽃망울', type: 'use' },
    { name: '세계수의 잎 #110', condition: '[생활] 식물채집', type: 'life' },
    { name: '세계수의 잎 #111', condition: '[생활] 벌목', type: 'life' },
    { name: '세계수의 잎 #112', condition: '[생활] 채광', type: 'life' },
    { name: '세계수의 잎 #113', condition: '[생활] 수렵', type: 'life' },
    { name: '세계수의 잎 #114', condition: '[생활] 낚시', type: 'life' },
    { name: '세계수의 잎 #115', condition: '[생활] 고고학', type: 'life' },
    { name: '세계수의 잎 #116', condition: '[사용] 비밀 주머니 : 슬픔에 잠긴 주머니', type: 'use' },
    { name: '세계수의 잎 #117', condition: '[사용] 슬픔에 잠긴 예물 상자', type: 'use' },
    { name: '세계수의 잎 #118', condition: '[사용] 비밀 주머니 : 거무스름한 주머니', type: 'use' }
  ],
  '오르페우스의 별': [
    { name: '오르페우스의 별 #1', condition: '[퀘스트] 속삭이는 별', type: 'quest' },
    { name: '오르페우스의 별 #2', condition: '[평판] 니아 마을 - 정화 의식', type: 'reputation' },
    { name: '오르페우스의 별 #3', condition: '[호감도] 니아 마을 - 니아', type: 'rapport' },
    { name: '오르페우스의 별 #4', condition: '[물물교환] 파푸니카 - 작살아귀 헌팅 길드선', type: 'trade' },
    { name: '오르페우스의 별 #5', condition: '[필드 보스] 티카티카 군락지 - 모아케', type: 'field_boss' },
    { name: '오르페우스의 별 #6', condition: '[몬스터 처치] 탄식의 정원 - 망가진 스텔라', type: 'monster' },
    { name: '오르페우스의 별 #7', condition: '[던전] 베른 남부 - 혼돈의 사선', type: 'dungeon' },
    { name: '오르페우스의 별 #8', condition: '[필드 보스] 레갸르방크 대평원 - 헤르무트', type: 'field_boss' },
    { name: '오르페우스의 별 #9', condition: '[필드 보스] 엘가시아 - 이스라펠', type: 'field_boss' },
    { name: '오르페우스의 별 #10', condition: '[필드 보스] 볼다이크 - 드라커스', type: 'field_boss' }
  ],
  '기억의 오르골': [
    { name: '기억의 구슬 #1', condition: '[퀘스트] 배꽃나무 자생지 - 검은 들녘 바깥의 삶', type: 'quest' },
    { name: '기억의 구슬 #2', condition: '[퀘스트] 은빛물결 호수 - 너를 위한 자장가', type: 'quest' },
    { name: '기억의 구슬 #3', condition: '[퀘스트] 라니아 마을 - 레기오로스의 수염이라고!', type: 'quest' },
    { name: '기억의 구슬 #4', condition: '[퀘스트] 티카티카 군락지 - 새로운 나를 위한 것이었음을', type: 'quest' },
    { name: '기억의 구슬 #5', condition: '[퀘스트] 디오리카 평원 - 할아버지와 손자', type: 'quest' },
    { name: '기억의 구슬 #6', condition: '[퀘스트] 니아 마을 - 전설이 시작된 곳', type: 'quest' },
    { name: '기억의 구슬 #7', condition: '[퀘스트] 레온하트 - 그들의 유토피아?', type: 'quest' },
    { name: '기억의 구슬 #8', condition: '[퀘스트] 라니아 마을 - 즐거운 나의 집', type: 'quest' },
    { name: '기억의 구슬 #9', condition: '[퀘스트] 머무른 시간의 호수 - 가깝고도 먼 사이', type: 'quest' },
    { name: '기억의 구슬 #10', condition: '[퀘스트] 이름 없는 협곡 - 영웅을 기억하는 법', type: 'quest' },
    { name: '기억의 구슬 #11', condition: '[퀘스트] 은빛물결 호수 - 멀리 온 소풍', type: 'quest' },
    { name: '기억의 구슬 #12', condition: '[퀘스트] 크로커니스 해변 - 마음이 도착하는 곳', type: 'quest' },
    { name: '기억의 구슬 #13', condition: '[퀘스트] 이름 없는 협곡 - 돌이킬 수 없는 꿈', type: 'quest' },
    { name: '기억의 구슬 #14', condition: '[퀘스트] 거북 섬 - 모래톱에 부서지는 윤슬처럼', type: 'quest' },
    { name: '기억의 구슬 #15', condition: '[퀘스트] 살란드 구릉지 - 전설이 영웅에게', type: 'quest' },
    { name: '기억의 구슬 #16', condition: '[퀘스트] 소리의 숲 - 화불재양, 돌아갈 수 없더라도', type: 'quest' },
    { name: '기억의 구슬 #17', condition: '[퀘스트] 빌브린숲 - 바람이 건네는 인사', type: 'quest' },
    { name: '기억의 구슬 #18', condition: '[퀘스트] 라니아 마을 - 못 말리는 아가씨', type: 'quest' },
    { name: '기억의 구슬 #19', condition: '[퀘스트] 플레체 - 어둠 너머', type: 'quest' },
    { name: '기억의 구슬 #20', condition: '[퀘스트] 베른 성 - 온전한 기억 한 켠, 그리고', type: 'quest' }
  ],
};

const CollectiblesProgress = ({ collectiblesData }) => {
  const [selectedCollectible, setSelectedCollectible] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sortType, setSortType] = useState('기본');
  // 수집품 아이콘 매핑
  const getCollectibleIcon = (type) => {
    const iconMap = {
      '모코코 씨앗': Map,
      '섬의 마음': Heart,
      '위대한 미술품': Palette,
      '거인의 심장': Heart,
      '이그네아의 징표': Crown,
      '항해 모험물': Compass,
      '세계수의 잎': Leaf
    };
    return iconMap[type] || Star;
  };

  // 진행도 색상 계산
  const getProgressColor = (percentage) => {
    if (percentage === 100) return 'bg-cyan-500';    // 완료 시 에스더 색상
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 진행도 텍스트 색상
  const getProgressTextColor = (percentage) => {
    if (percentage === 100) return 'text-cyan-400';  // 완료 시 에스더 색상
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 70) return 'text-blue-400';
    if (percentage >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  // 모달 관련 함수들
  const openDetails = (collectible) => {
    setSelectedCollectible(collectible);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedCollectible(null);
    setSortType('기본');
  };

  // 정렬된 아이템 목록 가져오기
  const getSortedItems = () => {
    if (!selectedCollectible || !selectedCollectible.CollectiblePoints) {
      return [];
    }
    
    const items = selectedCollectible.CollectiblePoints.map((item, index) => ({
      ...item,
      originalIndex: index
    }));

    if (sortType === '획득 조건') {
      return items.sort((a, b) => {
        const aCondition = COLLECTIBLE_DETAILS[selectedCollectible.Type] && COLLECTIBLE_DETAILS[selectedCollectible.Type][a.originalIndex];
        const bCondition = COLLECTIBLE_DETAILS[selectedCollectible.Type] && COLLECTIBLE_DETAILS[selectedCollectible.Type][b.originalIndex];
        
        if (!aCondition && !bCondition) return 0;
        if (!aCondition) return 1;
        if (!bCondition) return -1;
        
        return aCondition.type.localeCompare(bCondition.type);
      });
    }
    
    if (sortType === '미획득') {
      return items.sort((a, b) => {
        const aCompleted = a.Point >= a.MaxPoint;
        const bCompleted = b.Point >= b.MaxPoint;
        
        // 미완료를 먼저, 완료를 나중에
        if (aCompleted !== bCompleted) {
          return aCompleted ? 1 : -1;
        }
        // 같은 완료 상태면 원래 순서 유지
        return a.originalIndex - b.originalIndex;
      });
    }
    
    return items; // 기본 순서
  };

  if (!collectiblesData || collectiblesData.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-8">
        수집품 정보가 없습니다.
      </div>
    );
  }

  // 전체 진행도 계산 - 각 수집품의 퍼센트를 평균내어 계산
  const individualPercentages = collectiblesData.map(item => 
    item.MaxPoint > 0 ? (item.Point / item.MaxPoint) * 100 : 0
  );
  const overallPercentage = individualPercentages.length > 0 ? 
    Math.floor(individualPercentages.reduce((sum, percentage) => sum + percentage, 0) / individualPercentages.length) : 0;

  return (
    <div className="space-y-6">
      {/* 전체 진행도 요약 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">전체 수집품 진행도</h3>
          <span className={`text-lg font-bold ${getProgressTextColor(overallPercentage)}`}>
            {overallPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(overallPercentage)}`}
            style={{ width: `${overallPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* 개별 수집품 진행도 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collectiblesData.map((collectible, index) => {
          const percentage = collectible.MaxPoint > 0 ? 
            Math.floor((collectible.Point / collectible.MaxPoint) * 100) : 0;
          const IconComponent = getCollectibleIcon(collectible.Type);

          return (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-lg p-4 relative overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              onClick={() => openDetails(collectible)}
            >
              {/* 전체 배경 아이콘 */}
              <div className="absolute inset-0 opacity-85 pointer-events-none flex items-center justify-center">
                {collectible.Icon ? (
                  <img 
                    src={collectible.Icon} 
                    alt={collectible.Type}
                    className="w-full h-full object-cover scale-125"
                  />
                ) : (
                  <IconComponent size={200} className="text-gray-600 scale-125" />
                )}
              </div>
              
              {/* 텍스트 가독성을 위한 오버레이 */}
              <div className="absolute inset-0 bg-gray-900/60 dark:bg-gray-800/60 pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  {collectible.Icon ? (
                    <img 
                      src={collectible.Icon} 
                      alt={collectible.Type}
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <IconComponent size={20} className="text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-bold text-sm">{collectible.Type}</h4>
                    <div className="text-right">
                      <span className={`text-xs font-black ${getProgressTextColor(percentage)} block`}>
                        {percentage}%
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                        {collectible.Point.toLocaleString()} / {collectible.MaxPoint.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 진행도 바 */}
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 relative z-10">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 상세 보기 모달 */}
      {showDetails && selectedCollectible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeDetails}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  {selectedCollectible.Icon ? (
                    <img 
                      src={selectedCollectible.Icon} 
                      alt={selectedCollectible.Type}
                      className="w-6 h-6 object-cover rounded"
                    />
                  ) : (
                    <Map size={16} className="text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedCollectible.Type}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedCollectible.Point} / {selectedCollectible.MaxPoint}
                    <span> </span>({Math.floor((selectedCollectible.Point / selectedCollectible.MaxPoint) * 100)}%)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* 정렬 버튼 */}
                {COLLECTIBLE_DETAILS[selectedCollectible.Type] && COLLECTIBLE_DETAILS[selectedCollectible.Type].length > 0 && (
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setSortType('기본')}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        sortType === '기본'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      기본
                    </button>
                    <button
                      onClick={() => setSortType('획득 조건')}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        sortType === '획득 조건'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      획득 조건
                    </button>
                    <button
                      onClick={() => setSortType('미획득')}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        sortType === '미획득'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      미획득
                    </button>
                  </div>
                )}
                <button
                  onClick={closeDetails}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* 상세 리스트 */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedCollectible.CollectiblePoints && selectedCollectible.CollectiblePoints.length > 0 ? (
                <div className="space-y-2">
                  {getSortedItems().map((item, displayIndex) => {
                    const isCompleted = item.Point >= item.MaxPoint;
                    const originalIndex = item.originalIndex;
                    // 수집품 조건 정보 가져오기 (COLLECTIBLE_DETAILS에 있는 경우)
                    const conditionInfo = COLLECTIBLE_DETAILS[selectedCollectible.Type] && COLLECTIBLE_DETAILS[selectedCollectible.Type][originalIndex]
                      ? COLLECTIBLE_DETAILS[selectedCollectible.Type][originalIndex] 
                      : null;
                    
                    return (
                      <div 
                        key={`${sortType}-${originalIndex}`}
                        className={`grid grid-cols-[300px_1fr_auto] items-center gap-4 p-3 rounded-lg border transition-colors ${
                          isCompleted 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {/* 좌측: 번호 + 아이템명 */}
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            isCompleted 
                              ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' 
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}>
                            {sortType === '기본' ? originalIndex + 1 : displayIndex + 1}
                          </div>
                          <div>
                            <h4 className={`font-medium ${
                              isCompleted 
                                ? 'text-green-900 dark:text-green-100' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {item.PointName}
                            </h4>
                            <p className={`text-sm ${
                              isCompleted 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {item.Point} / {item.MaxPoint}
                            </p>
                          </div>
                        </div>
                        
                        {/* 중앙: 조건 정보 (고정 위치) */}
                        <div>
                          {conditionInfo && (
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                              {conditionInfo.condition}
                            </span>
                          )}
                        </div>
                        
                        {/* 우측: 체크 아이콘 */}
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          {isCompleted && <Check size={14} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  상세 정보가 없습니다.
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                아무곳이나 클릭하면 닫힙니다
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectiblesProgress;