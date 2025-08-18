/**
 * 스켈레톤 로딩 컴포넌트
 * 데이터 로딩 중에 표시할 스켈레톤 UI 제공
 */

// 기본 스켈레톤 박스
export const SkeletonBox = ({ className = "", animate = true }) => (
  <div 
    className={`bg-gray-200 dark:bg-gray-700 rounded ${animate ? 'animate-pulse' : ''} ${className}`}
  />
);

// 텍스트 스켈레톤 (한 줄)
export const SkeletonText = ({ width = "w-full", className = "" }) => (
  <SkeletonBox className={`h-4 ${width} ${className}`} />
);

// 제목 스켈레톤
export const SkeletonTitle = ({ className = "" }) => (
  <SkeletonBox className={`h-6 w-3/4 ${className}`} />
);

// 아바타/아이콘 스켈레톤
export const SkeletonAvatar = ({ size = "w-10 h-10", className = "" }) => (
  <SkeletonBox className={`${size} rounded-full ${className}`} />
);

// 카드 스켈레톤
export const SkeletonCard = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse border border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

// 캐릭터 프로필 스켈레톤
export const CharacterProfileSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="relative h-60">
      {/* 배경 이미지 스켈레톤 */}
      <SkeletonBox className="absolute inset-0 rounded-none" />
      
      <div className="absolute inset-0 p-6 flex">
        {/* 캐릭터 아바타 스켈레톤 */}
        <div className="flex-shrink-0">
          <SkeletonBox className="w-45 h-60 rounded-lg" />
        </div>
        
        {/* 캐릭터 정보 스켈레톤 */}
        <div className="flex-1 ml-6 flex flex-col justify-between">
          <div className="space-y-3">
            {/* 서버/직업 정보 */}
            <div className="flex gap-3">
              <SkeletonBox className="h-8 w-20" />
              <SkeletonBox className="h-8 w-24" />
            </div>
            
            {/* 스탯 정보 */}
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <SkeletonText width="w-20" />
                  <SkeletonText width="w-16" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            {/* 캐릭터명 */}
            <div>
              <SkeletonBox className="h-6 w-32 mb-2" />
              <SkeletonBox className="h-8 w-40" />
            </div>
            
            {/* 버튼들 */}
            <div className="flex gap-2">
              <SkeletonBox className="h-8 w-8" />
              <SkeletonBox className="h-8 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 장비 스켈레톤
export const EquipmentSkeleton = () => (
  <div className="grid grid-cols-2 gap-4">
    {[...Array(12)].map((_, i) => (
      <SkeletonCard key={i} className="p-3">
        <div className="flex items-center gap-3">
          <SkeletonBox className="w-12 h-12 rounded border" />
          <div className="flex-1 space-y-2">
            <SkeletonText width="w-3/4" />
            <SkeletonText width="w-1/2" className="h-3" />
          </div>
        </div>
      </SkeletonCard>
    ))}
  </div>
);

// 보석 스켈레톤
export const GemsSkeleton = ({ expanded = false }) => (
  <div className={expanded ? "space-y-3" : "grid grid-cols-6 gap-2"}>
    {[...Array(expanded ? 11 : 11)].map((_, i) => (
      expanded ? (
        <SkeletonCard key={i} className="p-3">
          <div className="flex items-center gap-3">
            <SkeletonBox className="w-10 h-10 rounded" />
            <div className="flex-1">
              <SkeletonText width="w-3/4 mb-1" />
              <SkeletonText width="w-1/2 h-3" />
            </div>
          </div>
        </SkeletonCard>
      ) : (
        <SkeletonBox key={i} className="w-12 h-12 rounded" />
      )
    ))}
  </div>
);

// 각인 스켈레톤
export const EngravingsSkeleton = () => (
  <div className="space-y-3">
    {[...Array(6)].map((_, i) => (
      <SkeletonCard key={i} className="p-3">
        <div className="flex items-center justify-between">
          <SkeletonText width="w-1/2" />
          <SkeletonBox className="h-6 w-8 rounded" />
        </div>
      </SkeletonCard>
    ))}
  </div>
);

// 스킬 스켈레톤
export const SkillsSkeleton = () => (
  <div className="grid grid-cols-2 gap-4">
    {[...Array(8)].map((_, i) => (
      <SkeletonCard key={i} className="p-3">
        <div className="flex items-start gap-3">
          <SkeletonBox className="w-12 h-12 rounded" />
          <div className="flex-1 space-y-2">
            <SkeletonText width="w-3/4" />
            <SkeletonText width="w-1/2 h-3" />
            <div className="space-y-1">
              {[...Array(3)].map((_, j) => (
                <SkeletonText key={j} width="w-full h-3" />
              ))}
            </div>
          </div>
        </div>
      </SkeletonCard>
    ))}
  </div>
);

// 수집품 스켈레톤
export const CollectiblesSkeleton = () => (
  <div className="grid grid-cols-2 gap-4">
    {[...Array(7)].map((_, i) => (
      <SkeletonCard key={i} className="p-4 relative">
        <div className="flex items-center justify-between">
          <div>
            <SkeletonText width="w-24 mb-2" />
            <SkeletonBox className="h-8 w-16 rounded" />
          </div>
          <div className="text-right">
            <SkeletonText width="w-16 mb-1 h-3" />
          </div>
        </div>
      </SkeletonCard>
    ))}
  </div>
);

// 원정대 스켈레톤

// 시장 아이템 목록 스켈레톤
export const MarketItemsSkeleton = () => (
  <div className="space-y-3">
    {[...Array(10)].map((_, i) => (
      <SkeletonCard key={i} className="p-4">
        <div className="flex items-center gap-4">
          <SkeletonBox className="w-12 h-12 rounded border" />
          <div className="flex-1 space-y-2">
            <SkeletonText width="w-2/3" />
            <div className="flex gap-4">
              <SkeletonText width="w-20 h-3" />
              <SkeletonText width="w-16 h-3" />
              <SkeletonText width="w-24 h-3" />
            </div>
          </div>
          <div className="text-right space-y-1">
            <SkeletonText width="w-20" />
            <SkeletonText width="w-16 h-3" />
          </div>
        </div>
      </SkeletonCard>
    ))}
  </div>
);

export default {
  SkeletonBox,
  SkeletonText,
  SkeletonTitle,
  SkeletonAvatar,
  SkeletonCard,
  CharacterProfileSkeleton,
  EquipmentSkeleton,
  GemsSkeleton,
  EngravingsSkeleton,
  SkillsSkeleton,
  CollectiblesSkeleton,
  MarketItemsSkeleton
};