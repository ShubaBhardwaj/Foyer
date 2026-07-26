import { z } from "zod";

/**
 * POST /auth/complete-login
 */
export const completeLoginSchema = z.object({
  clerkId: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type CompleteLoginInput = z.infer<typeof completeLoginSchema>;

/**
 * POST /auth/link-account
 */
export const linkAccountSchema = z.object({
  clerkId: z.string().optional(),
  societyCode: z.string().min(1, "Society Code is required."),
});

export type LinkAccountInput = z.infer<typeof linkAccountSchema>;

