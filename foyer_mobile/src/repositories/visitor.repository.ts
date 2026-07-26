import { visitorApi } from "@/api/visitor.api";
import {
  CreateVisitorRequestDto,
  VisitorDto,
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

  async approveVisitor(id: string, statusRemark?: string): Promise<VisitorDto> {
    const res = await visitorApi.approveVisitor(id, { statusRemark });
    return res.data;
  },

  async rejectVisitor(id: string, statusRemark: string): Promise<VisitorDto> {
    const res = await visitorApi.rejectVisitor(id, { statusRemark });
    return res.data;
  },

  async cancelVisitor(id: string, statusRemark?: string): Promise<VisitorDto> {
    const res = await visitorApi.cancelVisitor(id, { statusRemark });
    return res.data;
  },

  async checkInVisitor(id: string, entryCode?: string): Promise<VisitorDto> {
    const res = await visitorApi.checkInVisitor(id, { entryCode });
    return res.data;
  },

  async checkOutVisitor(id: string): Promise<VisitorDto> {
    const res = await visitorApi.checkOutVisitor(id);
    return res.data;
  },
};

