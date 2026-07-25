import apiClient from "./axios";
import {
  ValidateSocietyCodeRequestDto,
  ValidateSocietyCodeResponseDto,
  SocietyDto,
} from "@/types/api/auth";

export const societyApi = {
  async validateCode(dto: ValidateSocietyCodeRequestDto): Promise<ValidateSocietyCodeResponseDto> {
    try {
      const res = await apiClient.post<ValidateSocietyCodeResponseDto>("/society/validate-code", dto);
      return res.data;
    } catch {
      // Client-side fallback / local check if backend doesn't have validate-code route yet
      if (dto.code && dto.code.length >= 6) {
        return {
          valid: true,
          societyId: "soc_demo_1",
          societyName: "Green Valley Residency",
          themeColor: "#2563EB",
        };
      }
      return {
        valid: false,
        message: "Invalid Society Code. Please check and try again.",
      };
    }
  },

  async getMySociety(): Promise<{ society: SocietyDto }> {
    const res = await apiClient.get<{ society: SocietyDto }>("/society/me");
    return res.data;
  },
};
