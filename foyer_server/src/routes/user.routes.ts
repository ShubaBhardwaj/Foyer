import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireRole } from "../middleware/roleAuth";
import { validate } from "../middleware/validate";
import userController from "../controllers/user.controller";
import { createUserSchema, createResidentSchema } from "../validators/user.validator";
import { Role } from "../models/User";

const router = Router();

/**
 * POST /user/super-admin
 *
 * Creates a super admin for the society.
 * Allowed: owner only.
 */
router.post(
  "/super-admin",
  clerkAuth,
  requireRole(Role.OWNER),
  validate(createUserSchema),
  userController.createSuperAdmin.bind(userController)
);

/**
 * POST /user/admin
 *
 * Creates a society admin.
 * Allowed: super_admin only.
 */
router.post(
  "/admin",
  clerkAuth,
  requireRole(Role.SUPER_ADMIN),
  validate(createUserSchema),
  userController.createAdmin.bind(userController)
);

/**
 * POST /user/resident
 *
 * Creates a resident.
 * Allowed: super_admin, admin.
 */
router.post(
  "/resident",
  clerkAuth,
  requireRole(Role.SUPER_ADMIN, Role.ADMIN),
  validate(createResidentSchema),
  userController.createResident.bind(userController)
);

/**
 * POST /user/guard
 *
 * Creates a guard.
 * Allowed: super_admin, admin.
 */
router.post(
  "/guard",
  clerkAuth,
  requireRole(Role.SUPER_ADMIN, Role.ADMIN),
  validate(createUserSchema),
  userController.createGuard.bind(userController)
);

export default router;
