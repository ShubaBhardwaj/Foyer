import mongoose, { Types } from "mongoose";
import BookingModel, {
  IBooking,
  BookingStatus,
  BookingPaymentStatus,
} from "../models/booking.model";
import AmenityModel from "../models/amenity.model";
import { Role, IUser } from "../models/User";
import ApiError from "../utils/apiError";
import auditService from "./audit.service";
import { AuditAction, AuditResourceType } from "../models/audit.model";
import activityService from "./activity.service";
import { ActivityType, ActivityVisibility } from "../models/activity.model";
import notificationService from "./notification.service";
import jobService from "./job.service";
import { JobType } from "../types/job.types";
import searchService from "./search.service";
import { validateObjectId } from "../utils/validation";
import { SearchResult } from "../types/search.types";
import {
  CreateBookingInput,
  RejectBookingInput,
  CancelBookingInput,
  ListBookingsInput,
} from "../validators/booking.validator";

/**
 * BookingService — Business logic layer for Facility Bookings management.
 */
class BookingService {
  /**
   * Create a facility booking with transaction-based overlap and double-booking checks.
   */
  async createBooking(
    resident: IUser,
    data: CreateBookingInput
  ): Promise<IBooking> {
    if (!resident.society) {
      throw ApiError.forbidden("User account is not linked to any society.");
    }

    validateObjectId(data.amenityId, "Amenity ID");

    const amenity = await AmenityModel.findOne({
      _id: data.amenityId,
      society: resident.society,
      isDeleted: { $ne: true },
    });

    if (!amenity) {
      throw ApiError.notFound("Amenity not found.");
    }

    if (!amenity.isActive) {
      throw ApiError.badRequest("Amenity is currently inactive and unavailable for booking.");
    }

    const start = new Date(data.slotStart);
    const end = new Date(data.slotEnd);
    const date = new Date(data.bookingDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      throw ApiError.badRequest("Invalid booking slot timestamps. Slot start must be before slot end.");
    }

    const now = new Date();
    if (start < now) {
      throw ApiError.badRequest("Booking slot cannot be in the past.");
    }

    // Booking window validation
    const maxFutureDate = new Date();
    maxFutureDate.setDate(maxFutureDate.getDate() + amenity.bookingWindowDays);
    if (start > maxFutureDate) {
      throw ApiError.badRequest(
        `Bookings can only be made up to ${amenity.bookingWindowDays} days in advance.`
      );
    }

    // Resident active booking limit check
    const activeResidentBookingsCount = await BookingModel.countDocuments({
      society: resident.society,
      amenity: amenity._id,
      resident: resident._id,
      status: { $in: [BookingStatus.PENDING, BookingStatus.APPROVED] },
      isDeleted: { $ne: true },
    });

    if (activeResidentBookingsCount >= amenity.maxBookingsPerResident) {
      throw ApiError.badRequest(
        `Maximum active bookings limit (${amenity.maxBookingsPerResident}) reached for this amenity.`
      );
    }

    // Transaction to prevent double booking race conditions
    const session = await mongoose.startSession();
    session.startTransaction();

    let createdBooking: IBooking;

    try {
      const overlappingBooking = await BookingModel.findOne({
        amenity: amenity._id,
        status: { $in: [BookingStatus.PENDING, BookingStatus.APPROVED] },
        isDeleted: { $ne: true },
        $or: [
          { slotStart: { $lt: end }, slotEnd: { $gt: start } },
        ],
      }).session(session);

      if (overlappingBooking) {
        throw ApiError.conflict(
          "Requested slot conflicts with an existing booking. Please select another time."
        );
      }

      const initialStatus = amenity.requiresApproval
        ? BookingStatus.PENDING
        : BookingStatus.APPROVED;

      const paymentStatus = amenity.bookingFee > 0
        ? BookingPaymentStatus.PENDING
        : BookingPaymentStatus.NOT_REQUIRED;

      const [newBooking] = await BookingModel.create(
        [
          {
            society: resident.society,
            amenity: amenity._id,
            resident: resident._id,
            bookingDate: date,
            slotStart: start,
            slotEnd: end,
            purpose: data.purpose,
            attendees: data.attendees || 1,
            status: initialStatus,
            paymentStatus,
            isDeleted: false,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      createdBooking = newBooking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    // Shared infrastructure side effects
    await this.safeAuditLog({
      actor: resident._id,
      actorRole: resident.roles[0] || "resident",
      society: resident.society,
      action: AuditAction.BOOKING_CREATED,
      resourceType: AuditResourceType.AMENITY_BOOKING,
      resourceId: createdBooking._id,
      after: createdBooking.toObject(),
    });

    await this.safeActivityPublish({
      society: resident.society,
      actor: resident._id,
      actorName: resident.name || resident.email || "Resident",
      actorRole: resident.roles[0] || "resident",
      activityType: ActivityType.AMENITY_BOOKED,
      resourceType: "Booking",
      resourceId: createdBooking._id,
      message: `${resident.name || "Resident"} booked ${amenity.name} for ${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
      metadata: {
        amenityName: amenity.name,
        slotStart: start.toISOString(),
        slotEnd: end.toISOString(),
        status: createdBooking.status,
      },
      visibility: ActivityVisibility.ALL,
    });

    await notificationService.sendNotification({
      title: "Booking Submitted",
      body: `Your booking for ${amenity.name} has been submitted (${createdBooking.status}).`,
      userIds: [resident._id.toString()],
    });

    // Schedule reminder job hook
    try {
      const reminderTime = new Date(start.getTime() - 60 * 60 * 1000); // 1 hour before
      if (reminderTime > new Date()) {
        jobService.registerJob(
          JobType.BOOKING_REMINDER,
          async (jobData) => {
            console.log(`[JobService] Executing booking reminder for ${jobData?.bookingId}`);
          },
          {
            id: `reminder_${createdBooking._id}`,
            schedule: reminderTime.toISOString(),
            data: { bookingId: createdBooking._id.toString() },
          }
        );
      }
    } catch (err) {
      console.warn("[BookingService] Background job registration warning:", err);
    }

    return createdBooking;
  }

  /**
   * Get booking details by ID with society tenant isolation.
   */
  async getBookingById(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<IBooking> {
    validateObjectId(id, "Booking ID");

    const booking = await BookingModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    })
      .populate("amenity", "name category location openingTime closingTime")
      .populate("resident", "name email phone roles");

    if (!booking) {
      throw ApiError.notFound("Booking not found.");
    }

    const isResident = user.roles.includes(Role.RESIDENT);
    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (isResident && !isAdmin && booking.resident._id.toString() !== user._id.toString()) {
      throw ApiError.forbidden("You do not have permission to view this booking.");
    }

    return booking;
  }

  /**
   * List bookings with search, filtering, and pagination.
   */
  async listBookings(
    societyId: Types.ObjectId,
    user: IUser,
    input: ListBookingsInput
  ): Promise<SearchResult<IBooking>> {
    const filter: Record<string, any> = {
      society: societyId,
      isDeleted: { $ne: true },
    };

    const isResident = user.roles.includes(Role.RESIDENT);
    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (isResident && !isAdmin) {
      filter.resident = user._id;
    } else if (input.residentId) {
      validateObjectId(input.residentId, "Resident User ID");
      filter.resident = new Types.ObjectId(input.residentId);
    }

    if (input.amenityId) {
      validateObjectId(input.amenityId, "Amenity ID");
      filter.amenity = new Types.ObjectId(input.amenityId);
    }

    if (input.status) filter.status = input.status;
    if (input.paymentStatus) filter.paymentStatus = input.paymentStatus;

    if (input.startDate || input.endDate) {
      filter.slotStart = {};
      if (input.startDate) filter.slotStart.$gte = new Date(input.startDate);
      if (input.endDate) filter.slotStart.$lte = new Date(input.endDate);
    }

    return searchService.search<IBooking>(BookingModel as any, {
      searchKeyword: input.searchKeyword,
      searchFields: ["purpose"],
      filter,
      sort: input.sort || "-slotStart",
      page: input.page ? Number(input.page) : undefined,
      limit: input.limit ? Number(input.limit) : undefined,
      populate: [
        { path: "amenity", select: "name category location" },
        { path: "resident", select: "name email phone" },
      ],
    });
  }

  /**
   * Approve a pending booking.
   */
  async approveBooking(
    societyId: Types.ObjectId,
    adminUser: IUser,
    id: string
  ): Promise<IBooking> {
    validateObjectId(id, "Booking ID");

    const booking = await BookingModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!booking) {
      throw ApiError.notFound("Booking not found.");
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw ApiError.badRequest(`Cannot approve booking in status "${booking.status}".`);
    }

    const beforeState = booking.toObject();

    booking.status = BookingStatus.APPROVED;
    booking.approvedBy = adminUser._id;
    booking.approvedAt = new Date();

    await booking.save();

    await this.safeAuditLog({
      actor: adminUser._id,
      actorRole: adminUser.roles[0] || "admin",
      society: societyId,
      action: AuditAction.BOOKING_APPROVED,
      resourceType: AuditResourceType.AMENITY_BOOKING,
      resourceId: booking._id,
      before: beforeState,
      after: booking.toObject(),
    });

    await notificationService.sendNotification({
      title: "Booking Approved",
      body: "Your facility booking has been approved.",
      userIds: [booking.resident.toString()],
    });

    return booking;
  }

  /**
   * Reject a pending booking.
   */
  async rejectBooking(
    societyId: Types.ObjectId,
    adminUser: IUser,
    id: string,
    data: RejectBookingInput
  ): Promise<IBooking> {
    validateObjectId(id, "Booking ID");

    const booking = await BookingModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!booking) {
      throw ApiError.notFound("Booking not found.");
    }

    const beforeState = booking.toObject();

    booking.status = BookingStatus.REJECTED;
    booking.rejectedReason = data.rejectedReason;

    await booking.save();

    await this.safeAuditLog({
      actor: adminUser._id,
      actorRole: adminUser.roles[0] || "admin",
      society: societyId,
      action: AuditAction.BOOKING_CANCELLED,
      resourceType: AuditResourceType.AMENITY_BOOKING,
      resourceId: booking._id,
      before: beforeState,
      after: booking.toObject(),
    });

    await notificationService.sendNotification({
      title: "Booking Rejected",
      body: `Your booking request was rejected: ${data.rejectedReason}`,
      userIds: [booking.resident.toString()],
    });

    return booking;
  }

  /**
   * Cancel a booking.
   */
  async cancelBooking(
    societyId: Types.ObjectId,
    user: IUser,
    id: string,
    data: CancelBookingInput
  ): Promise<IBooking> {
    validateObjectId(id, "Booking ID");

    const booking = await BookingModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!booking) {
      throw ApiError.notFound("Booking not found.");
    }

    if (
      booking.status === BookingStatus.CANCELLED ||
      booking.status === BookingStatus.COMPLETED
    ) {
      throw ApiError.badRequest(`Cannot cancel booking in status "${booking.status}".`);
    }

    const beforeState = booking.toObject();

    booking.status = BookingStatus.CANCELLED;
    if (data.cancellationReason) {
      booking.cancellationReason = data.cancellationReason;
    }

    await booking.save();

    await this.safeAuditLog({
      actor: user._id,
      actorRole: user.roles[0] || "user",
      society: societyId,
      action: AuditAction.BOOKING_CANCELLED,
      resourceType: AuditResourceType.AMENITY_BOOKING,
      resourceId: booking._id,
      before: beforeState,
      after: booking.toObject(),
    });

    return booking;
  }

  /**
   * Complete a booking after slot end.
   */
  async completeBooking(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<IBooking> {
    validateObjectId(id, "Booking ID");

    const booking = await BookingModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    });

    if (!booking) {
      throw ApiError.notFound("Booking not found.");
    }

    booking.status = BookingStatus.COMPLETED;
    await booking.save();
    return booking;
  }

  private async safeAuditLog(
    input: Parameters<typeof auditService.log>[0]
  ): Promise<void> {
    try {
      await auditService.log(input);
    } catch (err) {
      console.warn("[BookingService] Non-critical audit warning:", err);
    }
  }

  private async safeActivityPublish(
    input: Parameters<typeof activityService.publish>[0]
  ): Promise<void> {
    try {
      await activityService.publish(input);
    } catch (err) {
      console.warn("[BookingService] Non-critical activity warning:", err);
    }
  }
}

export default new BookingService();
