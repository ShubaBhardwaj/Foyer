import { noticeApi } from "@/api/notice.api";
import { CreateNoticeRequestDto, NoticeDto } from "@/types/api/notice";

export const noticeRepository = {
  async fetchNoticesList(filters?: { page?: number; limit?: number; category?: string; pinned?: boolean; search?: string }) {
    const res = await noticeApi.listNotices(filters);
    return {
      notices: res.data || [],
      pagination: res.pagination,
    };
  },

  async fetchNoticeById(id: string): Promise<NoticeDto> {
    const res = await noticeApi.getNoticeById(id);
    return res.data;
  },

  async createNotice(dto: CreateNoticeRequestDto): Promise<NoticeDto> {
    const res = await noticeApi.createNotice(dto);
    return res.data;
  },
};
