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

  async getNoticeById(id: string): Promise<NoticeDetailResponseDto> {
    const res = await apiClient.get<NoticeDetailResponseDto>(`/notices/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async createNotice(dto: CreateNoticeRequestDto): Promise<NoticeDetailResponseDto> {
    const res = await apiClient.post<NoticeDetailResponseDto>("/notices", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },
};

