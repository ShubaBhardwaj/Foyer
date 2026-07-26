import apiClient from "./axios";
import {
  CompleteLoginRequestDto,
  CompleteLoginResponseDto,
  GetMeResponseDto,
} from "@/types/api/auth";

export const authApi = {
  async completeLogin(dto: CompleteLoginRequestDto): Promise<CompleteLoginResponseDto> {
    const res = await apiClient.post<CompleteLoginResponseDto>("/auth/complete-login", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return responseData;
  },

  async getMe(): Promise<GetMeResponseDto> {
    const res = await apiClient.get<GetMeResponseDto>("/auth/me");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return responseData;
  },
};

