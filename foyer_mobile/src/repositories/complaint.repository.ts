import { complaintApi } from "@/api/complaint.api";
import {
  ComplaintDto,
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

  async resolveComplaint(id: string, resolutionNotes?: string): Promise<ComplaintDto> {
    const res = await complaintApi.resolveComplaint(id, { resolutionNotes });
    return res.data;
  },
};

