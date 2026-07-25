import path from "path";
import { env } from "./env";
import { StorageProviderName } from "../types/storage.types";

export interface StorageConfig {
  activeProvider: StorageProviderName;
  localStorageDir: string;
  baseUrl: string;
  cloudinary: {
    cloudName?: string;
    apiKey?: string;
    apiSecret?: string;
  };
  s3: {
    bucket?: string;
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  };
}

const computedBaseUrl =
  env.APP_BASE_URL || `http://localhost:${env.PORT}`;

export const storageConfig: StorageConfig = {
  activeProvider: (env.STORAGE_PROVIDER as StorageProviderName) || "local",
  localStorageDir: path.resolve(process.cwd(), env.LOCAL_STORAGE_DIR || "uploads"),
  baseUrl: computedBaseUrl,
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },
  s3: {
    bucket: env.AWS_S3_BUCKET,
    region: env.AWS_S3_REGION,
    accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
  },
};
