import { Schema, model, Types, Document } from "mongoose";

export interface ITower extends Document {
  society: Types.ObjectId;
  name: string;
  floors: number;
  flatsPerFloor: number;
  createdAt: Date;
  updatedAt: Date;
}

const towerSchema = new Schema<ITower>(
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

    floors: {
      type: Number,
      required: true,
      min: 1,
    },

    flatsPerFloor: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Compound unique index — tower name must be unique per society
towerSchema.index({ society: 1, name: 1 }, { unique: true });

export default model<ITower>("Tower", towerSchema);
