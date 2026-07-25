import { amenityRepository } from "@/repositories/amenity.repository";
import { CreateBookingRequestDto } from "@/types/api/booking";

export async function getFacilities() {
  return amenityRepository.fetchAmenitiesList();
}

export async function getFacilityById(facilityId: string) {
  return amenityRepository.fetchAmenityById(facilityId);
}

export async function getFacilityAvailability(facilityId: string, date: string) {
  return amenityRepository.fetchAvailableSlots(facilityId, date);
}

export async function createFacilityBooking(dto: CreateBookingRequestDto) {
  return amenityRepository.createBooking(dto);
}

export async function getMyBookings() {
  return amenityRepository.fetchUserBookings();
}

export async function cancelBooking(bookingId: string, reason?: string) {
  return amenityRepository.cancelBooking(bookingId, reason);
}
