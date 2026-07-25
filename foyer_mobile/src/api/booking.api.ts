import apiClient from "./axios";
import {
  BookingDetailResponseDto,
  BookingListResponseDto,
  CancelBookingRequestDto,
  CreateBookingRequestDto,
} from "@/types/api/booking";

export const bookingApi = {
  async listBookings(): Promise<BookingListResponseDto> {
    const res = await apiClient.get<BookingListResponseDto>("/bookings");
    return res.data;
  },

  async createBooking(dto: CreateBookingRequestDto): Promise<BookingDetailResponseDto> {
    const res = await apiClient.post<BookingDetailResponseDto>("/bookings", dto);
    return res.data;
  },

  async cancelBooking(id: string, dto?: CancelBookingRequestDto): Promise<BookingDetailResponseDto> {
    const res = await apiClient.post<BookingDetailResponseDto>(`/bookings/${id}/cancel`, dto || {});
    return res.data;
  },
};
