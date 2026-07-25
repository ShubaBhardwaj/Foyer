import { visitorApi } from "@/api/visitor.api";
import {
  CreateVisitorRequestDto,
  UpdateVisitorStatusRequestDto,
  VisitorDto,
  VisitorStatus,
} from "@/types/api/visitor";

export const visitorRepository = {
  async fetchVisitorsList(filters?: { page?: number; limit?: number; status?: string; search?: string }) {
    const res = await visitorApi.listVisitors(filters);
    return {
      visitors: res.data || [],
      pagination: res.pagination,
    };
  },

  async fetchVisitorById(id: string): Promise<VisitorDto> {
    const res = await visitorApi.getVisitorById(id);
    return res.data;
  },

  async createVisitorPass(dto: CreateVisitorRequestDto): Promise<VisitorDto> {
    const res = await visitorApi.createVisitor(dto);
    return res.data;
  },

  async updateStatus(id: string, status: VisitorStatus, reason?: string): Promise<VisitorDto> {
    const dto: UpdateVisitorStatusRequestDto = { status, reason };
    const res = await visitorApi.updateVisitorStatus(id, dto);
    return res.data;
  },

  async fetchQrPass(id: string) {
    return await visitorApi.getVisitorQrCode(id);
  },
};
