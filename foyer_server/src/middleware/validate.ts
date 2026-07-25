import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import ApiError from "../utils/apiError";

/**
 * Generic Zod validation middleware factory.
 * Validates `req.body` against the provided Zod schema.
 * Forwards validation errors to the global error middleware.
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));

        next(ApiError.validation("Validation failed.", errors));
        return;
      }

      next(ApiError.badRequest("Invalid request body."));
    }
  };
};
