import { Response } from "express";

/**
 * Standardized API response helpers.
 * Every endpoint should use these for consistent response shape.
 */
export const sendSuccess = (
  res: Response,
  data: unknown = null,
  message: string = "Success",
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string = "Internal server error",
  statusCode: number = 500
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};
