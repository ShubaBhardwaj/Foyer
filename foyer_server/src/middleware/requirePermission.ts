import { Request, Response, NextFunction } from "express";
import permissionService from "../services/permission.service";
import { Permission } from "../constants/permissions";
import ApiError from "../utils/apiError";

/**
 * Express middleware requiring the authenticated user to possess specific permissions.
 *
 * Middleware pipeline order:
 * clerkAuth -> requireLinkedAccount -> requirePermission(...) -> controller
 *
 * Usage:
 *   router.get("/visitors", clerkAuth, requireLinkedAccount, requirePermission(Permission.VISITOR_READ), controller.list);
 */
export const requirePermission = (...requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.roles || req.user.roles.length === 0) {
      next(
        ApiError.unauthorized(
          "Unauthorized: User account not linked or has no roles."
        )
      );
      return;
    }

    const isAuthorized = permissionService.hasAnyPermission(
      req.user.roles,
      requiredPermissions
    );

    if (!isAuthorized) {
      next(
        ApiError.forbidden(
          `Forbidden: Requires permission ${requiredPermissions.join(" or ")}.`
        )
      );
      return;
    }

    next();
  };
};

export default requirePermission;
