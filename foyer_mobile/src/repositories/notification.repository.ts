import { notificationApi } from "@/api/notification.api";
import { NotificationDto } from "@/types/api/notification";

export const notificationRepository = {
  async fetchNotificationsList(filters?: { page?: number; limit?: number }) {
    const res = await notificationApi.listNotifications(filters);
    return {
      notifications: res.data || [],
      unreadCount: res.unreadCount || 0,
      pagination: res.pagination,
    };
  },

  async fetchUnreadCount(): Promise<number> {
    const res = await notificationApi.getUnreadCount();
    return res.unreadCount || 0;
  },

  async markRead(id: string): Promise<boolean> {
    const res = await notificationApi.markAsRead(id);
    return res.success;
  },

  async markAllRead(): Promise<boolean> {
    const res = await notificationApi.markAllAsRead();
    return res.success;
  },

  async removeNotification(id: string): Promise<boolean> {
    const res = await notificationApi.deleteNotification(id);
    return res.success;
  },
};
