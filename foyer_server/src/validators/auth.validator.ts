import { z } from "zod";

/**
 * POST /auth/complete-login
 *
 * - uniqueId is optional: only provided during first login for non-owner roles.
 * - If omitted, the backend tries to find the user by clerkId (future login).
 */
export const completeLoginSchema = z.object({
  uniqueId: z
    .string()
    .min(1, "Unique ID cannot be empty.")
    .optional(),
});

export type CompleteLoginInput = z.infer<typeof completeLoginSchema>;
