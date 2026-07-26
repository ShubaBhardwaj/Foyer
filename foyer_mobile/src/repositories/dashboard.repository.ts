import { dashboardApi } from "@/api/dashboard.api";
import { GetDashboardResponseDto } from "@/types/api/dashboard";

export const dashboardRepository = {
  async getDashboardData(role?: string): Promise<GetDashboardResponseDto> {
    return await dashboardApi.getDashboard(role);
  },
};
