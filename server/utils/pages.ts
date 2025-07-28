import { Pagination } from '@shared/types';

export function calculatePagination(
  resultsStart: number,
  resultsEnd: number,
  totalResults: number,
  perPage: number = 10,
): Pagination {
  const totalPages = perPage > 0 ? Math.ceil(totalResults / perPage) : 0;
  const currentPage = perPage > 0 ? Math.ceil(resultsStart / perPage) : 1;

  return {
    perPage,
    currentPage,
    totalPages,
  };
}