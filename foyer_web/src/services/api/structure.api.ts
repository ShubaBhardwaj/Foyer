import { axiosClient } from "./axiosClient";
import {
  ApiResponse,
  CreateStructurePayload,
  StructureResponse,
  UpdateStructurePayload,
} from "@/types";

export const structureApi = {
  generate: async (payload: CreateStructurePayload): Promise<ApiResponse<StructureResponse>> => {
    const response = await axiosClient.post<ApiResponse<StructureResponse>>("/society/structure", payload);
    return response.data;
  },

  expand: async (payload: CreateStructurePayload): Promise<ApiResponse<StructureResponse>> => {
    const response = await axiosClient.post<ApiResponse<StructureResponse>>("/society/structure/expand", payload);
    return response.data;
  },

  update: async (payload: UpdateStructurePayload): Promise<ApiResponse<StructureResponse>> => {
    const response = await axiosClient.patch<ApiResponse<StructureResponse>>("/society/structure", payload);
    return response.data;
  },

  get: async (): Promise<ApiResponse<StructureResponse>> => {
    const response = await axiosClient.get<ApiResponse<StructureResponse>>("/society/structure");
    return response.data;
  },

  deleteTower: async (towerId: string): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(`/society/structure/tower/${towerId}`);
    return response.data;
  },
};
