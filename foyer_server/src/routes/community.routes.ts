import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import { requirePermission } from "../middleware/requirePermission";
import { validate } from "../middleware/validate";
import communityPostController from "../controllers/community-post.controller";
import communityCommentController from "../controllers/community-comment.controller";
import communityReactionController from "../controllers/community-reaction.controller";
import { Permission } from "../constants/permissions";
import {
  createPostSchema,
  updatePostSchema,
  listPostsSchema,
  postIdParamsSchema,
} from "../validators/community-post.validator";
import {
  createCommentSchema,
  updateCommentSchema,
  commentIdParamsSchema,
} from "../validators/community-comment.validator";
import {
  addReactionSchema,
  removeReactionSchema,
} from "../validators/community-reaction.validator";

export const communityRouter = Router();

// ==========================================
// Posts Endpoints
// ==========================================

/**
 * POST /community/posts
 * Create a new community post.
 * Required Permission: COMMUNITY_CREATE
 */
communityRouter.post(
  "/posts",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMMUNITY_CREATE),
  validate(createPostSchema),
  communityPostController.createPost.bind(communityPostController)
);

/**
 * GET /community/posts
 * List community posts.
 * Required Permission: COMMUNITY_READ
 */
communityRouter.get(
  "/posts",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMMUNITY_READ),
  validate(listPostsSchema, "query"),
  communityPostController.listPosts.bind(communityPostController)
);

/**
 * GET /community/posts/:id
 * Get single post details.
 * Required Permission: COMMUNITY_READ
 */
communityRouter.get(
  "/posts/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMMUNITY_READ),
  validate(postIdParamsSchema, "params"),
  communityPostController.getPost.bind(communityPostController)
);

/**
 * PATCH /community/posts/:id
 * Update post details.
 * Required Permission: COMMUNITY_CREATE
 */
communityRouter.patch(
  "/posts/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMMUNITY_CREATE),
  validate(postIdParamsSchema, "params"),
  validate(updatePostSchema),
  communityPostController.updatePost.bind(communityPostController)
);

/**
 * POST /community/posts/:id/archive
 * Archive a post (Moderation).
 * Required Permission: COMMUNITY_MODERATE
 */
communityRouter.post(
  "/posts/:id/archive",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMMUNITY_MODERATE),
  validate(postIdParamsSchema, "params"),
  communityPostController.archivePost.bind(communityPostController)
);

/**
 * DELETE /community/posts/:id
 * Soft-delete a post.
 * Required Permission: COMMUNITY_DELETE
 */
communityRouter.delete(
  "/posts/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMMUNITY_DELETE),
  validate(postIdParamsSchema, "params"),
  communityPostController.deletePost.bind(communityPostController)
);

// ==========================================
// Comments Endpoints
// ==========================================

/**
 * POST /community/posts/:id/comments
 * Add a comment or reply to a post.
 * Required Permission: COMMUNITY_CREATE
 */
communityRouter.post(
  "/posts/:id/comments",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMMUNITY_CREATE),
  validate(postIdParamsSchema, "params"),
  validate(createCommentSchema),
  communityCommentController.createComment.bind(communityCommentController)
);

/**
 * GET /community/posts/:id/comments
 * List all comments for a post.
 * Required Permission: COMMUNITY_READ
 */
communityRouter.get(
  "/posts/:id/comments",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMMUNITY_READ),
  validate(postIdParamsSchema, "params"),
  communityCommentController.listComments.bind(communityCommentController)
);

/**
 * PATCH /community/comments/:id
 * Update comment content.
 * Required Permission: COMMUNITY_CREATE
 */
communityRouter.patch(
  "/comments/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMMUNITY_CREATE),
  validate(commentIdParamsSchema, "params"),
  validate(updateCommentSchema),
  communityCommentController.updateComment.bind(communityCommentController)
);

/**
 * DELETE /community/comments/:id
 * Delete a comment.
 * Required Permission: COMMUNITY_DELETE
 */
communityRouter.delete(
  "/comments/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMMUNITY_DELETE),
  validate(commentIdParamsSchema, "params"),
  communityCommentController.deleteComment.bind(communityCommentController)
);

// ==========================================
// Reactions Endpoints
// ==========================================

/**
 * POST /community/reactions
 * Add or update reaction on post or comment.
 * Required Permission: COMMUNITY_CREATE
 */
communityRouter.post(
  "/reactions",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMMUNITY_CREATE),
  validate(addReactionSchema),
  communityReactionController.addReaction.bind(communityReactionController)
);

/**
 * DELETE /community/reactions
 * Remove reaction from post or comment.
 * Required Permission: COMMUNITY_CREATE
 */
communityRouter.delete(
  "/reactions",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.COMMUNITY_CREATE),
  validate(removeReactionSchema),
  communityReactionController.removeReaction.bind(communityReactionController)
);

export default communityRouter;
