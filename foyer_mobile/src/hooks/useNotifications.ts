import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { notificationRepository } from "@/repositories/notification.repository";

export function useNotifications() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: () => notificationRepository.fetchNotificationsList(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationRepository.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationRepository.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationRepository.removeNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    pagination: data?.pagination,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    markRead: (id: string) => markReadMutation.mutate(id),
    markAllRead: () => markAllReadMutation.mutate(),
    deleteNotification: (id: string) => deleteNotificationMutation.mutate(id),
  };
}

export function useUnreadNotificationsCount() {
  const { data: count = 0 } = useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: () => notificationRepository.fetchUnreadCount(),
    refetchInterval: 30_000, // Background poll every 30s
  });

  return count;
}
