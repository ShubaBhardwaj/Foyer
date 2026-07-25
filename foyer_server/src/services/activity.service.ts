import { Types } from "mongoose";
import ActivityModel, {
  IActivity,
  ActivityType,
  ActivityVisibility,
} from "../models/activity.model";
import { UserRole } from "../constants/enums";
import ApiError from "../utils/apiError";

export interface PublishInput {
  society: Types.ObjectId | string;
  actor: Types.ObjectId | string;
  actorName: string;
  actorRole: UserRole | string;
  activityType: ActivityType;
  resourceType: string;
  resourceId: Types.ObjectId | string;
  message: string;
  metadata?: any;
  visibility?: ActivityVisibility;
  isArchived?: boolean;
}

/**
 * ActivityService — Centralized domain service for timeline activity feed management.
 * Serves as the sole gateway for persisting IActivity documents.
 */
class ActivityService {
  /**
   * Publish a new activity feed entry to MongoDB.
   */
  async publish(input: PublishInput): Promise<IActivity> {
    if (!input.society) {
      throw ApiError.badRequest("Society ID is required for activity feed entry.");
    }
    if (!input.actor || !input.actorName) {
      throw ApiError.badRequest("Actor ID and actor display name are required.");
    }
    if (!input.activityType) {
      throw ApiError.badRequest("Activity type is required.");
    }
    if (!input.resourceType || !input.resourceId) {
      throw ApiError.badRequest("Resource type and resource ID are required.");
    }
    if (!input.message) {
      throw ApiError.badRequest("Activity timeline message is required.");
    }

    try {
      const societyId =
        input.society instanceof Types.ObjectId
          ? input.society
          : new Types.ObjectId(input.society);

      const actorId =
        input.actor instanceof Types.ObjectId
          ? input.actor
          : new Types.ObjectId(input.actor);

      const activity = await ActivityModel.create({
        society: societyId,
        actor: actorId,
        actorName: input.actorName.trim(),
        actorRole: input.actorRole,
        activityType: input.activityType,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        message: input.message.trim(),
        metadata: input.metadata || null,
        visibility: input.visibility || ActivityVisibility.ALL,
        isArchived: input.isArchived || false,
      });

      return activity;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to publish activity entry";
      throw ApiError.internal(`Activity feed publishing failed: ${message}`);
    }
  }

  /**
   * Convenience helper for creation timeline events.
   */
  async publishCreate(input: PublishInput): Promise<IActivity> {
    return this.publish(input);
  }

  /**
   * Convenience helper for update timeline events.
   */
  async publishUpdate(input: PublishInput): Promise<IActivity> {
    return this.publish(input);
  }

  /**
   * Convenience helper for deletion timeline events.
   */
  async publishDelete(input: PublishInput): Promise<IActivity> {
    return this.publish(input);
  }
}

export default new ActivityService();
