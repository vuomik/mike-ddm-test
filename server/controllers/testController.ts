import { NextFunction, Request, Response } from 'express';

export const testEndpoint = async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({hello: 'world'});
  } catch (e) {
    next(e);
  }
};