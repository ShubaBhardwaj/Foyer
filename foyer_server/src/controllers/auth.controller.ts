import { Request, Response } from "express";
import authService from "../services/auth.service";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { CompleteLoginInput, LinkAccountInput } from "../validators/auth.validator";

/**
 * AuthController — handles authentication HTTP requests.
 * Delegates all business logic to AuthService.
 */
class AuthController {
  /**
   * POST /auth/complete-login
   * Checks if user exists by clerkId.
   * - If user exists: returns user, society, permissions, role.
   * - If user does NOT exist: returns { success: true, requiresSocietyCode: true }.
   */
  completeLogin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const clerkUserId = req.auth?.clerkUserId || req.body.clerkId;
    const { email, firstName, lastName, imageUrl } = req.body as CompleteLoginInput;

    const result = await authService.completeLogin(clerkUserId, {
      email,
      firstName,
      lastName,
      imageUrl,
    });

    ApiResponse.ok(res, "Complete login evaluated successfully.", result);
  });

  /**
   * POST /auth/link-account
   * Validates societyCode, links clerkId to MongoDB user, returns session.
   */
  linkAccount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const clerkUserId = req.auth?.clerkUserId || req.body.clerkId;
    const { societyCode } = req.body as LinkAccountInput;

    const result = await authService.linkAccount(clerkUserId, societyCode);

    ApiResponse.ok(res, "Account linked successfully.", result);
  });

  /**
   * GET /auth/me
   * Returns the current authenticated user's profile, society, permissions, and role.
   */
  getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const clerkUserId = req.auth!.clerkUserId;

    const result = await authService.getMe(clerkUserId);

    ApiResponse.ok(res, "User profile fetched.", result);
  });
}

export default new AuthController();

