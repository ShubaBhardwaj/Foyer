import apiClient from "./axios";
import {
  NotificationDto,
  NotificationListResponseDto,
} from "@/types/api/notification";

export const notificationApi = {
  async listNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean | string;
  }): Promise<NotificationListResponseDto> {
    const queryParams: Record<string, unknown> = {};
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.unreadOnly !== undefined) queryParams.unreadOnly = String(params.unreadOnly);

    const res = await apiClient.get<NotificationListResponseDto>("/notifications", { params: queryParams });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metaData = (res.data as any)?.meta || (res.data as any)?.pagination;
    const list: NotificationDto[] = Array.isArray(responseData) ? responseData : [];
    const unreadCount = list.filter((n) => !n.isRead).length;

    return {
      success: true,
      data: list,
      unreadCount: metaData?.total !== undefined ? metaData.total : unreadCount,
      pagination: metaData || { page: 1, limit: 10, total: list.length, pages: 1 },
    };
  },

  async markAsRead(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.post<{ success: boolean }>(`/notifications/${id}/read`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: (res.data as any)?.success ?? true };
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    const res = await apiClient.post<{ success: boolean }>("/notifications/read-all");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: (res.data as any)?.success ?? true };
  },

  async deleteNotification(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete<{ success: boolean }>(`/notifications/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: (res.data as any)?.success ?? true };
  },
};

