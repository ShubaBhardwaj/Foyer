import { Request, Response } from "express";
import authService from "../services/auth.service";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { CompleteLoginInput } from "../validators/auth.validator";

/**
 * AuthController — handles authentication HTTP requests.
 * Delegates all business logic to AuthService.
 */
class AuthController {
  /**
   * POST /auth/complete-login
   *
   * Handles both first-time login (with uniqueId) and future login (clerkId only).
   */
  completeLogin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const clerkUserId = req.auth!.clerkUserId;
    const { uniqueId } = req.body as CompleteLoginInput;

    const result = await authService.completeLogin(clerkUserId, uniqueId);

    ApiResponse.ok(res, "Login successful.", result);
  });

  /**
   * GET /auth/me
   *
   * Returns the current authenticated user's profile and society.
   */
  getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const clerkUserId = req.auth!.clerkUserId;

    const result = await authService.getMe(clerkUserId);

    ApiResponse.ok(res, "User profile fetched.", result);
  });
}

export default new AuthController();
