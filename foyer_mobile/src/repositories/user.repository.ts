import { userApi, CreateResidentRequestDto, CreateGuardRequestDto } from "@/api/user.api";
import { UserMongoDto } from "@/types/api/auth";

export const userRepository = {
  async fetchUsersList(): Promise<UserMongoDto[]> {
    const res = await userApi.listUsers();
    return res.data || [];
  },

  async registerResident(dto: CreateResidentRequestDto): Promise<UserMongoDto> {
    const res = await userApi.createResident(dto);
    return res.data;
  },

  async registerGuard(dto: CreateGuardRequestDto): Promise<UserMongoDto> {
    const res = await userApi.createGuard(dto);
    return res.data;
  },
};
