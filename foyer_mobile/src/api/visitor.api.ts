import apiClient from "./axios";
import {
  CreateVisitorRequestDto,
  UpdateVisitorStatusRequestDto,
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

  async updateVisitorStatus(id: string, dto: UpdateVisitorStatusRequestDto): Promise<VisitorDetailResponseDto> {
    const res = await apiClient.put<VisitorDetailResponseDto>(`/visitors/${id}/status`, dto);
    return res.data;
  },

  async getVisitorQrCode(id: string): Promise<{ success: boolean; qrCodeUrl: string; passCode: string }> {
    const res = await apiClient.get<{ success: boolean; qrCodeUrl: string; passCode: string }>(`/visitors/${id}/qr`);
    return res.data;
  },
};
