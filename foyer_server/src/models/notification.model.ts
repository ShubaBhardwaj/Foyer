import { Schema, model, Types, Document } from "mongoose";

/**
 * Notification Categories / Types.
 */
export enum NotificationType {
  VISITOR = "VISITOR",
  COMPLAINT = "COMPLAINT",
  NOTICE = "NOTICE",
  BOOKING = "BOOKING",
  POLL = "POLL",
  PAYMENT = "PAYMENT",
  COMMUNITY = "COMMUNITY",
  SYSTEM = "SYSTEM",
}

/**
 * Notification Priority Levels.
 */
export enum NotificationPriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

/**
 * In-App Notification Document TypeScript Interface.
 */
export interface INotification extends Document {
  society: Types.ObjectId;
  recipient: Types.ObjectId;
  actor?: Types.ObjectId | null;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: Date | null;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.SYSTEM,
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: Object.values(NotificationPriority),
      default: NotificationPriority.NORMAL,
      required: true,
      index: true,
    },

    data: {
      type: Schema.Types.Mixed,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexes
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ society: 1, createdAt: -1 });

export default model<INotification>("Notification", notificationSchema);
