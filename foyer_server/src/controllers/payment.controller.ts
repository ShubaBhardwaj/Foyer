import { Request, Response } from "express";
import paymentService from "../services/payment.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

/**
 * PaymentController — Thin HTTP layer for Maintenance Payments.
 */
class PaymentController {
  recordPayment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required.");
    }

    const payment = await paymentService.recordPayment(req.user, req.body);
    ApiResponse.created(res, "Payment recorded successfully.", payment);
  });

  listPayments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const result = await paymentService.listPayments(
      req.user.society,
      req.user,
      req.query as any
    );

    ApiResponse.ok(res, "Payments retrieved successfully.", result.data, result.meta);
  });

  getPayment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const payment = await paymentService.getPaymentById(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Payment details retrieved successfully.", payment);
  });
}

export default new PaymentController();
