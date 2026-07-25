import { z } from "zod";
import { Types } from "mongoose";
import { PostVisibility, PostStatus } from "../models/community-post.model";

/**
 * Validate MongoDB ObjectId string format.
 */
const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid Mongo ObjectId format.",
  });

/**
 * Schema for creating a new community post.
 */
export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(150, "Title cannot exceed 150 characters."),
  content: z
    .string()
    .min(5, "Content must be at least 5 characters.")
    .max(5000, "Content cannot exceed 5000 characters."),
  images: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  visibility: z
    .nativeEnum(PostVisibility, {
      errorMap: () => ({ message: "Invalid post visibility." }),
    })
    .optional()
    .default(PostVisibility.ALL),
});

/**
 * Schema for updating an existing community post.
 */
export const updatePostSchema = createPostSchema.partial();

/**
 * Schema for query parameters when listing community posts.
 */
export const listPostsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  authorId: z.string().optional(),
  tag: z.string().optional(),
  visibility: z.nativeEnum(PostVisibility).optional(),
  status: z.nativeEnum(PostStatus).optional(),
  searchKeyword: z.string().optional(),
  sort: z.string().optional(),
});

/**
 * Schema for validating route param `id`.
 */
export const postIdParamsSchema = z.object({
  id: objectIdSchema,
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type ListPostsInput = z.infer<typeof listPostsSchema>;
