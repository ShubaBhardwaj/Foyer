import apiClient from "./axios";
import {
  ComplaintDetailResponseDto,
  ComplaintListResponseDto,
  CreateComplaintRequestDto,
  ResolveComplaintRequestDto,
} from "@/types/api/complaint";

export const complaintApi = {
  async listComplaints(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
  }): Promise<ComplaintListResponseDto> {
    const res = await apiClient.get<ComplaintListResponseDto>("/complaints", { params });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paginationData = (res.data as any)?.meta || (res.data as any)?.pagination;
    return {
      success: true,
      data: Array.isArray(responseData) ? responseData : [],
      pagination: paginationData || { page: 1, limit: 10, total: 0, pages: 1 },
    };
  },

  async getComplaintById(id: string): Promise<ComplaintDetailResponseDto> {
    const res = await apiClient.get<ComplaintDetailResponseDto>(`/complaints/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async createComplaint(dto: CreateComplaintRequestDto): Promise<ComplaintDetailResponseDto> {
    const res = await apiClient.post<ComplaintDetailResponseDto>("/complaints", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async resolveComplaint(id: string, dto?: ResolveComplaintRequestDto): Promise<ComplaintDetailResponseDto> {
    const res = await apiClient.post<ComplaintDetailResponseDto>(`/complaints/${id}/resolve`, dto || {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },
};

