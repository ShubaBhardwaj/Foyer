import { Request, Response } from "express";
import complaintService from "../services/complaint.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

/**
 * ComplaintController — Thin HTTP layer for Complaints Management.
 * Delegating 100% of business logic to ComplaintService.
 */
class ComplaintController {
  /**
   * POST /complaints
   * Create a new complaint.
   */
  createComplaint = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required.");
    }

    const complaint = await complaintService.createComplaint(req.user, req.body);
    ApiResponse.created(res, "Complaint registered successfully.", complaint);
  });

  /**
   * GET /complaints
   * List complaints with filtering, search, and pagination.
   */
  listComplaints = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const result = await complaintService.listComplaints(
      req.user.society,
      req.user,
      req.query as any
    );

    ApiResponse.ok(res, "Complaints retrieved successfully.", result.data, result.meta);
  });

  /**
   * GET /complaints/:id
   * Get details for a single complaint by ID.
   */
  getComplaint = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const complaint = await complaintService.getComplaintById(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Complaint details retrieved successfully.", complaint);
  });

  /**
   * PATCH /complaints/:id
   * Update complaint details.
   */
  updateComplaint = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const complaint = await complaintService.updateComplaint(
      req.user.society,
      req.user,
      req.params.id,
      req.body
    );

    ApiResponse.ok(res, "Complaint updated successfully.", complaint);
  });

  /**
   * POST /complaints/:id/assign
   * Assign complaint to a user/staff member.
   */
  assignComplaint = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const complaint = await complaintService.assignComplaint(
      req.user.society,
      req.user,
      req.params.id,
      req.body
    );

    ApiResponse.ok(res, "Complaint assigned successfully.", complaint);
  });

  /**
   * POST /complaints/:id/start
   * Transition complaint status to IN_PROGRESS.
   */
  startComplaint = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const complaint = await complaintService.startComplaint(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Complaint marked as IN_PROGRESS.", complaint);
  });

  /**
   * POST /complaints/:id/resolve
   * Resolve complaint with resolution notes.
   */
  resolveComplaint = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const complaint = await complaintService.resolveComplaint(
      req.user.society,
      req.user,
      req.params.id,
      req.body
    );

    ApiResponse.ok(res, "Complaint resolved successfully.", complaint);
  });

  /**
   * POST /complaints/:id/close
   * Close a resolved complaint with optional feedback.
   */
  closeComplaint = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const complaint = await complaintService.closeComplaint(
      req.user.society,
      req.user,
      req.params.id,
      req.body
    );

    ApiResponse.ok(res, "Complaint closed successfully.", complaint);
  });

  /**
   * DELETE /complaints/:id
   * Soft-delete a complaint.
   */
  deleteComplaint = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const complaint = await complaintService.deleteComplaint(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Complaint deleted successfully.", complaint);
  });
}

export default new ComplaintController();
