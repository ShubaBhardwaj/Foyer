import apiClient from "./axios";
import {
  InitiatePaymentRequestDto,
  InitiatePaymentResponseDto,
  InvoiceDetailResponseDto,
  InvoiceListResponseDto,
} from "@/types/api/maintenance";

export const maintenanceApi = {
  async listInvoices(): Promise<InvoiceListResponseDto> {
    const res = await apiClient.get<InvoiceListResponseDto>("/invoices");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metaData = (res.data as any)?.meta || (res.data as any)?.pagination;
    const list = Array.isArray(responseData) ? responseData : [];
    return {
      success: true,
      data: list,
      pagination: metaData || { page: 1, limit: 10, total: list.length, pages: 1 },
    };
  },

  async getInvoiceById(id: string): Promise<InvoiceDetailResponseDto> {
    const res = await apiClient.get<InvoiceDetailResponseDto>(`/invoices/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async initiatePayment(dto: InitiatePaymentRequestDto): Promise<InitiatePaymentResponseDto> {
    const res = await apiClient.post<InitiatePaymentResponseDto>("/payments", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },
};

