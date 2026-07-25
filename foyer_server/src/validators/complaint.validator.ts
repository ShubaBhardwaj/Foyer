import { z } from "zod";
import { Types } from "mongoose";
import {
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from "../models/complaint.model";

/**
 * Validate MongoDB ObjectId string format.
 */
const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid Mongo ObjectId format.",
  });

/**
 * Schema for creating a new complaint.
 */
export const createComplaintSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title cannot exceed 100 characters."),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters.")
    .max(2000, "Description cannot exceed 2000 characters."),
  category: z.nativeEnum(ComplaintCategory, {
    errorMap: () => ({ message: "Invalid complaint category." }),
  }),
  priority: z
    .nativeEnum(ComplaintPriority, {
      errorMap: () => ({ message: "Invalid complaint priority." }),
    })
    .optional()
    .default(ComplaintPriority.MEDIUM),
  attachments: z.array(z.string()).optional().default([]),
  location: z.string().max(150, "Location cannot exceed 150 characters.").optional(),
});

/**
 * Schema for updating an existing complaint.
 */
export const updateComplaintSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title cannot exceed 100 characters.")
    .optional(),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters.")
    .max(2000, "Description cannot exceed 2000 characters.")
    .optional(),
  category: z.nativeEnum(ComplaintCategory).optional(),
  priority: z.nativeEnum(ComplaintPriority).optional(),
  attachments: z.array(z.string()).optional(),
  location: z.string().max(150).optional(),
});

/**
 * Schema for assigning a complaint to a staff member / user.
 */
export const assignComplaintSchema = z.object({
  assignedTo: objectIdSchema,
});

/**
 * Schema for resolving a complaint.
 */
export const resolveComplaintSchema = z.object({
  resolutionNotes: z
    .string()
    .max(1000, "Resolution notes cannot exceed 1000 characters.")
    .optional(),
});

/**
 * Schema for closing a complaint.
 */
export const closeComplaintSchema = z.object({
  feedbackRemark: z
    .string()
    .max(1000, "Feedback remark cannot exceed 1000 characters.")
    .optional(),
});

/**
 * Schema for query string parameters when listing complaints.
 */
export const listComplaintsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.nativeEnum(ComplaintStatus).optional(),
  category: z.nativeEnum(ComplaintCategory).optional(),
  priority: z.nativeEnum(ComplaintPriority).optional(),
  assignedTo: z.string().optional(),
  createdBy: z.string().optional(),
  searchKeyword: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sort: z.string().optional(),
});

/**
 * Schema for validating route param `id`.
 */
export const complaintIdParamsSchema = z.object({
  id: objectIdSchema,
});

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>;
export type AssignComplaintInput = z.infer<typeof assignComplaintSchema>;
export type ResolveComplaintInput = z.infer<typeof resolveComplaintSchema>;
export type CloseComplaintInput = z.infer<typeof closeComplaintSchema>;
export type ListComplaintsInput = z.infer<typeof listComplaintsSchema>;
