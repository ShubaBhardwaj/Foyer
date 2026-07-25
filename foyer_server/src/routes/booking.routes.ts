import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import { requirePermission } from "../middleware/requirePermission";
import { validate } from "../middleware/validate";
import bookingController from "../controllers/booking.controller";
import { Permission } from "../constants/permissions";
import {
  createBookingSchema,
  rejectBookingSchema,
  cancelBookingSchema,
  listBookingsSchema,
  bookingIdParamsSchema,
} from "../validators/booking.validator";

export const bookingRouter = Router();

/**
 * POST /bookings
 * Create a new facility booking.
 * Required Permission: AMENITY_BOOK
 */
bookingRouter.post(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_BOOK),
  validate(createBookingSchema),
  bookingController.createBooking.bind(bookingController)
);

/**
 * GET /bookings
 * List facility bookings with filtering and pagination.
 * Required Permission: AMENITY_READ
 */
bookingRouter.get(
  "/",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_READ),
  validate(listBookingsSchema, "query"),
  bookingController.listBookings.bind(bookingController)
);

/**
 * GET /bookings/:id
 * Get details for a single booking.
 * Required Permission: AMENITY_READ
 */
bookingRouter.get(
  "/:id",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_READ),
  validate(bookingIdParamsSchema, "params"),
  bookingController.getBooking.bind(bookingController)
);

/**
 * POST /bookings/:id/approve
 * Approve a pending booking.
 * Required Permission: AMENITY_APPROVE
 */
bookingRouter.post(
  "/:id/approve",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_APPROVE),
  validate(bookingIdParamsSchema, "params"),
  bookingController.approveBooking.bind(bookingController)
);

/**
 * POST /bookings/:id/reject
 * Reject a pending booking.
 * Required Permission: AMENITY_APPROVE
 */
bookingRouter.post(
  "/:id/reject",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_APPROVE),
  validate(bookingIdParamsSchema, "params"),
  validate(rejectBookingSchema),
  bookingController.rejectBooking.bind(bookingController)
);

/**
 * POST /bookings/:id/cancel
 * Cancel a booking.
 * Required Permission: AMENITY_BOOK
 */
bookingRouter.post(
  "/:id/cancel",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_BOOK),
  validate(bookingIdParamsSchema, "params"),
  validate(cancelBookingSchema),
  bookingController.cancelBooking.bind(bookingController)
);

/**
 * POST /bookings/:id/complete
 * Complete a booking.
 * Required Permission: AMENITY_APPROVE
 */
bookingRouter.post(
  "/:id/complete",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.AMENITY_APPROVE),
  validate(bookingIdParamsSchema, "params"),
  bookingController.completeBooking.bind(bookingController)
);

export default bookingRouter;
