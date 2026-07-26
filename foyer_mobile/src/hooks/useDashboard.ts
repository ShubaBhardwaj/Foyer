import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { dashboardRepository } from "@/repositories/dashboard.repository";
import { useAuthStore } from "@/store/use-auth-store";

export function useDashboard() {
  const role = useAuthStore((s) => s.role);

  const query = useQuery({
    queryKey: queryKeys.dashboard.byRole(role || "default"),
    queryFn: () => dashboardRepository.getDashboardData(role || undefined),
    staleTime: 30_000,
  });

  return {
    dashboardData: query.data,
    metrics: query.data?.metrics,
    role: query.data?.role || role,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
