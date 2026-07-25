import { maintenanceApi } from "@/api/maintenance.api";
import { InvoiceDto } from "@/types/api/maintenance";

export const maintenanceRepository = {
  async fetchInvoicesList(): Promise<InvoiceDto[]> {
    const res = await maintenanceApi.listInvoices();
    return res.data || [];
  },

  async fetchInvoiceById(id: string): Promise<InvoiceDto> {
    const res = await maintenanceApi.getInvoiceById(id);
    return res.data;
  },

  async initiateInvoicePayment(invoiceId: string, amount: number, paymentMethod: string) {
    return await maintenanceApi.initiatePayment({
      invoiceId,
      amount,
      paymentMethod,
    });
  },
};
