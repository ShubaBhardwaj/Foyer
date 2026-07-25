import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import { requirePermission } from "../middleware/requirePermission";
import { validate } from "../middleware/validate";
import visitorController from "../controllers/visitor.controller";
import { Permission } from "../constants/permissions";
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
 * Required Permission: VISITOR_CREATE
 */
visitorRouter.post(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.VISITOR_CREATE),
  validate(createVisitorSchema),
  visitorController.createVisitor.bind(visitorController)
);

/**
 * GET /visitors
 * List visitors for authenticated user's society with filtering and pagination.
 * Required Permission: VISITOR_READ
 */
visitorRouter.get(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.VISITOR_READ),
  validate(listVisitorsSchema, "query"),
  visitorController.listVisitors.bind(visitorController)
);

/**
 * GET /visitors/:id
 * Get details for a specific visitor request.
 * Required Permission: VISITOR_READ
 */
visitorRouter.get(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.VISITOR_READ),
  validate(visitorIdParamsSchema, "params"),
  visitorController.getVisitor.bind(visitorController)
);

/**
 * PATCH /visitors/:id
 * Update visitor details (permitted only in PENDING or APPROVED status).
 * Required Permission: VISITOR_CREATE
 */
visitorRouter.patch(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.VISITOR_CREATE),
  validate(visitorIdParamsSchema, "params"),
  validate(updateVisitorSchema),
  visitorController.updateVisitor.bind(visitorController)
);

/**
 * DELETE /visitors/:id
 * Soft-delete a visitor request.
 * Required Permission: VISITOR_DELETE
 */
visitorRouter.delete(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.VISITOR_DELETE),
  validate(visitorIdParamsSchema, "params"),
  visitorController.deleteVisitor.bind(visitorController)
);

/**
 * POST /visitors/:id/approve
 * Resident approves a PENDING visitor request.
 * Required Permission: VISITOR_APPROVE
 */
visitorRouter.post(
  "/:id/approve",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.VISITOR_APPROVE),
  validate(visitorIdParamsSchema, "params"),
  validate(approveVisitorSchema),
  visitorController.approveVisitor.bind(visitorController)
);

/**
 * POST /visitors/:id/reject
 * Resident rejects a PENDING visitor request with mandatory reason.
 * Required Permission: VISITOR_REJECT
 */
visitorRouter.post(
  "/:id/reject",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.VISITOR_REJECT),
  validate(visitorIdParamsSchema, "params"),
  validate(rejectVisitorSchema),
  visitorController.rejectVisitor.bind(visitorController)
);

/**
 * POST /visitors/:id/cancel
 * Resident cancels a PENDING or APPROVED visitor pass.
 * Required Permission: VISITOR_CREATE or VISITOR_DELETE
 */
visitorRouter.post(
  "/:id/cancel",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.VISITOR_CREATE, Permission.VISITOR_DELETE),
  validate(visitorIdParamsSchema, "params"),
  validate(cancelVisitorSchema),
  visitorController.cancelVisitor.bind(visitorController)
);

/**
 * POST /visitors/:id/check-in
 * Guard checks in an APPROVED visitor.
 * Required Permission: VISITOR_CHECKIN
 */
visitorRouter.post(
  "/:id/check-in",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.VISITOR_CHECKIN),
  validate(visitorIdParamsSchema, "params"),
  validate(checkInVisitorSchema),
  visitorController.checkInVisitor.bind(visitorController)
);

/**
 * POST /visitors/:id/check-out
 * Guard checks out a CHECKED_IN visitor.
 * Required Permission: VISITOR_CHECKOUT
 */
visitorRouter.post(
  "/:id/check-out",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.VISITOR_CHECKOUT),
  validate(visitorIdParamsSchema, "params"),
  validate(checkOutVisitorSchema),
  visitorController.checkOutVisitor.bind(visitorController)
);

export default visitorRouter;
