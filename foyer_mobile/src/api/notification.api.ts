import apiClient from "./axios";
import {
  NotificationListResponseDto,
  UnreadCountResponseDto,
} from "@/types/api/notification";

export const notificationApi = {
  async listNotifications(params?: { page?: number; limit?: number }): Promise<NotificationListResponseDto> {
    const res = await apiClient.get<NotificationListResponseDto>("/notifications", { params });
    return res.data;
  },

  async getUnreadCount(): Promise<UnreadCountResponseDto> {
    const res = await apiClient.get<UnreadCountResponseDto>("/notifications/unread-count");
    return res.data;
  },

  async markAsRead(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.patch<{ success: boolean }>(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    const res = await apiClient.patch<{ success: boolean }>("/notifications/read-all");
    return res.data;
  },

  async deleteNotification(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete<{ success: boolean }>(`/notifications/${id}`);
    return res.data;
  },
};
