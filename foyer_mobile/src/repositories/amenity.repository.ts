import { amenityApi } from "@/api/amenity.api";
import { bookingApi } from "@/api/booking.api";
import { AmenityDto, AmenitySlotDto } from "@/types/api/amenity";
import { BookingDto, CreateBookingRequestDto } from "@/types/api/booking";

export const amenityRepository = {
  async fetchAmenitiesList(): Promise<AmenityDto[]> {
    const res = await amenityApi.listAmenities();
    return res.data || [];
  },

  async fetchAmenityById(id: string): Promise<AmenityDto> {
    const res = await amenityApi.getAmenityById(id);
    return res.data;
  },

  async fetchAvailableSlots(id: string, date: string): Promise<AmenitySlotDto[]> {
    const res = await amenityApi.getAmenitySlots(id, date);
    return res.slots || [];
  },

  async fetchUserBookings(): Promise<BookingDto[]> {
    const res = await bookingApi.listBookings();
    return res.data || [];
  },

  async createBooking(dto: CreateBookingRequestDto): Promise<BookingDto> {
    const res = await bookingApi.createBooking(dto);
    return res.data;
  },

  async cancelBooking(id: string, reason?: string): Promise<BookingDto> {
    const res = await bookingApi.cancelBooking(id, { reason });
    return res.data;
  },
};
