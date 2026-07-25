import apiClient from "./axios";
import {
  CompleteLoginRequestDto,
  CompleteLoginResponseDto,
  GetMeResponseDto,
} from "@/types/api/auth";

export const authApi = {
  async completeLogin(dto: CompleteLoginRequestDto): Promise<CompleteLoginResponseDto> {
    const res = await apiClient.post<CompleteLoginResponseDto>("/auth/complete-login", dto);
    return res.data;
  },

  async getMe(): Promise<GetMeResponseDto> {
    const res = await apiClient.get<GetMeResponseDto>("/auth/me");
    return res.data;
  },
};
