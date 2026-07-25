import { z } from "zod";
import { Types } from "mongoose";
import {
  BookingStatus,
  BookingPaymentStatus,
} from "../models/booking.model";

/**
 * Validate MongoDB ObjectId string format.
 */
const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid Mongo ObjectId format.",
  });

/**
 * Schema for creating a facility booking.
 */
export const createBookingSchema = z.object({
  amenityId: objectIdSchema,
  bookingDate: z.string().or(z.date()),
  slotStart: z.string().or(z.date()),
  slotEnd: z.string().or(z.date()),
  purpose: z
    .string()
    .min(3, "Purpose must be at least 3 characters.")
    .max(500, "Purpose cannot exceed 500 characters."),
  attendees: z
    .number()
    .min(1, "Attendees must be at least 1.")
    .max(1000, "Attendees cannot exceed 1000.")
    .optional()
    .default(1),
});

/**
 * Schema for rejecting a booking.
 */
export const rejectBookingSchema = z.object({
  rejectedReason: z
    .string()
    .min(3, "Rejection reason must be at least 3 characters.")
    .max(500, "Rejection reason cannot exceed 500 characters."),
});

/**
 * Schema for cancelling a booking.
 */
export const cancelBookingSchema = z.object({
  cancellationReason: z
    .string()
    .max(500, "Cancellation reason cannot exceed 500 characters.")
    .optional(),
});

/**
 * Schema for query string parameters when listing bookings.
 */
export const listBookingsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  amenityId: z.string().optional(),
  residentId: z.string().optional(),
  status: z.nativeEnum(BookingStatus).optional(),
  paymentStatus: z.nativeEnum(BookingPaymentStatus).optional(),
  searchKeyword: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sort: z.string().optional(),
});

/**
 * Schema for validating route param `id`.
 */
export const bookingIdParamsSchema = z.object({
  id: objectIdSchema,
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type RejectBookingInput = z.infer<typeof rejectBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type ListBookingsInput = z.infer<typeof listBookingsSchema>;
