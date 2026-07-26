import apiClient from "./axios";
import { UploadFileResponseDto } from "@/types/api/upload";

export const uploadApi = {
  async uploadImage(
    fileUri: string,
    fileName: string,
    mimeType: string,
    onProgress?: (progressPercent: number) => void
  ): Promise<UploadFileResponseDto> {
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: fileName,
      type: mimeType,
    } as unknown as Blob);

    const res = await apiClient.post<UploadFileResponseDto>("/uploads/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return res.data;
  },

  async uploadDocument(
    fileUri: string,
    fileName: string,
    mimeType: string,
    onProgress?: (progressPercent: number) => void
  ): Promise<UploadFileResponseDto> {
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: fileName,
      type: mimeType,
    } as unknown as Blob);

    const res = await apiClient.post<UploadFileResponseDto>("/uploads/document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return res.data;
  },
};
