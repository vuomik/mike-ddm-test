import { Pagination } from '../types';

export function calculatePagination(
  resultsStart: number,
  resultsEnd: number,
  totalResults: number
): Pagination {
  const perPage = resultsEnd - resultsStart + 1;
  const totalPages = perPage > 0 ? Math.ceil(totalResults / perPage) : 0;
  const currentPage = perPage > 0 ? Math.ceil(resultsStart / perPage) : 1;

  return {
    perPage,
    currentPage,
    totalPages,
  };
}