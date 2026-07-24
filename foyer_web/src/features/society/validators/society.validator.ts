import { z } from "zod";

export const registerSocietySchema = z.object({
  name: z.string().min(2, "Society name must be at least 2 characters.").max(100).trim(),
  address: z.string().min(5, "Address must be at least 5 characters.").trim(),
  city: z.string().min(2, "City must be at least 2 characters.").trim(),
  state: z.string().min(2, "State must be at least 2 characters.").trim(),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits."),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters.").max(50).trim(),
  ownerPhone: z.string().min(10, "Phone number must be at least 10 digits.").max(15),
});

export type RegisterSocietyFormValues = z.infer<typeof registerSocietySchema>;
