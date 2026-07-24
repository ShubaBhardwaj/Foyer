import { axiosClient } from "./axiosClient";
import {
  ApiResponse,
  CreateResidentPayload,
  CreateUserPayload,
  User,
} from "@/types";

export const usersApi = {
  createSuperAdmin: async (payload: CreateUserPayload): Promise<ApiResponse<{ user: User }>> => {
    const response = await axiosClient.post<ApiResponse<{ user: User }>>("/user/super-admin", payload);
    return response.data;
  },

  createAdmin: async (payload: CreateUserPayload): Promise<ApiResponse<{ user: User }>> => {
    const response = await axiosClient.post<ApiResponse<{ user: User }>>("/user/admin", payload);
    return response.data;
  },

  createResident: async (payload: CreateResidentPayload): Promise<ApiResponse<{ user: User }>> => {
    const response = await axiosClient.post<ApiResponse<{ user: User }>>("/user/resident", payload);
    return response.data;
  },

  createGuard: async (payload: CreateUserPayload): Promise<ApiResponse<{ user: User }>> => {
    const response = await axiosClient.post<ApiResponse<{ user: User }>>("/user/guard", payload);
    return response.data;
  },

  getUsers: async (): Promise<ApiResponse<{ users: User[] }>> => {
    const response = await axiosClient.get<ApiResponse<{ users: User[] }>>("/user");
    return response.data;
  },
};
