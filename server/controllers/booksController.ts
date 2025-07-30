import type { Request, Response } from 'express'
import { Repository as GoodReadsRepository } from '@server/lib/goodreads/repository'
import type { ApiResponse, Book } from '@shared/types'
import { container } from 'tsyringe'
import asyncHandler from 'express-async-handler'
import createError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { INITIAL_PAGE } from '@server/utils/pages'

const searchQuerySchema = z.object({
  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Denotes a non-empty string */
  q: z.string().min(1),
  page: z.coerce
    .number()
    .int()
    .min(INITIAL_PAGE)
    .optional()
    .default(INITIAL_PAGE),
})

const repository = container.resolve(GoodReadsRepository)

export const searchBooks = asyncHandler(
  async (req: Request, res: Response<ApiResponse<Book[]>>) => {
    try {
      const { q: query, page } = searchQuerySchema.parse(req.query)
      const { pagination, result } = await repository.search(query, page)
      const response = {
        pagination,
        data: result,
      }
      res.status(StatusCodes.OK).json(response)
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        throw createError.BadRequest(
          'Please check your parameters: "page" must be a positive whole number, and "query" cannot be empty.'
        )
      }
      throw e
    }
  }
)
