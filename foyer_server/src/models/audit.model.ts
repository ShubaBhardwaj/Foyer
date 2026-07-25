import { Schema, model, Types, Document } from "mongoose";
import { UserRole } from "../constants/enums";

/**
 * System Audit Actions Enum.
 */
export enum AuditAction {
  // Visitor Module
  VISITOR_CREATED = "VISITOR_CREATED",
  VISITOR_APPROVED = "VISITOR_APPROVED",
  VISITOR_REJECTED = "VISITOR_REJECTED",
  VISITOR_CANCELLED = "VISITOR_CANCELLED",
  VISITOR_CHECKED_IN = "VISITOR_CHECKED_IN",
  VISITOR_CHECKED_OUT = "VISITOR_CHECKED_OUT",
  VISITOR_DELETED = "VISITOR_DELETED",

  // Complaint Module
  COMPLAINT_CREATED = "COMPLAINT_CREATED",
  COMPLAINT_UPDATED = "COMPLAINT_UPDATED",
  COMPLAINT_ASSIGNED = "COMPLAINT_ASSIGNED",
  COMPLAINT_RESOLVED = "COMPLAINT_RESOLVED",

  // Notice Module
  NOTICE_PUBLISHED = "NOTICE_PUBLISHED",
  NOTICE_UPDATED = "NOTICE_UPDATED",
  NOTICE_DELETED = "NOTICE_DELETED",

  // Amenity / Booking Module
  AMENITY_CREATED = "AMENITY_CREATED",
  AMENITY_UPDATED = "AMENITY_UPDATED",
  AMENITY_DELETED = "AMENITY_DELETED",
  AMENITY_BOOKED = "AMENITY_BOOKED",
  AMENITY_CANCELLED = "AMENITY_CANCELLED",
  BOOKING_CREATED = "BOOKING_CREATED",
  BOOKING_APPROVED = "BOOKING_APPROVED",
  BOOKING_CANCELLED = "BOOKING_CANCELLED",
  BOOKING_REJECTED = "BOOKING_REJECTED",
  // Polls & Voting Module
  POLL_CREATED = "POLL_CREATED",
  POLL_UPDATED = "POLL_UPDATED",
  POLL_PUBLISHED = "POLL_PUBLISHED",
  POLL_CLOSED = "POLL_CLOSED",
  POLL_VOTED = "POLL_VOTED",
  POLL_DELETED = "POLL_DELETED",

  // Maintenance & Billing Subsystem
  MAINTENANCE_CREATED = "MAINTENANCE_CREATED",
  MAINTENANCE_PUBLISHED = "MAINTENANCE_PUBLISHED",
  MAINTENANCE_UPDATED = "MAINTENANCE_UPDATED",
  MAINTENANCE_CLOSED = "MAINTENANCE_CLOSED",
  INVOICE_GENERATED = "INVOICE_GENERATED",
  PAYMENT_RECORDED = "PAYMENT_RECORDED",

  // Community Subsystem
  POST_CREATED = "POST_CREATED",
  POST_UPDATED = "POST_UPDATED",
  POST_ARCHIVED = "POST_ARCHIVED",
  POST_DELETED = "POST_DELETED",
  COMMENT_CREATED = "COMMENT_CREATED",
  COMMENT_DELETED = "COMMENT_DELETED",

  // User & Account Module
  USER_CREATED = "USER_CREATED",
  USER_UPDATED = "USER_UPDATED",
  USER_ROLE_CHANGED = "USER_ROLE_CHANGED",

  // Society & Structure Module
  SOCIETY_CREATED = "SOCIETY_CREATED",
  SOCIETY_UPDATED = "SOCIETY_UPDATED",
  STRUCTURE_UPDATED = "STRUCTURE_UPDATED",

  // Storage Subsystem
  FILE_UPLOADED = "FILE_UPLOADED",
  FILE_DELETED = "FILE_DELETED",
}

/**
 * System Resource Types Enum.
 */
export enum AuditResourceType {
  VISITOR = "Visitor",
  COMPLAINT = "Complaint",
  NOTICE = "Notice",
  AMENITY = "Amenity",
  BOOKING = "Booking",
  AMENITY_BOOKING = "Booking",
  POLL = "Poll",
  VOTE = "Vote",
  MAINTENANCE = "Maintenance",
  INVOICE = "Invoice",
  PAYMENT = "Payment",
  COMMUNITY_POST = "CommunityPost",
  COMMUNITY_COMMENT = "CommunityComment",
  COMMUNITY_REACTION = "CommunityReaction",
  USER = "User",
  SOCIETY = "Society",
  STRUCTURE = "Structure",
  STORAGE = "Storage",
}

/**
 * Audit Log TypeScript Interface.
 */
export interface IAuditLog extends Document {
  actor: Types.ObjectId;
  actorRole: UserRole | string;
  society: Types.ObjectId;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId: Types.ObjectId | string;
  before?: any;
  after?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    actorRole: {
      type: String,
      required: true,
    },

    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: true,
      index: true,
    },

    resourceType: {
      type: String,
      enum: Object.values(AuditResourceType),
      required: true,
    },

    resourceId: {
      type: Schema.Types.Mixed,
      required: true,
    },

    before: {
      type: Schema.Types.Mixed,
      default: null,
    },

    after: {
      type: Schema.Types.Mixed,
      default: null,
    },

    ipAddress: {
      type: String,
      trim: true,
    },

    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
auditLogSchema.index({ society: 1, createdAt: -1 });
auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });

export default model<IAuditLog>("AuditLog", auditLogSchema);
