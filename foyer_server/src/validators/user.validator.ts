import { z } from "zod";

const baseUserSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(50, "Name must be at most 50 characters.")
      .trim(),

    email: z
      .string()
      .email("Invalid email address.")
      .transform((v) => v.toLowerCase()),

    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters.")
      .max(15, "Phone number must be at most 15 characters."),

    tower: z.string().optional(),
    flat: z.string().optional(),
  })
  .strict();

/**
 * POST /user/super-admin
 * POST /user/admin
 * POST /user/guard
 */
export const createUserSchema = baseUserSchema;

/**
 * POST /user/resident
 * Requires tower and flat references.
 */
export const createResidentSchema = baseUserSchema.extend({
  tower: z.string().min(1, "Tower ID is required."),
  flat: z.string().min(1, "Flat ID is required."),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateResidentInput = z.infer<typeof createResidentSchema>;
