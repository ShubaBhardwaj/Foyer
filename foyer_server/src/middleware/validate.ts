import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Generic Zod validation middleware factory.
 * Validates `req.body` against the provided Zod schema.
 * Returns 400 with structured error details if validation fails.
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

        res.status(400).json({
          success: false,
          message: "Validation failed.",
          data: errors,
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: "Invalid request body.",
        data: null,
      });
    }
  };
};
