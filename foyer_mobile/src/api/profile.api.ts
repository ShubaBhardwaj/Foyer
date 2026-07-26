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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return { success: true, data: responseData };
  },

  async updateProfile(dto: UpdateProfileRequestDto): Promise<{ success: boolean; data: UserMongoDto }> {
    const res = await apiClient.put<{ success: boolean; data: UserMongoDto }>("/user/profile", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return { success: true, data: responseData };
  },

  async listVehicles(): Promise<{ success: boolean; data: VehicleDto[] }> {
    const res = await apiClient.get<{ success: boolean; data: VehicleDto[] }>("/user/vehicles");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return { success: true, data: Array.isArray(responseData) ? responseData : [] };
  },

  async addVehicle(dto: AddVehicleRequestDto): Promise<{ success: boolean; data: VehicleDto }> {
    const res = await apiClient.post<{ success: boolean; data: VehicleDto }>("/user/vehicles", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return { success: true, data: responseData };
  },

  async removeVehicle(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete<{ success: boolean }>(`/user/vehicles/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: (res.data as any)?.success ?? true };
  },

  async listHouseholdMembers(): Promise<{ success: boolean; data: HouseholdMemberDto[] }> {
    const res = await apiClient.get<{ success: boolean; data: HouseholdMemberDto[] }>("/user/family");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return { success: true, data: Array.isArray(responseData) ? responseData : [] };
  },

  async addHouseholdMember(dto: AddHouseholdMemberRequestDto): Promise<{ success: boolean; data: HouseholdMemberDto }> {
    const res = await apiClient.post<{ success: boolean; data: HouseholdMemberDto }>("/user/family", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return { success: true, data: responseData };
  },
};

