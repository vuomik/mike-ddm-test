import type { ApiResponse } from '@shared/types'
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express'
import { isHttpError } from 'http-errors'
import { StatusCodes } from 'http-status-codes'

const isClientError = (statusCode: unknown): statusCode is number =>
  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Verify that this falls in the range of client-side HTTP status codes */
  typeof statusCode === 'number' && statusCode >= 400 && statusCode < 500

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  req: Request,
  res: Response<ApiResponse<undefined>>,

  next: NextFunction
) => {
  if (isHttpError(error) && isClientError(error.statusCode)) {
    return res
      .status(error.statusCode)
      .json({ messages: [{ text: error.message }] })
  } else {
    const statusCode = isHttpError(error)
      ? error.statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR
    /* eslint-disable-next-line no-console -- Always log server errors for review */
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
