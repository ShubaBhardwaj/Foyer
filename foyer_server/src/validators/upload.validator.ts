import { z } from "zod";

/**
 * File Size Limits in Bytes.
 */
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Allowed MIME Types.
 */
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

/**
 * Allowed Upload Folders.
 */
export const ALLOWED_UPLOAD_FOLDERS = [
  "visitors",
  "complaints",
  "notices",
  "community",
  "users",
  "general",
] as const;

/**
 * Upload Folder Validation Schema.
 */
export const uploadFolderSchema = z.enum(ALLOWED_UPLOAD_FOLDERS, {
  errorMap: () => ({ message: "Invalid upload folder specified." }),
});

/**
 * Generic Upload Options Schema.
 */
export const uploadOptionsSchema = z.object({
  folder: uploadFolderSchema.default("general"),
  filename: z
    .string()
    .max(100, "Filename cannot exceed 100 characters.")
    .trim()
    .optional(),
  overwrite: z.boolean().optional().default(false),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Image Upload Validation Schema (5 MB max, JPEG/PNG/WebP).
 */
export const imageUploadSchema = z.object({
  originalName: z
    .string({ required_error: "Original filename is required." })
    .min(1, "Original filename is required.")
    .trim(),

  mimeType: z.enum(ALLOWED_IMAGE_MIME_TYPES, {
    errorMap: () => ({
      message: "Invalid image format. Allowed formats: JPEG, PNG, WebP.",
    }),
  }),

  size: z
    .number({ required_error: "File size is required." })
    .min(1, "File size must be greater than 0 bytes.")
    .max(
      MAX_IMAGE_SIZE_BYTES,
      "Image size exceeds the maximum limit of 5 MB."
    ),

  folder: uploadFolderSchema.optional(),
  filename: z.string().max(100, "Filename cannot exceed 100 characters.").optional(),
  overwrite: z.boolean().optional(),
});

/**
 * Document Upload Validation Schema (10 MB max, PDF/DOC/DOCX).
 */
export const documentUploadSchema = z.object({
  originalName: z
    .string({ required_error: "Original filename is required." })
    .min(1, "Original filename is required.")
    .trim(),

  mimeType: z.enum(ALLOWED_DOCUMENT_MIME_TYPES, {
    errorMap: () => ({
      message: "Invalid document format. Allowed formats: PDF, DOC, DOCX.",
    }),
  }),

  size: z
    .number({ required_error: "File size is required." })
    .min(1, "File size must be greater than 0 bytes.")
    .max(
      MAX_DOCUMENT_SIZE_BYTES,
      "Document size exceeds the maximum limit of 10 MB."
    ),

  folder: uploadFolderSchema.optional(),
  filename: z.string().max(100, "Filename cannot exceed 100 characters.").optional(),
  overwrite: z.boolean().optional(),
});

// TypeScript Inferred Types
export type UploadFolderInput = z.infer<typeof uploadFolderSchema>;
export type UploadOptionsInput = z.infer<typeof uploadOptionsSchema>;
export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
