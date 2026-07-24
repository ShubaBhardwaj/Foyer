import { Request, Response } from "express";
import userService from "../services/user.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
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
  async createSuperAdmin(req: Request, res: Response): Promise<void> {
    await this.createUserWithRole(req, res, Role.SUPER_ADMIN);
  }

  /**
   * POST /user/admin
   *
   * Creates a society admin.
   * Allowed: super_admin only.
   */
  async createAdmin(req: Request, res: Response): Promise<void> {
    await this.createUserWithRole(req, res, Role.ADMIN);
  }

  /**
   * POST /user/resident
   *
   * Creates a resident.
   * Allowed: super_admin, admin.
   */
  async createResident(req: Request, res: Response): Promise<void> {
    await this.createUserWithRole(req, res, Role.RESIDENT);
  }

  /**
   * POST /user/guard
   *
   * Creates a guard.
   * Allowed: super_admin, admin.
   */
  async createGuard(req: Request, res: Response): Promise<void> {
    await this.createUserWithRole(req, res, Role.GUARD);
  }

  /**
   * GET /user
   *
   * Gets all users in the creator's society.
   */
  async getSocietyUsers(req: Request, res: Response): Promise<void> {
    try {
      const societyId = req.user!.society;
      const users = await userService.getSocietyUsers(societyId);
      sendSuccess(res, { users }, "Society users fetched successfully.");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to fetch society users.";
      console.error("[UserController.getSocietyUsers]", message);
      sendError(res, message, statusCode);
    }
  }

  /**
   * Shared handler for creating users with a specific role.
   */
  private async createUserWithRole(
    req: Request,
    res: Response,
    role: Role
  ): Promise<void> {
    try {
      const creator = req.user!;

      const newUser = await userService.createUser(creator, role, req.body);

      sendSuccess(
        res,
        { user: newUser },
        `${role.replace("_", " ")} created successfully.`,
        201
      );
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || `Failed to create ${role}.`;
      console.error(`[UserController.create${role}]`, message);
      sendError(res, message, statusCode);
    }
  }
}

export default new UserController();
