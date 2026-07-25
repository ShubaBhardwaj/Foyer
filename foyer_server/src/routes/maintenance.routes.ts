import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import { requirePermission } from "../middleware/requirePermission";
import { validate } from "../middleware/validate";
import maintenanceController from "../controllers/maintenance.controller";
import { Permission } from "../constants/permissions";
import {
  createMaintenanceSchema,
  updateMaintenanceSchema,
  listMaintenancesSchema,
  maintenanceIdParamsSchema,
} from "../validators/maintenance.validator";

export const maintenanceRouter = Router();

/**
 * POST /maintenances
 * Create a new maintenance cycle.
 * Required Permission: MAINTENANCE_CREATE
 */
maintenanceRouter.post(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.MAINTENANCE_CREATE),
  validate(createMaintenanceSchema),
  maintenanceController.createMaintenance.bind(maintenanceController)
);

/**
 * GET /maintenances
 * List maintenance cycles.
 * Required Permission: MAINTENANCE_READ
 */
maintenanceRouter.get(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.MAINTENANCE_READ),
  validate(listMaintenancesSchema, "query"),
  maintenanceController.listMaintenances.bind(maintenanceController)
);

/**
 * GET /maintenances/:id
 * Get single maintenance cycle.
 * Required Permission: MAINTENANCE_READ
 */
maintenanceRouter.get(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.MAINTENANCE_READ),
  validate(maintenanceIdParamsSchema, "params"),
  maintenanceController.getMaintenance.bind(maintenanceController)
);

/**
 * PATCH /maintenances/:id
 * Update maintenance cycle.
 * Required Permission: MAINTENANCE_UPDATE
 */
maintenanceRouter.patch(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.MAINTENANCE_UPDATE),
  validate(maintenanceIdParamsSchema, "params"),
  validate(updateMaintenanceSchema),
  maintenanceController.updateMaintenance.bind(maintenanceController)
);

/**
 * POST /maintenances/:id/publish
 * Publish maintenance cycle and generate invoices.
 * Required Permission: MAINTENANCE_PUBLISH
 */
maintenanceRouter.post(
  "/:id/publish",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.MAINTENANCE_PUBLISH),
  validate(maintenanceIdParamsSchema, "params"),
  maintenanceController.publishMaintenance.bind(maintenanceController)
);

/**
 * POST /maintenances/:id/close
 * Close maintenance cycle.
 * Required Permission: MAINTENANCE_UPDATE
 */
maintenanceRouter.post(
  "/:id/close",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.MAINTENANCE_UPDATE),
  validate(maintenanceIdParamsSchema, "params"),
  maintenanceController.closeMaintenance.bind(maintenanceController)
);

export default maintenanceRouter;
