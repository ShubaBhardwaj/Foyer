import { Schema, model, Types, Document } from "mongoose";

export interface IFlat extends Document {
  society: Types.ObjectId;
  tower: Types.ObjectId;
  flatNumber: string;
  floor: number;
  occupied: boolean;
  occupiedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const flatSchema = new Schema<IFlat>(
  {
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

    flatNumber: {
      type: String,
      required: true,
    },

    floor: {
      type: Number,
      required: true,
      min: 1,
    },

    occupied: {
      type: Boolean,
      default: false,
    },

    occupiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Compound unique index — flat number must be unique per tower & society
flatSchema.index({ society: 1, tower: 1, flatNumber: 1 }, { unique: true });

export default model<IFlat>("Flat", flatSchema);
