import { complaintApi } from "@/api/complaint.api";
import {
  ComplaintDto,
  ComplaintStatus,
  CreateComplaintRequestDto,
} from "@/types/api/complaint";

export const complaintRepository = {
  async fetchComplaintsList(filters?: { page?: number; limit?: number; status?: string; category?: string; search?: string }) {
    const res = await complaintApi.listComplaints(filters);
    return {
      complaints: res.data || [],
      pagination: res.pagination,
    };
  },

  async fetchComplaintById(id: string): Promise<ComplaintDto> {
    const res = await complaintApi.getComplaintById(id);
    return res.data;
  },

  async submitComplaint(dto: CreateComplaintRequestDto): Promise<ComplaintDto> {
    const res = await complaintApi.createComplaint(dto);
    return res.data;
  },

  async updateStatus(id: string, status: ComplaintStatus, note?: string): Promise<ComplaintDto> {
    const res = await complaintApi.updateComplaintStatus(id, { status, note });
    return res.data;
  },

  async addComment(id: string, text: string): Promise<ComplaintDto> {
    const res = await complaintApi.addComplaintComment(id, { text });
    return res.data;
  },
};
