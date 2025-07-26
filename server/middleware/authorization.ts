import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

export const authorize = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // everyone is allowed  
  next();
});