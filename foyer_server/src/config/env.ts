import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  MONGO_DB_URI: z.string().min(1, "MONGO_DB_URI is required"),
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  CLERK_PUBLISHABLE_KEY: z.string().min(1, "CLERK_PUBLISHABLE_KEY is required"),
  CLERK_JWT_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

/**
 * Validated Environment Variables.
 * Throws a ZodError automatically if environment variables fail validation.
 */
export const env = envSchema.parse(process.env);
