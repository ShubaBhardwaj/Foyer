import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import { requirePermission } from "../middleware/requirePermission";
import { validate } from "../middleware/validate";
import complaintController from "../controllers/complaint.controller";
import { Permission } from "../constants/permissions";
import {
  createComplaintSchema,
  updateComplaintSchema,
  assignComplaintSchema,
  resolveComplaintSchema,
  closeComplaintSchema,
  listComplaintsSchema,
  complaintIdParamsSchema,
} from "../validators/complaint.validator";

export const complaintRouter = Router();

/**
 * POST /complaints
 * Create a new complaint.
 * Required Permission: COMPLAINT_CREATE
 */
complaintRouter.post(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMPLAINT_CREATE),
  validate(createComplaintSchema),
  complaintController.createComplaint.bind(complaintController)
);

/**
 * GET /complaints
 * List complaints with filtering, search, and pagination.
 * Required Permission: COMPLAINT_READ
 */
complaintRouter.get(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMPLAINT_READ),
  validate(listComplaintsSchema, "query"),
  complaintController.listComplaints.bind(complaintController)
);

/**
 * GET /complaints/:id
 * Get details for a single complaint.
 * Required Permission: COMPLAINT_READ
 */
complaintRouter.get(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMPLAINT_READ),
  validate(complaintIdParamsSchema, "params"),
  complaintController.getComplaint.bind(complaintController)
);

/**
 * PATCH /complaints/:id
 * Update complaint details.
 * Required Permission: COMPLAINT_CREATE
 */
complaintRouter.patch(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMPLAINT_CREATE),
  validate(complaintIdParamsSchema, "params"),
  validate(updateComplaintSchema),
  complaintController.updateComplaint.bind(complaintController)
);

/**
 * POST /complaints/:id/assign
 * Assign complaint to a staff member.
 * Required Permission: COMPLAINT_ASSIGN
 */
complaintRouter.post(
  "/:id/assign",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMPLAINT_ASSIGN),
  validate(complaintIdParamsSchema, "params"),
  validate(assignComplaintSchema),
  complaintController.assignComplaint.bind(complaintController)
);

/**
 * POST /complaints/:id/start
 * Mark complaint as IN_PROGRESS.
 * Required Permission: COMPLAINT_RESOLVE
 */
complaintRouter.post(
  "/:id/start",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMPLAINT_RESOLVE),
  validate(complaintIdParamsSchema, "params"),
  complaintController.startComplaint.bind(complaintController)
);

/**
 * POST /complaints/:id/resolve
 * Resolve a complaint with resolution notes.
 * Required Permission: COMPLAINT_RESOLVE
 */
complaintRouter.post(
  "/:id/resolve",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMPLAINT_RESOLVE),
  validate(complaintIdParamsSchema, "params"),
  validate(resolveComplaintSchema),
  complaintController.resolveComplaint.bind(complaintController)
);

/**
 * POST /complaints/:id/close
 * Close a resolved complaint with optional feedback.
 * Required Permission: COMPLAINT_RESOLVE or COMPLAINT_CREATE
 */
complaintRouter.post(
  "/:id/close",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMPLAINT_RESOLVE, Permission.COMPLAINT_CREATE),
  validate(complaintIdParamsSchema, "params"),
  validate(closeComplaintSchema),
  complaintController.closeComplaint.bind(complaintController)
);

/**
 * DELETE /complaints/:id
 * Soft-delete a complaint.
 * Required Permission: COMPLAINT_DELETE
 */
complaintRouter.delete(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMPLAINT_DELETE),
  validate(complaintIdParamsSchema, "params"),
  complaintController.deleteComplaint.bind(complaintController)
);

export default complaintRouter;
