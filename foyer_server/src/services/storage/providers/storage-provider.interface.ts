import {
  UploadFileInput,
  UploadResult,
  DeleteResult,
  StorageUploadOptions,
} from "../../../types/storage.types";

/**
 * Storage Provider Contract Interface.
 * Every storage provider (Local, Cloudinary, S3) must implement this contract.
 */
export interface IStorageProvider {
  /**
   * Upload a file buffer to storage.
   */
  upload(
    file: UploadFileInput,
    options?: StorageUploadOptions
  ): Promise<UploadResult>;

  /**
   * Delete an uploaded file by its public ID.
   */
  delete(publicId: string): Promise<DeleteResult>;

  /**
   * Get the publicly accessible HTTP URL for a given public ID.
   */
  getPublicUrl(publicId: string): Promise<string> | string;
}
