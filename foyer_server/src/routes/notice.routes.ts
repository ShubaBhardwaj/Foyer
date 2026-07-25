import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import { requirePermission } from "../middleware/requirePermission";
import { validate } from "../middleware/validate";
import noticeController from "../controllers/notice.controller";
import { Permission } from "../constants/permissions";
import {
  createNoticeSchema,
  updateNoticeSchema,
  listNoticesSchema,
  noticeIdParamsSchema,
} from "../validators/notice.validator";

export const noticeRouter = Router();

/**
 * POST /notices
 * Create a new notice.
 * Required Permission: NOTICE_CREATE
 */
noticeRouter.post(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTICE_CREATE),
  validate(createNoticeSchema),
  noticeController.createNotice.bind(noticeController)
);

/**
 * GET /notices
 * List notices with search, filtering, and role visibility.
 * Required Permission: NOTICE_READ
 */
noticeRouter.get(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTICE_READ),
  validate(listNoticesSchema, "query"),
  noticeController.listNotices.bind(noticeController)
);

/**
 * GET /notices/:id
 * Get details for a single notice.
 * Required Permission: NOTICE_READ
 */
noticeRouter.get(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTICE_READ),
  validate(noticeIdParamsSchema, "params"),
  noticeController.getNotice.bind(noticeController)
);

/**
 * PATCH /notices/:id
 * Update notice details.
 * Required Permission: NOTICE_CREATE
 */
noticeRouter.patch(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTICE_CREATE),
  validate(noticeIdParamsSchema, "params"),
  validate(updateNoticeSchema),
  noticeController.updateNotice.bind(noticeController)
);

/**
 * POST /notices/:id/publish
 * Publish a notice to society audience.
 * Required Permission: NOTICE_PUBLISH
 */
noticeRouter.post(
  "/:id/publish",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTICE_PUBLISH),
  validate(noticeIdParamsSchema, "params"),
  noticeController.publishNotice.bind(noticeController)
);

/**
 * POST /notices/:id/archive
 * Archive a notice.
 * Required Permission: NOTICE_PUBLISH
 */
noticeRouter.post(
  "/:id/archive",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTICE_PUBLISH),
  validate(noticeIdParamsSchema, "params"),
  noticeController.archiveNotice.bind(noticeController)
);

/**
 * POST /notices/:id/pin
 * Pin notice to top of board.
 * Required Permission: NOTICE_PUBLISH
 */
noticeRouter.post(
  "/:id/pin",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTICE_PUBLISH),
  validate(noticeIdParamsSchema, "params"),
  noticeController.pinNotice.bind(noticeController)
);

/**
 * POST /notices/:id/unpin
 * Unpin notice.
 * Required Permission: NOTICE_PUBLISH
 */
noticeRouter.post(
  "/:id/unpin",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTICE_PUBLISH),
  validate(noticeIdParamsSchema, "params"),
  noticeController.unpinNotice.bind(noticeController)
);

/**
 * DELETE /notices/:id
 * Soft-delete a notice.
 * Required Permission: NOTICE_DELETE
 */
noticeRouter.delete(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTICE_DELETE),
  validate(noticeIdParamsSchema, "params"),
  noticeController.deleteNotice.bind(noticeController)
);

export default noticeRouter;
