import { Schema, model, Types, Document } from "mongoose";

export interface IVisitorRequest extends Document {
  society: Types.ObjectId;
  resident: Types.ObjectId;
  guard: Types.ObjectId;
  visitorName: string;
  phone?: string;
  visitorType: "guest" | "delivery" | "cab" | "service";
  purpose?: string;
  status: "pending" | "approved" | "rejected" | "entered" | "exited";
  entryTime?: Date;
  exitTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const visitorRequestSchema = new Schema<IVisitorRequest>(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
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
      required: true,
    },

    visitorName: {
      type: String,
      required: true,
    },

    phone: String,

    visitorType: {
      type: String,
      enum: ["guest", "delivery", "cab", "service"],
      required: true,
    },

    purpose: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "entered", "exited"],
      default: "pending",
    },

    entryTime: Date,

    exitTime: Date,
  },
  {
    timestamps: true,
  }
);

export default model<IVisitorRequest>("VisitorRequest", visitorRequestSchema);
