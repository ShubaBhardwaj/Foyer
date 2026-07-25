import { IStorageProvider } from "./providers/storage-provider.interface";
import { LocalStorageProvider } from "./providers/local.provider";
import { CloudinaryStorageProvider } from "./providers/cloudinary.provider";
import { S3StorageProvider } from "./providers/s3.provider";
import { storageConfig } from "../../config/storage.config";
import { StorageProviderName } from "../../types/storage.types";

/**
 * StorageFactory.
 * Factory returning the active storage provider implementation.
 * Hides provider instantiation and selection details from business modules.
 */
export class StorageFactory {
  private static providers: Map<StorageProviderName, IStorageProvider> = new Map();

  /**
   * Get an instance of the configured or requested storage provider.
   */
  public static getProvider(providerName?: StorageProviderName): IStorageProvider {
    const targetProvider = providerName || storageConfig.activeProvider;

    if (!this.providers.has(targetProvider)) {
      switch (targetProvider) {
        case "cloudinary":
          this.providers.set("cloudinary", new CloudinaryStorageProvider());
          break;
        case "s3":
          this.providers.set("s3", new S3StorageProvider());
          break;
        case "local":
        default:
          this.providers.set("local", new LocalStorageProvider());
          break;
      }
    }

    return this.providers.get(targetProvider)!;
  }
}

export default StorageFactory;
