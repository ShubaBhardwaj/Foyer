import { Schema, model, Types, Document } from "mongoose";
import { VisitorStatus } from "../constants/enums";
import { VisitorType } from "../constants/visitor.enums";

export interface IVisitor extends Document {
  fullName: string;
  phoneNumber: string;
  email?: string;
  photoUrl?: string;

  visitorType: VisitorType;
  purpose?: string;
  notes?: string;
  vehicleNumber?: string;
  expectedArrival: Date;
  expectedDeparture?: Date;

  society: Types.ObjectId;
  tower: Types.ObjectId;
  flat: Types.ObjectId;
  resident: Types.ObjectId;
  guard?: Types.ObjectId | null;

  entryCode: string;
  status: VisitorStatus;

  approvedAt?: Date;
  approvedBy?: Types.ObjectId;
  rejectedAt?: Date;
  rejectedBy?: Types.ObjectId;
  approvalRemark?: string;

  checkedInAt?: Date;
  checkedInBy?: Types.ObjectId;
  checkedOutAt?: Date;
  checkedOutBy?: Types.ObjectId;

  isDeleted?: boolean;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const visitorSchema = new Schema<IVisitor>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    photoUrl: {
      type: String,
    },

    visitorType: {
      type: String,
      enum: Object.values(VisitorType),
      required: true,
    },

    purpose: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    vehicleNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },

    expectedArrival: {
      type: Date,
      required: true,
    },

    expectedDeparture: {
      type: Date,
    },

    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },

    tower: {
      type: Schema.Types.ObjectId,
      ref: "Tower",
      required: true,
    },

    flat: {
      type: Schema.Types.ObjectId,
      ref: "Flat",
      required: true,
    },

    resident: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    guard: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    entryCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(VisitorStatus),
      default: VisitorStatus.PENDING,
      required: true,
    },

    approvedAt: Date,
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    rejectedAt: Date,
    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvalRemark: String,

    checkedInAt: Date,
    checkedInBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    checkedOutAt: Date,
    checkedOutBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
visitorSchema.index({ society: 1, resident: 1, createdAt: -1 });
visitorSchema.index({ society: 1, status: 1, createdAt: -1 });
visitorSchema.index({ entryCode: 1 }, { unique: true });
visitorSchema.index({ expectedArrival: 1 });
visitorSchema.index({ phoneNumber: 1 });

export default model<IVisitor>("Visitor", visitorSchema);
