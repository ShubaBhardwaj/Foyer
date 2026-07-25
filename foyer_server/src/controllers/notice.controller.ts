import { Request, Response } from "express";
import noticeService from "../services/notice.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

/**
 * NoticeController — Thin HTTP layer for Society Notices Management.
 * Delegating 100% of business logic to NoticeService.
 */
class NoticeController {
  /**
   * POST /notices
   * Create a new notice.
   */
  createNotice = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required.");
    }

    const notice = await noticeService.createNotice(req.user, req.body);
    ApiResponse.created(res, "Notice created successfully.", notice);
  });

  /**
   * GET /notices
   * List notices with filtering, search, and pagination.
   */
  listNotices = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const result = await noticeService.listNotices(
      req.user.society,
      req.user,
      req.query as any
    );

    ApiResponse.ok(res, "Notices retrieved successfully.", result.data, result.meta);
  });

  /**
   * GET /notices/:id
   * Get details for a single notice by ID.
   */
  getNotice = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const notice = await noticeService.getNoticeById(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Notice details retrieved successfully.", notice);
  });

  /**
   * PATCH /notices/:id
   * Update notice details.
   */
  updateNotice = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const notice = await noticeService.updateNotice(
      req.user.society,
      req.user,
      req.params.id,
      req.body
    );

    ApiResponse.ok(res, "Notice updated successfully.", notice);
  });

  /**
   * POST /notices/:id/publish
   * Publish a notice to society audience.
   */
  publishNotice = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const notice = await noticeService.publishNotice(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Notice published successfully.", notice);
  });

  /**
   * POST /notices/:id/archive
   * Archive a notice.
   */
  archiveNotice = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const notice = await noticeService.archiveNotice(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Notice archived successfully.", notice);
  });

  /**
   * POST /notices/:id/pin
   * Pin notice to top of society board.
   */
  pinNotice = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const notice = await noticeService.pinNotice(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Notice pinned successfully.", notice);
  });

  /**
   * POST /notices/:id/unpin
   * Unpin notice.
   */
  unpinNotice = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const notice = await noticeService.unpinNotice(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Notice unpinned successfully.", notice);
  });

  /**
   * DELETE /notices/:id
   * Soft-delete a notice.
   */
  deleteNotice = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const notice = await noticeService.deleteNotice(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Notice deleted successfully.", notice);
  });
}

export default new NoticeController();
