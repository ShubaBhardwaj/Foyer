import { Schema, model, Types, Document } from "mongoose";

export interface ISociety extends Document {
  name: string;
  societyCode: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  owner: Types.ObjectId;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const societySchema = new Schema<ISociety>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    societyCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default model<ISociety>("Society", societySchema);
