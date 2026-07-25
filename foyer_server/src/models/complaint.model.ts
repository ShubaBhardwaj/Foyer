import { Schema, model, Types, Document } from "mongoose";

/**
 * Complaint Category Enum.
 */
export enum ComplaintCategory {
  SECURITY = "SECURITY",
  CLEANLINESS = "CLEANLINESS",
  ELECTRICITY = "ELECTRICITY",
  WATER = "WATER",
  PLUMBING = "PLUMBING",
  LIFT = "LIFT",
  PARKING = "PARKING",
  NOISE = "NOISE",
  MAINTENANCE = "MAINTENANCE",
  OTHER = "OTHER",
}

/**
 * Complaint Priority Level Enum.
 */
export enum ComplaintPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

/**
 * Complaint Status Lifecycle Enum.
 */
export enum ComplaintStatus {
  OPEN = "OPEN",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

/**
 * Complaint Document TypeScript Interface.
 */
export interface IComplaint extends Document {
  society: Types.ObjectId;
  createdBy: Types.ObjectId;
  assignedTo?: Types.ObjectId | null;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  attachments: string[];
  location?: string;
  resolutionNotes?: string;
  resolvedAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema<IComplaint>(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: Object.values(ComplaintCategory),
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: Object.values(ComplaintPriority),
      default: ComplaintPriority.MEDIUM,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ComplaintStatus),
      default: ComplaintStatus.OPEN,
      required: true,
      index: true,
    },

    attachments: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      trim: true,
    },

    resolutionNotes: {
      type: String,
      trim: true,
    },

    resolvedAt: {
      type: Date,
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
complaintSchema.index({ society: 1, status: 1 });
complaintSchema.index({ society: 1, category: 1 });
complaintSchema.index({ createdBy: 1, createdAt: -1 });
complaintSchema.index({ assignedTo: 1, createdAt: -1 });
complaintSchema.index({ society: 1, createdAt: -1 });

export default model<IComplaint>("Complaint", complaintSchema);
