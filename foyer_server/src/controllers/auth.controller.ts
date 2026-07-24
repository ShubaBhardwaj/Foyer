import { Request, Response } from "express";
import authService from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
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
  async completeLogin(req: Request, res: Response): Promise<void> {
    try {
      const clerkUserId = req.auth!.clerkUserId;
      const { uniqueId } = req.body as CompleteLoginInput;

      const result = await authService.completeLogin(clerkUserId, uniqueId);

      sendSuccess(res, result, "Login successful.");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Login failed.";
      console.error("[AuthController.completeLogin]", message);
      sendError(res, message, statusCode);
    }
  }

  /**
   * GET /auth/me
   *
   * Returns the current authenticated user's profile and society.
   */
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const clerkUserId = req.auth!.clerkUserId;

      const result = await authService.getMe(clerkUserId);

      sendSuccess(res, result, "User profile fetched.");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to fetch user profile.";
      console.error("[AuthController.getMe]", message);
      sendError(res, message, statusCode);
    }
  }
}

export default new AuthController();
