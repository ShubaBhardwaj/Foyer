import { authApi } from "@/api/auth.api";
import {
  CompleteLoginRequestDto,
  CompleteLoginResponseDto,
  GetMeResponseDto,
} from "@/types/api/auth";

export class AuthRepository {
  async completeLogin(dto: CompleteLoginRequestDto): Promise<CompleteLoginResponseDto> {
    return await authApi.completeLogin(dto);
  }

  async getMe(): Promise<GetMeResponseDto> {
    return await authApi.getMe();
  }
}

export const authRepository = new AuthRepository();
