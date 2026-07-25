import { Types } from "mongoose";
import CommunityReactionModel, {
  ICommunityReaction,
  ReactionType,
} from "../models/community-reaction.model";
import CommunityPostModel from "../models/community-post.model";
import CommunityCommentModel from "../models/community-comment.model";
import { IUser } from "../models/User";
import ApiError from "../utils/apiError";
import { validateObjectId } from "../utils/validation";
import {
  AddReactionInput,
  RemoveReactionInput,
} from "../validators/community-reaction.validator";

/**
 * CommunityReactionService — Business logic layer for Post and Comment Reactions.
 */
class CommunityReactionService {
  /**
   * Add or update a reaction on a post or comment.
   */
  async addReaction(
    user: IUser,
    data: AddReactionInput
  ): Promise<ICommunityReaction> {
    if (!user.society) {
      throw ApiError.forbidden("User account is not linked to any society.");
    }

    const reactionType = data.type || ReactionType.LIKE;

    if (data.postId) {
      validateObjectId(data.postId, "Post ID");
      const post = await CommunityPostModel.findOne({
        _id: data.postId,
        society: user.society,
        isDeleted: { $ne: true },
      });

      if (!post) {
        throw ApiError.notFound("Community post not found.");
      }

      const existing = await CommunityReactionModel.findOne({
        post: post._id,
        user: user._id,
      });

      if (existing) {
        existing.type = reactionType;
        await existing.save();
        return existing;
      }

      const reaction = await CommunityReactionModel.create({
        post: post._id,
        society: user.society,
        user: user._id,
        type: reactionType,
      });

      post.reactionsCount += 1;
      await post.save();

      return reaction;
    }

    if (data.commentId) {
      validateObjectId(data.commentId, "Comment ID");
      const comment = await CommunityCommentModel.findOne({
        _id: data.commentId,
        society: user.society,
        isDeleted: { $ne: true },
      });

      if (!comment) {
        throw ApiError.notFound("Community comment not found.");
      }

      const existing = await CommunityReactionModel.findOne({
        comment: comment._id,
        user: user._id,
      });

      if (existing) {
        existing.type = reactionType;
        await existing.save();
        return existing;
      }

      const reaction = await CommunityReactionModel.create({
        comment: comment._id,
        society: user.society,
        user: user._id,
        type: reactionType,
      });

      comment.reactionsCount += 1;
      await comment.save();

      return reaction;
    }

    throw ApiError.badRequest("Either postId or commentId must be provided.");
  }

  /**
   * Remove a reaction from a post or comment.
   */
  async removeReaction(
    user: IUser,
    data: RemoveReactionInput
  ): Promise<boolean> {
    if (!user.society) {
      throw ApiError.forbidden("User account is not linked to any society.");
    }

    if (data.postId) {
      validateObjectId(data.postId, "Post ID");

      const reaction = await CommunityReactionModel.findOneAndDelete({
        post: data.postId,
        society: user.society,
        user: user._id,
      });

      if (reaction) {
        await CommunityPostModel.findByIdAndUpdate(data.postId, {
          $inc: { reactionsCount: -1 },
        });
        return true;
      }
      return false;
    }

    if (data.commentId) {
      validateObjectId(data.commentId, "Comment ID");

      const reaction = await CommunityReactionModel.findOneAndDelete({
        comment: data.commentId,
        society: user.society,
        user: user._id,
      });

      if (reaction) {
        await CommunityCommentModel.findByIdAndUpdate(data.commentId, {
          $inc: { reactionsCount: -1 },
        });
        return true;
      }
      return false;
    }

    throw ApiError.badRequest("Either postId or commentId must be provided.");
  }
}

export default new CommunityReactionService();
