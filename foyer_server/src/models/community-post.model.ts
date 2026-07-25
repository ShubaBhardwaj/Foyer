import { Schema, model, Types, Document } from "mongoose";

/**
 * Community Post Visibility Enum.
 */
export enum PostVisibility {
  ALL = "ALL",
  RESIDENTS = "RESIDENTS",
  ADMINS = "ADMINS",
}

/**
 * Community Post Status Enum.
 */
export enum PostStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

/**
 * Community Post Document TypeScript Interface.
 */
export interface ICommunityPost extends Document {
  society: Types.ObjectId;
  author: Types.ObjectId;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  visibility: PostVisibility;
  status: PostStatus;
  commentsCount: number;
  reactionsCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const communityPostSchema = new Schema<ICommunityPost>(
  {
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

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    visibility: {
      type: String,
      enum: Object.values(PostVisibility),
      default: PostVisibility.ALL,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(PostStatus),
      default: PostStatus.ACTIVE,
      required: true,
      index: true,
    },

    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
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
communityPostSchema.index({ society: 1, status: 1, createdAt: -1 });
communityPostSchema.index({ author: 1, createdAt: -1 });

export default model<ICommunityPost>("CommunityPost", communityPostSchema);
