import { Request, Response } from "express";
import uploadService from "../services/upload.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import { UploadFileInput, StorageUploadOptions } from "../types/storage.types";

/**
 * Helper to extract UploadFileInput from Express Request (Multer or body payload).
 */
const extractFileInput = (req: Request): UploadFileInput => {
  const file = (req as any).file;

  if (file) {
    return {
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      folder: req.body?.folder,
      filename: req.body?.filename,
    };
  }

  if (req.body && req.body.buffer) {
    return {
      buffer: Buffer.isBuffer(req.body.buffer)
        ? req.body.buffer
        : Buffer.from(req.body.buffer),
      originalName: req.body.originalName || "file",
      mimeType: req.body.mimeType || "application/octet-stream",
      size: req.body.size || 0,
      folder: req.body.folder,
      filename: req.body.filename,
    };
  }

  throw ApiError.badRequest("No file provided for upload.");
};

/**
 * UploadController — Handles HTTP requests for storage operations.
 * Thin controller layer; all storage execution is delegated to UploadService.
 */
class UploadController {
  /**
   * POST /upload/image
   * Upload an image file.
   */
  uploadImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const fileInput = extractFileInput(req);
    const options: StorageUploadOptions = {
      overwrite: req.body?.overwrite === "true" || req.body?.overwrite === true,
    };

    const result = await uploadService.upload(fileInput, options);

    ApiResponse.created(res, "Image uploaded successfully.", result);
  });

  /**
   * POST /upload/document
   * Upload a document file.
   */
  uploadDocument = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const fileInput = extractFileInput(req);
    const options: StorageUploadOptions = {
      overwrite: req.body?.overwrite === "true" || req.body?.overwrite === true,
    };

    const result = await uploadService.upload(fileInput, options);

    ApiResponse.created(res, "Document uploaded successfully.", result);
  });

  /**
   * DELETE /upload
   * Delete an uploaded file by public ID.
   */
  deleteFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const publicId = (req.body?.publicId ||
      req.query?.publicId ||
      req.params?.publicId) as string;

    if (!publicId) {
      throw ApiError.badRequest("Public ID is required for deletion.");
    }

    const result = await uploadService.delete(publicId);

    ApiResponse.ok(res, "File deleted successfully.", result);
  });

  /**
   * PUT /upload/replace
   * Replace an existing file with a new file upload.
   */
  replaceFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const oldPublicId = (req.body?.oldPublicId ||
      req.query?.oldPublicId) as string;

    const fileInput = extractFileInput(req);
    const options: StorageUploadOptions = {
      overwrite: req.body?.overwrite === "true" || req.body?.overwrite === true,
    };

    const result = await uploadService.replace(oldPublicId, fileInput, options);

    ApiResponse.ok(res, "File replaced successfully.", result);
  });

  /**
   * GET /upload/url
   * Resolve public URL for a given public ID.
   */
  getPublicUrl = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const publicId = (req.query?.publicId ||
      req.params?.publicId ||
      req.body?.publicId) as string;

    if (!publicId) {
      throw ApiError.badRequest("Public ID is required to resolve URL.");
    }

    const url = await uploadService.getPublicUrl(publicId);

    ApiResponse.ok(res, "Public URL resolved successfully.", {
      publicId,
      url,
    });
  });
}

export default new UploadController();
