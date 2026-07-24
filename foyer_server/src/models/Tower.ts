import { Schema, model, Types, Document } from "mongoose";

export interface ITower extends Document {
  society: Types.ObjectId;
  name: string;
  floors: number;
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
    },
  },
  {
    timestamps: true,
  }
);

export default model<ITower>("Tower", towerSchema);
