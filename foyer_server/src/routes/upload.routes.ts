import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import { requirePermission } from "../middleware/requirePermission";
import uploadController from "../controllers/upload.controller";
import { Permission } from "../constants/permissions";

export const uploadRouter = Router();

/**
 * POST /uploads/image
 * Upload an image file.
 * Required Permission: FILE_UPLOAD
 */
uploadRouter.post(
  "/image",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.FILE_UPLOAD),
  uploadController.uploadImage.bind(uploadController)
);

/**
 * POST /uploads/document
 * Upload a document file.
 * Required Permission: FILE_UPLOAD
 */
uploadRouter.post(
  "/document",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.FILE_UPLOAD),
  uploadController.uploadDocument.bind(uploadController)
);

/**
 * PUT /uploads/:publicId(*)
 * Replace an existing file with a new upload.
 * Required Permission: FILE_UPLOAD
 */
uploadRouter.put(
  "/:publicId(*)",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.FILE_UPLOAD),
  uploadController.replaceFile.bind(uploadController)
);

/**
 * DELETE /uploads/:publicId(*)
 * Delete a stored file by public ID.
 * Required Permission: FILE_DELETE
 */
uploadRouter.delete(
  "/:publicId(*)",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.FILE_DELETE),
  uploadController.deleteFile.bind(uploadController)
);

/**
 * GET /uploads/:publicId(*)
 * Get public URL for a stored file by public ID.
 * Required Permission: FILE_UPLOAD
 */
uploadRouter.get(
  "/:publicId(*)",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.FILE_UPLOAD),
  uploadController.getPublicUrl.bind(uploadController)
);

export default uploadRouter;
