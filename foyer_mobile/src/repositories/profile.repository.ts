import { profileApi } from "@/api/profile.api";
import { UserMongoDto } from "@/types/api/auth";
import {
  AddHouseholdMemberRequestDto,
  AddVehicleRequestDto,
  HouseholdMemberDto,
  UpdateProfileRequestDto,
  VehicleDto,
} from "@/types/api/profile";

export const profileRepository = {
  async fetchUserProfile(): Promise<UserMongoDto> {
    const res = await profileApi.getProfile();
    return res.data;
  },

  async updateUserProfile(dto: UpdateProfileRequestDto): Promise<UserMongoDto> {
    const res = await profileApi.updateProfile(dto);
    return res.data;
  },

  async fetchVehicles(): Promise<VehicleDto[]> {
    const res = await profileApi.listVehicles();
    return res.data || [];
  },

  async createVehicle(dto: AddVehicleRequestDto): Promise<VehicleDto> {
    const res = await profileApi.addVehicle(dto);
    return res.data;
  },

  async deleteVehicle(id: string): Promise<boolean> {
    const res = await profileApi.removeVehicle(id);
    return res.success;
  },

  async fetchHouseholdMembers(): Promise<HouseholdMemberDto[]> {
    const res = await profileApi.listHouseholdMembers();
    return res.data || [];
  },

  async createHouseholdMember(dto: AddHouseholdMemberRequestDto): Promise<HouseholdMemberDto> {
    const res = await profileApi.addHouseholdMember(dto);
    return res.data;
  },
};
