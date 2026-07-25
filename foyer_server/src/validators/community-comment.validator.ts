import { z } from "zod";
import { Types } from "mongoose";

/**
 * Validate MongoDB ObjectId string format.
 */
const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid Mongo ObjectId format.",
  });

/**
 * Schema for creating a comment or reply.
 */
export const createCommentSchema = z.object({
  postId: objectIdSchema,
  content: z
    .string()
    .min(1, "Comment content cannot be empty.")
    .max(1000, "Comment content cannot exceed 1000 characters."),
  parentCommentId: objectIdSchema.optional(),
});

/**
 * Schema for updating an existing comment.
 */
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content cannot be empty.")
    .max(1000, "Comment content cannot exceed 1000 characters."),
});

/**
 * Schema for validating route param `id`.
 */
export const commentIdParamsSchema = z.object({
  id: objectIdSchema,
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
