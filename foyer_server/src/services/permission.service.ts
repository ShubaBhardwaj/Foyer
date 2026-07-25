import { UserRole } from "../constants/enums";
import { Permission, ROLE_PERMISSIONS } from "../constants/permissions";

/**
 * PermissionService — Centralized service for role-permission evaluations.
 * Pure stateless domain service delegating to the ROLE_PERMISSIONS registry.
 */
class PermissionService {
  /**
   * Check if a single user role has a specific permission.
   */
  hasPermission(role: UserRole | string, permission: Permission): boolean {
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role as UserRole];
    if (!permissions) return false;
    return permissions.includes(permission);
  }

  /**
   * Check if any role in a user's role list has at least one of the required permissions.
   */
  hasAnyPermission(
    roles: (UserRole | string)[],
    permissions: Permission[] | Permission
  ): boolean {
    if (!roles || roles.length === 0) return false;
    const permList = Array.isArray(permissions) ? permissions : [permissions];

    return roles.some((role) =>
      permList.some((perm) => this.hasPermission(role, perm))
    );
  }

  /**
   * Check if user roles collectively have all required permissions.
   */
  hasAllPermissions(
    roles: (UserRole | string)[],
    permissions: Permission[]
  ): boolean {
    if (!roles || roles.length === 0) return false;
    if (!permissions || permissions.length === 0) return true;

    return permissions.every((perm) =>
      roles.some((role) => this.hasPermission(role, perm))
    );
  }
}

export default new PermissionService();
