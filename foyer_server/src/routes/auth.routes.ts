import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { validate } from "../middleware/validate";
import authController from "../controllers/auth.controller";
import { completeLoginSchema } from "../validators/auth.validator";

const router = Router();

/**
 * POST /auth/complete-login
 *
 * Handles both first-time login (account linking) and future login.
 * - First login: client sends { uniqueId } in the body.
 * - Future login: no body needed, user is found by clerkId.
 *
 * Protected by Clerk JWT. No role check — user may not be linked yet.
 */
router.post(
  "/complete-login",
  clerkAuth,
  validate(completeLoginSchema),
  authController.completeLogin.bind(authController)
);

/**
 * GET /auth/me
 *
 * Returns the current user's profile and society.
 * Protected by Clerk JWT. User must be linked.
 */
router.get(
  "/me",
  clerkAuth,
  authController.getMe.bind(authController)
);

export default router;
