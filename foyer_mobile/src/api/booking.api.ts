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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metaData = (res.data as any)?.meta || (res.data as any)?.pagination;
    const list = Array.isArray(responseData) ? responseData : [];
    return {
      success: true,
      data: list,
      pagination: metaData || { page: 1, limit: 10, total: list.length, pages: 1 },
    };
  },

  async createBooking(dto: CreateBookingRequestDto): Promise<BookingDetailResponseDto> {
    const res = await apiClient.post<BookingDetailResponseDto>("/bookings", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async cancelBooking(id: string, dto?: CancelBookingRequestDto): Promise<BookingDetailResponseDto> {
    const res = await apiClient.post<BookingDetailResponseDto>(`/bookings/${id}/cancel`, dto || {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },
};

