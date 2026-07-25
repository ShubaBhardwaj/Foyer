import { Request, Response } from "express";
import amenityService from "../services/amenity.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

/**
 * AmenityController — Thin HTTP layer for Society Amenities management.
 * Delegating 100% of business logic to AmenityService.
 */
class AmenityController {
  /**
   * POST /amenities
   * Create a new amenity.
   */
  createAmenity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required.");
    }

    const amenity = await amenityService.createAmenity(req.user, req.body);
    ApiResponse.created(res, "Amenity created successfully.", amenity);
  });

  /**
   * GET /amenities
   * List amenities with filtering and pagination.
   */
  listAmenities = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const result = await amenityService.listAmenities(
      req.user.society,
      req.query as any
    );

    ApiResponse.ok(res, "Amenities retrieved successfully.", result.data, result.meta);
  });

  /**
   * GET /amenities/:id
   * Get details for a single amenity by ID.
   */
  getAmenity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const amenity = await amenityService.getAmenityById(
      req.user.society,
      req.params.id
    );

    ApiResponse.ok(res, "Amenity details retrieved successfully.", amenity);
  });

  /**
   * PATCH /amenities/:id
   * Update amenity details.
   */
  updateAmenity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const amenity = await amenityService.updateAmenity(
      req.user.society,
      req.user,
      req.params.id,
      req.body
    );

    ApiResponse.ok(res, "Amenity updated successfully.", amenity);
  });

  /**
   * POST /amenities/:id/activate
   * Activate amenity.
   */
  activateAmenity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const amenity = await amenityService.activateAmenity(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Amenity activated successfully.", amenity);
  });

  /**
   * POST /amenities/:id/deactivate
   * Deactivate amenity.
   */
  deactivateAmenity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const amenity = await amenityService.deactivateAmenity(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Amenity deactivated successfully.", amenity);
  });

  /**
   * DELETE /amenities/:id
   * Soft-delete amenity.
   */
  deleteAmenity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const amenity = await amenityService.deleteAmenity(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Amenity deleted successfully.", amenity);
  });
}

export default new AmenityController();
