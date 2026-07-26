import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import { uploadApi } from "@/api/upload.api";
import { normalizeApiError, ApiError } from "@/api/network";

export interface UploadOptions {
  mediaTypes?: ImagePicker.MediaTypeOptions;
  allowsEditing?: boolean;
  quality?: number;
  allowsMultipleSelection?: boolean;
}

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<ApiError | null>(null);

  const uploadImages = useCallback(
    async (options?: UploadOptions): Promise<string[]> => {
      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          throw new Error("Permission to access media library was denied.");
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: options?.mediaTypes ?? ImagePicker.MediaTypeOptions.Images,
          allowsEditing: options?.allowsEditing ?? false,
          quality: options?.quality ?? 0.8,
          allowsMultipleSelection: options?.allowsMultipleSelection ?? false,
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
          setUploading(false);
          return [];
        }

        const uploadedUrls: string[] = [];
        const totalFiles = result.assets.length;

        for (let i = 0; i < totalFiles; i++) {
          const asset = result.assets[i];
          const fileName = asset.fileName || `upload_${Date.now()}_${i}.jpg`;
          const mimeType = asset.mimeType || "image/jpeg";

          const response = await uploadApi.uploadImage(asset.uri, fileName, mimeType, (fileProgress: number) => {
            const currentTotalProgress = Math.round((i * 100 + fileProgress) / totalFiles);
            setProgress(currentTotalProgress);
          });

          if (response.fileUrl) {
            uploadedUrls.push(response.fileUrl);
          }
        }

        setProgress(100);
        return uploadedUrls;
      } catch (err) {
        const apiErr = normalizeApiError(err);
        setError(apiErr);
        throw apiErr;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const takePhoto = useCallback(
    async (options?: UploadOptions): Promise<string | null> => {
      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          throw new Error("Permission to access camera was denied.");
        }

        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: options?.allowsEditing ?? true,
          quality: options?.quality ?? 0.8,
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
          setUploading(false);
          return null;
        }

        const asset = result.assets[0];
        const fileName = asset.fileName || `photo_${Date.now()}.jpg`;
        const mimeType = asset.mimeType || "image/jpeg";

        const response = await uploadApi.uploadImage(asset.uri, fileName, mimeType, (percent: number) => {
          setProgress(percent);
        });

        setProgress(100);
        return response.fileUrl || null;
      } catch (err) {
        const apiErr = normalizeApiError(err);
        setError(apiErr);
        throw apiErr;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  return {
    uploadImages,
    takePhoto,
    uploading,
    progress,
    error,
  };
}
