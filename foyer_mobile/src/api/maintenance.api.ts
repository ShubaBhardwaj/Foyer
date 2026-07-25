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
    return res.data;
  },

  async getInvoiceById(id: string): Promise<InvoiceDetailResponseDto> {
    const res = await apiClient.get<InvoiceDetailResponseDto>(`/invoices/${id}`);
    return res.data;
  },

  async initiatePayment(dto: InitiatePaymentRequestDto): Promise<InitiatePaymentResponseDto> {
    const res = await apiClient.post<InitiatePaymentResponseDto>("/payments", dto);
    return res.data;
  },
};
