import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { isHttpError } from 'http-errors';

const isError = (error: unknown): error is Error => {
    return (error !== null && typeof error === 'object' && 'message' in error);
}

export const errorHandler: ErrorRequestHandler = ( // @todo can this be fixed?
  error: unknown,
  req: Request,
  res: Response,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  next: NextFunction
) => {
  if (isHttpError(error)) {
    const statusCode = error.statusCode || 500;
    const messages = [ error.message || 'An error occurred' ];
    if (statusCode >= 500) {
      console.error('An unexpected server-side error occurred:', error);
    }
    return res.status(statusCode).json({ messages });
  } else if (isError(error)) {
    return res.status(500).json({ messages: [error.message] });
  } else {
    return res.status(500).json({ messages: [error] });
  }  
};