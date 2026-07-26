import { notificationApi } from "@/api/notification.api";

export const notificationRepository = {
  async fetchNotificationsList(filters?: { page?: number; limit?: number; unreadOnly?: boolean | string }) {
    const res = await notificationApi.listNotifications(filters);
    return {
      notifications: res.data || [],
      unreadCount: res.unreadCount || 0,
      pagination: res.pagination,
    };
  },

  async fetchUnreadCount(): Promise<number> {
    const res = await notificationApi.listNotifications({ unreadOnly: "true" });
    return res.unreadCount ?? (Array.isArray(res.data) ? res.data.length : 0);
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

