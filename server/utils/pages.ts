import type { Pagination } from '@shared/types'

export const INITIAL_PAGE = 1
export const INITIAL_TOTAL_PAGES = 0
export const PER_PAGE = 10
export const MIN_PER_PAGE = 1

export function calculatePagination(
  resultsStart: number,
  totalResults: number,
  perPage = PER_PAGE
): Pagination {
  const totalPages =
    perPage >= MIN_PER_PAGE
      ? Math.ceil(totalResults / perPage)
      : INITIAL_TOTAL_PAGES
  const currentPage =
    perPage >= MIN_PER_PAGE ? Math.ceil(resultsStart / perPage) : INITIAL_PAGE

  return {
    perPage,
    currentPage,
    totalPages,
  }
}
