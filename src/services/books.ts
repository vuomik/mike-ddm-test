import axios from 'axios'
import type { ApiResponse, Book } from '@shared/types'
import { ApiError } from '@/exceptions'

export function booksService(): {
  fetch: (q: string, page: number) => Promise<ApiResponse<Book[]>>
  fetchOne: (id: string) => Promise<Book>
} {
  const fetch = async (
    q: string,
    page: number
  ): Promise<ApiResponse<Book[]>> => {
    try {
      const response = await axios.get<ApiResponse<Book[]>>(`/api/books`, {
        params: { q, page },
      })
      if (response.data.data == null) {
        throw new Error('No data')
      }
      return response.data
    } catch (e: unknown) {
      throw handleError(e)
    }
  }

  const fetchOne = async (id: string): Promise<Book> => {
    try {
      const response = await axios.get<ApiResponse<Book>>(`/api/books/${id}`)
      if (response.data.data == null) {
        throw new Error('No data')
      }
      return response.data.data
    } catch (e: unknown) {
      throw handleError(e)
    }
  }

  return {
    fetch,
    fetchOne,
  }
}

const handleError = (e: unknown): Error => {
  if (axios.isAxiosError(e)) {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
 -- Trusting isAxiosError as a type guard */
    return new ApiError(e.response?.data?.messages ?? [])
  } else if (e instanceof Error) {
    return new ApiError([{ text: e.message }])
  } else {
    return new Error('Unknown error', { cause: e })
  }
}
