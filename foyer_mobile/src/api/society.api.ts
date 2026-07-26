import apiClient from "./axios";
import {
  ValidateSocietyCodeRequestDto,
  ValidateSocietyCodeResponseDto,
  SocietyDto,
} from "@/types/api/auth";

export const societyApi = {
  async validateCode(dto: ValidateSocietyCodeRequestDto): Promise<ValidateSocietyCodeResponseDto> {
    const res = await apiClient.post<ValidateSocietyCodeResponseDto>("/society/validate-code", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return responseData;
  },

  async getMySociety(): Promise<{ society: SocietyDto }> {
    const res = await apiClient.get<{ society: SocietyDto }>("/society/me");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return responseData?.society ? responseData : { society: responseData };
  },
};

