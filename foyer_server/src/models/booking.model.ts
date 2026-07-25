import { Schema, model, Types, Document } from "mongoose";

/**
 * Facility Booking Lifecycle Status Enum.
 */
export enum BookingStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

/**
 * Facility Booking Payment Status Enum.
 */
export enum BookingPaymentStatus {
  NOT_REQUIRED = "NOT_REQUIRED",
  PENDING = "PENDING",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
}

/**
 * Facility Booking Document TypeScript Interface.
 */
export interface IBooking extends Document {
  society: Types.ObjectId;
  amenity: Types.ObjectId;
  resident: Types.ObjectId;
  bookingDate: Date;
  slotStart: Date;
  slotEnd: Date;
  purpose: string;
  attendees: number;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  cancellationReason?: string;
  approvedBy?: Types.ObjectId | null;
  approvedAt?: Date | null;
  rejectedReason?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    amenity: {
      type: Schema.Types.ObjectId,
      ref: "Amenity",
      required: true,
      index: true,
    },

    resident: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    bookingDate: {
      type: Date,
      required: true,
      index: true,
    },

    slotStart: {
      type: Date,
      required: true,
      index: true,
    },

    slotEnd: {
      type: Date,
      required: true,
      index: true,
    },

    purpose: {
      type: String,
      required: true,
      trim: true,
    },

    attendees: {
      type: Number,
      default: 1,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
      required: true,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(BookingPaymentStatus),
      default: BookingPaymentStatus.NOT_REQUIRED,
      required: true,
    },

    cancellationReason: {
      type: String,
      trim: true,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedReason: {
      type: String,
      trim: true,
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

// Compound Indexes for fast slot conflict checks and filtering
bookingSchema.index({ amenity: 1, slotStart: 1, slotEnd: 1, status: 1 });
bookingSchema.index({ society: 1, status: 1 });
bookingSchema.index({ resident: 1, createdAt: -1 });

export default model<IBooking>("Booking", bookingSchema);
