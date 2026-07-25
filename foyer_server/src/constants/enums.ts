/**
 * Core User Roles in Foyer Platform.
 */
export enum UserRole {
  OWNER = "owner",
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  RESIDENT = "resident",
  GUARD = "guard",
}

/**
 * Visitor Request Statuses.
 */
export enum VisitorStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CHECKED_IN = "checked_in",
  CHECKED_OUT = "checked_out",
  CANCELLED = "cancelled",
}
