// 로스트아크 레이드별 더보기 보상 데이터
// 2025년 기준 주요 레이드 정보

// 레이드 아이콘 import
// 군단장 레이드
import valtanIcon from '../assets/images/valtan.webp';
import vykasIcon from '../assets/images/vykas.webp';
import koukuIcon from '../assets/images/kouku.webp';
import brelshazaIcon from '../assets/images/brelshaza.webp';
import illiakanIcon from '../assets/images/illiakan.webp';
import kamenIcon from '../assets/images/kamen.webp';
// 어비스 던전
import kayangelIcon from '../assets/images/kayangel.webp';
import ivory_towerIcon from '../assets/images/ivory_tower.webp';
// 에픽 레이드
import behemothIcon from '../assets/images/behemoth.webp';
// 카제로스 레이드
import ekidnaIcon from '../assets/images/ekidna.webp';
import aegirIcon from '../assets/images/aegir.webp';
import abrelIcon from '../assets/images/abrel.webp';
import mordumIcon from '../assets/images/mordum.webp';
import armocheIcon from '../assets/images/armoche.webp';
import kazerothIcon from '../assets/images/kazeroth.webp';

export const RAID_DATA = {
  // 군단장 레이드
  valtan: {
    id: 'valtan',
    name: '발탄',
    category: '군단장 레이드',
    iconUrl: valtanIcon, // WebP 아이콘
    difficulty: ['normal', 'hard'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '파괴석 결정', quantity: { normal: 280, hard: 360 }, category: '강화재료' },
          { name: '수호석 결정', quantity: { normal: 560, hard: 720 }, category: '강화재료' },
          { name: '위대한 명예의 돌파석', quantity: { normal: 7, hard: 10 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 600, hard: 1300 }, category: '강화재료' },
          { name: '마수의 뼈', quantity: { normal: 1, hard: 3 }, category: '고유' },
        ],
        moreRewardCost: { normal: 75, hard: 175 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '파괴석 결정', quantity: { normal: 360, hard: 480 }, category: '강화재료' },
          { name: '수호석 결정', quantity: { normal: 720, hard: 960 }, category: '강화재료' },
          { name: '위대한 명예의 돌파석', quantity: { normal: 8, hard: 10 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 900, hard: 1600 }, category: '강화재료' },
          { name: '마수의 뼈', quantity: { normal: 2, hard: 3 }, category: '고유' },
          { name: '융합 돌파석', quantity: { normal: 6, hard: 12 }, category: '고유' },
        ],
        moreRewardCost: { normal: 100, hard: 275 }
      }
    ]
  },
  vykas: {
    id: 'vykas',
    name: '비아키스',
    category: '군단장 레이드',
    iconUrl: vykasIcon,
    difficulty: ['normal', 'hard'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '파괴석 결정', quantity: { normal: 340, hard: 450 }, category: '강화재료' },
          { name: '수호석 결정', quantity: { normal: 680, hard: 900 }, category: '강화재료' },
          { name: '위대한 명예의 돌파석', quantity: { normal: 9, hard: 12 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 800, hard: 1600 }, category: '강화재료' },
          { name: '욕망의 날개', quantity: { normal: 1, hard: 3 }, category: '고유' },
        ],
        moreRewardCost: { normal: 100, hard: 225 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '파괴석 결정', quantity: { normal: 420, hard: 520 }, category: '강화재료' },
          { name: '수호석 결정', quantity: { normal: 840, hard: 1040 }, category: '강화재료' },
          { name: '위대한 명예의 돌파석', quantity: { normal: 10, hard: 12 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 1200, hard: 2000 }, category: '강화재료' },
          { name: '욕망의 날개', quantity: { normal: 2, hard: 3 }, category: '고유' },
          { name: '융합 돌파석', quantity: { normal: 8, hard: 16 }, category: '고유' },
        ],
        moreRewardCost: { normal: 150, hard: 375 }
      }
    ]
  },
  kouku: {
    id: 'kouku',
    name: '쿠크세이튼',
    category: '군단장 레이드',
    iconUrl: koukuIcon,
    difficulty: ['normal'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '파괴석 결정', quantity: { normal: 360 }, category: '강화재료' },
          { name: '수호석 결정', quantity: { normal: 720 }, category: '강화재료' },
          { name: '위대한 명예의 돌파석', quantity: { normal: 13 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 2200 }, category: '강화재료' },
          { name: '광기의 나팔', quantity: { normal: 1 }, category: '고유' },
        ],
        moreRewardCost: { normal: 100 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '파괴석 결정', quantity: { normal: 480 }, category: '강화재료' },
          { name: '수호석 결정', quantity: { normal: 960 }, category: '강화재료' },
          { name: '위대한 명예의 돌파석', quantity: { normal: 13 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 2200 }, category: '강화재료' },
          { name: '광기의 나팔', quantity: { normal: 2 }, category: '고유' },
        ],
        moreRewardCost: { normal: 150 }
      },
      {
        gateId: 3,
        name: '3관문',
        materials: [
          { name: '파괴석 결정', quantity: { normal: 600 }, category: '강화재료' },
          { name: '수호석 결정', quantity: { normal: 1200 }, category: '강화재료' },
          { name: '위대한 명예의 돌파석', quantity: { normal: 16 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 2600 }, category: '강화재료' },
          { name: '광기의 나팔', quantity: { normal: 2 }, category: '고유' },
          { name: '융합 돌파석', quantity: { normal: 12 }, category: '고유' },
        ],
        moreRewardCost: { normal: 200 }
      }
    ]
  },
  brelshaza: {
    id: 'brelshaza',
    name: '아브렐슈드',
    category: '군단장 레이드',
    iconUrl: brelshazaIcon,
    difficulty: ['normal', 'hard'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '파괴강석', quantity: { normal: 120, hard: 260 }, category: '강화재료' },
          { name: '수호강석', quantity: { normal: 240, hard: 520 }, category: '강화재료' },
          { name: '경이로운 명예의 돌파석', quantity: { normal: 8, hard: 12 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 3000, hard: 3000 }, category: '강화재료' },
          { name: '몽환의 사념', quantity: { normal: 4, hard: 6 }, category: '고유' },
        ],
        moreRewardCost: { normal: 100, hard: 300 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '파괴강석', quantity: { normal: 180, hard: 420 }, category: '강화재료' },
          { name: '수호강석', quantity: { normal: 360, hard: 840 }, category: '강화재료' },
          { name: '경이로운 명예의 돌파석', quantity: { normal: 10, hard: 16 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 3000, hard: 4000 }, category: '강화재료' },
          { name: '몽환의 사념', quantity: { normal: 4, hard: 6 }, category: '고유' },
        ],
        moreRewardCost: { normal: 150, hard: 300 }
      },
      {
        gateId: 3,
        name: '3관문',
        materials: [
          { name: '파괴강석', quantity: { normal: 300, hard: 640 }, category: '강화재료' },
          { name: '수호강석', quantity: { normal: 600, hard: 1280 }, category: '강화재료' },
          { name: '경이로운 명예의 돌파석', quantity: { normal: 16, hard: 24 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 4000, hard: 5200 }, category: '강화재료' },
          { name: '몽환의 사념', quantity: { normal: 5, hard: 7 }, category: '고유' },
          { name: '심화 돌파석', quantity: { normal: 10, hard: 12 }, category: '고유' },
        ],
        moreRewardCost: { normal: 200, hard: 300 }
      },
      {
        gateId: 4,
        name: '4관문',
        materials: [
          { name: '파괴강석', quantity: { normal: 600, hard: 1000 }, category: '강화재료' },
          { name: '수호강석', quantity: { normal: 1200, hard: 2000 }, category: '강화재료' },
          { name: '경이로운 명예의 돌파석', quantity: { normal: 28, hard: 40 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 7000, hard: 10000 }, category: '강화재료' },
          { name: '몽환의 사념', quantity: { normal: 7, hard: 10 }, category: '고유' },
          { name: '심화 돌파석', quantity: { normal: 20, hard: 24 }, category: '고유' },
        ],
        moreRewardCost: { normal: 375, hard: 500 }
      }
    ]
  },
  illiakan: {
    id: 'illiakan',
    name: '일리아칸',
    category: '군단장 레이드',
    iconUrl: illiakanIcon,
    difficulty: ['normal', 'hard'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '정제된 파괴강석', quantity: { normal: 140, hard: 160 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { normal: 280, hard: 320 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { normal: 6, hard: 8 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 3830, hard: 3200 }, category: '강화재료' },
          { name: '쇠락의 눈동자', quantity: { normal: 3, hard: 7 }, category: '고유' },
        ],
        moreRewardCost: { normal: 190, hard: 300 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '정제된 파괴강석', quantity: { normal: 160, hard: 200 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { normal: 320, hard: 400 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { normal: 7, hard: 10 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 3880, hard: 3200 }, category: '강화재료' },
          { name: '쇠락의 눈동자', quantity: { normal: 3, hard: 7 }, category: '고유' },
        ],
        moreRewardCost: { normal: 230, hard: 500 }
      },
      {
        gateId: 3,
        name: '3관문',
        materials: [
          { name: '정제된 파괴강석', quantity: { normal: 230, hard: 290 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { normal: 460, hard: 580 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { normal: 13, hard: 15 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 4430, hard: 4400 }, category: '강화재료' },
          { name: '쇠락의 눈동자', quantity: { normal: 5, hard: 8 }, category: '고유' },
          { name: '농축 돌파석', quantity: { normal: 7, hard: 13 }, category: '고유' },
        ],
        moreRewardCost: { normal: 330, hard: 700 }
      }
    ]
  },
  kamen: {
    id: 'kamen',
    name: '카멘',
    category: '군단장 레이드',
    iconUrl: kamenIcon,
    difficulty: ['normal', 'hard'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '정제된 파괴강석', quantity: { normal: 250, hard: 280 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { normal: 500, hard: 560 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { normal: 9, hard: 9 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 2220, hard: 2760 }, category: '강화재료' },
          { name: '어둠의 불', quantity: { normal: 6, hard: 12 }, category: '고유' },
          { name: '마력의 샘물', quantity: { normal: 2, hard: 6 }, category: '고유' },
        ],
        moreRewardCost: { normal: 360, hard: 500 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '정제된 파괴강석', quantity: { normal: 290, hard: 320 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { normal: 580, hard: 640 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { normal: 12, hard: 12 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 2880, hard: 3200 }, category: '강화재료' },
          { name: '어둠의 불', quantity: { normal: 8, hard: 16 }, category: '고유' },
          { name: '마력의 샘물', quantity: { normal: 3, hard: 9 }, category: '고유' },
        ],
        moreRewardCost: { normal: 440, hard: 600 }
      },
      {
        gateId: 3,
        name: '3관문',
        materials: [
          { name: '정제된 파괴강석', quantity: { normal: 390, hard: 410 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { normal: 780, hard: 820 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { normal: 13, hard: 16 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 3780, hard: 4080 }, category: '강화재료' },
          { name: '어둠의 불', quantity: { normal: 12, hard: 24 }, category: '고유' },
          { name: '마력의 샘물', quantity: { normal: 4, hard: 12 }, category: '고유' },
          { name: '농축 돌파석', quantity: { normal: 3, hard: 5 }, category: '고유' },
        ],
        moreRewardCost: { normal: 640, hard: 900 }
      },
      {
        gateId: 4,
        name: '4관문',
        materials: [
          { name: '정제된 파괴강석', quantity: { hard: 560 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { hard: 1120 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { hard: 22 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { hard: 5730 }, category: '강화재료' },
          { name: '어둠의 불', quantity: { hard: 24 }, category: '고유' },
          { name: '마력의 샘물', quantity: { hard: 12 }, category: '고유' },
          { name: '농축 돌파석', quantity: { hard: 7 }, category: '고유' },
        ],
        moreRewardCost: { hard: 1250 }
      }
    ]
  },
  // 어비스 던전
  kayangel: {
    id: 'kayangel',
    name: '카양겔',
    category: '어비스 던전',
    iconUrl: kayangelIcon,
    difficulty: ['normal', 'hard'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '파괴강석', quantity: { normal: 210 }, category: '강화재료' },
          { name: '정제된 파괴강석', quantity: { hard: 70 }, category: '강화재료' },
          { name: '수호강석', quantity: { normal: 420 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { hard: 140 }, category: '강화재료' },
          { name: '경이로운 명예의 돌파석', quantity: { normal: 10 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { hard: 3 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 3290, hard: 3400 }, category: '강화재료' },
          { name: '관조의 빛무리', quantity: { hard: 1 }, category: '고유' },
          { name: '시련의 빛', quantity: { normal: 11, hard: 14 }, category: '고유' },
        ],
        moreRewardCost: { normal: 180, hard: 225 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '파괴강석', quantity: { normal: 260 }, category: '강화재료' },
          { name: '정제된 파괴강석', quantity: { hard: 800 }, category: '강화재료' },
          { name: '수호강석', quantity: { normal: 520 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { hard: 160 }, category: '강화재료' },
          { name: '경이로운 명예의 돌파석', quantity: { normal: 11 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { hard: 4 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 3310, hard: 3400 }, category: '강화재료' },
          { name: '관조의 빛무리', quantity: { normal: 1, hard: 1 }, category: '고유' },
          { name: '시련의 빛', quantity: { normal: 12, hard: 16 }, category: '고유' },
        ],
        moreRewardCost: { normal: 200, hard: 350 }
      },
      {
        gateId: 3,
        name: '3관문',
        materials: [
          { name: '파괴강석', quantity: { normal: 310 }, category: '강화재료' },
          { name: '정제된 파괴강석', quantity: { hard: 110 }, category: '강화재료' },
          { name: '수호강석', quantity: { normal: 620 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { hard: 220 }, category: '강화재료' },
          { name: '경이로운 명예의 돌파석', quantity: { normal: 15 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { hard: 6 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 4990, hard: 5100 }, category: '강화재료' },
          { name: '관조의 빛무리', quantity: { normal: 2, hard: 3 }, category: '고유' },
          { name: '시련의 빛', quantity: { normal: 17, hard: 20 }, category: '고유' },
          { name: '심화 돌파석', quantity: { normal: 8 }, category: '고유' },
          { name: '농축 돌파석', quantity: { hard: 5 }, category: '고유' },
        ],
        moreRewardCost: { normal: 270, hard: 500 }
      }
    ]
  },
    ivory_tower: {
    id: 'ivory_tower',
    name: '혼돈의 상아탑',
    category: '어비스 던전',
    iconUrl: ivory_towerIcon,
    difficulty: ['normal', 'hard'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '정제된 파괴강석', quantity: { normal: 150, hard: 170 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { normal: 300 , hard: 340 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { normal: 7, hard: 8 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 3600, hard: 4400 }, category: '강화재료' },
          { name: '빛나는 지혜의 기운', quantity: { normal: 2, hard: 4 }, category: '고유' },
        ],
        moreRewardCost: { normal: 180, hard: 350 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '정제된 파괴강석', quantity: { normal: 160, hard: 180 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { normal: 320 , hard: 360 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { normal: 7, hard: 8 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 3600, hard: 4400 }, category: '강화재료' },
          { name: '빛나는 지혜의 기운', quantity: { normal: 2, hard: 4 }, category: '고유' },
        ],
        moreRewardCost: { normal: 220, hard: 500 }
      },
      {
        gateId: 3,
        name: '3관문',
        materials: [
          { name: '정제된 파괴강석', quantity: { normal: 230, hard: 280 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { normal: 460 , hard: 560 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { normal: 13, hard: 16 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 6000, hard: 7000 }, category: '강화재료' },
          { name: '빛나는 지혜의 기운', quantity: { normal: 4, hard: 8 }, category: '고유' },
          { name: '빛나는 지혜의 엘릭서', quantity: { normal: 1, hard: 2 }, category: '고유' },
          { name: '농축 돌파석', quantity: { normal: 3, hard: 5 }, category: '고유' },
        ],
        moreRewardCost: { normal: 300, hard: 950 }
      }
    ]
  },
  // 에픽 레이드
  behemoth: {
    id: 'behemoth',
    name: '베히모스',
    category: '에픽 레이드',
    iconUrl: behemothIcon,
    difficulty: ['normal'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '운명의 파괴석', quantity: { normal: 300 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { normal: 600 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { normal: 8 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { normal: 2050 }, category: '강화재료' },
          { name: '베히모스의 비늘', quantity: { normal: 10 }, category: '고유' },
          { name: '마력의 샘물', quantity: { normal: 10 }, category: '고유' },
        ],
        moreRewardCost: { normal: 920 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '운명의 파괴석', quantity: { normal: 470 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { normal: 940 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { normal: 11 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { normal: 3120 }, category: '강화재료' },
          { name: '베히모스의 비늘', quantity: { normal: 20 }, category: '고유' },
          { name: '마력의 샘물', quantity: { normal: 18 }, category: '고유' },
          { name: '순환 돌파석', quantity: { normal: 7 }, category: '고유' },
        ],
        moreRewardCost: { normal: 1960 }
      }
    ]
  },
  // 카제로스 레이드
  ekidna: {
    id: 'ekidna',
    name: '서막: 에키드나',
    category: '카제로스 레이드',
    iconUrl: ekidnaIcon,
    difficulty: ['normal', 'hard'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '정제된 파괴강석', quantity: { normal: 310 }, category: '강화재료' },
          { name: '운명의 파괴석', quantity: { hard: 300 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { normal: 620 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { hard: 600 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { normal: 12 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { hard: 8 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 4350 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { hard: 2050 }, category: '강화재료' },
          { name: '아그리스의 비늘', quantity: { normal: 3 }, category: '고유' },
          { name: '알키오네의 눈', quantity: { hard: 3 }, category: '고유' },
        ],
        moreRewardCost: { normal: 380, hard: 920 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '정제된 파괴강석', quantity: { normal: 540 }, category: '강화재료' },
          { name: '운명의 파괴석', quantity: { hard: 470 }, category: '강화재료' },
          { name: '정제된 수호강석', quantity: { normal: 1080 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { hard: 940 }, category: '강화재료' },
          { name: '찬란한 명예의 돌파석', quantity: { normal: 20 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { hard: 11 }, category: '강화재료' },
          { name: '명예의 파편', quantity: { normal: 6340 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { hard: 3120 }, category: '강화재료' },
          { name: '아그리스의 비늘', quantity: { normal: 6 }, category: '고유' },
          { name: '알키오네의 눈', quantity: { hard: 6 }, category: '고유' },
          { name: '농축 돌파석', quantity: { normal: 5 }, category: '고유' },
          { name: '순환 돌파석', quantity: { hard: 6 }, category: '고유' },
        ],
        moreRewardCost: { normal: 840, hard: 1960 }
      }
    ]
  },
  aegir: {
    id: 'aegir',
    name: '1막: 에기르',
    category: '카제로스 레이드',
    iconUrl: aegirIcon,
    difficulty: ['normal', 'hard'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '운명의 파괴석', quantity: { normal: 420, hard: 760 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { normal: 840, hard: 1520 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { normal: 10, hard: 25 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { normal: 3790, hard: 6670 }, category: '강화재료' },
          { name: '업화의 쐐기돌', quantity: { normal: 4, hard: 8 }, category: '고유' },
        ],
        moreRewardCost: { normal: 1030, hard: 3640 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '운명의 파괴석', quantity: { normal: 610, hard: 1030 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { normal: 1220, hard: 2060 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { normal: 19, hard: 34 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { normal: 6020, hard: 9820 }, category: '강화재료' },
          { name: '업화의 쐐기돌', quantity: { normal: 6, hard: 12 }, category: '고유' },
          { name: '순환 돌파석', quantity: { normal: 7, hard: 9 }, category: '고유' },
        ],
        moreRewardCost: { normal: 2400, hard: 5880 }
      }
    ]
  },
  abrel: {
    id: 'abrel',
    name: '2막: 아브렐슈드',
    category: '카제로스 레이드',
    iconUrl: abrelIcon,
    difficulty: ['normal', 'hard'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '운명의 파괴석', quantity: { normal: 690, hard: 850 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { normal: 1380, hard: 1900 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { normal: 16, hard: 32 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { normal: 5980, hard: 8000 }, category: '강화재료' },
          { name: '카르마의 잔영', quantity: { normal: 4, hard: 8 }, category: '고유' },
        ],
        moreRewardCost: { normal: 3240, hard: 4500 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '운명의 파괴석', quantity: { normal: 910, hard: 1400 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { normal: 1820, hard: 2800 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { normal: 26, hard: 48 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { normal: 6020, hard: 9820 }, category: '강화재료' },
          { name: '카르마의 잔영', quantity: { normal: 6, hard: 12 }, category: '고유' },
          { name: '순환 돌파석', quantity: { normal: 7, hard: 9 }, category: '고유' },
        ],
        moreRewardCost: { normal: 4830, hard: 7200 }
      }
    ]
  },
  mordum: {
    id: 'mordum',
    name: '3막: 모르둠',
    category: '카제로스 레이드',
    iconUrl: mordumIcon,
    difficulty: ['normal', 'hard'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '운명의 파괴석', quantity: { normal: 500, hard: 830 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { normal: 1000, hard: 1660 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { normal: 18, hard: 31 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { normal: 4800, hard: 7000 }, category: '강화재료' },
          { name: '낙뢰의 뿔', quantity: { normal: 3 }, category: '고유' },
          { name: '우뢰의 뇌옥', quantity: { hard: 3 }, category: '고유' },
        ],
        moreRewardCost: { normal: 2400, hard: 2700 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '운명의 파괴석', quantity: { normal: 620, hard: 1140 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { normal: 1240, hard: 2280 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { normal: 20, hard: 36 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { normal: 5600, hard: 9900 }, category: '강화재료' },
          { name: '낙뢰의 뿔', quantity: { normal: 5 }, category: '고유' },
          { name: '우뢰의 뇌옥', quantity: { hard: 5 }, category: '고유' },
        ],
        moreRewardCost: { normal: 3200, hard: 4100 }
      },
            {
        gateId: 3,
        name: '3관문',
        materials: [
          { name: '운명의 파괴석', quantity: { normal: 840, hard: 2080 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { normal: 1680, hard: 4160 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { normal: 26, hard: 64 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { normal: 7400, hard: 16800 }, category: '강화재료' },
          { name: '낙뢰의 뿔', quantity: { normal: 10 }, category: '고유' },
          { name: '우뢰의 뇌옥', quantity: { hard: 10 }, category: '고유' },
          { name: '순환 돌파석', quantity: { normal: 7, hard: 10 }, category: '고유' },
        ],
        moreRewardCost: { normal: 4200, hard: 5800 }
      }
    ]
  },
  armoche: {
    id: 'armoche',
    name: '4막: 아르모체',
    category: '카제로스 레이드',
    iconUrl: armocheIcon,
    difficulty: ['normal', 'hard'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '운명의 파괴석', quantity: { normal: 1400, hard: 1680 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { normal: 2800, hard: 3360 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { normal: 44, hard: 53 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { normal: 11880, hard: 14250 }, category: '강화재료' },
          { name: '아크 그리드', quantity: { normal: 1, hard: 1 }, category: '고유' },
        ],
        moreRewardCost: { normal: 4000, hard: 4800 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '운명의 파괴석', quantity: { normal: 2400, hard: 2880 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { normal: 4800, hard: 5760 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { normal: 78, hard: 94 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { normal: 20160, hard: 24200 }, category: '강화재료' },
          { name: '아크 그리드', quantity: { normal: 1, hard: 1 }, category: '고유' },
          { name: '순환 돌파석', quantity: { normal: 10, hard: 13 }, category: '고유' },
        ],
        moreRewardCost: { normal: 6560, hard: 8640 }
      }
    ]
  },
  kazeroth: {
    id: 'kazeroth',
    name: '종막: 카제로스',
    category: '카제로스 레이드',
    iconUrl: kazerothIcon,
    difficulty: ['normal', 'hard'],
    gates: [
      {
        gateId: 1,
        name: '1관문',
        materials: [
          { name: '운명의 파괴석', quantity: { normal: 1610, hard: 2200 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { normal: 3220, hard: 4400 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { normal: 50, hard: 70 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { normal: 13650, hard: 17500 }, category: '강화재료' },
          { name: '아크 그리드', quantity: { normal: 1, hard: 1 }, category: '고유' },
        ],
        moreRewardCost: { normal: 4480, hard: 5440 }
      },
      {
        gateId: 2,
        name: '2관문',
        materials: [
          { name: '운명의 파괴석', quantity: { normal: 2760, hard: 3800 }, category: '강화재료' },
          { name: '운명의 수호석', quantity: { normal: 5520, hard: 7600 }, category: '강화재료' },
          { name: '운명의 돌파석', quantity: { normal: 90, hard: 120 }, category: '강화재료' },
          { name: '운명의 파편', quantity: { normal: 23200, hard: 29800 }, category: '강화재료' },
          { name: '아크 그리드', quantity: { normal: 1, hard: 1 }, category: '고유' },
          { name: '순환 돌파석', quantity: { normal: 12, hard: 16 }, category: '고유' },
        ],
        moreRewardCost: { normal: 8320, hard: 11200 }
      }
    ]
  },

};

// 레이드 카테고리별 분류
export const RAID_CATEGORIES = {
  '군단장 레이드': ['valtan', 'vykas', 'kouku', 'brelshaza', 'illiakan', 'kamen'],
  '카제로스 레이드': ['ekidna', 'aegir', 'abrel', 'mordum', 'armoche', 'kazeroth'],
  '어비스 던전': ['kayangel', 'ivory_tower'],
  '에픽 레이드': ['behemoth']
};

// 재료 아이템 정보 (거래소 검색용)
export const MATERIAL_SEARCH_NAMES = {
  // 개당 가격 재료
  '상급 오레하 융화 재료': '상급 오레하 융화 재료',
  '최상급 오레하 융화 재료': '최상급 오레하 융화 재료',
  '아비도스 융화 재료': '아비도스 융화 재료',

  '위대한 명예의 돌파석': '위대한 명예의 돌파석',
  '경이로운 명예의 돌파석': '경이로운 명예의 돌파석',
  '찬란한 명예의 돌파석': '찬란한 명예의 돌파석',
  '운명의 돌파석': '운명의 돌파석',
  
  // 100개당 가격 재료 (거래소에서 100개 단위로 판매)
  '파괴석 결정': '파괴석 결정',
  '수호석 결정': '수호석 결정',
  '파괴강석': '파괴강석',
  '수호강석': '수호강석',
  '정제된 파괴강석': '정제된 파괴강석',
  '정제된 수호강석': '정제된 수호강석',
  '운명의 파괴석': '운명의 파괴석',
  '운명의 수호석': '운명의 수호석',
  
  // 주머니(대) 형태 재료 (거래소에서 주머니로 판매)
  '명예의 파편': '명예의 파편 주머니(대)',
  '운명의 파편': '운명의 파편 주머니(대)'
};

// 재료별 가격 계산 로직
export const MATERIAL_PRICE_CALCULATORS = {
  // 100개당 가격 재료 (거래소 가격 ÷ 100 = 개당 가격)
  '파괴석 결정': (price) => price / 100,
  '수호석 결정': (price) => price / 100,
  '파괴강석': (price) => price / 100,
  '수호강석': (price) => price / 100,
  '정제된 파괴강석': (price) => price / 100,
  '정제된 수호강석': (price) => price / 100,
  '운명의 파괴석': (price) => price / 100,
  '운명의 수호석': (price) => price / 100,
  
  // 주머니(대) 형태 재료
  '명예의 파편': (price) => price / 1500,  // 주머니(대) 가격 ÷ 1500 = 개당 가격
  '운명의 파편': (price) => price / 3000,  // 주머니(대) 가격 ÷ 3000 = 개당 가격
  
  // 기본값: 개당 가격 (그대로 사용)
  // 아비도스 융화 재료, 각종 돌파석들은 개당 가격으로 계산
  default: (price) => price
};

// 재료의 개당 가격 계산 함수
export const calculateMaterialUnitPrice = (materialName, marketPrice) => {
  const calculator = MATERIAL_PRICE_CALCULATORS[materialName] || MATERIAL_PRICE_CALCULATORS.default;
  return calculator(marketPrice);
};

// 레이드 정렬 순서 (UI 표시용)
export const RAID_DISPLAY_ORDER = [
  'valtan', 'vykas', 'kouku', 'brelshaza', 'kayangel', 'illiakan', 'ivory_tower', 'kamen', 'behemoth',
  'ekidna', 'aegir', 'abrel', 'mordum', 'armoche', 'kazeroth',
];

// 레이드 선택 옵션 생성 함수
export const getRaidOptions = () => {
  return RAID_DISPLAY_ORDER.map(raidId => ({
    value: raidId,
    label: RAID_DATA[raidId].name,
    category: RAID_DATA[raidId].category
  }));
};

// 특정 레이드의 관문 데이터 가져오기
export const getRaidGates = (raidId, difficulty = 'normal') => {
  const raid = RAID_DATA[raidId];
  if (!raid) return [];
  
  return raid.gates.map(gate => ({
    ...gate,
    currentCost: gate.moreRewardCost[difficulty] || gate.moreRewardCost.normal
  }));
};