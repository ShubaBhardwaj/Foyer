import { z } from "zod";
import { Types } from "mongoose";
import { VisitorStatus } from "../constants/enums";
import { VisitorType } from "../constants/visitor.enums";

/**
 * Reusable ObjectId validation helper for Zod schemas.
 */
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId format.",
});

/**
 * Coerced Date validation helper.
 */
const dateSchema = z.coerce.date({
  errorMap: () => ({ message: "Must be a valid date." }),
});

/**
 * Create Visitor Request Schema.
 */
export const createVisitorSchema = z
  .object({
    fullName: z
      .string({ required_error: "Full name is required." })
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name cannot exceed 100 characters.")
      .trim(),

    phoneNumber: z
      .string({ required_error: "Phone number is required." })
      .min(8, "Phone number must be at least 8 digits.")
      .max(15, "Phone number cannot exceed 15 digits.")
      .trim(),

    email: z
      .string()
      .email("Invalid email format.")
      .trim()
      .toLowerCase()
      .optional()
      .or(z.literal("")),

    photoUrl: z
      .string()
      .url("Invalid photo URL.")
      .optional()
      .or(z.literal("")),

    visitorType: z.nativeEnum(VisitorType, {
      errorMap: () => ({ message: "Invalid visitor type." }),
    }),

    purpose: z
      .string()
      .max(300, "Purpose cannot exceed 300 characters.")
      .trim()
      .optional(),

    notes: z
      .string()
      .max(500, "Notes cannot exceed 500 characters.")
      .trim()
      .optional(),

    vehicleNumber: z
      .string()
      .max(25, "Vehicle number cannot exceed 25 characters.")
      .trim()
      .toUpperCase()
      .optional(),

    expectedArrival: dateSchema,

    expectedDeparture: dateSchema.optional(),

    society: objectIdSchema,
    tower: objectIdSchema,
    flat: objectIdSchema,
    resident: objectIdSchema,
  })
  .refine(
    (data) => {
      if (data.expectedDeparture && data.expectedArrival) {
        return data.expectedDeparture >= data.expectedArrival;
      }
      return true;
    },
    {
      message: "expectedDeparture must be greater than or equal to expectedArrival.",
      path: ["expectedDeparture"],
    }
  );

/**
 * Update Visitor Schema (Only editable fields; excludes system-managed status/entryCode/timestamps).
 */
export const updateVisitorSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name cannot exceed 100 characters.")
      .trim()
      .optional(),

    phoneNumber: z
      .string()
      .min(8, "Phone number must be at least 8 digits.")
      .max(15, "Phone number cannot exceed 15 digits.")
      .trim()
      .optional(),

    email: z
      .string()
      .email("Invalid email format.")
      .trim()
      .toLowerCase()
      .optional()
      .or(z.literal("")),

    photoUrl: z
      .string()
      .url("Invalid photo URL.")
      .optional()
      .or(z.literal("")),

    visitorType: z
      .nativeEnum(VisitorType, {
        errorMap: () => ({ message: "Invalid visitor type." }),
      })
      .optional(),

    purpose: z
      .string()
      .max(300, "Purpose cannot exceed 300 characters.")
      .trim()
      .optional(),

    notes: z
      .string()
      .max(500, "Notes cannot exceed 500 characters.")
      .trim()
      .optional(),

    vehicleNumber: z
      .string()
      .max(25, "Vehicle number cannot exceed 25 characters.")
      .trim()
      .toUpperCase()
      .optional(),

    expectedArrival: dateSchema.optional(),

    expectedDeparture: dateSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.expectedDeparture && data.expectedArrival) {
        return data.expectedDeparture >= data.expectedArrival;
      }
      return true;
    },
    {
      message: "expectedDeparture must be greater than or equal to expectedArrival.",
      path: ["expectedDeparture"],
    }
  );

/**
 * Approve Visitor Schema (Optional remark).
 */
export const approveVisitorSchema = z.object({
  statusRemark: z
    .string()
    .max(300, "Status remark cannot exceed 300 characters.")
    .trim()
    .optional(),
});

/**
 * Reject Visitor Schema (Mandatory reason).
 */
export const rejectVisitorSchema = z.object({
  statusRemark: z
    .string({ required_error: "Rejection reason is mandatory." })
    .min(1, "Rejection reason is mandatory.")
    .max(300, "Status remark cannot exceed 300 characters.")
    .trim(),
});

/**
 * Cancel Visitor Schema (Optional remark).
 */
export const cancelVisitorSchema = z.object({
  statusRemark: z
    .string()
    .max(300, "Status remark cannot exceed 300 characters.")
    .trim()
    .optional(),
});

/**
 * Check-In Visitor Schema (Optional entry code for QR pass support).
 */
export const checkInVisitorSchema = z.object({
  entryCode: z
    .string()
    .max(20, "Entry code cannot exceed 20 characters.")
    .trim()
    .optional(),
});

/**
 * Check-Out Visitor Schema (No request body).
 */
export const checkOutVisitorSchema = z.object({});

/**
 * List Visitors Query Schema.
 */
export const listVisitorsSchema = z
  .object({
    page: z.coerce.number().min(1, "Page must be at least 1.").default(1),

    limit: z.coerce
      .number()
      .min(1, "Limit must be at least 1.")
      .max(100, "Limit cannot exceed 100.")
      .default(20),

    status: z
      .nativeEnum(VisitorStatus, {
        errorMap: () => ({ message: "Invalid visitor status filter." }),
      })
      .optional(),

    visitorType: z
      .nativeEnum(VisitorType, {
        errorMap: () => ({ message: "Invalid visitor type filter." }),
      })
      .optional(),

    tower: objectIdSchema.optional(),

    flat: objectIdSchema.optional(),

    resident: objectIdSchema.optional(),

    search: z
      .string()
      .max(100, "Search query cannot exceed 100 characters.")
      .trim()
      .optional(),

    dateFrom: dateSchema.optional(),

    dateTo: dateSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.dateFrom && data.dateTo) {
        return data.dateTo >= data.dateFrom;
      }
      return true;
    },
    {
      message: "dateTo must be greater than or equal to dateFrom.",
      path: ["dateTo"],
    }
  );

// TypeScript Inferred Input Types
export type CreateVisitorInput = z.infer<typeof createVisitorSchema>;
export type UpdateVisitorInput = z.infer<typeof updateVisitorSchema>;
export type ApproveVisitorInput = z.infer<typeof approveVisitorSchema>;
export type RejectVisitorInput = z.infer<typeof rejectVisitorSchema>;
export type CancelVisitorInput = z.infer<typeof cancelVisitorSchema>;
export type CheckInVisitorInput = z.infer<typeof checkInVisitorSchema>;
export type CheckOutVisitorInput = z.infer<typeof checkOutVisitorSchema>;
export type ListVisitorsInput = z.infer<typeof listVisitorsSchema>;
