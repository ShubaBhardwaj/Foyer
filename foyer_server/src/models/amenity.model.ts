import { Schema, model, Types, Document } from "mongoose";

/**
 * Amenity Category Enum.
 */
export enum AmenityCategory {
  CLUBHOUSE = "CLUBHOUSE",
  GYM = "GYM",
  SWIMMING_POOL = "SWIMMING_POOL",
  TENNIS_COURT = "TENNIS_COURT",
  BADMINTON = "BADMINTON",
  PARTY_HALL = "PARTY_HALL",
  MEETING_ROOM = "MEETING_ROOM",
  GUEST_ROOM = "GUEST_ROOM",
  BBQ_AREA = "BBQ_AREA",
  OTHER = "OTHER",
}

/**
 * Amenity Booking Type Enum.
 */
export enum AmenityBookingType {
  SLOT_BASED = "SLOT_BASED",
  DAY_BASED = "DAY_BASED",
  OPEN_ACCESS = "OPEN_ACCESS",
}

/**
 * Amenity Document TypeScript Interface.
 */
export interface IAmenity extends Document {
  society: Types.ObjectId;
  name: string;
  description: string;
  category: AmenityCategory;
  images: string[];
  location: string;
  capacity: number;
  openingTime: string;
  closingTime: string;
  slotDuration: number;
  bookingType: AmenityBookingType;
  bookingWindowDays: number;
  cancellationWindowHours: number;
  requiresApproval: boolean;
  maxBookingsPerResident: number;
  bookingFee: number;
  securityDeposit: number;
  isActive: boolean;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const amenitySchema = new Schema<IAmenity>(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    name: {
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
      enum: Object.values(AmenityCategory),
      default: AmenityCategory.OTHER,
      required: true,
      index: true,
    },

    images: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    capacity: {
      type: Number,
      default: 1,
      required: true,
    },

    openingTime: {
      type: String,
      default: "06:00",
      required: true,
    },

    closingTime: {
      type: String,
      default: "22:00",
      required: true,
    },

    slotDuration: {
      type: Number,
      default: 60, // in minutes
      required: true,
    },

    bookingType: {
      type: String,
      enum: Object.values(AmenityBookingType),
      default: AmenityBookingType.SLOT_BASED,
      required: true,
    },

    bookingWindowDays: {
      type: Number,
      default: 30,
      required: true,
    },

    cancellationWindowHours: {
      type: Number,
      default: 24,
      required: true,
    },

    requiresApproval: {
      type: Boolean,
      default: false,
    },

    maxBookingsPerResident: {
      type: Number,
      default: 3,
    },

    bookingFee: {
      type: Number,
      default: 0,
    },

    securityDeposit: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
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
amenitySchema.index({ society: 1, isActive: 1 });
amenitySchema.index({ society: 1, category: 1 });

export default model<IAmenity>("Amenity", amenitySchema);
