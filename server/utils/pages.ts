import { Pagination } from '../types';

export function calculatePagination(
  resultsStart: number,
  resultsEnd: number,
  totalResults: number,
  perPage: number = 10,
): Pagination {
  // @todo perpage is wrong
  //const perPage = resultsEnd - resultsStart + 1;
  const totalPages = perPage > 0 ? Math.ceil(totalResults / perPage) : 0;
  const currentPage = perPage > 0 ? Math.ceil(resultsStart / perPage) : 1;

  return {
    perPage,
    currentPage,
    totalPages,
  };
}