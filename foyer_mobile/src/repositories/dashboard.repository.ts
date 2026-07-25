import { dashboardApi } from "@/api/dashboard.api";
import { GetDashboardResponseDto } from "@/types/api/dashboard";

export const dashboardRepository = {
  async getDashboardData(): Promise<GetDashboardResponseDto> {
    return await dashboardApi.getDashboard();
  },
};
