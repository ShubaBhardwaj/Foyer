import { z } from "zod";
import { Types } from "mongoose";
import { InvoiceStatus } from "../models/invoice.model";

/**
 * Validate MongoDB ObjectId string format.
 */
const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid Mongo ObjectId format.",
  });

/**
 * Schema for query parameters when listing invoices.
 */
export const listInvoicesSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  maintenanceId: z.string().optional(),
  residentId: z.string().optional(),
  flat: z.string().optional(),
  status: z.nativeEnum(InvoiceStatus).optional(),
  searchKeyword: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sort: z.string().optional(),
});

/**
 * Schema for validating route param `id`.
 */
export const invoiceIdParamsSchema = z.object({
  id: objectIdSchema,
});

export type ListInvoicesInput = z.infer<typeof listInvoicesSchema>;
