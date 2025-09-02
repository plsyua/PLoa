// 로스트아크 일일/주간 컨텐츠 데이터 정의

// 일일 컨텐츠 종류
export const DAILY_CONTENT = {
  CHAOS_DUNGEON: {
    id: 'chaos_dungeon',
    name: '쿠르잔 전선',
    maxCount: 1,
    type: 'daily',
    resetType: 'daily'
  },
  GUARDIAN_RAID: {
    id: 'guardian_raid', 
    name: '가디언 토벌',
    maxCount: 1,
    type: 'daily',
    resetType: 'daily'
  },
  FIELD_BOSS: { // 화, 금, 일요일만 입장 가능
    id: 'field_boss',
    name: '필드보스',
    maxCount: 1,
    type: 'daily',
    resetType: 'daily',
    shared: true, // 계정 공유 컨텐츠
    availableDays: [0, 2, 5] // 일요일, 화요일, 금요일 (0=일요일)
  },
  CHAOS_GATE: { // 월, 목, 토, 일요일만 입장 가능
    id: 'chaos_gate',
    name: '카오스게이트',
    maxCount: 1,
    type: 'daily',
    resetType: 'daily',
    shared: true, // 계정 공유 컨텐츠
    availableDays: [0, 1, 4, 6] // 일요일, 월요일, 목요일, 토요일
  }
};

// 주간 컨텐츠 종류
export const WEEKLY_CONTENT = {
  WEEKLY_QUEST: {
    id: 'weekly_quest',
    name: '주간 에포나',
    maxCount: 3,
    type: 'weekly',
    resetType: 'weekly'
  }
};

// 어비스 던전 컨텐츠
export const ABYSS_DUNGEON_CONTENT = {
  KAYANGEL: {
    id: 'kayangel',
    name: '카양겔',
    difficulties: [
      { id: 'kayangel_normal', name: '카양겔', difficulty: 'normal', minLevel: 1540 },
      { id: 'kayangel_hard', name: '카양겔', difficulty: 'hard', minLevel: 1580 },
    ]
  },
  Ivory_Tower: {
    id: 'ivory_tower',
    name: '혼돈의 상아탑',
    difficulties: [
      { id: 'ivorytower_normal', name: '혼돈의 상아탑', difficulty: 'normal', minLevel: 1600 },
      { id: 'ivorytower_hard', name: '혼돈의 상아탑', difficulty: 'hard', minLevel: 1620 },
    ]
  }  
};

// 군단장 레이드 컨텐츠
export const LEGION_RAID_CONTENT = {
  BALTAN: {
    id: 'baltan',
    name: '발탄',
    difficulties: [
      { id: 'baltan_normal', name: '발탄', difficulty: 'normal', minLevel: 1415 },
      { id: 'baltan_hard', name: '발탄', difficulty: 'hard', minLevel: 1430 }
    ],
    type: 'legion_raid',
    resetType: 'weekly'
  },
  VYKAS: {
    id: 'vykas', 
    name: '비아키스',
    difficulties: [
      { id: 'vykas_normal', name: '비아키스', difficulty: 'normal', minLevel: 1430 },
      { id: 'vykas_hard', name: '비아키스', difficulty: 'hard', minLevel: 1460 }
    ],
    type: 'legion_raid',
    resetType: 'weekly'
  },
  KAKUL: {
    id: 'kouku',
    name: '쿠크세이튼',
    difficulties: [
      { id: 'kakul_normal', name: '쿠크세이튼', difficulty: 'normal', minLevel: 1475 }
    ],
    type: 'legion_raid',
    resetType: 'weekly'
  },
  BRELSHAZA: {
    id: 'brelshaza',
    name: '아브렐슈드',
    difficulties: [
      { id: 'brel_normal', name: '아브렐슈드', difficulty: 'normal', minLevel: 1490 },
      { id: 'brel_hard', name: '아브렐슈드', difficulty: 'hard', minLevel: 1540 }
    ],
    type: 'legion_raid',
    resetType: 'weekly'
  },
  AKKAN: {
    id: 'akkan',
    name: '일리아칸',
    difficulties: [
      { id: 'akkan_normal', name: '일리아칸', difficulty: 'normal', minLevel: 1580 },
      { id: 'akkan_hard', name: '일리아칸', difficulty: 'hard', minLevel: 1600 }
    ],
    type: 'legion_raid', 
    resetType: 'weekly'
  },
  KAMEN: {
    id: 'kamen',
    name: '카멘',
    difficulties: [
      { id: 'kamen_normal', name: '카멘', difficulty: 'normal', minLevel: 1610 },
      { id: 'kamen_hard', name: '카멘', difficulty: 'hard', minLevel: 1630 }
    ],
    type: 'legion_raid',
    resetType: 'weekly'
  }
};

// 에픽 레이드 컨텐츠 (별도 관리)
export const EPIC_RAID_CONTENT = {
  BEHEMOTH: {
    id: 'behemoth',
    name: '베히모스',
    difficulties: [
      { id: 'behemoth_normal', name: '베히모스', difficulty: 'normal', minLevel: 1640 }
    ],
    type: 'epic_raid',
    resetType: 'weekly'
  }
};

// 카제로스 레이드 컨텐츠 // 추가 예정
export const KAZEROTH_RAID_CONTENT = {
  EKIDNA: {
    id: 'ekidna',
    name: '서막: 에키드나',
    difficulties: [
      { id: 'ekidna_normal', name: '서막: 에키드나', difficulty: 'normal', minLevel: 1620 },
      { id: 'ekidna_hard', name: '서막: 에키드나', difficulty: 'hard', minLevel: 1640 }
    ],
    type: 'kazeroth_raid',
    resetType: 'weekly'
  },
  AEGIR: {
    id: 'aegir',
    name: '1막: 에기르',
    difficulties: [
      { id: 'aegir_normal', name: '1막: 에기르', difficulty: 'normal', minLevel: 1660 },
      { id: 'aegir_hard', name: '1막: 에기르', difficulty: 'hard', minLevel: 1680 }
    ],
    type: 'kazeroth_raid',
    resetType: 'weekly'
  },
  ABREL: {
    id: 'abrel',
    name: '2막: 아브렐슈드',
    difficulties: [
      { id: 'abrel_normal', name: '2막: 아브렐슈드', difficulty: 'normal', minLevel: 1670 },
      { id: 'abrel_hard', name: '2막: 아브렐슈드', difficulty: 'hard', minLevel: 1690 }
    ],
    type: 'kazeroth_raid',
    resetType: 'weekly'
  },
  MORDUM: {
    id: 'mordum',
    name: '3막: 모르둠',
    difficulties: [
      { id: 'mordum_normal', name: '3막: 모르둠', difficulty: 'normal', minLevel: 1680 },
      { id: 'mordum_hard', name: '3막: 모르둠', difficulty: 'hard', minLevel: 1700 }
    ],
    type: 'kazeroth_raid',
    resetType: 'weekly'
  },
  ARMOCHE: {
    id: 'armoche',
    name: '4막: 아르모체',
    difficulties: [
      { id: 'armoche_normal', name: '4막: 아르모체', difficulty: 'normal', minLevel: 1700 },
      { id: 'armoche_hard', name: '4막: 아르모체', difficulty: 'hard', minLevel: 1720 }
    ],
    type: 'kazeroth_raid',
    resetType: 'weekly'
  },
  KAZEROTH: {
    id: 'kazeroth',
    name: '종막: 카제로스',
    difficulties: [
      { id: 'kazeroth_normal', name: '종막: 카제로스', difficulty: 'normal', minLevel: 1710 },
      { id: 'kazeroth_hard', name: '종막: 카제로스', difficulty: 'hard', minLevel: 1730 }
    ],
    type: 'kazeroth_raid',
    resetType: 'weekly'
  }
};

// 전체 컨텐츠 목록 (표시 순서대로)
export const ALL_CONTENT = [
  ...Object.values(DAILY_CONTENT),
  ...Object.values(WEEKLY_CONTENT),
  ...Object.values(ABYSS_DUNGEON_CONTENT),
  ...Object.values(LEGION_RAID_CONTENT),
  ...Object.values(EPIC_RAID_CONTENT),
  ...Object.values(KAZEROTH_RAID_CONTENT)
];

// 리셋 시간 상수
export const RESET_TIMES = {
  DAILY_RESET_HOUR: 6, // 오전 6시 일일 리셋
  WEEKLY_RESET_DAY: 3, // 수요일 (0=일요일, 3=수요일)
  WEEKLY_RESET_HOUR: 6 // 오전 6시 주간 리셋
};

// 캐릭터 기본 데이터 구조
export const createDefaultCharacterSchedule = (characterInfo) => {
  const schedule = {};
  
  // 일일 컨텐츠 초기화 (체크박스)
  Object.values(DAILY_CONTENT).forEach(content => {
    schedule[content.id] = {
      completed: false,
      lastReset: new Date().toISOString()
    };
  });
  
  // 주간 컨텐츠 초기화 (maxCount에 따라 다름)
  Object.values(WEEKLY_CONTENT).forEach(content => {
    schedule[content.id] = {
      completed: content.maxCount > 1 ? 0 : false,
      lastReset: new Date().toISOString()
    };
  });
  
  // 어비스 던전 초기화 (캐릭터 레벨에 맞는 난이도만)
  Object.values(ABYSS_DUNGEON_CONTENT).forEach(raidData => {
    raidData.difficulties.forEach(difficulty => {
      // 모든 난이도를 초기화 (나중에 UI에서 레벨에 맞는 것만 표시)
      schedule[difficulty.id] = {
        completed: false,
        lastReset: new Date().toISOString()
      };
    });
  });
  
  // 군단장 레이드 초기화 (캐릭터 레벨에 맞는 난이도만)
  Object.values(LEGION_RAID_CONTENT).forEach(raidData => {
    raidData.difficulties.forEach(difficulty => {
      // 모든 난이도를 초기화 (나중에 UI에서 레벨에 맞는 것만 표시)
      schedule[difficulty.id] = {
        completed: false,
        lastReset: new Date().toISOString()
      };
    });
  });
  
  // 에픽 레이드 초기화 (캐릭터 레벨에 맞는 난이도만)
  Object.values(EPIC_RAID_CONTENT).forEach(raidData => {
    raidData.difficulties.forEach(difficulty => {
      // 모든 난이도를 초기화 (나중에 UI에서 레벨에 맞는 것만 표시)
      schedule[difficulty.id] = {
        completed: false,
        lastReset: new Date().toISOString()
      };
    });
  });
  
  // 카제로스 레이드 초기화 (캐릭터 레벨에 맞는 난이도만)
  Object.values(KAZEROTH_RAID_CONTENT).forEach(raidData => {
    raidData.difficulties.forEach(difficulty => {
      // 모든 난이도를 초기화 (나중에 UI에서 레벨에 맞는 것만 표시)
      schedule[difficulty.id] = {
        completed: false,
        lastReset: new Date().toISOString()
      };
    });
  });
  
  return {
    id: Date.now().toString(),
    name: characterInfo.name,
    className: characterInfo.className,
    serverName: characterInfo.serverName,
    itemLevel: characterInfo.itemLevel,
    classIcon: characterInfo.classIcon,
    schedule,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};