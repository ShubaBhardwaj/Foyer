import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { validate } from "../middleware/validate";
import authController from "../controllers/auth.controller";
import { completeLoginSchema, linkAccountSchema } from "../validators/auth.validator";

const router = Router();

/**
 * POST /auth/complete-login
 * Protected by Clerk JWT. Checks if user exists with clerkId in MongoDB.
 */
router.post(
  "/complete-login",
  clerkAuth,
  validate(completeLoginSchema),
  authController.completeLogin.bind(authController)
);

/**
 * POST /auth/link-account
 * Protected by Clerk JWT. Links user account using societyCode.
 */
router.post(
  "/link-account",
  clerkAuth,
  validate(linkAccountSchema),
  authController.linkAccount.bind(authController)
);

/**
 * GET /auth/me
 * Protected by Clerk JWT. Returns authenticated user profile, society, permissions, and role.
 */
router.get(
  "/me",
  clerkAuth,
  authController.getMe.bind(authController)
);

export default router;

