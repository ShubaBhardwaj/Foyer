import { Request, Response } from "express";
import communityReactionService from "../services/community-reaction.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

/**
 * CommunityReactionController — Thin HTTP layer for Community Reactions.
 */
class CommunityReactionController {
  addReaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required.");
    }

    const reaction = await communityReactionService.addReaction(req.user, req.body);
    ApiResponse.ok(res, "Reaction recorded successfully.", reaction);
  });

  removeReaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required.");
    }

    const removed = await communityReactionService.removeReaction(req.user, req.body);
    ApiResponse.ok(res, removed ? "Reaction removed successfully." : "No reaction found.", { removed });
  });
}

export default new CommunityReactionController();
