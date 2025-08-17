import { useState, useMemo } from 'react';

// 페이지네이션 로직을 관리하는 커스텀 훅
const usePagination = ({
  totalCount = 0,
  pageSize = 10,
  initialPage = 1,
  siblingCount = 1 // 현재 페이지 주변에 보여줄 페이지 수
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // 현재 페이지의 아이템 범위 계산
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // 페이지네이션에 표시할 페이지 번호들 계산
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5; // 첫페이지, 이전, 현재, 다음, 마지막 + 형제 페이지들

    // 총 페이지가 표시할 페이지 수보다 적으면 모든 페이지 표시
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // 오른쪽 dots만 보이는 경우
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    // 왼쪽 dots만 보이는 경우  
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, '...', ...rightRange];
    }

    // 양쪽 모두 dots가 보이는 경우
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }

    return [];
  }, [currentPage, siblingCount, totalPages]);

  // 페이지 변경 함수
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  // 다음 페이지로
  const goToNext = () => {
    goToPage(currentPage + 1);
  };

  // 이전 페이지로
  const goToPrevious = () => {
    goToPage(currentPage - 1);
  };

  // 첫 페이지로
  const goToFirst = () => {
    goToPage(1);
  };

  // 마지막 페이지로
  const goToLast = () => {
    goToPage(totalPages);
  };

  // 페이지네이션 리셋 (보통 검색 조건 변경 시 사용)
  const reset = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    startItem,
    endItem,
    paginationRange,
    goToPage,
    goToNext,
    goToPrevious, 
    goToFirst,
    goToLast,
    reset,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    isFirst: currentPage === 1,
    isLast: currentPage === totalPages
  };
};

export default usePagination;