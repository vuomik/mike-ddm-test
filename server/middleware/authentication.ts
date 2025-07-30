import type { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'

export const authenticate = asyncHandler(
  /* eslint-disable-next-line @typescript-eslint/require-await -- next does not require a promise */
  async (req: Request, res: Response, next: NextFunction) => {
    // everyone is allowed
    next()
  }
)
