import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import uploadController from "../controllers/upload.controller";

export const uploadRouter = Router();

/**
 * POST /uploads/image
 * Upload an image file.
 * Requires: Authentication & Linked Account.
 */
uploadRouter.post(
  "/image",
  clerkAuth,
  requireLinkedAccount,
  uploadController.uploadImage.bind(uploadController)
);

/**
 * POST /uploads/document
 * Upload a document file.
 * Requires: Authentication & Linked Account.
 */
uploadRouter.post(
  "/document",
  clerkAuth,
  requireLinkedAccount,
  uploadController.uploadDocument.bind(uploadController)
);

/**
 * PUT /uploads/:publicId(*)
 * Replace an existing file with a new upload.
 * Requires: Authentication & Linked Account.
 */
uploadRouter.put(
  "/:publicId(*)",
  clerkAuth,
  requireLinkedAccount,
  uploadController.replaceFile.bind(uploadController)
);

/**
 * DELETE /uploads/:publicId(*)
 * Delete a stored file by public ID.
 * Requires: Authentication & Linked Account.
 */
uploadRouter.delete(
  "/:publicId(*)",
  clerkAuth,
  requireLinkedAccount,
  uploadController.deleteFile.bind(uploadController)
);

/**
 * GET /uploads/:publicId(*)
 * Get public URL for a stored file by public ID.
 * Requires: Authentication & Linked Account.
 */
uploadRouter.get(
  "/:publicId(*)",
  clerkAuth,
  requireLinkedAccount,
  uploadController.getPublicUrl.bind(uploadController)
);

export default uploadRouter;
