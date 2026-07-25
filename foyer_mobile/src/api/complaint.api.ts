import apiClient from "./axios";
import {
  AddComplaintCommentRequestDto,
  ComplaintDetailResponseDto,
  ComplaintListResponseDto,
  CreateComplaintRequestDto,
  UpdateComplaintStatusRequestDto,
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
    return res.data;
  },

  async getComplaintById(id: string): Promise<ComplaintDetailResponseDto> {
    const res = await apiClient.get<ComplaintDetailResponseDto>(`/complaints/${id}`);
    return res.data;
  },

  async createComplaint(dto: CreateComplaintRequestDto): Promise<ComplaintDetailResponseDto> {
    const res = await apiClient.post<ComplaintDetailResponseDto>("/complaints", dto);
    return res.data;
  },

  async updateComplaintStatus(id: string, dto: UpdateComplaintStatusRequestDto): Promise<ComplaintDetailResponseDto> {
    const res = await apiClient.patch<ComplaintDetailResponseDto>(`/complaints/${id}/status`, dto);
    return res.data;
  },

  async addComplaintComment(id: string, dto: AddComplaintCommentRequestDto): Promise<ComplaintDetailResponseDto> {
    const res = await apiClient.post<ComplaintDetailResponseDto>(`/complaints/${id}/comments`, dto);
    return res.data;
  },
};
