import mongoose, { Types } from "mongoose";
import MaintenanceModel, {
  IMaintenance,
  MaintenanceStatus,
} from "../models/maintenance.model";
import InvoiceModel, { InvoiceStatus } from "../models/invoice.model";
import UserModel, { Role, IUser } from "../models/User";
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
  CreateMaintenanceInput,
  UpdateMaintenanceInput,
  ListMaintenancesInput,
} from "../validators/maintenance.validator";

/**
 * MaintenanceService — Business logic layer for Maintenance Billing Cycles.
 */
class MaintenanceService {
  /**
   * Create a new maintenance billing cycle.
   */
  async createMaintenance(
    creator: IUser,
    data: CreateMaintenanceInput
  ): Promise<IMaintenance> {
    if (!creator.society) {
      throw ApiError.forbidden("User account is not linked to any society.");
    }

    const dueDate = new Date(data.dueDate);

    const maintenance = await MaintenanceModel.create({
      society: creator.society,
      title: data.title,
      description: data.description,
      billingPeriod: data.billingPeriod,
      dueDate,
      amount: data.amount,
      lateFee: data.lateFee || 0,
      status: MaintenanceStatus.DRAFT,
      createdBy: creator._id,
      isDeleted: false,
    });

    await this.safeAuditLog({
      actor: creator._id,
      actorRole: creator.roles[0] || "admin",
      society: creator.society,
      action: AuditAction.MAINTENANCE_CREATED,
      resourceType: AuditResourceType.MAINTENANCE,
      resourceId: maintenance._id,
      after: maintenance.toObject(),
    });

    await this.safeActivityPublish({
      society: creator.society,
      actor: creator._id,
      actorName: creator.name || creator.email || "Admin",
      actorRole: creator.roles[0] || "admin",
      activityType: ActivityType.MAINTENANCE_CREATED,
      resourceType: "Maintenance",
      resourceId: maintenance._id,
      message: `Maintenance cycle created: "${maintenance.title}" (${maintenance.billingPeriod}).`,
      metadata: {
        title: maintenance.title,
        amount: maintenance.amount,
        billingPeriod: maintenance.billingPeriod,
      },
      visibility: ActivityVisibility.ALL,
    });

    return maintenance;
  }

  /**
   * Publish maintenance cycle and generate invoices for all society residents.
   */
  async publishMaintenance(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<IMaintenance> {
    validateObjectId(id, "Maintenance ID");

    const maintenance = await MaintenanceModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!maintenance) {
      throw ApiError.notFound("Maintenance cycle not found.");
    }

    if (maintenance.status !== MaintenanceStatus.DRAFT) {
      throw ApiError.badRequest(
        `Cannot publish maintenance cycle in status "${maintenance.status}".`
      );
    }

    // Find all active residents / owners in society
    const residents = await UserModel.find({
      society: societyId,
      roles: { $in: [Role.RESIDENT, Role.OWNER] },
      isActive: true,
    });

    if (residents.length === 0) {
      throw ApiError.badRequest("No active residents or owners found in society to generate invoices.");
    }

    const beforeState = maintenance.toObject();

    // Use transaction for batch invoice generation
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      maintenance.status = MaintenanceStatus.PUBLISHED;
      await maintenance.save({ session });

      const timestamp = Date.now().toString().slice(-6);
      const invoicesToInsert = residents.map((resident: IUser, idx: number) => ({
        society: societyId,
        maintenance: maintenance._id,
        resident: resident._id,
        flat: (resident as any).flat || "A-101",
        invoiceNumber: `INV-${maintenance.billingPeriod}-${timestamp}-${idx + 1}`,
        amount: maintenance.amount,
        dueDate: maintenance.dueDate,
        paidAmount: 0,
        balance: maintenance.amount,
        status: InvoiceStatus.PENDING,
        generatedAt: new Date(),
        isDeleted: false,
      }));

      await InvoiceModel.insertMany(invoicesToInsert, { session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "admin",
      society: societyId,
      action: AuditAction.MAINTENANCE_PUBLISHED,
      resourceType: AuditResourceType.MAINTENANCE,
      resourceId: maintenance._id,
      before: beforeState,
      after: maintenance.toObject(),
    });

    await this.safeActivityPublish({
      society: societyId,
      actor: user._id,
      actorName: user.name || user.email || "Admin",
      actorRole: user.roles[0] || "admin",
      activityType: ActivityType.MAINTENANCE_PUBLISHED,
      resourceType: "Maintenance",
      resourceId: maintenance._id,
      message: `Maintenance published: "${maintenance.title}". Invoices generated for ${residents.length} residents.`,
      metadata: {
        title: maintenance.title,
        amount: maintenance.amount,
        residentsCount: residents.length,
      },
      visibility: ActivityVisibility.ALL,
    });

    await notificationService.sendNotification({
      title: "Maintenance Bill Published",
      body: `Maintenance bill for ${maintenance.billingPeriod} (${maintenance.amount}) is due on ${new Date(maintenance.dueDate).toLocaleDateString()}.`,
      userIds: residents.map((r: IUser) => r._id.toString()),
    });

    return maintenance;
  }

  /**
   * Get maintenance by ID.
   */
  async getMaintenanceById(
    societyId: Types.ObjectId,
    id: string
  ): Promise<IMaintenance> {
    validateObjectId(id, "Maintenance ID");

    const maintenance = await MaintenanceModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    }).populate("createdBy", "name email");

    if (!maintenance) {
      throw ApiError.notFound("Maintenance cycle not found.");
    }

    return maintenance;
  }

  /**
   * List maintenance cycles.
   */
  async listMaintenances(
    societyId: Types.ObjectId,
    input: ListMaintenancesInput
  ): Promise<SearchResult<IMaintenance>> {
    const filter: Record<string, any> = {
      society: societyId,
      isDeleted: { $ne: true },
    };

    if (input.status) filter.status = input.status;
    if (input.billingPeriod) filter.billingPeriod = input.billingPeriod;

    return searchService.search<IMaintenance>(MaintenanceModel as any, {
      searchKeyword: input.searchKeyword,
      searchFields: ["title", "description", "billingPeriod"],
      filter,
      sort: input.sort || "-dueDate",
      page: input.page ? Number(input.page) : undefined,
      limit: input.limit ? Number(input.limit) : undefined,
      populate: [{ path: "createdBy", select: "name email" }],
    });
  }

  /**
   * Update maintenance details.
   */
  async updateMaintenance(
    societyId: Types.ObjectId,
    user: IUser,
    id: string,
    data: UpdateMaintenanceInput
  ): Promise<IMaintenance> {
    validateObjectId(id, "Maintenance ID");

    const maintenance = await MaintenanceModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!maintenance) {
      throw ApiError.notFound("Maintenance cycle not found.");
    }

    const beforeState = maintenance.toObject();

    if (data.title !== undefined) maintenance.title = data.title;
    if (data.description !== undefined) maintenance.description = data.description;
    if (data.billingPeriod !== undefined) maintenance.billingPeriod = data.billingPeriod;
    if (data.dueDate !== undefined) maintenance.dueDate = new Date(data.dueDate);
    if (data.amount !== undefined) maintenance.amount = data.amount;
    if (data.lateFee !== undefined) maintenance.lateFee = data.lateFee;

    await maintenance.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "admin",
      society: societyId,
      action: AuditAction.MAINTENANCE_UPDATED,
      resourceType: AuditResourceType.MAINTENANCE,
      resourceId: maintenance._id,
      before: beforeState,
      after: maintenance.toObject(),
    });

    return maintenance;
  }

  /**
   * Close a maintenance cycle.
   */
  async closeMaintenance(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<IMaintenance> {
    validateObjectId(id, "Maintenance ID");

    const maintenance = await MaintenanceModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!maintenance) {
      throw ApiError.notFound("Maintenance cycle not found.");
    }

    const beforeState = maintenance.toObject();
    maintenance.status = MaintenanceStatus.CLOSED;
    await maintenance.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "admin",
      society: societyId,
      action: AuditAction.MAINTENANCE_CLOSED,
      resourceType: AuditResourceType.MAINTENANCE,
      resourceId: maintenance._id,
      before: beforeState,
      after: maintenance.toObject(),
    });

    return maintenance;
  }

  private async safeAuditLog(
    input: Parameters<typeof auditService.log>[0]
  ): Promise<void> {
    try {
      await auditService.log(input);
    } catch (err) {
      console.warn("[MaintenanceService] Non-critical audit warning:", err);
    }
  }

  private async safeActivityPublish(
    input: Parameters<typeof activityService.publish>[0]
  ): Promise<void> {
    try {
      await activityService.publish(input);
    } catch (err) {
      console.warn("[MaintenanceService] Non-critical activity warning:", err);
    }
  }
}

export default new MaintenanceService();
