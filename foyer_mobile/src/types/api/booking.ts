export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "REJECTED";

export interface BookingDto {
  _id: string;
  amenity: { _id: string; name: string; images?: string[] };
  user: { _id: string; name: string; flatNumber?: string };
  bookingDate: string;
  startTime: string;
  endTime: string;
  numberOfGuests: number;
  status: BookingStatus;
  totalPrice?: number;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequestDto {
  amenityId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  numberOfGuests?: number;
}

export interface CancelBookingRequestDto {
  reason?: string;
}

export interface BookingListResponseDto {
  success: boolean;
  data: BookingDto[];
}

export interface BookingDetailResponseDto {
  success: boolean;
  data: BookingDto;
}
