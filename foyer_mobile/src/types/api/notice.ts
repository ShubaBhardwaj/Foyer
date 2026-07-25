export interface NoticeDto {
  _id: string;
  title: string;
  content: string;
  category: "GENERAL" | "MAINTENANCE" | "EVENT" | "EMERGENCY" | "RULES";
  isPinned: boolean;
  isArchived: boolean;
  attachments?: string[];
  createdBy: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoticeRequestDto {
  title: string;
  content: string;
  category?: string;
  isPinned?: boolean;
  attachments?: string[];
}

export interface NoticeListResponseDto {
  success: boolean;
  data: NoticeDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface NoticeDetailResponseDto {
  success: boolean;
  data: NoticeDto;
}
