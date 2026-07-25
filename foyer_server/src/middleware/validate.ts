import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import ApiError from "../utils/apiError";

/**
 * Generic Zod validation middleware factory.
 * Validates request property (`body`, `params`, or `query`) against the provided Zod schema.
 * Forwards validation errors to the global error middleware.
 */
export const validate = (
  schema: ZodSchema,
  target: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req[target] = schema.parse(req[target]);
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

      next(ApiError.badRequest(`Invalid request ${target}.`));
    }
  };
};
