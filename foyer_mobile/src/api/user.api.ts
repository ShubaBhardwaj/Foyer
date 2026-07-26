import apiClient from "./axios";
import { UserMongoDto } from "@/types/api/auth";

export interface CreateResidentRequestDto {
  name: string;
  email: string;
  phone: string;
  tower: string;
  flat: string;
}

export interface CreateGuardRequestDto {
  name: string;
  email: string;
  phone: string;
  gate?: string;
}

export const userApi = {
  async listUsers(): Promise<{ success: boolean; data: UserMongoDto[] }> {
    const res = await apiClient.get<{ success: boolean; data: UserMongoDto[] }>("/user");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: Array.isArray(responseData) ? responseData : [],
    };
  },

  async createResident(dto: CreateResidentRequestDto): Promise<{ success: boolean; data: UserMongoDto }> {
    const res = await apiClient.post<{ success: boolean; data: UserMongoDto }>("/user/resident", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async createGuard(dto: CreateGuardRequestDto): Promise<{ success: boolean; data: UserMongoDto }> {
    const res = await apiClient.post<{ success: boolean; data: UserMongoDto }>("/user/guard", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },
};

