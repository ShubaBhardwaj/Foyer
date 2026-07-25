import { UserRole } from "./enums";

/**
 * System Fine-Grained Permissions Enum.
 */
export enum Permission {
  // Visitor Subsystem
  VISITOR_CREATE = "visitor:create",
  VISITOR_READ = "visitor:read",
  VISITOR_APPROVE = "visitor:approve",
  VISITOR_REJECT = "visitor:reject",
  VISITOR_CHECKIN = "visitor:checkin",
  VISITOR_CHECKOUT = "visitor:checkout",
  VISITOR_DELETE = "visitor:delete",

  // Complaints Subsystem
  COMPLAINT_CREATE = "complaint:create",
  COMPLAINT_READ = "complaint:read",
  COMPLAINT_ASSIGN = "complaint:assign",
  COMPLAINT_RESOLVE = "complaint:resolve",
  COMPLAINT_DELETE = "complaint:delete",

  // Notices Subsystem
  NOTICE_CREATE = "notice:create",
  NOTICE_READ = "notice:read",
  NOTICE_PUBLISH = "notice:publish",
  NOTICE_DELETE = "notice:delete",

  // Amenities Subsystem
  AMENITY_CREATE = "amenity:create",
  AMENITY_READ = "amenity:read",
  AMENITY_UPDATE = "amenity:update",
  AMENITY_DELETE = "amenity:delete",
  AMENITY_BOOK = "amenity:book",
  AMENITY_APPROVE = "amenity:approve",

  // Polls & Voting Subsystem
  POLL_CREATE = "poll:create",
  POLL_READ = "poll:read",
  POLL_PUBLISH = "poll:publish",
  POLL_VOTE = "poll:vote",
  POLL_DELETE = "poll:delete",

  // Maintenance & Billing Subsystem
  MAINTENANCE_CREATE = "maintenance:create",
  MAINTENANCE_READ = "maintenance:read",
  MAINTENANCE_PAY = "maintenance:pay",
  MAINTENANCE_UPDATE = "maintenance:update",
  MAINTENANCE_PUBLISH = "maintenance:publish",
  MAINTENANCE_DELETE = "maintenance:delete",
  // Community Subsystem
  COMMUNITY_CREATE = "community:create",
  COMMUNITY_READ = "community:read",
  COMMUNITY_MODERATE = "community:moderate",
  COMMUNITY_DELETE = "community:delete",

  // User & Society Management
  USER_CREATE = "user:create",
  USER_READ = "user:read",
  USER_UPDATE = "user:update",
  USER_DELETE = "user:delete",
  SOCIETY_UPDATE = "society:update",

  // Structure Management
  TOWER_CREATE = "tower:create",
  FLAT_CREATE = "flat:create",

  // Storage & Files Subsystem
  FILE_UPLOAD = "file:upload",
  FILE_DELETE = "file:delete",

  // System Audit & Activity Log
  AUDIT_VIEW = "audit:view",
  ACTIVITY_VIEW = "activity:view",
}

/**
 * Role to Permissions Mapping (Single Source of Truth).
 */
export const ROLE_PERMISSIONS: Readonly<Record<UserRole, readonly Permission[]>> = Object.freeze({
  [UserRole.SUPER_ADMIN]: Object.values(Permission),

  [UserRole.ADMIN]: [
    Permission.VISITOR_CREATE,
    Permission.VISITOR_READ,
    Permission.VISITOR_APPROVE,
    Permission.VISITOR_REJECT,
    Permission.VISITOR_CHECKIN,
    Permission.VISITOR_CHECKOUT,
    Permission.VISITOR_DELETE,
    Permission.COMPLAINT_CREATE,
    Permission.COMPLAINT_READ,
    Permission.COMPLAINT_ASSIGN,
    Permission.COMPLAINT_RESOLVE,
    Permission.COMPLAINT_DELETE,
    Permission.NOTICE_CREATE,
    Permission.NOTICE_READ,
    Permission.NOTICE_PUBLISH,
    Permission.NOTICE_DELETE,
    Permission.AMENITY_CREATE,
    Permission.AMENITY_READ,
    Permission.AMENITY_UPDATE,
    Permission.AMENITY_DELETE,
    Permission.AMENITY_BOOK,
    Permission.AMENITY_APPROVE,
    Permission.POLL_CREATE,
    Permission.POLL_READ,
    Permission.POLL_PUBLISH,
    Permission.POLL_VOTE,
    Permission.POLL_DELETE,
    Permission.MAINTENANCE_CREATE,
    Permission.MAINTENANCE_READ,
    Permission.MAINTENANCE_PAY,
    Permission.MAINTENANCE_UPDATE,
    Permission.MAINTENANCE_PUBLISH,
    Permission.MAINTENANCE_DELETE,
    Permission.COMMUNITY_CREATE,
    Permission.COMMUNITY_READ,
    Permission.COMMUNITY_MODERATE,
    Permission.COMMUNITY_DELETE,
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.SOCIETY_UPDATE,
    Permission.TOWER_CREATE,
    Permission.FLAT_CREATE,
    Permission.FILE_UPLOAD,
    Permission.FILE_DELETE,
    Permission.AUDIT_VIEW,
    Permission.ACTIVITY_VIEW,
  ],

  [UserRole.OWNER]: [
    Permission.VISITOR_CREATE,
    Permission.VISITOR_READ,
    Permission.VISITOR_APPROVE,
    Permission.VISITOR_REJECT,
    Permission.VISITOR_CHECKIN,
    Permission.VISITOR_CHECKOUT,
    Permission.VISITOR_DELETE,
    Permission.COMPLAINT_CREATE,
    Permission.COMPLAINT_READ,
    Permission.NOTICE_READ,
    Permission.AMENITY_READ,
    Permission.AMENITY_BOOK,
    Permission.POLL_READ,
    Permission.POLL_VOTE,
    Permission.COMMUNITY_CREATE,
    Permission.COMMUNITY_READ,
    Permission.COMMUNITY_DELETE,
    Permission.MAINTENANCE_READ,
    Permission.MAINTENANCE_PAY,
    Permission.USER_READ,
    Permission.FILE_UPLOAD,
    Permission.ACTIVITY_VIEW,
  ],

  [UserRole.RESIDENT]: [
    Permission.VISITOR_CREATE,
    Permission.VISITOR_READ,
    Permission.VISITOR_APPROVE,
    Permission.VISITOR_REJECT,
    Permission.VISITOR_CHECKIN,
    Permission.VISITOR_CHECKOUT,
    Permission.VISITOR_DELETE,
    Permission.COMPLAINT_CREATE,
    Permission.COMPLAINT_READ,
    Permission.NOTICE_READ,
    Permission.AMENITY_READ,
    Permission.AMENITY_BOOK,
    Permission.POLL_READ,
    Permission.POLL_VOTE,
    Permission.COMMUNITY_CREATE,
    Permission.COMMUNITY_READ,
    Permission.COMMUNITY_DELETE,
    Permission.MAINTENANCE_READ,
    Permission.MAINTENANCE_PAY,
    Permission.USER_READ,
    Permission.FILE_UPLOAD,
    Permission.ACTIVITY_VIEW,
  ],

  [UserRole.GUARD]: [
    Permission.VISITOR_CREATE,
    Permission.VISITOR_READ,
    Permission.VISITOR_CHECKIN,
    Permission.VISITOR_CHECKOUT,
    Permission.NOTICE_READ,
    Permission.POLL_READ,
    Permission.COMMUNITY_READ,
    Permission.USER_READ,
    Permission.FILE_UPLOAD,
    Permission.ACTIVITY_VIEW,
  ],
});
