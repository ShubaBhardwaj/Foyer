export type InvoiceStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export interface InvoiceItemDto {
  description: string;
  amount: number;
}

export interface InvoiceDto {
  _id: string;
  invoiceNumber: string;
  user: { _id: string; name: string; flatNumber?: string; tower?: string };
  dueDate: string;
  billingPeriod: string;
  items: InvoiceItemDto[];
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  paymentDate?: string;
  paymentMethod?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitiatePaymentRequestDto {
  invoiceId: string;
  paymentMethod: string;
  amount: number;
}

export interface InitiatePaymentResponseDto {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  status?: "SUCCESS" | "PENDING" | "FAILED";
  data?: any;
}


export interface InvoiceListResponseDto {
  success: boolean;
  data: InvoiceDto[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface InvoiceDetailResponseDto {
  success: boolean;
  data: InvoiceDto;
}

