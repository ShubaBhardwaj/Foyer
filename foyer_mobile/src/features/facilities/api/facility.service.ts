import {
  facilitiesData,
  availabilityTimeSlots,
  userBookings,
  bookingHistoryData,
} from "../shared/data/facilityDummyData";
import {
  FacilityItem,
  TimeSlotItem,
  BookingItem,
  GroupedBookingHistory,
} from "../shared/types/facility.types";

/**
 * Dummy API service layer for Facilities Module.
 * Future backend integration should wire React Query or REST APIs here.
 */

// TODO: Replace with GET /api/v1/facilities
export async function getFacilities(): Promise<FacilityItem[]> {
  return Promise.resolve(facilitiesData);
}

// TODO: Replace with GET /api/v1/facilities/:facilityId
export async function getFacilityById(
  facilityId: string
): Promise<FacilityItem | undefined> {
  const facility = facilitiesData.find((f) => f.id === facilityId) ?? facilitiesData[0];
  return Promise.resolve(facility);
}

// TODO: Replace with GET /api/v1/facilities/:facilityId/availability?date=:date
export async function getFacilityAvailability(
  facilityId: string,
  date: string
): Promise<TimeSlotItem[]> {
  return Promise.resolve(availabilityTimeSlots);
}

// TODO: Replace with POST /api/v1/facilities/:facilityId/bookings
export async function createFacilityBooking(
  facilityId: string,
  data: Partial<BookingItem>
): Promise<BookingItem> {
  const facility = facilitiesData.find((f) => f.id === facilityId) ?? facilitiesData[0];
  const newBooking: BookingItem = {
    id: `bk_${Date.now()}`,
    facilityId: facility.id,
    facilityName: facility.name,
    image: facility.image,
    date: data.date ?? "Tomorrow, 26 Jul 2026",
    timeSlot: data.timeSlot ?? "07:00 AM - 08:00 AM",
    status: "Upcoming",
    bookingCode: `BK-FYR-${Math.floor(1000 + Math.random() * 9000)}`,
    purpose: data.purpose ?? "Resident Recreation",
    notes: data.notes,
    createdAt: "Just now",
  };
  return Promise.resolve(newBooking);
}

// TODO: Replace with GET /api/v1/bookings/my-bookings
export async function getMyBookings(): Promise<BookingItem[]> {
  return Promise.resolve(userBookings);
}

// TODO: Replace with POST /api/v1/bookings/:bookingId/cancel
export async function cancelBooking(bookingId: string): Promise<boolean> {
  return Promise.resolve(true);
}

// TODO: Replace with GET /api/v1/bookings/history
export async function getBookingHistory(): Promise<GroupedBookingHistory[]> {
  return Promise.resolve(bookingHistoryData);
}
