import { Schema, model, Types, Document } from "mongoose";

export interface IFlat extends Document {
  society: Types.ObjectId;
  tower: Types.ObjectId;
  flatNumber: string;
  floor: number;
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
    },
  },
  {
    timestamps: true,
  }
);

export default model<IFlat>("Flat", flatSchema);
