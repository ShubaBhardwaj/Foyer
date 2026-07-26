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
    return res.data;
  },

  async getVisitorById(id: string): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.get<VisitorDetailResponseDto>(`/visitors/${id}`);
    return res.data;
  },

  async createVisitor(dto: CreateVisitorRequestDto): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.post<VisitorDetailResponseDto>("/visitors", dto);
    return res.data;
  },

  async approveVisitor(id: string, dto?: ApproveVisitorRequestDto): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.post<VisitorDetailResponseDto>(`/visitors/${id}/approve`, dto ?? {});
    return res.data;
  },

  async rejectVisitor(id: string, dto: RejectVisitorRequestDto): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.post<VisitorDetailResponseDto>(`/visitors/${id}/reject`, dto);
    return res.data;
  },

  async cancelVisitor(id: string, dto?: CancelVisitorRequestDto): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.post<VisitorDetailResponseDto>(`/visitors/${id}/cancel`, dto ?? {});
    return res.data;
  },

  async checkInVisitor(id: string, dto?: CheckInVisitorRequestDto): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.post<VisitorDetailResponseDto>(`/visitors/${id}/check-in`, dto ?? {});
    return res.data;
  },

  async checkOutVisitor(id: string): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.post<VisitorDetailResponseDto>(`/visitors/${id}/check-out`, {});
    return res.data;
  },
};

