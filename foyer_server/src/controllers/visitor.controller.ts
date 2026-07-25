import { Request, Response } from "express";
import visitorService from "../services/visitor.service";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import {
  CreateVisitorInput,
  UpdateVisitorInput,
  ApproveVisitorInput,
  RejectVisitorInput,
  CancelVisitorInput,
  CheckInVisitorInput,
  ListVisitorsInput,
} from "../validators/visitor.validator";

/**
 * VisitorController — Handles HTTP requests for Visitor Management.
 * Thin controller layer; all business logic is delegated to VisitorService.
 */
class VisitorController {
  /**
   * POST /visitors
   * Create a new visitor request (Resident pre-approval or Guard walk-in).
   */
  createVisitor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const creator = req.user!;
    const body = req.body as CreateVisitorInput;

    const result = await visitorService.createVisitor(creator, body);

    ApiResponse.created(res, "Visitor request created successfully.", result);
  });

  /**
   * GET /visitors/:id
   * Fetch visitor details by ID.
   */
  getVisitor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const societyId = req.user!.society;
    const { id } = req.params;

    const visitor = await visitorService.getVisitorById(societyId, id);

    ApiResponse.ok(res, "Visitor details fetched successfully.", visitor);
  });

  /**
   * GET /visitors
   * List visitors with filtering and pagination.
   */
  listVisitors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const societyId = req.user!.society;
    const filters = req.query as unknown as ListVisitorsInput;

    const { data, meta } = await visitorService.listVisitors(societyId, filters);

    ApiResponse.ok(res, "Visitors fetched successfully.", data, meta);
  });

  /**
   * PATCH /visitors/:id
   * Update visitor details (permitted only when status is PENDING or APPROVED).
   */
  updateVisitor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = req.user!;
    const societyId = user.society;
    const { id } = req.params;
    const body = req.body as UpdateVisitorInput;

    const result = await visitorService.updateVisitor(societyId, user, id, body);

    ApiResponse.ok(res, "Visitor updated successfully.", result);
  });

  /**
   * POST /visitors/:id/approve
   * Resident approves a PENDING visitor request.
   */
  approveVisitor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = req.user!;
    const societyId = user.society;
    const { id } = req.params;
    const { statusRemark } = (req.body || {}) as ApproveVisitorInput;

    const result = await visitorService.approveVisitor(
      societyId,
      user,
      id,
      statusRemark
    );

    ApiResponse.ok(res, "Visitor request approved successfully.", result);
  });

  /**
   * POST /visitors/:id/reject
   * Resident rejects a PENDING visitor request.
   */
  rejectVisitor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = req.user!;
    const societyId = user.society;
    const { id } = req.params;
    const { statusRemark } = req.body as RejectVisitorInput;

    const result = await visitorService.rejectVisitor(
      societyId,
      user,
      id,
      statusRemark
    );

    ApiResponse.ok(res, "Visitor request rejected successfully.", result);
  });

  /**
   * POST /visitors/:id/cancel
   * Cancel a PENDING or APPROVED visitor request.
   */
  cancelVisitor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = req.user!;
    const societyId = user.society;
    const { id } = req.params;
    const { statusRemark } = (req.body || {}) as CancelVisitorInput;

    const result = await visitorService.cancelVisitor(
      societyId,
      user,
      id,
      statusRemark
    );

    ApiResponse.ok(res, "Visitor pass cancelled successfully.", result);
  });

  /**
   * POST /visitors/:id/check-in
   * Guard checks in an APPROVED visitor.
   */
  checkInVisitor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const guardUser = req.user!;
    const societyId = guardUser.society;
    const { id } = req.params;
    const { entryCode } = (req.body || {}) as CheckInVisitorInput;

    const result = await visitorService.checkInVisitor(
      societyId,
      guardUser,
      id,
      entryCode
    );

    ApiResponse.ok(res, "Visitor checked in successfully.", result);
  });

  /**
   * POST /visitors/:id/check-out
   * Guard checks out a CHECKED_IN visitor.
   */
  checkOutVisitor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const guardUser = req.user!;
    const societyId = guardUser.society;
    const { id } = req.params;

    const result = await visitorService.checkOutVisitor(
      societyId,
      guardUser,
      id
    );

    ApiResponse.ok(res, "Visitor checked out successfully.", result);
  });

  /**
   * DELETE /visitors/:id
   * Soft-delete a visitor request.
   */
  deleteVisitor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = req.user!;
    const societyId = user.society;
    const { id } = req.params;

    await visitorService.deleteVisitor(societyId, user, id);

    ApiResponse.ok(res, "Visitor deleted successfully.", null);
  });
}

export default new VisitorController();
