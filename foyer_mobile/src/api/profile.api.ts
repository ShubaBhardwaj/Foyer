import apiClient from "./axios";
import {
  AddHouseholdMemberRequestDto,
  AddVehicleRequestDto,
  HouseholdMemberDto,
  UpdateProfileRequestDto,
  VehicleDto,
} from "@/types/api/profile";
import { UserMongoDto } from "@/types/api/auth";

export const profileApi = {
  async getProfile(): Promise<{ success: boolean; data: UserMongoDto }> {
    const res = await apiClient.get<{ success: boolean; data: UserMongoDto }>("/user/profile");
    return res.data;
  },

  async updateProfile(dto: UpdateProfileRequestDto): Promise<{ success: boolean; data: UserMongoDto }> {
    const res = await apiClient.put<{ success: boolean; data: UserMongoDto }>("/user/profile", dto);
    return res.data;
  },

  async listVehicles(): Promise<{ success: boolean; data: VehicleDto[] }> {
    const res = await apiClient.get<{ success: boolean; data: VehicleDto[] }>("/user/vehicles");
    return res.data;
  },

  async addVehicle(dto: AddVehicleRequestDto): Promise<{ success: boolean; data: VehicleDto }> {
    const res = await apiClient.post<{ success: boolean; data: VehicleDto }>("/user/vehicles", dto);
    return res.data;
  },

  async removeVehicle(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete<{ success: boolean }>(`/user/vehicles/${id}`);
    return res.data;
  },

  async listHouseholdMembers(): Promise<{ success: boolean; data: HouseholdMemberDto[] }> {
    const res = await apiClient.get<{ success: boolean; data: HouseholdMemberDto[] }>("/user/family");
    return res.data;
  },

  async addHouseholdMember(dto: AddHouseholdMemberRequestDto): Promise<{ success: boolean; data: HouseholdMemberDto }> {
    const res = await apiClient.post<{ success: boolean; data: HouseholdMemberDto }>("/user/family", dto);
    return res.data;
  },
};
