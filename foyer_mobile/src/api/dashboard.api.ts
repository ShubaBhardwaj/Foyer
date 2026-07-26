import apiClient from "./axios";
import { GetDashboardResponseDto } from "@/types/api/dashboard";

export const dashboardApi = {
  async getResidentDashboard(): Promise<unknown> {
    const res = await apiClient.get("/dashboard/resident");
    return res.data;
  },

  async getGuardDashboard(): Promise<unknown> {
    const res = await apiClient.get("/dashboard/guard");
    return res.data;
  },

  async getAdminDashboard(): Promise<unknown> {
    const res = await apiClient.get("/dashboard/admin");
    return res.data;
  },

  async getDashboard(role?: string): Promise<GetDashboardResponseDto> {
    const normalizedRole = (role || "").toUpperCase();
    let endpoint = "/dashboard/resident";

    if (normalizedRole === "GUARD") {
      endpoint = "/dashboard/guard";
    } else if (normalizedRole === "ADMIN" || normalizedRole === "SUPER_ADMIN" || normalizedRole === "OWNER") {
      endpoint = "/dashboard/admin";
    }

    try {
      const res = await apiClient.get(endpoint);
      return {
        success: true,
        role: (role as GetDashboardResponseDto["role"]) || "RESIDENT",
        metrics: res.data?.data || res.data || {},
      };
    } catch {
      return {
        success: true,
        role: (role as GetDashboardResponseDto["role"]) || "RESIDENT",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metrics: {} as any,
      };
    }
  },
};
