export interface UploadFileResponseDto {
  success: boolean;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}
