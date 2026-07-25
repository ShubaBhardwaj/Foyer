export type VisitorStatus = "PENDING" | "APPROVED" | "REJECTED" | "CHECKED_IN" | "CHECKED_OUT" | "EXPIRED";

export interface VisitorDto {
  _id: string;
  name: string;
  phone: string;
  purpose: string;
  vehicleNumber?: string;
  entryType: "GUEST" | "DELIVERY" | "CAB" | "SERVICE";
  status: VisitorStatus;
  hostUser: string | { _id: string; name: string; flatNumber?: string; tower?: string };
  expectedDate?: string;
  expectedTime?: string;
  checkInTime?: string;
  checkOutTime?: string;
  passCode?: string;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitorRequestDto {
  name: string;
  phone: string;
  purpose: string;
  vehicleNumber?: string;
  entryType?: "GUEST" | "DELIVERY" | "CAB" | "SERVICE";
  expectedDate?: string;
  expectedTime?: string;
}

export interface UpdateVisitorStatusRequestDto {
  status: VisitorStatus;
  reason?: string;
}

export interface VisitorListResponseDto {
  success: boolean;
  data: VisitorDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VisitorDetailResponseDto {
  success: boolean;
  data: VisitorDto;
}
