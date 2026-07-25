import { z } from "zod";
import { Types } from "mongoose";
import {
  AmenityCategory,
  AmenityBookingType,
} from "../models/amenity.model";

/**
 * Validate MongoDB ObjectId string format.
 */
const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid Mongo ObjectId format.",
  });

/**
 * Schema for creating a new amenity.
 */
export const createAmenitySchema = z.object({
  name: z
    .string()
    .min(3, "Amenity name must be at least 3 characters.")
    .max(100, "Amenity name cannot exceed 100 characters."),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters.")
    .max(2000, "Description cannot exceed 2000 characters."),
  category: z.nativeEnum(AmenityCategory, {
    errorMap: () => ({ message: "Invalid amenity category." }),
  }),
  images: z.array(z.string()).optional().default([]),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters.")
    .max(150, "Location cannot exceed 150 characters."),
  capacity: z
    .number()
    .min(1, "Capacity must be at least 1.")
    .max(1000, "Capacity cannot exceed 1000.")
    .optional()
    .default(10),
  openingTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Opening time must be HH:mm format.")
    .optional()
    .default("06:00"),
  closingTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Closing time must be HH:mm format.")
    .optional()
    .default("22:00"),
  slotDuration: z
    .number()
    .min(15, "Slot duration must be at least 15 minutes.")
    .max(1440, "Slot duration cannot exceed 24 hours.")
    .optional()
    .default(60),
  bookingType: z
    .nativeEnum(AmenityBookingType)
    .optional()
    .default(AmenityBookingType.SLOT_BASED),
  bookingWindowDays: z.number().min(1).max(365).optional().default(30),
  cancellationWindowHours: z.number().min(0).max(168).optional().default(24),
  requiresApproval: z.boolean().optional().default(false),
  maxBookingsPerResident: z.number().min(1).max(50).optional().default(3),
  bookingFee: z.number().min(0).optional().default(0),
  securityDeposit: z.number().min(0).optional().default(0),
});

/**
 * Schema for updating an existing amenity.
 */
export const updateAmenitySchema = createAmenitySchema.partial();

/**
 * Schema for query string parameters when listing amenities.
 */
export const listAmenitiesSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.nativeEnum(AmenityCategory).optional(),
  isActive: z.string().optional(),
  searchKeyword: z.string().optional(),
  sort: z.string().optional(),
});

/**
 * Schema for validating route param `id`.
 */
export const amenityIdParamsSchema = z.object({
  id: objectIdSchema,
});

export type CreateAmenityInput = z.infer<typeof createAmenitySchema>;
export type UpdateAmenityInput = z.infer<typeof updateAmenitySchema>;
export type ListAmenitiesInput = z.infer<typeof listAmenitiesSchema>;
