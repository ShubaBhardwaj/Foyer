import UserModel, { IUser } from "../models/User";
import SocietyModel, { ISociety } from "../models/Society";
import { fetchClerkUser } from "../utils/clerkUser";
import { clerkClient } from "../config/clerk";
import ApiError from "../utils/apiError";

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
    const isDevUser = clerkUserId.startsWith("dev_");
    const cleanUniqueId = uniqueId ? uniqueId.trim() : undefined;

    let userToLogin: IUser | null = null;

    // Priority 1: If uniqueId is provided, look up the user by uniqueId (case-insensitive)
    if (cleanUniqueId) {
      userToLogin = await UserModel.findOne({
        uniqueId: new RegExp(`^${cleanUniqueId}$`, "i"),
      });

      // Fallback: If not found by uniqueId, try finding by societyCode
      if (!userToLogin) {
        const society = await SocietyModel.findOne({
          societyCode: new RegExp(`^${cleanUniqueId}$`, "i"),
        });
        if (society) {
          userToLogin = await UserModel.findOne({ society: society._id });
        }
      }
    }

    // Priority 2: If no uniqueId provided, look up user by linked clerkId
    if (!userToLogin && clerkUserId && !isDevUser) {
      userToLogin = await UserModel.findOne({ clerkId: clerkUserId });
    }

    if (!userToLogin) {
      if (!isDevUser) {
        await clerkClient.users.deleteUser(clerkUserId).catch(() => {});
      }
      throw ApiError.notFound(`No user found with Unique ID or Society Code: ${uniqueId}`);
    }

    // Step 4: Check if already linked to a different Clerk account (skip for dev user).
    if (userToLogin.clerkId && !isDevUser && userToLogin.clerkId !== clerkUserId) {
      await clerkClient.users.deleteUser(clerkUserId).catch(() => {});
      throw ApiError.conflict("This account is already linked to another Google account.");
    }

    // Step 5: Fetch Clerk user profile to verify email match (skip for dev user).
    if (!isDevUser) {
      const clerkProfile = await fetchClerkUser(clerkUserId);
      if (clerkProfile.email.toLowerCase() !== userToLogin.email.toLowerCase()) {
        await clerkClient.users.deleteUser(clerkUserId).catch(() => {});
        throw ApiError.forbidden("Your email is not same as you provided at the time of registration.");
      }
    }

    // Step 6: Check if user is blocked.
    if (userToLogin.status === "blocked") {
      if (!isDevUser) {
        await clerkClient.users.deleteUser(clerkUserId).catch(() => {});
      }
      throw ApiError.forbidden("Your account has been blocked. Contact your society admin.");
    }

    // Link clerkId if not set
    if (!userToLogin.clerkId && !isDevUser) {
      userToLogin.clerkId = clerkUserId;
      userToLogin.isVerified = true;
      await userToLogin.save();
    }

    const society = await SocietyModel.findById(userToLogin.society);

    return { user: userToLogin, society };
  }

  /**
   * Get the current authenticated user's profile.
   */
  async getMe(clerkUserId: string): Promise<LoginResult> {
    const user = await UserModel.findOne({ clerkId: clerkUserId });

    if (!user) {
      throw ApiError.notFound("No account linked to this Google account.");
    }

    const society = await SocietyModel.findById(user.society);

    return { user, society };
  }
}

export default new AuthService();
