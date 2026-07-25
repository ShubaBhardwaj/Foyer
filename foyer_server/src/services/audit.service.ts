import { Types } from "mongoose";
import AuditModel, {
  IAuditLog,
  AuditAction,
  AuditResourceType,
} from "../models/audit.model";
import { UserRole } from "../constants/enums";
import ApiError from "../utils/apiError";

export interface LogInput {
  actor: Types.ObjectId | string;
  actorRole: UserRole | string;
  society: Types.ObjectId | string;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId: Types.ObjectId | string;
  before?: any;
  after?: any;
  ipAddress?: string;
  userAgent?: string;
}

export type LogCreateInput = Omit<LogInput, "before">;
export type LogUpdateInput = LogInput;
export type LogDeleteInput = Omit<LogInput, "after">;

/**
 * AuditService — Centralized domain service for recording system activity.
 * Serves as the sole gateway for persisting AuditLog entries.
 */
class AuditService {
  /**
   * Record a new audit log entry in MongoDB.
   */
  async log(input: LogInput): Promise<IAuditLog> {
    if (!input.actor) {
      throw ApiError.badRequest("Actor ID is required for audit logging.");
    }
    if (!input.society) {
      throw ApiError.badRequest("Society ID is required for audit logging.");
    }
    if (!input.action) {
      throw ApiError.badRequest("Audit action is required.");
    }
    if (!input.resourceType || !input.resourceId) {
      throw ApiError.badRequest("Resource type and resource ID are required.");
    }

    try {
      const actorId =
        input.actor instanceof Types.ObjectId
          ? input.actor
          : new Types.ObjectId(input.actor);

      const societyId =
        input.society instanceof Types.ObjectId
          ? input.society
          : new Types.ObjectId(input.society);

      const auditEntry = await AuditModel.create({
        actor: actorId,
        actorRole: input.actorRole,
        society: societyId,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        before: input.before || null,
        after: input.after || null,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });

      return auditEntry;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to save audit log";
      throw ApiError.internal(`Audit logging failed: ${message}`);
    }
  }

  /**
   * Convenience helper for resource creation events (before = null).
   */
  async logCreate(input: LogCreateInput): Promise<IAuditLog> {
    return this.log({
      ...input,
      before: null,
    });
  }

  /**
   * Convenience helper for resource update events (captures before & after state snapshots).
   */
  async logUpdate(input: LogUpdateInput): Promise<IAuditLog> {
    return this.log(input);
  }

  /**
   * Convenience helper for resource deletion events (after = null).
   */
  async logDelete(input: LogDeleteInput): Promise<IAuditLog> {
    return this.log({
      ...input,
      after: null,
    });
  }
}

export default new AuditService();
