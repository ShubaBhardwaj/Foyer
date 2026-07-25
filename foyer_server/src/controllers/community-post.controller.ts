import { Request, Response } from "express";
import communityPostService from "../services/community-post.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

/**
 * CommunityPostController — Thin HTTP layer for Community Posts.
 */
class CommunityPostController {
  createPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required.");
    }

    const post = await communityPostService.createPost(req.user, req.body);
    ApiResponse.created(res, "Community post created successfully.", post);
  });

  listPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const result = await communityPostService.listPosts(
      req.user.society,
      req.user,
      req.query as any
    );

    ApiResponse.ok(res, "Community posts retrieved successfully.", result.data, result.meta);
  });

  getPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const post = await communityPostService.getPostById(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Community post retrieved successfully.", post);
  });

  updatePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const post = await communityPostService.updatePost(
      req.user.society,
      req.user,
      req.params.id,
      req.body
    );

    ApiResponse.ok(res, "Community post updated successfully.", post);
  });

  archivePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const post = await communityPostService.archivePost(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Community post archived successfully.", post);
  });

  deletePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const post = await communityPostService.deletePost(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Community post deleted successfully.", post);
  });
}

export default new CommunityPostController();
