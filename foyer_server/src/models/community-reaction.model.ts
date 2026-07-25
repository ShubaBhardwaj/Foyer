import { Schema, model, Types, Document } from "mongoose";

/**
 * Reaction Type Enum.
 */
export enum ReactionType {
  LIKE = "LIKE",
  LOVE = "LOVE",
  CELEBRATE = "CELEBRATE",
  HELPFUL = "HELPFUL",
}

/**
 * Community Reaction Document TypeScript Interface.
 */
export interface ICommunityReaction extends Document {
  post?: Types.ObjectId | null;
  comment?: Types.ObjectId | null;
  society: Types.ObjectId;
  user: Types.ObjectId;
  type: ReactionType;
  createdAt: Date;
  updatedAt: Date;
}

const communityReactionSchema = new Schema<ICommunityReaction>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "CommunityPost",
      default: null,
      index: true,
    },

    comment: {
      type: Schema.Types.ObjectId,
      ref: "CommunityComment",
      default: null,
      index: true,
    },

    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(ReactionType),
      default: ReactionType.LIKE,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexes for uniqueness per user per post/comment
communityReactionSchema.index(
  { post: 1, user: 1 },
  { unique: true, partialFilterExpression: { post: { $type: "objectId" } } }
);

communityReactionSchema.index(
  { comment: 1, user: 1 },
  { unique: true, partialFilterExpression: { comment: { $type: "objectId" } } }
);

export default model<ICommunityReaction>("CommunityReaction", communityReactionSchema);
