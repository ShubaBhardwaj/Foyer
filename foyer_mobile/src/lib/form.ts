import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export { zodResolver, z };

/**
 * Common reusable Zod schemas for future form validations.
 */
export const commonSchemas = {
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
};
