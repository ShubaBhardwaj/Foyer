import { Schema, model, Types, Document } from "mongoose";

export interface IBooking extends Document {
  resident: Types.ObjectId;
  amenity: Types.ObjectId;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  status: "pending" | "approved" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    resident: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amenity: {
      type: Schema.Types.ObjectId,
      ref: "Amenity",
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "approved",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IBooking>("Booking", bookingSchema);
