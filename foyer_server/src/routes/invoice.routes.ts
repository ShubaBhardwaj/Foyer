import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import { requirePermission } from "../middleware/requirePermission";
import { validate } from "../middleware/validate";
import invoiceController from "../controllers/invoice.controller";
import { Permission } from "../constants/permissions";
import {
  listInvoicesSchema,
  invoiceIdParamsSchema,
} from "../validators/invoice.validator";

export const invoiceRouter = Router();

/**
 * GET /invoices
 * List invoices with filtering and role isolation.
 * Required Permission: MAINTENANCE_READ
 */
invoiceRouter.get(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.MAINTENANCE_READ),
  validate(listInvoicesSchema, "query"),
  invoiceController.listInvoices.bind(invoiceController)
);

/**
 * GET /invoices/:id
 * Get single invoice details.
 * Required Permission: MAINTENANCE_READ
 */
invoiceRouter.get(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.MAINTENANCE_READ),
  validate(invoiceIdParamsSchema, "params"),
  invoiceController.getInvoice.bind(invoiceController)
);

export default invoiceRouter;
