import { Role } from "@/types";

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  super_admin: "Super Admin",
  admin: "Society Admin",
  resident: "Resident",
  guard: "Guard",
};

export const ROLE_BADGE_VARIANTS: Record<
  Role,
  { label: string; className: string }
> = {
  owner: {
    label: "Owner",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  super_admin: {
    label: "Super Admin",
    className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  admin: {
    label: "Society Admin",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  resident: {
    label: "Resident",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  guard: {
    label: "Guard",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
};

/**
 * Priority order for displaying user's primary role badge.
 */
export const ROLE_HIERARCHY_ORDER: Role[] = [
  "owner",
  "super_admin",
  "admin",
  "resident",
  "guard",
];

export function getPrimaryRole(roles: Role[] = []): Role {
  for (const role of ROLE_HIERARCHY_ORDER) {
    if (roles.includes(role)) return role;
  }
  return roles[0] || "resident";
}
