import UserModel, { IUser, Role } from "../models/User";
import SocietyModel, { ISociety } from "../models/Society";
import ApiError from "../utils/apiError";
import { ROLE_PERMISSIONS, Permission } from "../constants/permissions";
import { UserRole } from "../constants/enums";

export interface AuthSuccessPayload {
  success: true;
  requiresSocietyCode?: false;
  user: IUser;
  society: ISociety | null;
  role: string;
  permissions: string[];
}

export interface AuthRequiresCodePayload {
  success: true;
  requiresSocietyCode: true;
}

export type CompleteLoginResult = AuthSuccessPayload | AuthRequiresCodePayload;

/**
 * AuthService — Handles authentication, account linking, and session lookup.
 * MongoDB is the single source of truth for roles, permissions, and society membership.
 */
class AuthService {
  /**
   * Helper to derive primary role and combined permissions from MongoDB User roles.
   */
  private buildRoleAndPermissions(user: IUser): { role: string; permissions: string[] } {
    const roles = user.roles && user.roles.length > 0 ? user.roles : [Role.RESIDENT];
    const primaryRole = roles[0];

    const permissionSet = new Set<string>();
    roles.forEach((r) => {
      // Map User model Role to UserRole enum if needed
      const mappedRole = r as unknown as UserRole;
      const perms = ROLE_PERMISSIONS[mappedRole] || [];
      perms.forEach((p) => permissionSet.add(p));
    });

    return {
      role: primaryRole,
      permissions: Array.from(permissionSet),
    };
  }

  /**
   * Complete login flow step.
   * Checks MongoDB for user where clerkId == incoming clerkId.
   * If found: returns full session (User, Society, Permissions, Role).
   * If not found: returns { success: true, requiresSocietyCode: true }.
   */
  async completeLogin(
    clerkUserId: string,
    _details?: {
      email?: string;
      firstName?: string;
      lastName?: string;
      imageUrl?: string;
    }
  ): Promise<CompleteLoginResult> {
    const isDevUser = clerkUserId.startsWith("dev_");

    const user = await UserModel.findOne({ clerkId: clerkUserId });

    if (!user) {
      // Unlinked Google account -> prompt for society code
      return {
        success: true,
        requiresSocietyCode: true,
      };
    }

    if (user.status === "blocked") {
      throw ApiError.forbidden("Your account has been blocked. Contact your society admin.");
    }

    const society = await SocietyModel.findById(user.society);
    const { role, permissions } = this.buildRoleAndPermissions(user);

    return {
      success: true,
      requiresSocietyCode: false,
      user,
      society,
      role,
      permissions,
    };
  }

  /**
   * Link Google/Clerk Account with Society Code or Unique ID.
   */
  async linkAccount(
    clerkUserId: string,
    societyCode: string
  ): Promise<AuthSuccessPayload> {
    const cleanCode = societyCode.trim();

    // 1. Try finding user by uniqueId (case-insensitive)
    let userToLink = await UserModel.findOne({
      uniqueId: new RegExp(`^${cleanCode}$`, "i"),
    });

    // 2. Fallback: If not found by uniqueId, try finding society by code and an unlinked user in it
    if (!userToLink) {
      const societyObj = await SocietyModel.findOne({
        societyCode: new RegExp(`^${cleanCode}$`, "i"),
      });
      if (societyObj) {
        userToLink = await UserModel.findOne({
          society: societyObj._id,
          $or: [{ clerkId: null }, { clerkId: "" }],
        });
      }
    }

    if (!userToLink) {
      throw ApiError.notFound(`Invalid Society Code or Unique ID: "${societyCode}"`);
    }

    if (userToLink.status === "blocked") {
      throw ApiError.forbidden("Your account has been blocked. Contact your society admin.");
    }

    const isDevUser = clerkUserId.startsWith("dev_");
    if (userToLink.clerkId && !isDevUser && userToLink.clerkId !== clerkUserId) {
      throw ApiError.conflict("This invitation code is already linked to another account.");
    }

    // Link clerkId to MongoDB user
    userToLink.clerkId = isDevUser ? `dev_clerk_user_${userToLink._id.toString()}` : clerkUserId;
    userToLink.isVerified = true;
    await userToLink.save();

    const society = await SocietyModel.findById(userToLink.society);
    const { role, permissions } = this.buildRoleAndPermissions(userToLink);

    return {
      success: true,
      requiresSocietyCode: false,
      user: userToLink,
      society,
      role,
      permissions,
    };
  }

  /**
   * Get the current authenticated user's session profile (GET /auth/me).
   */
  async getMe(clerkUserId: string): Promise<AuthSuccessPayload> {
    const user = await UserModel.findOne({ clerkId: clerkUserId });

    if (!user) {
      throw ApiError.notFound("No account linked to this Google account.");
    }

    if (user.status === "blocked") {
      throw ApiError.forbidden("Your account has been blocked. Contact your society admin.");
    }

    const society = await SocietyModel.findById(user.society);
    const { role, permissions } = this.buildRoleAndPermissions(user);

    return {
      success: true,
      requiresSocietyCode: false,
      user,
      society,
      role,
      permissions,
    };
  }
}

export default new AuthService();

