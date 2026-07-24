import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount, requireRole } from "../middleware/roleAuth";
import { validate } from "../middleware/validate";
import societyController from "../controllers/society.controller";
import structureController from "../controllers/structure.controller";
import { registerSocietySchema } from "../validators/society.validator";
import {
  createStructureSchema,
  expandStructureSchema,
  updateStructureSchema,
} from "../validators/structure.validator";
import { Role } from "../models/User";

const router = Router();

/**
 * POST /society/register
 * Registers a new society and creates the owner user.
 */
router.post(
  "/register",
  clerkAuth,
  validate(registerSocietySchema),
  societyController.register.bind(societyController)
);

/**
 * GET /society/me
 * Returns the authenticated user's society.
 */
router.get(
  "/me",
  clerkAuth,
  requireLinkedAccount,
  societyController.getMySociety.bind(societyController)
);

// ─── Society Structure Endpoints ─────────────────────────────────────────────

/**
 * POST /society/structure
 * Generate initial society structure (Towers & Flats).
 * Allowed: owner, super_admin.
 */
router.post(
  "/structure",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.OWNER, Role.SUPER_ADMIN),
  validate(createStructureSchema),
  structureController.generate.bind(structureController)
);

/**
 * POST /society/structure/expand
 * Expand society structure by adding new towers.
 * Allowed: owner, super_admin.
 */
router.post(
  "/structure/expand",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.OWNER, Role.SUPER_ADMIN),
  validate(expandStructureSchema),
  structureController.expand.bind(structureController)
);

/**
 * PATCH /society/structure
 * Bulk update multiple towers in a single request.
 * Allowed: owner, super_admin.
 */
router.patch(
  "/structure",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.OWNER, Role.SUPER_ADMIN),
  validate(updateStructureSchema),
  structureController.update.bind(structureController)
);

/**
 * GET /society/structure
 * Fetch complete society structure (towers & flats).
 * Allowed: owner, super_admin, admin.
 */
router.get(
  "/structure",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.OWNER, Role.SUPER_ADMIN, Role.ADMIN),
  structureController.get.bind(structureController)
);

/**
 * DELETE /society/structure/tower/:towerId
 * Delete a specific tower block.
 * Allowed: owner, super_admin.
 */
router.delete(
  "/structure/tower/:towerId",
  clerkAuth,
  requireLinkedAccount,
  requireRole(Role.OWNER, Role.SUPER_ADMIN),
  structureController.deleteTower.bind(structureController)
);

export default router;
