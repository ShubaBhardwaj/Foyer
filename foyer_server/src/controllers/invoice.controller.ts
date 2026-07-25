import { Request, Response } from "express";
import invoiceService from "../services/invoice.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

/**
 * InvoiceController — Thin HTTP layer for Resident Invoices.
 */
class InvoiceController {
  listInvoices = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const result = await invoiceService.listInvoices(
      req.user.society,
      req.user,
      req.query as any
    );

    ApiResponse.ok(res, "Invoices retrieved successfully.", result.data, result.meta);
  });

  getInvoice = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const invoice = await invoiceService.getInvoiceById(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Invoice details retrieved successfully.", invoice);
  });
}

export default new InvoiceController();
