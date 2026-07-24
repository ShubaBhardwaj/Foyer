import { Schema, model, Types, Document } from "mongoose";

export interface INotice extends Document {
  society: Types.ObjectId;
  title: string;
  description: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<INotice>(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default model<INotice>("Notice", noticeSchema);
