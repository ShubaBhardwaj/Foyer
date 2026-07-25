import mongoose, { Types } from "mongoose";
import NoticeModel, {
  INotice,
  NoticeStatus,
  NoticeVisibility,
} from "../models/notice.model";
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
  CreateNoticeInput,
  UpdateNoticeInput,
  ListNoticesInput,
} from "../validators/notice.validator";

/**
 * NoticeService — Single source of truth for business logic in Society Notices Management.
 */
class NoticeService {
  /**
   * Create a new notice (DRAFT or PUBLISHED).
   */
  async createNotice(
    creator: IUser,
    data: CreateNoticeInput
  ): Promise<INotice> {
    if (!creator.society) {
      throw ApiError.forbidden("User account is not linked to any society.");
    }

    const initialStatus = data.publishNow
      ? NoticeStatus.PUBLISHED
      : NoticeStatus.DRAFT;

    const publishDate = data.publishAt ? new Date(data.publishAt) : new Date();
    const expiryDate = data.expiresAt ? new Date(data.expiresAt) : null;

    const notice = await NoticeModel.create({
      society: creator.society,
      title: data.title,
      content: data.content,
      category: data.category,
      priority: data.priority,
      visibility: data.visibility,
      status: initialStatus,
      attachments: data.attachments || [],
      publishAt: publishDate,
      expiresAt: expiryDate,
      publishedBy: creator._id,
      isPinned: data.isPinned || false,
      isDeleted: false,
    });

    await this.safeAuditLog({
      actor: creator._id,
      actorRole: creator.roles[0] || "admin",
      society: creator.society,
      action: AuditAction.NOTICE_PUBLISHED,
      resourceType: AuditResourceType.NOTICE,
      resourceId: notice._id,
      after: notice.toObject(),
    });

    if (initialStatus === NoticeStatus.PUBLISHED) {
      await this.publishNoticeEvents(creator, notice);
    }

    return notice;
  }

  /**
   * Get notice details by ID enforcing society isolation and role visibility.
   */
  async getNoticeById(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<INotice> {
    validateObjectId(id, "Notice ID");

    const notice = await NoticeModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    }).populate("publishedBy", "name email roles");

    if (!notice) {
      throw ApiError.notFound("Notice not found.");
    }

    const isResident = user.roles.includes(Role.RESIDENT);
    const isGuard = user.roles.includes(Role.GUARD);
    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    // Residents & Guards only see PUBLISHED notices matching their visibility
    if (!isAdmin) {
      if (notice.status !== NoticeStatus.PUBLISHED) {
        throw ApiError.notFound("Notice not found.");
      }

      if (
        isResident &&
        notice.visibility !== NoticeVisibility.ALL &&
        notice.visibility !== NoticeVisibility.RESIDENTS
      ) {
        throw ApiError.forbidden("You do not have permission to view this notice.");
      }

      if (
        isGuard &&
        notice.visibility !== NoticeVisibility.ALL &&
        notice.visibility !== NoticeVisibility.GUARDS
      ) {
        throw ApiError.forbidden("You do not have permission to view this notice.");
      }
    }

    return notice;
  }

  /**
   * List notices with search, filtering, and role visibility rules.
   */
  async listNotices(
    societyId: Types.ObjectId,
    user: IUser,
    input: ListNoticesInput
  ): Promise<SearchResult<INotice>> {
    const filter: Record<string, any> = {
      society: societyId,
      isDeleted: { $ne: true },
    };

    const isResident = user.roles.includes(Role.RESIDENT);
    const isGuard = user.roles.includes(Role.GUARD);
    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (!isAdmin) {
      filter.status = NoticeStatus.PUBLISHED;

      if (isResident) {
        filter.visibility = {
          $in: [NoticeVisibility.ALL, NoticeVisibility.RESIDENTS],
        };
      } else if (isGuard) {
        filter.visibility = {
          $in: [NoticeVisibility.ALL, NoticeVisibility.GUARDS],
        };
      }
    } else if (input.status) {
      filter.status = input.status;
    }

    if (input.category) filter.category = input.category;
    if (input.priority) filter.priority = input.priority;
    if (isAdmin && input.visibility) filter.visibility = input.visibility;

    if (input.publishedBy) {
      validateObjectId(input.publishedBy, "PublishedBy User ID");
      filter.publishedBy = new Types.ObjectId(input.publishedBy);
    }

    if (input.startDate || input.endDate) {
      filter.publishAt = {};
      if (input.startDate) filter.publishAt.$gte = new Date(input.startDate);
      if (input.endDate) filter.publishAt.$lte = new Date(input.endDate);
    }

    return searchService.search<INotice>(NoticeModel as any, {
      searchKeyword: input.searchKeyword,
      searchFields: ["title", "content"],
      filter,
      sort: input.sort || "-isPinned,-publishAt",
      page: input.page ? Number(input.page) : undefined,
      limit: input.limit ? Number(input.limit) : undefined,
      populate: [{ path: "publishedBy", select: "name email" }],
    });
  }

  /**
   * Update notice details.
   */
  async updateNotice(
    societyId: Types.ObjectId,
    user: IUser,
    id: string,
    data: UpdateNoticeInput
  ): Promise<INotice> {
    validateObjectId(id, "Notice ID");

    const notice = await NoticeModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!notice) {
      throw ApiError.notFound("Notice not found.");
    }

    const beforeState = notice.toObject();

    if (data.title !== undefined) notice.title = data.title;
    if (data.content !== undefined) notice.content = data.content;
    if (data.category !== undefined) notice.category = data.category;
    if (data.priority !== undefined) notice.priority = data.priority;
    if (data.visibility !== undefined) notice.visibility = data.visibility;
    if (data.attachments !== undefined) notice.attachments = data.attachments;
    if (data.publishAt !== undefined) notice.publishAt = new Date(data.publishAt);
    if (data.expiresAt !== undefined) {
      notice.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
    }
    if (data.isPinned !== undefined) notice.isPinned = data.isPinned;

    await notice.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "admin",
      society: societyId,
      action: AuditAction.NOTICE_UPDATED,
      resourceType: AuditResourceType.NOTICE,
      resourceId: notice._id,
      before: beforeState,
      after: notice.toObject(),
    });

    return notice;
  }

  /**
   * Publish a DRAFT or ARCHIVED notice.
   */
  async publishNotice(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<INotice> {
    validateObjectId(id, "Notice ID");

    const notice = await NoticeModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!notice) {
      throw ApiError.notFound("Notice not found.");
    }

    const beforeState = notice.toObject();

    notice.status = NoticeStatus.PUBLISHED;
    notice.publishAt = new Date();
    notice.publishedBy = user._id;

    await notice.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "admin",
      society: societyId,
      action: AuditAction.NOTICE_PUBLISHED,
      resourceType: AuditResourceType.NOTICE,
      resourceId: notice._id,
      before: beforeState,
      after: notice.toObject(),
    });

    await this.publishNoticeEvents(user, notice);

    return notice;
  }

  /**
   * Archive a published notice.
   */
  async archiveNotice(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<INotice> {
    validateObjectId(id, "Notice ID");

    const notice = await NoticeModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!notice) {
      throw ApiError.notFound("Notice not found.");
    }

    const beforeState = notice.toObject();

    notice.status = NoticeStatus.ARCHIVED;
    notice.isPinned = false;

    await notice.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "admin",
      society: societyId,
      action: AuditAction.NOTICE_UPDATED,
      resourceType: AuditResourceType.NOTICE,
      resourceId: notice._id,
      before: beforeState,
      after: notice.toObject(),
    });

    return notice;
  }

  /**
   * Pin a notice to top of society board.
   */
  async pinNotice(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<INotice> {
    validateObjectId(id, "Notice ID");

    const notice = await NoticeModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!notice) {
      throw ApiError.notFound("Notice not found.");
    }

    notice.isPinned = true;
    await notice.save();
    return notice;
  }

  /**
   * Unpin a notice.
   */
  async unpinNotice(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<INotice> {
    validateObjectId(id, "Notice ID");

    const notice = await NoticeModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!notice) {
      throw ApiError.notFound("Notice not found.");
    }

    notice.isPinned = false;
    await notice.save();
    return notice;
  }

  /**
   * Soft-delete a notice.
   */
  async deleteNotice(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<INotice> {
    validateObjectId(id, "Notice ID");

    const notice = await NoticeModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!notice) {
      throw ApiError.notFound("Notice not found.");
    }

    const beforeState = notice.toObject();

    notice.isDeleted = true;
    await notice.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "admin",
      society: societyId,
      action: AuditAction.NOTICE_DELETED,
      resourceType: AuditResourceType.NOTICE,
      resourceId: notice._id,
      before: beforeState,
      after: notice.toObject(),
    });

    return notice;
  }

  private async publishNoticeEvents(user: IUser, notice: INotice): Promise<void> {
    await this.safeActivityPublish({
      society: notice.society,
      actor: user._id,
      actorName: user.name || user.email || "Admin",
      actorRole: user.roles[0] || "admin",
      activityType: ActivityType.NOTICE_POSTED,
      resourceType: "Notice",
      resourceId: notice._id,
      message: `Notice posted: "${notice.title}".`,
      metadata: {
        title: notice.title,
        category: notice.category,
        priority: notice.priority,
      },
      visibility: ActivityVisibility.ALL,
    });

    await notificationService.sendNotification({
      title: `Notice: ${notice.title}`,
      body: notice.content.substring(0, 100),
      userIds: [], // broadcasts to society audience
    });
  }

  private async safeAuditLog(
    input: Parameters<typeof auditService.log>[0]
  ): Promise<void> {
    try {
      await auditService.log(input);
    } catch (err) {
      console.warn("[NoticeService] Non-critical audit warning:", err);
    }
  }

  private async safeActivityPublish(
    input: Parameters<typeof activityService.publish>[0]
  ): Promise<void> {
    try {
      await activityService.publish(input);
    } catch (err) {
      console.warn("[NoticeService] Non-critical activity warning:", err);
    }
  }
}

export default new NoticeService();
