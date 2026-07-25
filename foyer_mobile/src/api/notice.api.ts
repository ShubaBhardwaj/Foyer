import apiClient from "./axios";
import {
  CreateNoticeRequestDto,
  NoticeDetailResponseDto,
  NoticeListResponseDto,
} from "@/types/api/notice";

export const noticeApi = {
  async listNotices(params?: {
    page?: number;
    limit?: number;
    category?: string;
    pinned?: boolean;
    search?: string;
  }): Promise<NoticeListResponseDto> {
    const res = await apiClient.get<NoticeListResponseDto>("/notices", { params });
    return res.data;
  },

  async getNoticeById(id: string): Promise<NoticeDetailResponseDto> {
    const res = await apiClient.get<NoticeDetailResponseDto>(`/notices/${id}`);
    return res.data;
  },

  async createNotice(dto: CreateNoticeRequestDto): Promise<NoticeDetailResponseDto> {
    const res = await apiClient.post<NoticeDetailResponseDto>("/notices", dto);
    return res.data;
  },
};
