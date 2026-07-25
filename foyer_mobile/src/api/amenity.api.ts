import apiClient from "./axios";
import {
  AmenityDetailResponseDto,
  AmenityListResponseDto,
  AmenitySlotsResponseDto,
} from "@/types/api/amenity";

export const amenityApi = {
  async listAmenities(): Promise<AmenityListResponseDto> {
    const res = await apiClient.get<AmenityListResponseDto>("/amenities");
    return res.data;
  },

  async getAmenityById(id: string): Promise<AmenityDetailResponseDto> {
    const res = await apiClient.get<AmenityDetailResponseDto>(`/amenities/${id}`);
    return res.data;
  },

  async getAmenitySlots(id: string, date: string): Promise<AmenitySlotsResponseDto> {
    const res = await apiClient.get<AmenitySlotsResponseDto>(`/amenities/${id}/slots`, {
      params: { date },
    });
    return res.data;
  },
};
