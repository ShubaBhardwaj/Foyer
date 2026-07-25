import { IStorageProvider } from "./storage-provider.interface";
import {
  UploadFileInput,
  UploadResult,
  DeleteResult,
  StorageUploadOptions,
} from "../../../types/storage.types";
import { storageConfig } from "../../../config/storage.config";

/**
 * AWS S3 Storage Provider Stub.
 * Typed placeholder implementation ready for future AWS S3 integration.
 */
export class S3StorageProvider implements IStorageProvider {
  private bucket?: string;
  private region?: string;

  constructor() {
    this.bucket = storageConfig.s3.bucket;
    this.region = storageConfig.s3.region;
  }

  async upload(
    file: UploadFileInput,
    _options?: StorageUploadOptions
  ): Promise<UploadResult> {
    const folder = file.folder || "general";
    const timestamp = Date.now();
    const publicId = `${folder}/s3_${timestamp}_${file.originalName}`;

    // Placeholder upload logic
    const url = this.getPublicUrl(publicId);

    return {
      url,
      publicId,
      provider: "s3",
      mimeType: file.mimeType,
      size: file.size,
    };
  }

  async delete(publicId: string): Promise<DeleteResult> {
    return {
      success: true,
      publicId,
      message: "AWS S3 stub delete completed.",
    };
  }

  getPublicUrl(publicId: string): string {
    const bucketName = this.bucket || "foyer-bucket";
    const awsRegion = this.region || "us-east-1";
    return `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${publicId}`;
  }
}
