import apiClient from "./axios";
import {
  CreateVisitorRequestDto,
  ApproveVisitorRequestDto,
  RejectVisitorRequestDto,
  CancelVisitorRequestDto,
  CheckInVisitorRequestDto,
  VisitorDetailResponseDto,
  VisitorListResponseDto,
} from "@/types/api/visitor";

export const visitorApi = {
  async listVisitors(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    date?: string;
  }): Promise<VisitorListResponseDto> {
    const res = await apiClient.get<VisitorListResponseDto>("/visitors", { params });
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

  async getVisitorById(id: string): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.get<VisitorDetailResponseDto>(`/visitors/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async createVisitor(dto: CreateVisitorRequestDto): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.post<VisitorDetailResponseDto>("/visitors", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async approveVisitor(id: string, dto?: ApproveVisitorRequestDto): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.post<VisitorDetailResponseDto>(`/visitors/${id}/approve`, dto ?? {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async rejectVisitor(id: string, dto: RejectVisitorRequestDto): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.post<VisitorDetailResponseDto>(`/visitors/${id}/reject`, dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async cancelVisitor(id: string, dto?: CancelVisitorRequestDto): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.post<VisitorDetailResponseDto>(`/visitors/${id}/cancel`, dto ?? {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async checkInVisitor(id: string, dto?: CheckInVisitorRequestDto): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.post<VisitorDetailResponseDto>(`/visitors/${id}/check-in`, dto ?? {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async checkOutVisitor(id: string): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.post<VisitorDetailResponseDto>(`/visitors/${id}/check-out`, {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },
};


