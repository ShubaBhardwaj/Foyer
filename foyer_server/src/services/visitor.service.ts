import mongoose, { Types } from "mongoose";
import VisitorModel, { IVisitor } from "../models/visitor.model";
import { VisitorStatus } from "../constants/enums";
import { VisitorType } from "../constants/visitor.enums";
import { Role, IUser } from "../models/User";
import ApiError from "../utils/apiError";
import notificationService from "./notification.service";
import auditService from "./audit.service";
import { AuditAction, AuditResourceType } from "../models/audit.model";
import { parsePagination, calculateMeta } from "../utils/pagination";
import { validateObjectId } from "../utils/validation";
import { PaginatedResult } from "../types/common";
import {
  CreateVisitorInput,
  UpdateVisitorInput,
  ListVisitorsInput,
} from "../validators/visitor.validator";

/**
 * VisitorService — Single source of truth owning the business logic for Visitor Management.
 */
class VisitorService {
  /**
   * Create a new visitor request (Resident pre-approval or Guard walk-in).
   */
  async createVisitor(creator: IUser, data: CreateVisitorInput): Promise<IVisitor> {
    if (data.society !== creator.society.toString()) {
      throw ApiError.forbidden("Cannot create visitor for another society.");
    }

    const isResidentFlow =
      creator.roles.includes(Role.RESIDENT) ||
      data.resident === creator._id.toString();

    const initialStatus = isResidentFlow
      ? VisitorStatus.APPROVED
      : VisitorStatus.PENDING;

    const entryCode = await this.generateUniqueEntryCode();

    const visitorData: Partial<IVisitor> = {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email || undefined,
      photoUrl: data.photoUrl || undefined,
      visitorType: data.visitorType,
      purpose: data.purpose,
      notes: data.notes,
      vehicleNumber: data.vehicleNumber,
      expectedArrival: data.expectedArrival,
      expectedDeparture: data.expectedDeparture,
      society: new Types.ObjectId(data.society),
      tower: new Types.ObjectId(data.tower),
      flat: new Types.ObjectId(data.flat),
      resident: new Types.ObjectId(data.resident),
      guard: isResidentFlow ? null : creator._id,
      entryCode,
      status: initialStatus,
      isDeleted: false,
    };

    if (isResidentFlow) {
      visitorData.approvedAt = new Date();
      visitorData.approvedBy = creator._id;
    }

    const visitor = await VisitorModel.create(visitorData);

    if (isResidentFlow) {
      await notificationService.notifyVisitorApproved(
        [data.resident],
        visitor.toObject()
      );
    } else {
      await notificationService.notifyVisitorRequest(
        [data.resident],
        visitor.toObject()
      );
    }

    await this.safeAuditLog({
      actor: creator._id,
      actorRole: creator.roles[0] || "resident",
      society: visitor.society,
      action: AuditAction.VISITOR_CREATED,
      resourceType: AuditResourceType.VISITOR,
      resourceId: visitor._id,
      after: visitor.toObject(),
    });

    return visitor;
  }

  /**
   * Helper to execute audit logging safely without breaking business flow.
   */
  private async safeAuditLog(
    input: Parameters<typeof auditService.log>[0]
  ): Promise<void> {
    try {
      await auditService.log(input);
    } catch (err) {
      console.warn("[VisitorService] Non-critical audit warning:", err);
    }
  }

  /**
   * Fetch a single visitor by ID enforcing society isolation.
   */
  async getVisitorById(societyId: Types.ObjectId, id: string): Promise<IVisitor> {
    validateObjectId(id, "Visitor ID");

    const visitor = await VisitorModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    })
      .populate("society", "name societyCode")
      .populate("tower", "name")
      .populate("flat", "flatNumber floor")
      .populate("resident", "name email phone")
      .populate("guard", "name email phone")
      .populate("approvedBy", "name")
      .populate("rejectedBy", "name")
      .populate("checkedInBy", "name")
      .populate("checkedOutBy", "name");

    if (!visitor) {
      throw ApiError.notFound("Visitor not found.");
    }

    return visitor;
  }

  /**
   * List visitors with multi-criteria filtering, search, and pagination.
   */
  async listVisitors(
    societyId: Types.ObjectId,
    filters: ListVisitorsInput
  ): Promise<PaginatedResult<IVisitor>> {
    const { page, limit, skip } = parsePagination(filters.page, filters.limit);

    const query: Record<string, any> = {
      society: societyId,
      isDeleted: { $ne: true },
    };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.visitorType) {
      query.visitorType = filters.visitorType;
    }

    if (filters.tower) {
      validateObjectId(filters.tower, "Tower ID");
      query.tower = new Types.ObjectId(filters.tower);
    }

    if (filters.flat) {
      validateObjectId(filters.flat, "Flat ID");
      query.flat = new Types.ObjectId(filters.flat);
    }

    if (filters.resident) {
      validateObjectId(filters.resident, "Resident ID");
      query.resident = new Types.ObjectId(filters.resident);
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, "i");
      query.$or = [
        { fullName: searchRegex },
        { phoneNumber: searchRegex },
        { vehicleNumber: searchRegex },
      ];
    }

    if (filters.dateFrom || filters.dateTo) {
      query.expectedArrival = {};
      if (filters.dateFrom) query.expectedArrival.$gte = filters.dateFrom;
      if (filters.dateTo) query.expectedArrival.$lte = filters.dateTo;
    }

    const [total, data] = await Promise.all([
      VisitorModel.countDocuments(query),
      VisitorModel.find(query)
        .populate("tower", "name")
        .populate("flat", "flatNumber floor")
        .populate("resident", "name phone")
        .populate("guard", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const meta = calculateMeta(total, page, limit);

    return { data, meta };
  }

  /**
   * Update an existing visitor (permitted only when status is APPROVED or PENDING).
   */
  async updateVisitor(
    societyId: Types.ObjectId,
    user: IUser,
    visitorId: string,
    data: UpdateVisitorInput
  ): Promise<IVisitor> {
    validateObjectId(visitorId, "Visitor ID");

    const visitor = await VisitorModel.findOne({
      _id: visitorId,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!visitor) {
      throw ApiError.notFound("Visitor not found.");
    }

    if (
      visitor.status !== VisitorStatus.APPROVED &&
      visitor.status !== VisitorStatus.PENDING
    ) {
      throw ApiError.badRequest(
        `Cannot update visitor in status "${visitor.status}". Updates allowed only for PENDING or APPROVED visitors.`
      );
    }

    // Permission check: Resident can only update their own visitors
    if (
      user.roles.includes(Role.RESIDENT) &&
      !user.roles.includes(Role.ADMIN) &&
      !user.roles.includes(Role.SUPER_ADMIN) &&
      !user.roles.includes(Role.OWNER) &&
      visitor.resident.toString() !== user._id.toString()
    ) {
      throw ApiError.forbidden("You do not have permission to update this visitor.");
    }

    if (data.fullName !== undefined) visitor.fullName = data.fullName;
    if (data.phoneNumber !== undefined) visitor.phoneNumber = data.phoneNumber;
    if (data.email !== undefined) visitor.email = data.email || undefined;
    if (data.photoUrl !== undefined) visitor.photoUrl = data.photoUrl || undefined;
    if (data.visitorType !== undefined) visitor.visitorType = data.visitorType;
    if (data.purpose !== undefined) visitor.purpose = data.purpose;
    if (data.notes !== undefined) (visitor as any).notes = data.notes;
    if (data.vehicleNumber !== undefined) visitor.vehicleNumber = data.vehicleNumber;
    if (data.expectedArrival !== undefined) visitor.expectedArrival = data.expectedArrival;
    if (data.expectedDeparture !== undefined) visitor.expectedDeparture = data.expectedDeparture;

    await visitor.save();
    return visitor;
  }

  /**
   * Approve a PENDING visitor (Resident action).
   */
  async approveVisitor(
    societyId: Types.ObjectId,
    user: IUser,
    visitorId: string,
    statusRemark?: string
  ): Promise<IVisitor> {
    validateObjectId(visitorId, "Visitor ID");

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const visitor = await VisitorModel.findOne({
        _id: visitorId,
        society: societyId,
        isDeleted: { $ne: true },
      }).session(session);

      if (!visitor) {
        throw ApiError.notFound("Visitor not found.");
      }

      if (visitor.status !== VisitorStatus.PENDING) {
        throw ApiError.badRequest(
          `Cannot approve visitor in status "${visitor.status}". Only PENDING visitors can be approved.`
        );
      }

      const beforeState = visitor.toObject();

      visitor.status = VisitorStatus.APPROVED;
      visitor.approvedAt = new Date();
      visitor.approvedBy = user._id;
      if (statusRemark) visitor.approvalRemark = statusRemark;

      await visitor.save({ session });
      await session.commitTransaction();

      await notificationService.notifyVisitorApproved(
        [visitor.resident.toString()],
        visitor.toObject()
      );

      await this.safeAuditLog({
        actor: user._id,
        actorRole: user.roles[0] || "resident",
        society: visitor.society,
        action: AuditAction.VISITOR_APPROVED,
        resourceType: AuditResourceType.VISITOR,
        resourceId: visitor._id,
        before: beforeState,
        after: visitor.toObject(),
      });

      return visitor;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Reject a PENDING visitor (Resident action).
   */
  async rejectVisitor(
    societyId: Types.ObjectId,
    user: IUser,
    visitorId: string,
    statusRemark: string
  ): Promise<IVisitor> {
    validateObjectId(visitorId, "Visitor ID");

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const visitor = await VisitorModel.findOne({
        _id: visitorId,
        society: societyId,
        isDeleted: { $ne: true },
      }).session(session);

      if (!visitor) {
        throw ApiError.notFound("Visitor not found.");
      }

      if (visitor.status !== VisitorStatus.PENDING) {
        throw ApiError.badRequest(
          `Cannot reject visitor in status "${visitor.status}". Only PENDING visitors can be rejected.`
        );
      }

      const beforeState = visitor.toObject();

      visitor.status = VisitorStatus.REJECTED;
      visitor.rejectedAt = new Date();
      visitor.rejectedBy = user._id;
      visitor.approvalRemark = statusRemark;

      await visitor.save({ session });
      await session.commitTransaction();

      await notificationService.notifyVisitorRejected(
        [visitor.resident.toString()],
        visitor.toObject()
      );

      await this.safeAuditLog({
        actor: user._id,
        actorRole: user.roles[0] || "resident",
        society: visitor.society,
        action: AuditAction.VISITOR_REJECTED,
        resourceType: AuditResourceType.VISITOR,
        resourceId: visitor._id,
        before: beforeState,
        after: visitor.toObject(),
      });

      return visitor;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Cancel a PENDING or APPROVED visitor request.
   */
  async cancelVisitor(
    societyId: Types.ObjectId,
    user: IUser,
    visitorId: string,
    statusRemark?: string
  ): Promise<IVisitor> {
    validateObjectId(visitorId, "Visitor ID");

    const visitor = await VisitorModel.findOne({
      _id: visitorId,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!visitor) {
      throw ApiError.notFound("Visitor not found.");
    }

    if (
      visitor.status !== VisitorStatus.PENDING &&
      visitor.status !== VisitorStatus.APPROVED
    ) {
      throw ApiError.badRequest(
        `Cannot cancel visitor in status "${visitor.status}". Only PENDING or APPROVED visitors can be cancelled.`
      );
    }

    const beforeState = visitor.toObject();

    visitor.status = VisitorStatus.CANCELLED;
    if (statusRemark) visitor.approvalRemark = statusRemark;

    await visitor.save();

    await notificationService.sendNotification({
      title: "Visitor Cancelled",
      body: `Visitor ${visitor.fullName} pass has been cancelled.`,
      userIds: [visitor.resident.toString()],
    });

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "resident",
      society: visitor.society,
      action: AuditAction.VISITOR_CANCELLED,
      resourceType: AuditResourceType.VISITOR,
      resourceId: visitor._id,
      before: beforeState,
      after: visitor.toObject(),
    });

    return visitor;
  }

  /**
   * Check-in an APPROVED visitor (Guard action).
   */
  async checkInVisitor(
    societyId: Types.ObjectId,
    guardUser: IUser,
    visitorId: string,
    entryCode?: string
  ): Promise<IVisitor> {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      let query: Record<string, any> = {
        society: societyId,
        isDeleted: { $ne: true },
      };

      if (entryCode) {
        query.entryCode = entryCode.trim().toUpperCase();
      } else {
        validateObjectId(visitorId, "Visitor ID");
        query._id = visitorId;
      }

      const visitor = await VisitorModel.findOne(query).session(session);

      if (!visitor) {
        throw ApiError.notFound("Visitor not found for check-in.");
      }

      if (visitor.status !== VisitorStatus.APPROVED) {
        throw ApiError.badRequest(
          `Cannot check-in visitor in status "${visitor.status}". Only APPROVED visitors can be checked in.`
        );
      }

      const beforeState = visitor.toObject();

      visitor.status = VisitorStatus.CHECKED_IN;
      visitor.checkedInAt = new Date();
      visitor.checkedInBy = guardUser._id;
      visitor.guard = guardUser._id;

      await visitor.save({ session });
      await session.commitTransaction();

      await notificationService.sendNotification({
        title: "Visitor Arrived",
        body: `${visitor.fullName} has been checked in by guard.`,
        userIds: [visitor.resident.toString()],
      });

      await this.safeAuditLog({
        actor: guardUser._id,
        actorRole: guardUser.roles[0] || "guard",
        society: visitor.society,
        action: AuditAction.VISITOR_CHECKED_IN,
        resourceType: AuditResourceType.VISITOR,
        resourceId: visitor._id,
        before: beforeState,
        after: visitor.toObject(),
      });

      return visitor;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Check-out a CHECKED_IN visitor (Guard action).
   */
  async checkOutVisitor(
    societyId: Types.ObjectId,
    guardUser: IUser,
    visitorId: string
  ): Promise<IVisitor> {
    validateObjectId(visitorId, "Visitor ID");

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const visitor = await VisitorModel.findOne({
        _id: visitorId,
        society: societyId,
        isDeleted: { $ne: true },
      }).session(session);

      if (!visitor) {
        throw ApiError.notFound("Visitor not found.");
      }

      if (visitor.status !== VisitorStatus.CHECKED_IN) {
        throw ApiError.badRequest(
          `Cannot check-out visitor in status "${visitor.status}". Only CHECKED_IN visitors can be checked out.`
        );
      }

      const beforeState = visitor.toObject();

      visitor.status = VisitorStatus.CHECKED_OUT;
      visitor.checkedOutAt = new Date();
      visitor.checkedOutBy = guardUser._id;

      await visitor.save({ session });
      await session.commitTransaction();

      await notificationService.sendNotification({
        title: "Visitor Departed",
        body: `${visitor.fullName} has checked out.`,
        userIds: [visitor.resident.toString()],
      });

      await this.safeAuditLog({
        actor: guardUser._id,
        actorRole: guardUser.roles[0] || "guard",
        society: visitor.society,
        action: AuditAction.VISITOR_CHECKED_OUT,
        resourceType: AuditResourceType.VISITOR,
        resourceId: visitor._id,
        before: beforeState,
        after: visitor.toObject(),
      });

      return visitor;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Soft-delete a visitor (Permitted only when not CHECKED_IN or CHECKED_OUT).
   */
  async deleteVisitor(
    societyId: Types.ObjectId,
    user: IUser,
    visitorId: string
  ): Promise<IVisitor> {
    validateObjectId(visitorId, "Visitor ID");

    const visitor = await VisitorModel.findOne({
      _id: visitorId,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!visitor) {
      throw ApiError.notFound("Visitor not found.");
    }

    if (
      visitor.status === VisitorStatus.CHECKED_IN ||
      visitor.status === VisitorStatus.CHECKED_OUT
    ) {
      throw ApiError.badRequest(
        `Cannot delete visitor with active entry/exit logs (status: "${visitor.status}").`
      );
    }

    const beforeState = visitor.toObject();

    visitor.isDeleted = true;
    visitor.deletedAt = new Date();
    await visitor.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "resident",
      society: visitor.society,
      action: AuditAction.VISITOR_DELETED,
      resourceType: AuditResourceType.VISITOR,
      resourceId: visitor._id,
      before: beforeState,
      after: visitor.toObject(),
    });

    return visitor;
  }

  /**
   * Helper to generate a unique 6-character uppercase alphanumeric entry code.
   */
  private async generateUniqueEntryCode(): Promise<string> {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const maxRetries = 5;

    for (let retry = 0; retry < maxRetries; retry++) {
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const existing = await VisitorModel.findOne({ entryCode: code });
      if (!existing) {
        return code;
      }
    }

    // Fallback timestamp-based suffix if collision continues
    return `V${Date.now().toString().slice(-5)}`;
  }
}

export default new VisitorService();
