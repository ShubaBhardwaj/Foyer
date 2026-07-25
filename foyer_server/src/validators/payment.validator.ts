import { z } from "zod";
import { Types } from "mongoose";
import { PaymentMethod, PaymentStatus } from "../models/payment.model";

/**
 * Validate MongoDB ObjectId string format.
 */
const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid Mongo ObjectId format.",
  });

/**
 * Schema for recording a payment for an invoice.
 */
export const recordPaymentSchema = z.object({
  invoiceId: objectIdSchema,
  amount: z.number().min(0.01, "Payment amount must be greater than zero."),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: "Invalid payment method." }),
  }),
  transactionReference: z
    .string()
    .min(3, "Transaction reference must be at least 3 characters.")
    .max(100, "Transaction reference cannot exceed 100 characters."),
  gateway: z.string().optional(),
  gatewayPaymentId: z.string().optional(),
});

/**
 * Schema for query parameters when listing payments.
 */
export const listPaymentsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  invoiceId: z.string().optional(),
  residentId: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  status: z.nativeEnum(PaymentStatus).optional(),
  searchKeyword: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sort: z.string().optional(),
});

/**
 * Schema for validating route param `id`.
 */
export const paymentIdParamsSchema = z.object({
  id: objectIdSchema,
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
export type ListPaymentsInput = z.infer<typeof listPaymentsSchema>;
