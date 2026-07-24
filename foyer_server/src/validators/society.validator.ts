import { z } from "zod";

/**
 * POST /society/register
 *
 * Owner registers a new society.
 * ownerName and ownerPhone are used to create the Owner user document.
 */
export const registerSocietySchema = z.object({
  name: z
    .string()
    .min(2, "Society name must be at least 2 characters.")
    .max(100, "Society name must be at most 100 characters.")
    .trim(),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters.")
    .trim(),

  city: z
    .string()
    .min(2, "City must be at least 2 characters.")
    .trim(),

  state: z
    .string()
    .min(2, "State must be at least 2 characters.")
    .trim(),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits."),

  ownerName: z
    .string()
    .min(2, "Owner name must be at least 2 characters.")
    .max(50, "Owner name must be at most 50 characters.")
    .trim(),

  ownerPhone: z
    .string()
    .min(10, "Phone number must be at least 10 characters.")
    .max(15, "Phone number must be at most 15 characters."),
});

export type RegisterSocietyInput = z.infer<typeof registerSocietySchema>;
