import type { ApiResponse } from '@shared/types'
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express'
import { isHttpError } from 'http-errors'

const isError = (error: unknown): error is Error =>
  error !== null && typeof error === 'object' && 'message' in error

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  req: Request,
  res: Response<ApiResponse<undefined>>,

  next: NextFunction
) => {
  if (isHttpError(error) && error.statusCode < 500) {
    return res
      .status(error.statusCode)
      .json({ messages: [{ text: error.message }] })
  } else {
    const statusCode = isHttpError(error) ? error.statusCode : 500
    console.error('An unexpected server-side error occurred:', error)
    return res.status(statusCode).json({
      messages: [
        {
          text: "An unexpected error occurred.  We logged it on our end and we'll figure it out in no time!",
        },
      ],
    })
  }
}
