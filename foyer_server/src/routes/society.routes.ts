import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import { validate } from "../middleware/validate";
import societyController from "../controllers/society.controller";
import { registerSocietySchema } from "../validators/society.validator";

const router = Router();

/**
 * POST /society/register
 *
 * Registers a new society and creates the owner user.
 * Protected by Clerk JWT. No role check — this is how owners are bootstrapped.
 * The service layer verifies the Clerk user doesn't already have an account.
 */
router.post(
  "/register",
  clerkAuth,
  validate(registerSocietySchema),
  societyController.register.bind(societyController)
);

/**
 * GET /society/me
 *
 * Returns the authenticated user's society.
 * Requires a linked account (any role).
 */
router.get(
  "/me",
  clerkAuth,
  requireLinkedAccount,
  societyController.getMySociety.bind(societyController)
);

export default router;
