import { Request, Response } from "express";
import userService from "../services/user.service";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { Role } from "../models/User";

/**
 * UserController — handles user management HTTP requests.
 * All endpoints are resource-based; permissions are enforced by middleware.
 */
class UserController {
  /**
   * POST /user/super-admin
   *
   * Creates a super admin for the creator's society.
   * Allowed: owner only.
   */
  createSuperAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.createUserWithRole(req, res, Role.SUPER_ADMIN);
  });

  /**
   * POST /user/admin
   *
   * Creates a society admin.
   * Allowed: super_admin only.
   */
  createAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.createUserWithRole(req, res, Role.ADMIN);
  });

  /**
   * POST /user/resident
   *
   * Creates a resident.
   * Allowed: super_admin, admin.
   */
  createResident = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.createUserWithRole(req, res, Role.RESIDENT);
  });

  /**
   * POST /user/guard
   *
   * Creates a guard.
   * Allowed: super_admin, admin.
   */
  createGuard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.createUserWithRole(req, res, Role.GUARD);
  });

  /**
   * GET /user
   *
   * Gets all users in the creator's society.
   */
  getSocietyUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const societyId = req.user!.society;
    const users = await userService.getSocietyUsers(societyId);
    ApiResponse.ok(res, "Society users fetched successfully.", { users });
  });

  /**
   * Shared handler for creating users with a specific role.
   */
  private async createUserWithRole(
    req: Request,
    res: Response,
    role: Role
  ): Promise<void> {
    const creator = req.user!;

    const newUser = await userService.createUser(creator, role, req.body);

    ApiResponse.created(
      res,
      `${role.replace("_", " ")} created successfully.`,
      { user: newUser }
    );
  }
}

export default new UserController();
