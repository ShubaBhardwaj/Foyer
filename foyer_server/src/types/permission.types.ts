import { UserRole } from "../constants/enums";
import { Permission } from "../constants/permissions";

/**
 * Type mapping each UserRole to a read-only list of allowed Permission values.
 */
export type RolePermissionsMap = Record<UserRole, readonly Permission[]>;

export { Permission };
