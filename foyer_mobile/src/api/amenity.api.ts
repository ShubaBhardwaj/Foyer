import apiClient from "./axios";
import {
  AmenityDetailResponseDto,
  AmenityListResponseDto,
  AmenitySlotsResponseDto,
} from "@/types/api/amenity";

export const amenityApi = {
  async listAmenities(): Promise<AmenityListResponseDto> {
    const res = await apiClient.get<AmenityListResponseDto>("/amenities");
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

  async getAmenityById(id: string): Promise<AmenityDetailResponseDto> {
    const res = await apiClient.get<AmenityDetailResponseDto>(`/amenities/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async getAmenitySlots(id: string, date: string): Promise<AmenitySlotsResponseDto> {
    const res = await apiClient.get<AmenitySlotsResponseDto>(`/amenities/${id}/slots`, {
      params: { date },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: Array.isArray(responseData) ? responseData : [],
    };
  },
};

