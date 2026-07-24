import UserModel, { IUser } from "../models/User";
import SocietyModel, { ISociety } from "../models/Society";
import { fetchClerkUser } from "../utils/clerkUser";
import { clerkClient } from "../config/clerk";

interface LoginResult {
  user: IUser;
  society: ISociety | null;
}

/**
 * AuthService — handles authentication and account linking logic using Mongoose ODM directly.
 */
class AuthService {
  /**
   * Complete login flow.
   *
   * @param clerkUserId - The Clerk user ID from the verified JWT.
   * @param uniqueId - Optional 6-digit Unique ID for first-time login.
   */
  async completeLogin(
    clerkUserId: string,
    uniqueId?: string
  ): Promise<LoginResult> {
    // Step 1: Check if user is already linked (future login).
    const existingUser = await UserModel.findOne({ clerkId: clerkUserId });

    if (existingUser) {
      const society = await SocietyModel.findById(existingUser.society);
      return { user: existingUser, society };
    }

    // Step 2: First login — uniqueId is required.
    if (!uniqueId) {
      // Delete Clerk session/account so user is not left in unlinked state
      await clerkClient.users.deleteUser(clerkUserId).catch((err) => {
        console.error("[AuthService] Error deleting clerk user:", err);
      });

      throw {
        statusCode: 404,
        message:
          "No account linked to this Google account. Please provide your Unique ID for first-time login.",
      };
    }

    // Step 3: Find user by uniqueId.
    const unlinkedUser = await UserModel.findOne({ uniqueId });

    if (!unlinkedUser) {
      // Delete Clerk user if invalid Unique ID is provided
      await clerkClient.users.deleteUser(clerkUserId).catch((err) => {
        console.error("[AuthService] Error deleting clerk user:", err);
      });

      throw {
        statusCode: 404,
        message: `No user found with Unique ID: ${uniqueId}`,
      };
    }

    // Step 4: Check if already linked to a different Clerk account.
    if (unlinkedUser.clerkId) {
      await clerkClient.users.deleteUser(clerkUserId).catch((err) => {
        console.error("[AuthService] Error deleting clerk user:", err);
      });

      throw {
        statusCode: 409,
        message: "This account is already linked to another Google account.",
      };
    }

    // Step 5: Fetch Clerk user profile to verify email match.
    const clerkProfile = await fetchClerkUser(clerkUserId);

    if (clerkProfile.email.toLowerCase() !== unlinkedUser.email.toLowerCase()) {
      // Delete Clerk account when email does not match registered email
      await clerkClient.users.deleteUser(clerkUserId).catch((err) => {
        console.error("[AuthService] Error deleting clerk user:", err);
      });

      throw {
        statusCode: 403,
        message:
          "Your email is not same as you provided at the time of registration.",
      };
    }

    // Step 6: Check if user is blocked.
    if (unlinkedUser.status === "blocked") {
      await clerkClient.users.deleteUser(clerkUserId).catch((err) => {
        console.error("[AuthService] Error deleting clerk user:", err);
      });

      throw {
        statusCode: 403,
        message: "Your account has been blocked. Contact your society admin.",
      };
    }

    // Step 7: Link the Clerk account permanently.
    unlinkedUser.clerkId = clerkUserId;
    unlinkedUser.isVerified = true;
    await unlinkedUser.save();

    const society = await SocietyModel.findById(unlinkedUser.society);

    return { user: unlinkedUser, society };
  }

  /**
   * Get the current authenticated user's profile.
   */
  async getMe(clerkUserId: string): Promise<LoginResult> {
    const user = await UserModel.findOne({ clerkId: clerkUserId });

    if (!user) {
      throw {
        statusCode: 404,
        message: "No account linked to this Google account.",
      };
    }

    const society = await SocietyModel.findById(user.society);

    return { user, society };
  }
}

export default new AuthService();
