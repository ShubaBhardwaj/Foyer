import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount, requireRole } from "../middleware/roleAuth";
import { validate } from "../middleware/validate";
import visitorController from "../controllers/visitor.controller";
import { Role } from "../models/User";
import {
  createVisitorSchema,
  updateVisitorSchema,
  approveVisitorSchema,
  rejectVisitorSchema,
  cancelVisitorSchema,
  checkInVisitorSchema,
  checkOutVisitorSchema,
  listVisitorsSchema,
  visitorIdParamsSchema,
} from "../validators/visitor.validator";

export const visitorRouter = Router();

/**
 * POST /visitors
 * Create a new visitor request (Resident pre-approval or Guard walk-in).
 * Allowed: RESIDENT, GUARD.
 */
visitorRouter.post(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.RESIDENT, Role.GUARD),
  validate(createVisitorSchema),
  visitorController.createVisitor.bind(visitorController)
);

/**
 * GET /visitors
 * List visitors for authenticated user's society with filtering and pagination.
 * Allowed: RESIDENT, ADMIN, SUPER_ADMIN, OWNER (Guards excluded from full history).
 */
visitorRouter.get(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.RESIDENT, Role.ADMIN, Role.SUPER_ADMIN, Role.OWNER),
  validate(listVisitorsSchema, "query"),
  visitorController.listVisitors.bind(visitorController)
);

/**
 * GET /visitors/:id
 * Get details for a specific visitor request.
 * Allowed: RESIDENT, GUARD, ADMIN, SUPER_ADMIN, OWNER.
 */
visitorRouter.get(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requireRole(
    Role.RESIDENT,
    Role.GUARD,
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.OWNER
  ),
  validate(visitorIdParamsSchema, "params"),
  visitorController.getVisitor.bind(visitorController)
);

/**
 * PATCH /visitors/:id
 * Update visitor details (permitted only in PENDING or APPROVED status).
 * Allowed: RESIDENT only.
 */
visitorRouter.patch(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.RESIDENT),
  validate(visitorIdParamsSchema, "params"),
  validate(updateVisitorSchema),
  visitorController.updateVisitor.bind(visitorController)
);

/**
 * DELETE /visitors/:id
 * Soft-delete a visitor request.
 * Allowed: RESIDENT only.
 */
visitorRouter.delete(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.RESIDENT),
  validate(visitorIdParamsSchema, "params"),
  visitorController.deleteVisitor.bind(visitorController)
);

/**
 * POST /visitors/:id/approve
 * Resident approves a PENDING visitor request.
 * Allowed: RESIDENT only.
 */
visitorRouter.post(
  "/:id/approve",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.RESIDENT),
  validate(visitorIdParamsSchema, "params"),
  validate(approveVisitorSchema),
  visitorController.approveVisitor.bind(visitorController)
);

/**
 * POST /visitors/:id/reject
 * Resident rejects a PENDING visitor request with mandatory reason.
 * Allowed: RESIDENT only.
 */
visitorRouter.post(
  "/:id/reject",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.RESIDENT),
  validate(visitorIdParamsSchema, "params"),
  validate(rejectVisitorSchema),
  visitorController.rejectVisitor.bind(visitorController)
);

/**
 * POST /visitors/:id/cancel
 * Resident cancels a PENDING or APPROVED visitor pass.
 * Allowed: RESIDENT only.
 */
visitorRouter.post(
  "/:id/cancel",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.RESIDENT),
  validate(visitorIdParamsSchema, "params"),
  validate(cancelVisitorSchema),
  visitorController.cancelVisitor.bind(visitorController)
);

/**
 * POST /visitors/:id/check-in
 * Guard checks in an APPROVED visitor.
 * Allowed: GUARD only.
 */
visitorRouter.post(
  "/:id/check-in",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.GUARD),
  validate(visitorIdParamsSchema, "params"),
  validate(checkInVisitorSchema),
  visitorController.checkInVisitor.bind(visitorController)
);

/**
 * POST /visitors/:id/check-out
 * Guard checks out a CHECKED_IN visitor.
 * Allowed: GUARD only.
 */
visitorRouter.post(
  "/:id/check-out",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.GUARD),
  validate(visitorIdParamsSchema, "params"),
  validate(checkOutVisitorSchema),
  visitorController.checkOutVisitor.bind(visitorController)
);

export default visitorRouter;
