export interface AmenitySlotDto {
  startTime: string;
  endTime: string;
  availableCapacity: number;
  maxCapacity: number;
  isAvailable: boolean;
}

export interface AmenityDto {
  _id: string;
  name: string;
  description: string;
  category: string;
  images?: string[];
  capacity: number;
  openingTime: string;
  closingTime: string;
  slotDurationMinutes: number;
  rules?: string[];
  isPaid: boolean;
  pricePerHour?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AmenityListResponseDto {
  success: boolean;
  data: AmenityDto[];
}

export interface AmenityDetailResponseDto {
  success: boolean;
  data: AmenityDto;
}

export interface AmenitySlotsResponseDto {
  success: boolean;
  date: string;
  slots: AmenitySlotDto[];
}
