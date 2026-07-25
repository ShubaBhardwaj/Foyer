import { Schema, model, Types, Document } from "mongoose";

/**
 * Maintenance Cycle Lifecycle Status Enum.
 */
export enum MaintenanceStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CLOSED = "CLOSED",
}

/**
 * Maintenance Document TypeScript Interface.
 */
export interface IMaintenance extends Document {
  society: Types.ObjectId;
  title: string;
  description: string;
  billingPeriod: string; // YYYY-MM
  dueDate: Date;
  amount: number;
  lateFee: number;
  status: MaintenanceStatus;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceSchema = new Schema<IMaintenance>(
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

    description: {
      type: String,
      required: true,
      trim: true,
    },

    billingPeriod: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    dueDate: {
      type: Date,
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    lateFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(MaintenanceStatus),
      default: MaintenanceStatus.DRAFT,
      required: true,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
maintenanceSchema.index({ society: 1, status: 1 });
maintenanceSchema.index({ society: 1, billingPeriod: 1 });
maintenanceSchema.index({ society: 1, dueDate: 1 });

export default model<IMaintenance>("Maintenance", maintenanceSchema);
