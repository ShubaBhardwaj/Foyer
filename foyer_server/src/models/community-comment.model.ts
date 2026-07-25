import { Schema, model, Types, Document } from "mongoose";

/**
 * Community Comment Document TypeScript Interface.
 */
export interface ICommunityComment extends Document {
  post: Types.ObjectId;
  society: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  parentComment?: Types.ObjectId | null;
  reactionsCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const communityCommentSchema = new Schema<ICommunityComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "CommunityPost",
      required: true,
      index: true,
    },

    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "CommunityComment",
      default: null,
      index: true,
    },

    reactionsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexes
communityCommentSchema.index({ post: 1, createdAt: 1 });
communityCommentSchema.index({ parentComment: 1, createdAt: 1 });

export default model<ICommunityComment>("CommunityComment", communityCommentSchema);
