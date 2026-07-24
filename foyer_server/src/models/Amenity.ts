import { Schema, model, Types, Document } from "mongoose";

export interface IAmenity extends Document {
  society: Types.ObjectId;
  name: string;
  description?: string;
  openingTime?: string;
  closingTime?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const amenitySchema = new Schema<IAmenity>(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: String,

    openingTime: String,

    closingTime: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IAmenity>("Amenity", amenitySchema);
