import { Request, Response } from "express";
import bookingService from "../services/booking.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

/**
 * BookingController — Thin HTTP layer for Facility Bookings management.
 * Delegating 100% of business logic to BookingService.
 */
class BookingController {
  /**
   * POST /bookings
   * Create a new facility booking.
   */
  createBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required.");
    }

    const booking = await bookingService.createBooking(req.user, req.body);
    ApiResponse.created(res, "Booking created successfully.", booking);
  });

  /**
   * GET /bookings
   * List bookings with filtering, search, and pagination.
   */
  listBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const result = await bookingService.listBookings(
      req.user.society,
      req.user,
      req.query as any
    );

    ApiResponse.ok(res, "Bookings retrieved successfully.", result.data, result.meta);
  });

  /**
   * GET /bookings/:id
   * Get details for a single booking by ID.
   */
  getBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const booking = await bookingService.getBookingById(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Booking details retrieved successfully.", booking);
  });

  /**
   * POST /bookings/:id/approve
   * Approve a pending booking.
   */
  approveBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const booking = await bookingService.approveBooking(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Booking approved successfully.", booking);
  });

  /**
   * POST /bookings/:id/reject
   * Reject a pending booking.
   */
  rejectBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const booking = await bookingService.rejectBooking(
      req.user.society,
      req.user,
      req.params.id,
      req.body
    );

    ApiResponse.ok(res, "Booking rejected successfully.", booking);
  });

  /**
   * POST /bookings/:id/cancel
   * Cancel a booking.
   */
  cancelBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const booking = await bookingService.cancelBooking(
      req.user.society,
      req.user,
      req.params.id,
      req.body
    );

    ApiResponse.ok(res, "Booking cancelled successfully.", booking);
  });

  /**
   * POST /bookings/:id/complete
   * Complete a booking.
   */
  completeBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const booking = await bookingService.completeBooking(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Booking completed successfully.", booking);
  });
}

export default new BookingController();
