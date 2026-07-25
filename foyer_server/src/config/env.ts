import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  MONGO_DB_URI: z.string().min(1, "MONGO_DB_URI is required"),
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  CLERK_PUBLISHABLE_KEY: z.string().min(1, "CLERK_PUBLISHABLE_KEY is required"),
  CLERK_JWT_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  STORAGE_PROVIDER: z.enum(["local", "cloudinary", "s3"]).default("local"),
  APP_BASE_URL: z.string().optional(),
  LOCAL_STORAGE_DIR: z.string().default("uploads"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_S3_REGION: z.string().optional(),
  AWS_S3_ACCESS_KEY_ID: z.string().optional(),
  AWS_S3_SECRET_ACCESS_KEY: z.string().optional(),
});

/**
 * Validated Environment Variables.
 * Throws a ZodError automatically if environment variables fail validation.
 */
export const env = envSchema.parse(process.env);
