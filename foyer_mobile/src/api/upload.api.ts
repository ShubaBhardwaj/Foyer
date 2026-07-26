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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return responseData;
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return responseData;
  },
};

