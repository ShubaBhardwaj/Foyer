import apiClient from "./axios";
import { GetDashboardResponseDto } from "@/types/api/dashboard";

export const dashboardApi = {
  async getDashboard(): Promise<GetDashboardResponseDto> {
    const res = await apiClient.get<GetDashboardResponseDto>("/dashboard");
    return res.data;
  },
};
