import { societyApi } from "@/api/society.api";
import {
  ValidateSocietyCodeRequestDto,
  ValidateSocietyCodeResponseDto,
  SocietyDto,
} from "@/types/api/auth";

export class SocietyRepository {
  async validateCode(dto: ValidateSocietyCodeRequestDto): Promise<ValidateSocietyCodeResponseDto> {
    return await societyApi.validateCode(dto);
  }

  async getMySociety(): Promise<{ society: SocietyDto }> {
    return await societyApi.getMySociety();
  }
}

export const societyRepository = new SocietyRepository();
