import { ref } from 'vue'
import type { Ref } from 'vue'
import { booksService } from '@/services/books'
import type { Pagination, Book } from '@shared/types'
import {
  INITIAL_PAGE,
  PER_PAGE,
  INITIAL_TOTAL_PAGES,
} from '@server/utils/pages'

export function useBooks(): {
  isLoading: Ref<boolean>
  books: Ref<Book[]>
  loadBooks: (q: string, page: number) => Promise<void>
  pagination: Ref<Pagination>
} {
  const books = ref<Book[]>([])
  const pagination = ref<Pagination>({
    perPage: PER_PAGE,
    currentPage: INITIAL_PAGE,
    totalPages: INITIAL_TOTAL_PAGES,
  })

  const { fetch } = booksService()

  const isLoading = ref(false)

  const loadBooks = async (q: string, page: number): Promise<void> => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Don't search if there's no query */
    if (isLoading.value || q.length < 1) {
      return
    }

    isLoading.value = true
    try {
      const { data: d, pagination: p } = await fetch(q, page)
      books.value = d ?? []
      pagination.value = p ?? {
        perPage: PER_PAGE,
        currentPage: INITIAL_PAGE,
        totalPages: INITIAL_TOTAL_PAGES,
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    books,
    loadBooks,
    pagination,
  }
}
