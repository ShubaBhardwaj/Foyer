export interface NotificationDto {
  _id: string;
  recipient: string;
  title: string;
  message?: string;
  body?: string;
  type: "VISITOR" | "COMPLAINT" | "NOTICE" | "BOOKING" | "MAINTENANCE" | "COMMUNITY" | "POLL" | "SYSTEM";
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface NotificationListResponseDto {
  success: boolean;
  data: NotificationDto[];
  unreadCount: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

