import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import ApiError from "../utils/apiError";
import { env } from "../config/env";

/**
 * Global Express Error Handling Middleware.
 */
export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors: any[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = 422;
    message = "Validation failed.";
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  } else if (err && typeof err === "object" && "statusCode" in err && "message" in err) {
    // Handling legacy error objects if any
    statusCode = Number(err.statusCode) || 500;
    message = String(err.message) || "An error occurred";
    errors = Array.isArray(err.errors) ? err.errors : [];
  } else if (err instanceof Error) {
    message = err.message;
  }

  const responsePayload: Record<string, any> = {
    success: false,
    message,
    errors,
  };

  if (env.NODE_ENV === "development" && err instanceof Error && err.stack) {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};

export default errorMiddleware;
