import { clerkClient } from "../config/clerk";

/**
 * Shape of the extracted Clerk user profile.
 * Contains only the fields needed for account linking.
 */
export interface ClerkUserProfile {
  clerkId: string;
  email: string;
  name: string;
  imageUrl: string;
}

/**
 * Fetch a Clerk user by their Clerk User ID and extract relevant profile fields.
 *
 * Used during:
 * - Society registration (owner first login)
 * - Account linking (first login for admin/resident/guard)
 *
 * @param clerkUserId - The Clerk user ID from the verified JWT.
 * @returns The extracted profile fields.
 * @throws If the Clerk user has no email address.
 */
export async function fetchClerkUser(
  clerkUserId: string
): Promise<ClerkUserProfile> {
  const user = await clerkClient.users.getUser(clerkUserId);

  // Prefer the primary email address; fall back gracefully.
  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error(`Clerk user ${clerkUserId} has no email address.`);
  }

  // Build display name from Clerk profile
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    email.split("@")[0];

  return {
    clerkId: user.id,
    email: email.toLowerCase(),
    name,
    imageUrl: user.imageUrl ?? "",
  };
}
