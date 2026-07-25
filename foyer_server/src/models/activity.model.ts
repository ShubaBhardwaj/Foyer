import { Schema, model, Types, Document } from "mongoose";
import { UserRole } from "../constants/enums";

/**
 * Activity Feed Event Types.
 */
export enum ActivityType {
  VISITOR_CREATED = "VISITOR_CREATED",
  VISITOR_APPROVED = "VISITOR_APPROVED",
  VISITOR_REJECTED = "VISITOR_REJECTED",
  VISITOR_CANCELLED = "VISITOR_CANCELLED",
  VISITOR_CHECKED_IN = "VISITOR_CHECKED_IN",
  VISITOR_CHECKED_OUT = "VISITOR_CHECKED_OUT",

  FILE_UPLOADED = "FILE_UPLOADED",
  NOTICE_POSTED = "NOTICE_POSTED",
  COMPLAINT_CREATED = "COMPLAINT_CREATED",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  AMENITY_BOOKED = "AMENITY_BOOKED",
}

/**
 * Activity Feed Visibility Filters.
 */
export enum ActivityVisibility {
  RESIDENT = "RESIDENT",
  ADMIN = "ADMIN",
  GUARD = "GUARD",
  ALL = "ALL",
}

/**
 * Activity Feed TypeScript Interface.
 */
export interface IActivity extends Document {
  society: Types.ObjectId;
  actor: Types.ObjectId;
  actorName: string;
  actorRole: UserRole | string;
  activityType: ActivityType;
  resourceType: string;
  resourceId: Types.ObjectId | string;
  message: string;
  metadata?: any;
  visibility: ActivityVisibility;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    actorName: {
      type: String,
      required: true,
      trim: true,
    },

    actorRole: {
      type: String,
      required: true,
    },

    activityType: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
      index: true,
    },

    resourceType: {
      type: String,
      required: true,
    },

    resourceId: {
      type: Schema.Types.Mixed,
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: null,
    },

    visibility: {
      type: String,
      enum: Object.values(ActivityVisibility),
      default: ActivityVisibility.ALL,
      required: true,
      index: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
activitySchema.index({ society: 1, createdAt: -1 });
activitySchema.index({ visibility: 1, createdAt: -1 });
activitySchema.index({ actor: 1, createdAt: -1 });
activitySchema.index({ resourceType: 1, resourceId: 1 });

export default model<IActivity>("Activity", activitySchema);
