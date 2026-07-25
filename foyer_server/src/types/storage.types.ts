export type StorageProviderName = "local" | "cloudinary" | "s3";

export type StorageFolder =
  | "visitors"
  | "complaints"
  | "notices"
  | "community"
  | "users"
  | "general";

export interface UploadFileInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
  folder?: StorageFolder | string;
  filename?: string;
}

export interface UploadResult {
  url: string;
  publicId: string;
  provider: StorageProviderName;
  mimeType: string;
  size: number;
}

export interface DeleteResult {
  success: boolean;
  publicId: string;
  message?: string;
}

export interface StorageUploadOptions {
  overwrite?: boolean;
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
  metadata?: Record<string, unknown>;
}
