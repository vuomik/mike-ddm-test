import { ref } from 'vue'
import type { Ref } from 'vue'
import { booksService } from '@/services/books'
import type { Message, Pagination, Book } from '@shared/types'
import { ApiError } from '@/exceptions'
import {
  INITIAL_PAGE,
  PER_PAGE,
  INITIAL_TOTAL_PAGES,
} from '@server/utils/pages'

export function useBooks(): {
  isLoading: Ref<boolean>
  books: Ref<Book[]>
  book: Ref<Book | undefined>
  loadBooks: (q: string, page: number) => Promise<void>
  loadBook: (id: string) => Promise<void>
  pagination: Ref<Pagination>
  getErrorMessages: (e: unknown) => Message[]
} {
  const books = ref<Book[]>([])
  const book = ref<Book>()
  const pagination = ref<Pagination>({
    perPage: PER_PAGE,
    currentPage: INITIAL_PAGE,
    totalPages: INITIAL_TOTAL_PAGES,
  })

  const { fetch, fetchOne } = booksService()

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

  const loadBook = async (id: string): Promise<void> => {
    if (isLoading.value) {
      return
    }
    isLoading.value = true
    try {
      book.value = await fetchOne(id)
    } finally {
      isLoading.value = false
    }
  }

  const getErrorMessages = (e: unknown): Message[] => {
    if (e instanceof ApiError) {
      return e.messages
    } else if (e instanceof Error) {
      return [{ text: e.message }]
    } else {
      return [{ text: 'Unknown error' }]
    }
  }

  return {
    isLoading,
    books,
    book,
    loadBooks,
    loadBook,
    pagination,
    getErrorMessages,
  }
}
