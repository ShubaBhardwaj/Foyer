import { Schema, model, Types, Document } from "mongoose";

/**
 * Notice Category Enum.
 */
export enum NoticeCategory {
  GENERAL = "GENERAL",
  SECURITY = "SECURITY",
  EVENT = "EVENT",
  MAINTENANCE = "MAINTENANCE",
  EMERGENCY = "EMERGENCY",
  BILLING = "BILLING",
  OTHER = "OTHER",
}

/**
 * Notice Priority Level Enum.
 */
export enum NoticePriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

/**
 * Notice Lifecycle Status Enum.
 */
export enum NoticeStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  EXPIRED = "EXPIRED",
  ARCHIVED = "ARCHIVED",
}

/**
 * Notice Target Visibility Enum.
 */
export enum NoticeVisibility {
  ALL = "ALL",
  RESIDENTS = "RESIDENTS",
  ADMINS = "ADMINS",
  GUARDS = "GUARDS",
}

/**
 * Notice Document TypeScript Interface.
 */
export interface INotice extends Document {
  society: Types.ObjectId;
  title: string;
  content: string;
  category: NoticeCategory;
  priority: NoticePriority;
  visibility: NoticeVisibility;
  status: NoticeStatus;
  attachments: string[];
  publishAt: Date;
  expiresAt?: Date | null;
  publishedBy: Types.ObjectId;
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<INotice>(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: Object.values(NoticeCategory),
      default: NoticeCategory.GENERAL,
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: Object.values(NoticePriority),
      default: NoticePriority.NORMAL,
      required: true,
    },

    visibility: {
      type: String,
      enum: Object.values(NoticeVisibility),
      default: NoticeVisibility.ALL,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(NoticeStatus),
      default: NoticeStatus.DRAFT,
      required: true,
      index: true,
    },

    attachments: {
      type: [String],
      default: [],
    },

    publishAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    publishedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexes
noticeSchema.index({ society: 1, status: 1 });
noticeSchema.index({ society: 1, publishAt: -1 });
noticeSchema.index({ society: 1, expiresAt: 1 });
noticeSchema.index({ society: 1, isPinned: -1, publishAt: -1 });

export default model<INotice>("Notice", noticeSchema);
