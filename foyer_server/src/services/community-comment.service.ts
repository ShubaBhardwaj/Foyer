import { Types } from "mongoose";
import CommunityCommentModel, {
  ICommunityComment,
} from "../models/community-comment.model";
import CommunityPostModel from "../models/community-post.model";
import { Role, IUser } from "../models/User";
import ApiError from "../utils/apiError";
import auditService from "./audit.service";
import { AuditAction, AuditResourceType } from "../models/audit.model";
import activityService from "./activity.service";
import { ActivityType, ActivityVisibility } from "../models/activity.model";
import notificationService from "./notification.service";
import { validateObjectId } from "../utils/validation";
import {
  CreateCommentInput,
  UpdateCommentInput,
} from "../validators/community-comment.validator";

/**
 * CommunityCommentService — Business logic layer for Community Comments and Threaded Replies.
 */
class CommunityCommentService {
  /**
   * Create a new comment or threaded reply.
   */
  async createComment(
    author: IUser,
    data: CreateCommentInput
  ): Promise<ICommunityComment> {
    if (!author.society) {
      throw ApiError.forbidden("User account is not linked to any society.");
    }

    validateObjectId(data.postId, "Post ID");

    const post = await CommunityPostModel.findOne({
      _id: data.postId,
      society: author.society,
      isDeleted: { $ne: true },
    });

    if (!post) {
      throw ApiError.notFound("Community post not found.");
    }

    let parentComment: ICommunityComment | null = null;
    if (data.parentCommentId) {
      validateObjectId(data.parentCommentId, "Parent Comment ID");
      parentComment = await CommunityCommentModel.findOne({
        _id: data.parentCommentId,
        post: post._id,
        isDeleted: { $ne: true },
      });

      if (!parentComment) {
        throw ApiError.notFound("Parent comment not found.");
      }
    }

    const comment = await CommunityCommentModel.create({
      post: post._id,
      society: author.society,
      author: author._id,
      content: data.content,
      parentComment: parentComment ? parentComment._id : null,
      reactionsCount: 0,
      isDeleted: false,
    });

    // Increment commentsCount on target post
    post.commentsCount += 1;
    await post.save();

    await this.safeAuditLog({
      actor: author._id,
      actorRole: author.roles[0] || "resident",
      society: author.society,
      action: AuditAction.COMMENT_CREATED,
      resourceType: AuditResourceType.COMMUNITY_COMMENT,
      resourceId: comment._id,
      after: comment.toObject(),
    });

    await this.safeActivityPublish({
      society: author.society,
      actor: author._id,
      actorName: author.name || author.email || "Resident",
      actorRole: author.roles[0] || "resident",
      activityType: ActivityType.COMMENT_ADDED,
      resourceType: "CommunityComment",
      resourceId: comment._id,
      message: `${author.name || "Resident"} commented on "${post.title}".`,
      metadata: {
        postId: post._id,
        postTitle: post.title,
      },
      visibility: ActivityVisibility.ALL,
    });

    // Notify post author
    if (post.author.toString() !== author._id.toString()) {
      await notificationService.sendNotification({
        title: "New Comment on Your Post",
        body: `${author.name || "A resident"} commented on "${post.title}".`,
        userIds: [post.author.toString()],
      });
    }

    return comment;
  }

  /**
   * List all comments for a post in chronological order.
   */
  async listCommentsByPost(
    societyId: Types.ObjectId,
    postId: string
  ): Promise<ICommunityComment[]> {
    validateObjectId(postId, "Post ID");

    return CommunityCommentModel.find({
      post: postId,
      society: societyId,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: 1 })
      .populate("author", "name email phone roles");
  }

  /**
   * Update comment content.
   */
  async updateComment(
    societyId: Types.ObjectId,
    user: IUser,
    id: string,
    data: UpdateCommentInput
  ): Promise<ICommunityComment> {
    validateObjectId(id, "Comment ID");

    const comment = await CommunityCommentModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!comment) {
      throw ApiError.notFound("Comment not found.");
    }

    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (!isAdmin && comment.author.toString() !== user._id.toString()) {
      throw ApiError.forbidden("You do not have permission to edit this comment.");
    }

    comment.content = data.content;
    await comment.save();
    return comment;
  }

  /**
   * Soft-delete comment and decrement post comments count.
   */
  async deleteComment(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<ICommunityComment> {
    validateObjectId(id, "Comment ID");

    const comment = await CommunityCommentModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!comment) {
      throw ApiError.notFound("Comment not found.");
    }

    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (!isAdmin && comment.author.toString() !== user._id.toString()) {
      throw ApiError.forbidden("You do not have permission to delete this comment.");
    }

    const beforeState = comment.toObject();

    comment.isDeleted = true;
    await comment.save();

    // Decrement comments count on post
    await CommunityPostModel.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 },
    });

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "user",
      society: societyId,
      action: AuditAction.COMMENT_DELETED,
      resourceType: AuditResourceType.COMMUNITY_COMMENT,
      resourceId: comment._id,
      before: beforeState,
      after: comment.toObject(),
    });

    return comment;
  }

  private async safeAuditLog(
    input: Parameters<typeof auditService.log>[0]
  ): Promise<void> {
    try {
      await auditService.log(input);
    } catch (err) {
      console.warn("[CommunityCommentService] Non-critical audit warning:", err);
    }
  }

  private async safeActivityPublish(
    input: Parameters<typeof activityService.publish>[0]
  ): Promise<void> {
    try {
      await activityService.publish(input);
    } catch (err) {
      console.warn("[CommunityCommentService] Non-critical activity warning:", err);
    }
  }
}

export default new CommunityCommentService();
