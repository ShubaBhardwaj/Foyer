import { axiosClient } from "./axiosClient";
import { ApiResponse, AuthMeResponse, CompleteLoginPayload } from "@/types";

export const authApi = {
  completeLogin: async (payload?: CompleteLoginPayload): Promise<ApiResponse<AuthMeResponse>> => {
    const response = await axiosClient.post<ApiResponse<AuthMeResponse>>("/auth/complete-login", payload || {});
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<AuthMeResponse>> => {
    const response = await axiosClient.get<ApiResponse<AuthMeResponse>>("/auth/me");
    return response.data;
  },
};
