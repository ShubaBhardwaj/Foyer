import { axiosClient } from "./axiosClient";
import { ApiResponse, RegisterSocietyPayload, Society } from "@/types";

export const societyApi = {
  register: async (payload: RegisterSocietyPayload): Promise<ApiResponse<{ society: Society }>> => {
    const response = await axiosClient.post<ApiResponse<{ society: Society }>>("/society/register", payload);
    return response.data;
  },

  getMySociety: async (): Promise<ApiResponse<{ society: Society }>> => {
    const response = await axiosClient.get<ApiResponse<{ society: Society }>>("/society/me");
    return response.data;
  },
};
