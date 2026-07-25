import { z } from "zod";
import { Types } from "mongoose";
import {
  NoticeCategory,
  NoticePriority,
  NoticeStatus,
  NoticeVisibility,
} from "../models/notice.model";

/**
 * Validate MongoDB ObjectId string format.
 */
const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid Mongo ObjectId format.",
  });

/**
 * Schema for creating a new notice.
 */
export const createNoticeSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(150, "Title cannot exceed 150 characters."),
  content: z
    .string()
    .min(5, "Content must be at least 5 characters.")
    .max(5000, "Content cannot exceed 5000 characters."),
  category: z
    .nativeEnum(NoticeCategory, {
      errorMap: () => ({ message: "Invalid notice category." }),
    })
    .optional()
    .default(NoticeCategory.GENERAL),
  priority: z
    .nativeEnum(NoticePriority, {
      errorMap: () => ({ message: "Invalid notice priority." }),
    })
    .optional()
    .default(NoticePriority.NORMAL),
  visibility: z
    .nativeEnum(NoticeVisibility, {
      errorMap: () => ({ message: "Invalid notice visibility." }),
    })
    .optional()
    .default(NoticeVisibility.ALL),
  attachments: z.array(z.string()).optional().default([]),
  publishAt: z.string().or(z.date()).optional(),
  expiresAt: z.string().or(z.date()).optional().nullable(),
  isPinned: z.boolean().optional().default(false),
  publishNow: z.boolean().optional().default(false),
});

/**
 * Schema for updating an existing notice.
 */
export const updateNoticeSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(150, "Title cannot exceed 150 characters.")
    .optional(),
  content: z
    .string()
    .min(5, "Content must be at least 5 characters.")
    .max(5000, "Content cannot exceed 5000 characters.")
    .optional(),
  category: z.nativeEnum(NoticeCategory).optional(),
  priority: z.nativeEnum(NoticePriority).optional(),
  visibility: z.nativeEnum(NoticeVisibility).optional(),
  attachments: z.array(z.string()).optional(),
  publishAt: z.string().or(z.date()).optional(),
  expiresAt: z.string().or(z.date()).optional().nullable(),
  isPinned: z.boolean().optional(),
});

/**
 * Schema for query string parameters when listing notices.
 */
export const listNoticesSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.nativeEnum(NoticeCategory).optional(),
  status: z.nativeEnum(NoticeStatus).optional(),
  priority: z.nativeEnum(NoticePriority).optional(),
  visibility: z.nativeEnum(NoticeVisibility).optional(),
  publishedBy: z.string().optional(),
  searchKeyword: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sort: z.string().optional(),
});

/**
 * Schema for validating route param `id`.
 */
export const noticeIdParamsSchema = z.object({
  id: objectIdSchema,
});

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;
export type ListNoticesInput = z.infer<typeof listNoticesSchema>;
