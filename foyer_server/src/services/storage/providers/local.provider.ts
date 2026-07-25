import fs from "fs/promises";
import path from "path";
import { IStorageProvider } from "./storage-provider.interface";
import {
  UploadFileInput,
  UploadResult,
  DeleteResult,
  StorageUploadOptions,
} from "../../../types/storage.types";
import { storageConfig } from "../../../config/storage.config";

/**
 * Local Storage Provider.
 * Stores file buffers on the local filesystem during development/testing.
 */
export class LocalStorageProvider implements IStorageProvider {
  private baseDir: string;
  private baseUrl: string;

  constructor() {
    this.baseDir = storageConfig.localStorageDir;
    this.baseUrl = storageConfig.baseUrl;
  }

  async upload(
    file: UploadFileInput,
    _options?: StorageUploadOptions
  ): Promise<UploadResult> {
    const folder = file.folder || "general";
    const folderPath = path.join(this.baseDir, folder);

    // Ensure target folder exists
    await fs.mkdir(folderPath, { recursive: true });

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitizedOriginal = file.originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = file.filename || `${timestamp}-${randomSuffix}-${sanitizedOriginal}`;

    const filePath = path.join(folderPath, filename);
    await fs.writeFile(filePath, file.buffer);

    const publicId = `${folder}/${filename}`;
    const url = this.getPublicUrl(publicId);

    return {
      url,
      publicId,
      provider: "local",
      mimeType: file.mimeType,
      size: file.size,
    };
  }

  async delete(publicId: string): Promise<DeleteResult> {
    try {
      const filePath = path.join(this.baseDir, publicId);
      await fs.unlink(filePath);
      return {
        success: true,
        publicId,
        message: "File deleted successfully from local storage.",
      };
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        publicId,
        message: `Failed to delete local file: ${errMessage}`,
      };
    }
  }

  getPublicUrl(publicId: string): string {
    const cleanPublicId = publicId.startsWith("/") ? publicId.slice(1) : publicId;
    return `${this.baseUrl}/uploads/${cleanPublicId}`;
  }
}
