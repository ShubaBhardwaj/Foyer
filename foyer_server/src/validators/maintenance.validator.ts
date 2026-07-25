import { z } from "zod";
import { Types } from "mongoose";
import { MaintenanceStatus } from "../models/maintenance.model";

/**
 * Validate MongoDB ObjectId string format.
 */
const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid Mongo ObjectId format.",
  });

/**
 * Schema for creating a maintenance billing cycle.
 */
export const createMaintenanceSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(150, "Title cannot exceed 150 characters."),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters.")
    .max(2000, "Description cannot exceed 2000 characters."),
  billingPeriod: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Billing period must be YYYY-MM format (e.g. 2026-07)."),
  dueDate: z.string().or(z.date()),
  amount: z.number().min(0, "Amount must be a positive number."),
  lateFee: z.number().min(0, "Late fee must be a positive number.").optional().default(0),
});

/**
 * Schema for updating an existing maintenance billing cycle.
 */
export const updateMaintenanceSchema = createMaintenanceSchema.partial();

/**
 * Schema for query parameters when listing maintenance cycles.
 */
export const listMaintenancesSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  billingPeriod: z.string().optional(),
  status: z.nativeEnum(MaintenanceStatus).optional(),
  searchKeyword: z.string().optional(),
  sort: z.string().optional(),
});

/**
 * Schema for validating route param `id`.
 */
export const maintenanceIdParamsSchema = z.object({
  id: objectIdSchema,
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
export type UpdateMaintenanceInput = z.infer<typeof updateMaintenanceSchema>;
export type ListMaintenancesInput = z.infer<typeof listMaintenancesSchema>;
