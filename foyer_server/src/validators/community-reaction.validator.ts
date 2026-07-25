import { z } from "zod";
import { Types } from "mongoose";
import { ReactionType } from "../models/community-reaction.model";

/**
 * Validate MongoDB ObjectId string format.
 */
const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid Mongo ObjectId format.",
  });

/**
 * Schema for adding or updating a reaction.
 */
export const addReactionSchema = z
  .object({
    postId: objectIdSchema.optional(),
    commentId: objectIdSchema.optional(),
    type: z.nativeEnum(ReactionType, {
      errorMap: () => ({ message: "Invalid reaction type." }),
    }).optional().default(ReactionType.LIKE),
  })
  .refine((data) => data.postId || data.commentId, {
    message: "Either postId or commentId must be provided for reaction.",
  });

/**
 * Schema for removing a reaction.
 */
export const removeReactionSchema = z
  .object({
    postId: objectIdSchema.optional(),
    commentId: objectIdSchema.optional(),
  })
  .refine((data) => data.postId || data.commentId, {
    message: "Either postId or commentId must be provided to remove reaction.",
  });

export type AddReactionInput = z.infer<typeof addReactionSchema>;
export type RemoveReactionInput = z.infer<typeof removeReactionSchema>;
