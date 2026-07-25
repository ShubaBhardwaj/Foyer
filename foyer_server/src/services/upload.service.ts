import StorageFactory from "./storage/storage.factory";
import { IStorageProvider } from "./storage/providers/storage-provider.interface";
import {
  UploadFileInput,
  UploadResult,
  DeleteResult,
  StorageUploadOptions,
} from "../types/storage.types";
import ApiError from "../utils/apiError";

/**
 * UploadService — Centralized domain service orchestrating file storage operations.
 * Operates purely through StorageFactory and IStorageProvider abstraction.
 */
class UploadService {
  /**
   * Resolve active storage provider instance from StorageFactory.
   */
  private getProvider(): IStorageProvider {
    return StorageFactory.getProvider();
  }

  /**
   * Upload a file buffer to storage using the active provider.
   */
  async upload(
    file: UploadFileInput,
    options?: StorageUploadOptions
  ): Promise<UploadResult> {
    try {
      const provider = this.getProvider();
      return await provider.upload(file, options);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "File upload failed";
      throw ApiError.internal(`Upload failed: ${message}`);
    }
  }

  /**
   * Delete an uploaded file by its public ID using the active provider.
   */
  async delete(publicId: string): Promise<DeleteResult> {
    if (!publicId) {
      throw ApiError.badRequest("Public ID is required for file deletion.");
    }

    try {
      const provider = this.getProvider();
      return await provider.delete(publicId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "File deletion failed";
      throw ApiError.internal(`Deletion failed: ${message}`);
    }
  }

  /**
   * Replace an existing file with a new file upload.
   * Uploads the new file first and safely attempts deletion of the old file.
   */
  async replace(
    oldPublicId: string | null | undefined,
    newFile: UploadFileInput,
    options?: StorageUploadOptions
  ): Promise<UploadResult> {
    const uploadResult = await this.upload(newFile, options);

    if (oldPublicId) {
      try {
        await this.delete(oldPublicId);
      } catch (error) {
        console.warn(
          `[UploadService.replace] Warning: Failed to clean up old file (${oldPublicId})`,
          error
        );
      }
    }

    return uploadResult;
  }

  /**
   * Get the publicly accessible HTTP URL for a given public ID.
   */
  getPublicUrl(publicId: string): Promise<string> | string {
    if (!publicId) {
      throw ApiError.badRequest("Public ID is required to resolve public URL.");
    }

    const provider = this.getProvider();
    return provider.getPublicUrl(publicId);
  }
}

export default new UploadService();
