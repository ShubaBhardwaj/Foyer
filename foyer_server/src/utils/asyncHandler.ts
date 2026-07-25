import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Higher-order function to handle async route handlers and pass unhandled errors to next().
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
