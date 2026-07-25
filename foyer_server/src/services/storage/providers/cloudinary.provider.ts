import { IStorageProvider } from "./storage-provider.interface";
import {
  UploadFileInput,
  UploadResult,
  DeleteResult,
  StorageUploadOptions,
} from "../../../types/storage.types";
import { storageConfig } from "../../../config/storage.config";

/**
 * Cloudinary Storage Provider Stub.
 * Typed placeholder implementation ready for future Cloudinary integration.
 */
export class CloudinaryStorageProvider implements IStorageProvider {
  private cloudName?: string;

  constructor() {
    this.cloudName = storageConfig.cloudinary.cloudName;
  }

  async upload(
    file: UploadFileInput,
    _options?: StorageUploadOptions
  ): Promise<UploadResult> {
    const folder = file.folder || "general";
    const timestamp = Date.now();
    const publicId = `${folder}/cloudinary_${timestamp}_${file.originalName}`;

    // Placeholder upload logic
    const url = this.getPublicUrl(publicId);

    return {
      url,
      publicId,
      provider: "cloudinary",
      mimeType: file.mimeType,
      size: file.size,
    };
  }

  async delete(publicId: string): Promise<DeleteResult> {
    return {
      success: true,
      publicId,
      message: "Cloudinary stub delete completed.",
    };
  }

  getPublicUrl(publicId: string): string {
    const cloud = this.cloudName || "demo";
    return `https://res.cloudinary.com/${cloud}/image/upload/${publicId}`;
  }
}
