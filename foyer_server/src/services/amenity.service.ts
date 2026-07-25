import { Types } from "mongoose";
import AmenityModel, { IAmenity } from "../models/amenity.model";
import { IUser } from "../models/User";
import ApiError from "../utils/apiError";
import auditService from "./audit.service";
import { AuditAction, AuditResourceType } from "../models/audit.model";
import activityService from "./activity.service";
import { ActivityType, ActivityVisibility } from "../models/activity.model";
import searchService from "./search.service";
import { validateObjectId } from "../utils/validation";
import { SearchResult } from "../types/search.types";
import {
  CreateAmenityInput,
  UpdateAmenityInput,
  ListAmenitiesInput,
} from "../validators/amenity.validator";

/**
 * AmenityService — Business logic layer for Society Amenities management.
 */
class AmenityService {
  /**
   * Create a new amenity.
   */
  async createAmenity(
    creator: IUser,
    data: CreateAmenityInput
  ): Promise<IAmenity> {
    if (!creator.society) {
      throw ApiError.forbidden("User account is not linked to any society.");
    }

    const amenity = await AmenityModel.create({
      society: creator.society,
      name: data.name,
      description: data.description,
      category: data.category,
      images: data.images || [],
      location: data.location,
      capacity: data.capacity,
      openingTime: data.openingTime,
      closingTime: data.closingTime,
      slotDuration: data.slotDuration,
      bookingType: data.bookingType,
      bookingWindowDays: data.bookingWindowDays,
      cancellationWindowHours: data.cancellationWindowHours,
      requiresApproval: data.requiresApproval,
      maxBookingsPerResident: data.maxBookingsPerResident,
      bookingFee: data.bookingFee,
      securityDeposit: data.securityDeposit,
      isActive: true,
      createdBy: creator._id,
      isDeleted: false,
    });

    await this.safeAuditLog({
      actor: creator._id,
      actorRole: creator.roles[0] || "admin",
      society: creator.society,
      action: AuditAction.AMENITY_CREATED,
      resourceType: AuditResourceType.AMENITY,
      resourceId: amenity._id,
      after: amenity.toObject(),
    });

    await this.safeActivityPublish({
      society: creator.society,
      actor: creator._id,
      actorName: creator.name || creator.email || "Admin",
      actorRole: creator.roles[0] || "admin",
      activityType: ActivityType.AMENITY_CREATED,
      resourceType: "Amenity",
      resourceId: amenity._id,
      message: `New amenity available: "${amenity.name}".`,
      metadata: {
        name: amenity.name,
        category: amenity.category,
      },
      visibility: ActivityVisibility.ALL,
    });

    return amenity;
  }

  /**
   * Get amenity by ID with society tenant isolation.
   */
  async getAmenityById(
    societyId: Types.ObjectId,
    id: string
  ): Promise<IAmenity> {
    validateObjectId(id, "Amenity ID");

    const amenity = await AmenityModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!amenity) {
      throw ApiError.notFound("Amenity not found.");
    }

    return amenity;
  }

  /**
   * List amenities with search, filtering, and pagination.
   */
  async listAmenities(
    societyId: Types.ObjectId,
    input: ListAmenitiesInput
  ): Promise<SearchResult<IAmenity>> {
    const filter: Record<string, any> = {
      society: societyId,
      isDeleted: { $ne: true },
    };

    if (input.category) filter.category = input.category;
    if (input.isActive !== undefined) {
      filter.isActive = input.isActive === "true";
    }

    return searchService.search<IAmenity>(AmenityModel as any, {
      searchKeyword: input.searchKeyword,
      searchFields: ["name", "description", "location"],
      filter,
      sort: input.sort || "name",
      page: input.page ? Number(input.page) : undefined,
      limit: input.limit ? Number(input.limit) : undefined,
    });
  }

  /**
   * Update amenity configuration.
   */
  async updateAmenity(
    societyId: Types.ObjectId,
    user: IUser,
    id: string,
    data: UpdateAmenityInput
  ): Promise<IAmenity> {
    validateObjectId(id, "Amenity ID");

    const amenity = await AmenityModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!amenity) {
      throw ApiError.notFound("Amenity not found.");
    }

    const beforeState = amenity.toObject();

    Object.assign(amenity, data);
    await amenity.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "admin",
      society: societyId,
      action: AuditAction.AMENITY_UPDATED,
      resourceType: AuditResourceType.AMENITY,
      resourceId: amenity._id,
      before: beforeState,
      after: amenity.toObject(),
    });

    return amenity;
  }

  /**
   * Activate amenity.
   */
  async activateAmenity(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<IAmenity> {
    validateObjectId(id, "Amenity ID");

    const amenity = await AmenityModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!amenity) {
      throw ApiError.notFound("Amenity not found.");
    }

    amenity.isActive = true;
    await amenity.save();
    return amenity;
  }

  /**
   * Deactivate amenity.
   */
  async deactivateAmenity(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<IAmenity> {
    validateObjectId(id, "Amenity ID");

    const amenity = await AmenityModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!amenity) {
      throw ApiError.notFound("Amenity not found.");
    }

    amenity.isActive = false;
    await amenity.save();
    return amenity;
  }

  /**
   * Soft-delete amenity.
   */
  async deleteAmenity(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<IAmenity> {
    validateObjectId(id, "Amenity ID");

    const amenity = await AmenityModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!amenity) {
      throw ApiError.notFound("Amenity not found.");
    }

    const beforeState = amenity.toObject();
    amenity.isDeleted = true;
    await amenity.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "admin",
      society: societyId,
      action: AuditAction.AMENITY_DELETED,
      resourceType: AuditResourceType.AMENITY,
      resourceId: amenity._id,
      before: beforeState,
      after: amenity.toObject(),
    });

    return amenity;
  }

  private async safeAuditLog(
    input: Parameters<typeof auditService.log>[0]
  ): Promise<void> {
    try {
      await auditService.log(input);
    } catch (err) {
      console.warn("[AmenityService] Non-critical audit warning:", err);
    }
  }

  private async safeActivityPublish(
    input: Parameters<typeof activityService.publish>[0]
  ): Promise<void> {
    try {
      await activityService.publish(input);
    } catch (err) {
      console.warn("[AmenityService] Non-critical activity warning:", err);
    }
  }
}

export default new AmenityService();
