import mongoose, { Types } from "mongoose";
import ComplaintModel, {
  IComplaint,
  ComplaintStatus,
} from "../models/complaint.model";
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
  CreateComplaintInput,
  UpdateComplaintInput,
  AssignComplaintInput,
  ResolveComplaintInput,
  CloseComplaintInput,
  ListComplaintsInput,
} from "../validators/complaint.validator";

/**
 * ComplaintService — Single source of truth for business logic in Complaints Management.
 */
class ComplaintService {
  /**
   * Create a new complaint request.
   */
  async createComplaint(
    creator: IUser,
    data: CreateComplaintInput
  ): Promise<IComplaint> {
    if (!creator.society) {
      throw ApiError.forbidden("User account is not linked to any society.");
    }

    const complaint = await ComplaintModel.create({
      society: creator.society,
      createdBy: creator._id,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: ComplaintStatus.OPEN,
      attachments: data.attachments || [],
      location: data.location,
      isDeleted: false,
    });

    await this.safeAuditLog({
      actor: creator._id,
      actorRole: creator.roles[0] || "resident",
      society: creator.society,
      action: AuditAction.COMPLAINT_CREATED,
      resourceType: AuditResourceType.COMPLAINT,
      resourceId: complaint._id,
      after: complaint.toObject(),
    });

    await this.safeActivityPublish({
      society: creator.society,
      actor: creator._id,
      actorName: creator.name || creator.email || "Resident",
      actorRole: creator.roles[0] || "resident",
      activityType: ActivityType.COMPLAINT_CREATED,
      resourceType: "Complaint",
      resourceId: complaint._id,
      message: `${creator.name || "Resident"} created a new complaint: "${complaint.title}".`,
      metadata: {
        title: complaint.title,
        category: complaint.category,
        priority: complaint.priority,
        status: complaint.status,
      },
      visibility: ActivityVisibility.ALL,
    });

    await notificationService.sendNotification({
      title: "New Complaint Submitted",
      body: `Complaint "${complaint.title}" has been registered.`,
      userIds: [creator._id.toString()],
    });

    return complaint;
  }

  /**
   * Get complaint by ID with society tenant isolation.
   */
  async getComplaintById(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<IComplaint> {
    validateObjectId(id, "Complaint ID");

    const complaint = await ComplaintModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    })
      .populate("createdBy", "name email phone roles")
      .populate("assignedTo", "name email phone roles");

    if (!complaint) {
      throw ApiError.notFound("Complaint not found.");
    }

    // Role-based visibility check
    const isResident = user.roles.includes(Role.RESIDENT);
    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (isResident && !isAdmin && complaint.createdBy._id.toString() !== user._id.toString()) {
      throw ApiError.forbidden("You do not have permission to view this complaint.");
    }

    return complaint;
  }

  /**
   * List complaints with filtering, search, and pagination.
   */
  async listComplaints(
    societyId: Types.ObjectId,
    user: IUser,
    input: ListComplaintsInput
  ): Promise<SearchResult<IComplaint>> {
    const filter: Record<string, any> = {
      society: societyId,
      isDeleted: { $ne: true },
    };

    const isResident = user.roles.includes(Role.RESIDENT);
    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    // Residents only see their own complaints
    if (isResident && !isAdmin) {
      filter.createdBy = user._id;
    } else if (input.createdBy) {
      validateObjectId(input.createdBy, "CreatedBy User ID");
      filter.createdBy = new Types.ObjectId(input.createdBy);
    }

    if (input.status) filter.status = input.status;
    if (input.category) filter.category = input.category;
    if (input.priority) filter.priority = input.priority;

    if (input.assignedTo) {
      validateObjectId(input.assignedTo, "AssignedTo User ID");
      filter.assignedTo = new Types.ObjectId(input.assignedTo);
    }

    if (input.startDate || input.endDate) {
      filter.createdAt = {};
      if (input.startDate) filter.createdAt.$gte = new Date(input.startDate);
      if (input.endDate) filter.createdAt.$lte = new Date(input.endDate);
    }

    return searchService.search<IComplaint>(ComplaintModel as any, {
      searchKeyword: input.searchKeyword,
      searchFields: ["title", "description", "location"],
      filter,
      sort: input.sort || "-createdAt",
      page: input.page ? Number(input.page) : undefined,
      limit: input.limit ? Number(input.limit) : undefined,
      populate: [
        { path: "createdBy", select: "name email phone" },
        { path: "assignedTo", select: "name email phone" },
      ],
    });
  }

  /**
   * Update complaint details.
   */
  async updateComplaint(
    societyId: Types.ObjectId,
    user: IUser,
    id: string,
    data: UpdateComplaintInput
  ): Promise<IComplaint> {
    validateObjectId(id, "Complaint ID");

    const complaint = await ComplaintModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!complaint) {
      throw ApiError.notFound("Complaint not found.");
    }

    if (
      complaint.status === ComplaintStatus.RESOLVED ||
      complaint.status === ComplaintStatus.CLOSED
    ) {
      throw ApiError.badRequest(
        `Cannot update complaint in status "${complaint.status}".`
      );
    }

    const isResident = user.roles.includes(Role.RESIDENT);
    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (isResident && !isAdmin && complaint.createdBy.toString() !== user._id.toString()) {
      throw ApiError.forbidden("You do not have permission to update this complaint.");
    }

    const beforeState = complaint.toObject();

    if (data.title !== undefined) complaint.title = data.title;
    if (data.description !== undefined) complaint.description = data.description;
    if (data.category !== undefined) complaint.category = data.category;
    if (data.priority !== undefined) complaint.priority = data.priority;
    if (data.attachments !== undefined) complaint.attachments = data.attachments;
    if (data.location !== undefined) complaint.location = data.location;

    await complaint.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "user",
      society: societyId,
      action: AuditAction.COMPLAINT_UPDATED,
      resourceType: AuditResourceType.COMPLAINT,
      resourceId: complaint._id,
      before: beforeState,
      after: complaint.toObject(),
    });

    return complaint;
  }

  /**
   * Assign a complaint to a staff member or admin.
   */
  async assignComplaint(
    societyId: Types.ObjectId,
    adminUser: IUser,
    id: string,
    data: AssignComplaintInput
  ): Promise<IComplaint> {
    validateObjectId(id, "Complaint ID");
    validateObjectId(data.assignedTo, "AssignedTo User ID");

    const complaint = await ComplaintModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!complaint) {
      throw ApiError.notFound("Complaint not found.");
    }

    const beforeState = complaint.toObject();

    complaint.assignedTo = new Types.ObjectId(data.assignedTo);
    if (complaint.status === ComplaintStatus.OPEN) {
      complaint.status = ComplaintStatus.ASSIGNED;
    }

    await complaint.save();

    await this.safeAuditLog({
      actor: adminUser._id,
      actorRole: adminUser.roles[0] || "admin",
      society: societyId,
      action: AuditAction.COMPLAINT_ASSIGNED,
      resourceType: AuditResourceType.COMPLAINT,
      resourceId: complaint._id,
      before: beforeState,
      after: complaint.toObject(),
    });

    await notificationService.sendNotification({
      title: "Complaint Assigned",
      body: `Complaint "${complaint.title}" has been assigned to you.`,
      userIds: [data.assignedTo],
    });

    return complaint;
  }

  /**
   * Start working on an assigned complaint (IN_PROGRESS).
   */
  async startComplaint(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<IComplaint> {
    validateObjectId(id, "Complaint ID");

    const complaint = await ComplaintModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!complaint) {
      throw ApiError.notFound("Complaint not found.");
    }

    const beforeState = complaint.toObject();
    complaint.status = ComplaintStatus.IN_PROGRESS;
    await complaint.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "user",
      society: societyId,
      action: AuditAction.COMPLAINT_UPDATED,
      resourceType: AuditResourceType.COMPLAINT,
      resourceId: complaint._id,
      before: beforeState,
      after: complaint.toObject(),
    });

    return complaint;
  }

  /**
   * Resolve a complaint.
   */
  async resolveComplaint(
    societyId: Types.ObjectId,
    user: IUser,
    id: string,
    data: ResolveComplaintInput
  ): Promise<IComplaint> {
    validateObjectId(id, "Complaint ID");

    const complaint = await ComplaintModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!complaint) {
      throw ApiError.notFound("Complaint not found.");
    }

    const beforeState = complaint.toObject();

    complaint.status = ComplaintStatus.RESOLVED;
    complaint.resolvedAt = new Date();
    if (data.resolutionNotes) {
      complaint.resolutionNotes = data.resolutionNotes;
    }

    await complaint.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "user",
      society: societyId,
      action: AuditAction.COMPLAINT_RESOLVED,
      resourceType: AuditResourceType.COMPLAINT,
      resourceId: complaint._id,
      before: beforeState,
      after: complaint.toObject(),
    });

    await this.safeActivityPublish({
      society: societyId,
      actor: user._id,
      actorName: user.name || user.email || "Staff",
      actorRole: user.roles[0] || "admin",
      activityType: ActivityType.COMPLAINT_CREATED,
      resourceType: "Complaint",
      resourceId: complaint._id,
      message: `Complaint "${complaint.title}" was resolved by ${user.name || "Staff"}.`,
      metadata: {
        title: complaint.title,
        status: complaint.status,
      },
      visibility: ActivityVisibility.ALL,
    });

    await notificationService.sendNotification({
      title: "Complaint Resolved",
      body: `Your complaint "${complaint.title}" has been resolved.`,
      userIds: [complaint.createdBy.toString()],
    });

    return complaint;
  }

  /**
   * Close a resolved complaint.
   */
  async closeComplaint(
    societyId: Types.ObjectId,
    user: IUser,
    id: string,
    data: CloseComplaintInput
  ): Promise<IComplaint> {
    validateObjectId(id, "Complaint ID");

    const complaint = await ComplaintModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!complaint) {
      throw ApiError.notFound("Complaint not found.");
    }

    const beforeState = complaint.toObject();

    complaint.status = ComplaintStatus.CLOSED;
    if (data.feedbackRemark) {
      complaint.resolutionNotes = complaint.resolutionNotes
        ? `${complaint.resolutionNotes} | Feedback: ${data.feedbackRemark}`
        : `Feedback: ${data.feedbackRemark}`;
    }

    await complaint.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "user",
      society: societyId,
      action: AuditAction.COMPLAINT_UPDATED,
      resourceType: AuditResourceType.COMPLAINT,
      resourceId: complaint._id,
      before: beforeState,
      after: complaint.toObject(),
    });

    return complaint;
  }

  /**
   * Soft-delete a complaint.
   */
  async deleteComplaint(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<IComplaint> {
    validateObjectId(id, "Complaint ID");

    const complaint = await ComplaintModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!complaint) {
      throw ApiError.notFound("Complaint not found.");
    }

    const beforeState = complaint.toObject();

    complaint.isDeleted = true;
    await complaint.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "user",
      society: societyId,
      action: AuditAction.COMPLAINT_UPDATED,
      resourceType: AuditResourceType.COMPLAINT,
      resourceId: complaint._id,
      before: beforeState,
      after: complaint.toObject(),
    });

    return complaint;
  }

  private async safeAuditLog(
    input: Parameters<typeof auditService.log>[0]
  ): Promise<void> {
    try {
      await auditService.log(input);
    } catch (err) {
      console.warn("[ComplaintService] Non-critical audit warning:", err);
    }
  }

  private async safeActivityPublish(
    input: Parameters<typeof activityService.publish>[0]
  ): Promise<void> {
    try {
      await activityService.publish(input);
    } catch (err) {
      console.warn("[ComplaintService] Non-critical activity warning:", err);
    }
  }
}

export default new ComplaintService();
