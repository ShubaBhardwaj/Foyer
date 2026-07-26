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
    return res.data;
  },

  async createResident(dto: CreateResidentRequestDto): Promise<{ success: boolean; data: UserMongoDto }> {
    const res = await apiClient.post<{ success: boolean; data: UserMongoDto }>("/user/resident", dto);
    return res.data;
  },

  async createGuard(dto: CreateGuardRequestDto): Promise<{ success: boolean; data: UserMongoDto }> {
    const res = await apiClient.post<{ success: boolean; data: UserMongoDto }>("/user/guard", dto);
    return res.data;
  },
};
