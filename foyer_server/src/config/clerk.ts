import { createClerkClient } from "@clerk/backend";
import { env } from "./env";

/**
 * Initialize the Clerk Backend SDK using the secret key from environment variables.
 * This client is used server-side to verify JWTs and fetch user details from Clerk.
 */
const clerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
});

export { clerkClient };
