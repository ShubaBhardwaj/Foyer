import { Schema, model, Types, Document } from "mongoose";

export interface IPoll extends Document {
  society: Types.ObjectId;
  question: string;
  options: { text: string; votes: number }[];
  createdBy: Types.ObjectId;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pollSchema = new Schema<IPoll>(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    options: [
      {
        text: String,
        votes: {
          type: Number,
          default: 0,
        },
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

export default model<IPoll>("Poll", pollSchema);
