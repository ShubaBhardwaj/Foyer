import { Request, Response, NextFunction } from "express";
import { Role } from "../models/User";

/**
 * Role-based authorization middleware factory.
 *
 * Usage:
 *   router.post("/super-admin", clerkAuth, requireRole(Role.OWNER), controller.create);
 *   router.post("/resident", clerkAuth, requireRole(Role.SUPER_ADMIN, Role.ADMIN), controller.create);
 *
 * Requires `clerkAuth` middleware to have run first (sets `req.user`).
 * Returns 403 if the user's role is not in the allowed list.
 */
export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User account not linked.",
        data: null,
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Requires role ${allowedRoles.join(" or ")}.`,
        data: null,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware that requires the user to have a linked MongoDB account.
 * Use on routes where req.user must exist (unlike /auth/complete-login).
 */
export const requireLinkedAccount = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: Account not linked. Complete login first.",
      data: null,
    });
    return;
  }
  next();
};
