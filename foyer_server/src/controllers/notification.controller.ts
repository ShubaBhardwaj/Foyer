import { Request, Response } from "express";
import notificationCenterService from "../services/notification-center.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

/**
 * NotificationController — Thin HTTP layer for In-App Notification Center.
 */
class NotificationController {
  listNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const result = await notificationCenterService.listNotifications(
      req.user.society,
      req.user._id,
      req.query as any
    );

    ApiResponse.ok(res, "Notifications retrieved successfully.", result.data, result.meta);
  });

  getNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const notification = await notificationCenterService.getNotificationById(
      req.user.society,
      req.user._id,
      req.params.id
    );

    ApiResponse.ok(res, "Notification details retrieved successfully.", notification);
  });

  markAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const notification = await notificationCenterService.markAsRead(
      req.user.society,
      req.user._id,
      req.params.id
    );

    ApiResponse.ok(res, "Notification marked as read.", notification);
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const count = await notificationCenterService.markAllAsRead(
      req.user.society,
      req.user._id
    );

    ApiResponse.ok(res, `Marked ${count} notifications as read.`, { count });
  });

  deleteNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const deleted = await notificationCenterService.deleteNotification(
      req.user.society,
      req.user._id,
      req.params.id
    );

    ApiResponse.ok(res, deleted ? "Notification deleted." : "Notification not found.", { deleted });
  });
}

export default new NotificationController();
