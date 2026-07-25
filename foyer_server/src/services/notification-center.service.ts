import { Types } from "mongoose";
import NotificationModel, {
  INotification,
  NotificationType,
  NotificationPriority,
} from "../models/notification.model";
import ApiError from "../utils/apiError";
import searchService from "./search.service";
import { validateObjectId } from "../utils/validation";
import { SearchResult } from "../types/search.types";
import { ListNotificationsInput } from "../validators/notification.validator";

export interface CreateInAppNotificationInput {
  society: Types.ObjectId | string;
  recipient: Types.ObjectId | string;
  actor?: Types.ObjectId | string | null;
  title: string;
  message: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  data?: Record<string, any>;
  expiresAt?: Date | null;
}

/**
 * NotificationCenterService — Business logic layer for In-App Notification Center.
 */
class NotificationCenterService {
  /**
   * Persist a new in-app notification for a user.
   */
  async createNotification(input: CreateInAppNotificationInput): Promise<INotification> {
    const notification = await NotificationModel.create({
      society: input.society,
      recipient: input.recipient,
      actor: input.actor || null,
      title: input.title,
      message: input.message,
      type: input.type || NotificationType.SYSTEM,
      priority: input.priority || NotificationPriority.NORMAL,
      data: input.data || undefined,
      isRead: false,
      readAt: null,
      expiresAt: input.expiresAt || null,
    });

    return notification;
  }

  /**
   * List in-app notifications for authenticated user.
   */
  async listNotifications(
    societyId: Types.ObjectId,
    recipientId: Types.ObjectId,
    input: ListNotificationsInput
  ): Promise<SearchResult<INotification>> {
    const filter: Record<string, any> = {
      society: societyId,
      recipient: recipientId,
    };

    if (input.unreadOnly === "true") {
      filter.isRead = false;
    }

    if (input.type) filter.type = input.type;
    if (input.priority) filter.priority = input.priority;

    if (input.startDate || input.endDate) {
      filter.createdAt = {};
      if (input.startDate) filter.createdAt.$gte = new Date(input.startDate);
      if (input.endDate) filter.createdAt.$lte = new Date(input.endDate);
    }

    return searchService.search<INotification>(NotificationModel as any, {
      searchKeyword: input.unreadOnly,
      searchFields: ["title", "message"],
      filter,
      sort: input.sort || "-createdAt",
      page: input.page ? Number(input.page) : undefined,
      limit: input.limit ? Number(input.limit) : undefined,
      populate: [{ path: "actor", select: "name email" }],
    });
  }

  /**
   * Get single notification by ID for recipient.
   */
  async getNotificationById(
    societyId: Types.ObjectId,
    recipientId: Types.ObjectId,
    id: string
  ): Promise<INotification> {
    validateObjectId(id, "Notification ID");

    const notification = await NotificationModel.findOne({
      _id: id,
      society: societyId,
      recipient: recipientId,
    }).populate("actor", "name email");

    if (!notification) {
      throw ApiError.notFound("Notification not found.");
    }

    return notification;
  }

  /**
   * Mark a single notification as read.
   */
  async markAsRead(
    societyId: Types.ObjectId,
    recipientId: Types.ObjectId,
    id: string
  ): Promise<INotification> {
    validateObjectId(id, "Notification ID");

    const notification = await NotificationModel.findOne({
      _id: id,
      society: societyId,
      recipient: recipientId,
    });

    if (!notification) {
      throw ApiError.notFound("Notification not found.");
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return notification;
  }

  /**
   * Mark all unread notifications as read for recipient.
   */
  async markAllAsRead(
    societyId: Types.ObjectId,
    recipientId: Types.ObjectId
  ): Promise<number> {
    const result = await NotificationModel.updateMany(
      {
        society: societyId,
        recipient: recipientId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    return result.modifiedCount;
  }

  /**
   * Delete a notification for recipient.
   */
  async deleteNotification(
    societyId: Types.ObjectId,
    recipientId: Types.ObjectId,
    id: string
  ): Promise<boolean> {
    validateObjectId(id, "Notification ID");

    const result = await NotificationModel.deleteOne({
      _id: id,
      society: societyId,
      recipient: recipientId,
    });

    return result.deletedCount > 0;
  }

  /**
   * Background job cleanup of expired notifications.
   */
  async cleanupExpiredNotifications(): Promise<number> {
    const result = await NotificationModel.deleteMany({
      expiresAt: { $ne: null, $lt: new Date() },
    });

    return result.deletedCount;
  }
}

export default new NotificationCenterService();
