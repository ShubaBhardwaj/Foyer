import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50).trim(),
  email: z.string().email("Invalid email address.").transform((v) => v.toLowerCase()),
  phone: z.string().min(10, "Phone number must be at least 10 digits.").max(15),
  tower: z.string().optional(),
  flat: z.string().optional(),
});

export const createResidentSchema = createUserSchema.extend({
  tower: z.string().min(1, "Tower selection is required for residents."),
  flat: z.string().min(1, "Flat selection is required for residents."),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type CreateResidentFormValues = z.infer<typeof createResidentSchema>;
