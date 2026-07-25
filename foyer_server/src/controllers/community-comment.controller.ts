import { Request, Response } from "express";
import communityCommentService from "../services/community-comment.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

/**
 * CommunityCommentController — Thin HTTP layer for Community Comments.
 */
class CommunityCommentController {
  createComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required.");
    }

    const payload = {
      ...req.body,
      postId: req.params.id || req.body.postId,
    };

    const comment = await communityCommentService.createComment(req.user, payload);
    ApiResponse.created(res, "Comment added successfully.", comment);
  });

  listComments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const comments = await communityCommentService.listCommentsByPost(
      req.user.society,
      req.params.id
    );

    ApiResponse.ok(res, "Comments retrieved successfully.", comments);
  });

  updateComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const comment = await communityCommentService.updateComment(
      req.user.society,
      req.user,
      req.params.id,
      req.body
    );

    ApiResponse.ok(res, "Comment updated successfully.", comment);
  });

  deleteComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const comment = await communityCommentService.deleteComment(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Comment deleted successfully.", comment);
  });
}

export default new CommunityCommentController();
