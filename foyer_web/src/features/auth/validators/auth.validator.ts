import { z } from "zod";

export const completeLoginSchema = z.object({
  uniqueId: z.string().trim().optional(),
});

export type CompleteLoginFormValues = z.infer<typeof completeLoginSchema>;
