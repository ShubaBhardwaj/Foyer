import { Types } from "mongoose";
import CommunityPostModel, {
  ICommunityPost,
  PostStatus,
  PostVisibility,
} from "../models/community-post.model";
import { Role, IUser } from "../models/User";
import ApiError from "../utils/apiError";
import auditService from "./audit.service";
import { AuditAction, AuditResourceType } from "../models/audit.model";
import activityService from "./activity.service";
import { ActivityType, ActivityVisibility } from "../models/activity.model";
import notificationService from "./notification.service";
import searchService from "./search.service";
import { validateObjectId } from "../utils/validation";
import { SearchResult } from "../types/search.types";
import {
  CreatePostInput,
  UpdatePostInput,
  ListPostsInput,
} from "../validators/community-post.validator";

/**
 * CommunityPostService — Business logic layer for Community Posts.
 */
class CommunityPostService {
  /**
   * Create a new community post.
   */
  async createPost(
    author: IUser,
    data: CreatePostInput
  ): Promise<ICommunityPost> {
    if (!author.society) {
      throw ApiError.forbidden("User account is not linked to any society.");
    }

    const post = await CommunityPostModel.create({
      society: author.society,
      author: author._id,
      title: data.title,
      content: data.content,
      images: data.images || [],
      tags: data.tags || [],
      visibility: data.visibility || PostVisibility.ALL,
      status: PostStatus.ACTIVE,
      commentsCount: 0,
      reactionsCount: 0,
      isDeleted: false,
    });

    await this.safeAuditLog({
      actor: author._id,
      actorRole: author.roles[0] || "resident",
      society: author.society,
      action: AuditAction.POST_CREATED,
      resourceType: AuditResourceType.COMMUNITY_POST,
      resourceId: post._id,
      after: post.toObject(),
    });

    await this.safeActivityPublish({
      society: author.society,
      actor: author._id,
      actorName: author.name || author.email || "Resident",
      actorRole: author.roles[0] || "resident",
      activityType: ActivityType.POST_CREATED,
      resourceType: "CommunityPost",
      resourceId: post._id,
      message: `${author.name || "Resident"} posted in Community: "${post.title}".`,
      metadata: {
        title: post.title,
        tags: post.tags,
      },
      visibility: ActivityVisibility.ALL,
    });

    await notificationService.sendNotification({
      title: `Community Post: ${post.title}`,
      body: post.content.substring(0, 100),
      userIds: [],
    });

    return post;
  }

  /**
   * Get single post by ID enforcing tenant isolation and visibility.
   */
  async getPostById(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<ICommunityPost> {
    validateObjectId(id, "Post ID");

    const post = await CommunityPostModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    }).populate("author", "name email phone roles");

    if (!post) {
      throw ApiError.notFound("Community post not found.");
    }

    const isResident = user.roles.includes(Role.RESIDENT);
    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (!isAdmin) {
      if (post.status !== PostStatus.ACTIVE) {
        throw ApiError.notFound("Community post not found.");
      }

      if (
        isResident &&
        post.visibility !== PostVisibility.ALL &&
        post.visibility !== PostVisibility.RESIDENTS
      ) {
        throw ApiError.forbidden("You do not have permission to view this post.");
      }
    }

    return post;
  }

  /**
   * List community posts with search, filtering, and role visibility rules.
   */
  async listPosts(
    societyId: Types.ObjectId,
    user: IUser,
    input: ListPostsInput
  ): Promise<SearchResult<ICommunityPost>> {
    const filter: Record<string, any> = {
      society: societyId,
      isDeleted: { $ne: true },
    };

    const isResident = user.roles.includes(Role.RESIDENT);
    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (!isAdmin) {
      filter.status = PostStatus.ACTIVE;
      if (isResident) {
        filter.visibility = {
          $in: [PostVisibility.ALL, PostVisibility.RESIDENTS],
        };
      }
    } else if (input.status) {
      filter.status = input.status;
    }

    if (input.authorId) {
      validateObjectId(input.authorId, "Author User ID");
      filter.author = new Types.ObjectId(input.authorId);
    }

    if (input.tag) filter.tags = input.tag;
    if (isAdmin && input.visibility) filter.visibility = input.visibility;

    return searchService.search<ICommunityPost>(CommunityPostModel as any, {
      searchKeyword: input.searchKeyword,
      searchFields: ["title", "content", "tags"],
      filter,
      sort: input.sort || "-createdAt",
      page: input.page ? Number(input.page) : undefined,
      limit: input.limit ? Number(input.limit) : undefined,
      populate: [{ path: "author", select: "name email" }],
    });
  }

  /**
   * Update post content.
   */
  async updatePost(
    societyId: Types.ObjectId,
    user: IUser,
    id: string,
    data: UpdatePostInput
  ): Promise<ICommunityPost> {
    validateObjectId(id, "Post ID");

    const post = await CommunityPostModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!post) {
      throw ApiError.notFound("Community post not found.");
    }

    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (!isAdmin && post.author.toString() !== user._id.toString()) {
      throw ApiError.forbidden("You do not have permission to edit this post.");
    }

    const beforeState = post.toObject();

    if (data.title !== undefined) post.title = data.title;
    if (data.content !== undefined) post.content = data.content;
    if (data.images !== undefined) post.images = data.images;
    if (data.tags !== undefined) post.tags = data.tags;
    if (data.visibility !== undefined) post.visibility = data.visibility;

    await post.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "user",
      society: societyId,
      action: AuditAction.POST_UPDATED,
      resourceType: AuditResourceType.COMMUNITY_POST,
      resourceId: post._id,
      before: beforeState,
      after: post.toObject(),
    });

    return post;
  }

  /**
   * Archive post (moderation action).
   */
  async archivePost(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<ICommunityPost> {
    validateObjectId(id, "Post ID");

    const post = await CommunityPostModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!post) {
      throw ApiError.notFound("Community post not found.");
    }

    const beforeState = post.toObject();
    post.status = PostStatus.ARCHIVED;
    await post.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "admin",
      society: societyId,
      action: AuditAction.POST_ARCHIVED,
      resourceType: AuditResourceType.COMMUNITY_POST,
      resourceId: post._id,
      before: beforeState,
      after: post.toObject(),
    });

    return post;
  }

  /**
   * Soft-delete post.
   */
  async deletePost(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<ICommunityPost> {
    validateObjectId(id, "Post ID");

    const post = await CommunityPostModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!post) {
      throw ApiError.notFound("Community post not found.");
    }

    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (!isAdmin && post.author.toString() !== user._id.toString()) {
      throw ApiError.forbidden("You do not have permission to delete this post.");
    }

    const beforeState = post.toObject();
    post.isDeleted = true;
    await post.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "user",
      society: societyId,
      action: AuditAction.POST_DELETED,
      resourceType: AuditResourceType.COMMUNITY_POST,
      resourceId: post._id,
      before: beforeState,
      after: post.toObject(),
    });

    return post;
  }

  private async safeAuditLog(
    input: Parameters<typeof auditService.log>[0]
  ): Promise<void> {
    try {
      await auditService.log(input);
    } catch (err) {
      console.warn("[CommunityPostService] Non-critical audit warning:", err);
    }
  }

  private async safeActivityPublish(
    input: Parameters<typeof activityService.publish>[0]
  ): Promise<void> {
    try {
      await activityService.publish(input);
    } catch (err) {
      console.warn("[CommunityPostService] Non-critical activity warning:", err);
    }
  }
}

export default new CommunityPostService();
