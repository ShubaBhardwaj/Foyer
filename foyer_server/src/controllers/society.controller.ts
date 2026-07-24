import { Request, Response } from "express";
import societyService from "../services/society.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { RegisterSocietyInput } from "../validators/society.validator";

/**
 * SocietyController — handles society-related HTTP requests.
 * Delegates all business logic to SocietyService.
 */
class SocietyController {
  /**
   * POST /society/register
   *
   * Registers a new society and creates the owner user.
   * Only callable by authenticated Clerk users who don't already have an account.
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const clerkUserId = req.auth!.clerkUserId;
      const data = req.body as RegisterSocietyInput;

      const result = await societyService.registerSociety(clerkUserId, data);

      sendSuccess(res, result, "Society registered successfully.", 201);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to register society.";
      console.error("[SocietyController.register]", message);
      sendError(res, message, statusCode);
    }
  }

  /**
   * GET /society/me
   *
   * Returns the authenticated user's society.
   * Requires a linked account (req.user must exist).
   */
  async getMySociety(req: Request, res: Response): Promise<void> {
    try {
      const society = await societyService.getMySociety(req.user!.society);

      if (!society) {
        sendError(res, "Society not found.", 404);
        return;
      }

      sendSuccess(res, { society }, "Society fetched.");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to fetch society.";
      console.error("[SocietyController.getMySociety]", message);
      sendError(res, message, statusCode);
    }
  }
}

export default new SocietyController();
