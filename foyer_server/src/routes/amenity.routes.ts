import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import { requirePermission } from "../middleware/requirePermission";
import { validate } from "../middleware/validate";
import amenityController from "../controllers/amenity.controller";
import { Permission } from "../constants/permissions";
import {
  createAmenitySchema,
  updateAmenitySchema,
  listAmenitiesSchema,
  amenityIdParamsSchema,
} from "../validators/amenity.validator";

export const amenityRouter = Router();

/**
 * POST /amenities
 * Create a new amenity.
 * Required Permission: AMENITY_CREATE
 */
amenityRouter.post(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_CREATE),
  validate(createAmenitySchema),
  amenityController.createAmenity.bind(amenityController)
);

/**
 * GET /amenities
 * List amenities with search, filtering, and pagination.
 * Required Permission: AMENITY_READ
 */
amenityRouter.get(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_READ),
  validate(listAmenitiesSchema, "query"),
  amenityController.listAmenities.bind(amenityController)
);

/**
 * GET /amenities/:id
 * Get details for a single amenity.
 * Required Permission: AMENITY_READ
 */
amenityRouter.get(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_READ),
  validate(amenityIdParamsSchema, "params"),
  amenityController.getAmenity.bind(amenityController)
);

/**
 * PATCH /amenities/:id
 * Update amenity details.
 * Required Permission: AMENITY_UPDATE
 */
amenityRouter.patch(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_UPDATE),
  validate(amenityIdParamsSchema, "params"),
  validate(updateAmenitySchema),
  amenityController.updateAmenity.bind(amenityController)
);

/**
 * POST /amenities/:id/activate
 * Activate amenity.
 * Required Permission: AMENITY_UPDATE
 */
amenityRouter.post(
  "/:id/activate",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_UPDATE),
  validate(amenityIdParamsSchema, "params"),
  amenityController.activateAmenity.bind(amenityController)
);

/**
 * POST /amenities/:id/deactivate
 * Deactivate amenity.
 * Required Permission: AMENITY_UPDATE
 */
amenityRouter.post(
  "/:id/deactivate",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_UPDATE),
  validate(amenityIdParamsSchema, "params"),
  amenityController.deactivateAmenity.bind(amenityController)
);

/**
 * DELETE /amenities/:id
 * Soft-delete amenity.
 * Required Permission: AMENITY_DELETE
 */
amenityRouter.delete(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_DELETE),
  validate(amenityIdParamsSchema, "params"),
  amenityController.deleteAmenity.bind(amenityController)
);

export default amenityRouter;
