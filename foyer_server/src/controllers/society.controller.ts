import { Request, Response } from "express";
import societyService from "../services/society.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
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
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const clerkUserId = req.auth!.clerkUserId;
    const data = req.body as RegisterSocietyInput;

    const result = await societyService.registerSociety(clerkUserId, data);

    ApiResponse.created(res, "Society registered successfully.", result);
  });

  /**
   * GET /society/me
   *
   * Returns the authenticated user's society.
   * Requires a linked account (req.user must exist).
   */
  getMySociety = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const society = await societyService.getMySociety(req.user!.society);

    if (!society) {
      throw ApiError.notFound("Society not found.");
    }

    ApiResponse.ok(res, "Society fetched.", { society });
  });

  /**
   * POST /society/validate-code
   *
   * Public endpoint to validate a 6-character society code or unique ID.
   */
  validateCode = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body as { code: string };
    const result = await societyService.validateCode(code);
    ApiResponse.ok(res, "Code validation completed.", result);
  });
}

export default new SocietyController();
