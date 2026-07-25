import { z } from "zod";
import { Types } from "mongoose";
import {
  NotificationType,
  NotificationPriority,
} from "../models/notification.model";

/**
 * Validate MongoDB ObjectId string format.
 */
const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid Mongo ObjectId format.",
  });

/**
 * Schema for listing in-app notifications.
 */
export const listNotificationsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  unreadOnly: z.string().optional(),
  type: z.nativeEnum(NotificationType).optional(),
  priority: z.nativeEnum(NotificationPriority).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sort: z.string().optional(),
});

/**
 * Schema for validating route param `id`.
 */
export const notificationIdParamsSchema = z.object({
  id: objectIdSchema,
});

export type ListNotificationsInput = z.infer<typeof listNotificationsSchema>;
