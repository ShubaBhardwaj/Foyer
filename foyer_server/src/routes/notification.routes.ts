import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import { requirePermission } from "../middleware/requirePermission";
import { validate } from "../middleware/validate";
import notificationController from "../controllers/notification.controller";
import { Permission } from "../constants/permissions";
import {
  listNotificationsSchema,
  notificationIdParamsSchema,
} from "../validators/notification.validator";

export const notificationCenterRouter = Router();

/**
 * GET /notifications
 * List notifications for logged-in user.
 * Required Permission: NOTIFICATION_READ
 */
notificationCenterRouter.get(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTIFICATION_READ),
  validate(listNotificationsSchema, "query"),
  notificationController.listNotifications.bind(notificationController)
);

/**
 * POST /notifications/read-all
 * Mark all unread notifications as read.
 * Required Permission: NOTIFICATION_READ
 */
notificationCenterRouter.post(
  "/read-all",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTIFICATION_READ),
  notificationController.markAllAsRead.bind(notificationController)
);

/**
 * GET /notifications/:id
 * Get single notification.
 * Required Permission: NOTIFICATION_READ
 */
notificationCenterRouter.get(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTIFICATION_READ),
  validate(notificationIdParamsSchema, "params"),
  notificationController.getNotification.bind(notificationController)
);

/**
 * POST /notifications/:id/read
 * Mark a single notification as read.
 * Required Permission: NOTIFICATION_READ
 */
notificationCenterRouter.post(
  "/:id/read",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTIFICATION_READ),
  validate(notificationIdParamsSchema, "params"),
  notificationController.markAsRead.bind(notificationController)
);

/**
 * DELETE /notifications/:id
 * Delete a notification.
 * Required Permission: NOTIFICATION_DELETE
 */
notificationCenterRouter.delete(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.NOTIFICATION_DELETE),
  validate(notificationIdParamsSchema, "params"),
  notificationController.deleteNotification.bind(notificationController)
);

export default notificationCenterRouter;
