import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import { requirePermission } from "../middleware/requirePermission";
import { validate } from "../middleware/validate";
import paymentController from "../controllers/payment.controller";
import { Permission } from "../constants/permissions";
import {
  recordPaymentSchema,
  listPaymentsSchema,
  paymentIdParamsSchema,
} from "../validators/payment.validator";

export const paymentRouter = Router();

/**
 * POST /payments
 * Record a payment for an invoice.
 * Required Permission: MAINTENANCE_PAY
 */
paymentRouter.post(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.MAINTENANCE_PAY),
  validate(recordPaymentSchema),
  paymentController.recordPayment.bind(paymentController)
);

/**
 * GET /payments
 * List payments with filtering and pagination.
 * Required Permission: MAINTENANCE_READ
 */
paymentRouter.get(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.MAINTENANCE_READ),
  validate(listPaymentsSchema, "query"),
  paymentController.listPayments.bind(paymentController)
);

/**
 * GET /payments/:id
 * Get single payment details.
 * Required Permission: MAINTENANCE_READ
 */
paymentRouter.get(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.MAINTENANCE_READ),
  validate(paymentIdParamsSchema, "params"),
  paymentController.getPayment.bind(paymentController)
);

export default paymentRouter;
