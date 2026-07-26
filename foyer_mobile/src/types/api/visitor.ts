export type VisitorStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "EXPIRED";

export interface VisitorDto {
  _id: string;
  fullName?: string;
  name?: string;
  phoneNumber?: string;
  phone?: string;
  purpose?: string;
  vehicleNumber?: string;
  visitorType?: "GUEST" | "DELIVERY" | "CAB" | "SERVICE";
  entryType?: "GUEST" | "DELIVERY" | "CAB" | "SERVICE";
  status: VisitorStatus;
  statusRemark?: string;
  hostUser?: string | { _id: string; name: string; flatNumber?: string; tower?: string };
  resident?: string | { _id: string; name: string; flatNumber?: string; tower?: string };
  expectedArrival?: string;
  expectedDeparture?: string;
  expectedDate?: string;
  expectedTime?: string;
  checkInTime?: string;
  checkOutTime?: string;
  entryCode?: string;
  passCode?: string;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitorRequestDto {
  fullName: string;
  phoneNumber: string;
  email?: string;
  photoUrl?: string;
  visitorType: "GUEST" | "DELIVERY" | "CAB" | "SERVICE";
  purpose?: string;
  notes?: string;
  vehicleNumber?: string;
  expectedArrival: string;
  expectedDeparture?: string;
  society: string;
  tower: string;
  flat: string;
  resident: string;
}

export interface ApproveVisitorRequestDto {
  statusRemark?: string;
}

export interface RejectVisitorRequestDto {
  statusRemark: string;
}

export interface CancelVisitorRequestDto {
  statusRemark?: string;
}

export interface CheckInVisitorRequestDto {
  entryCode?: string;
}

export interface CheckOutVisitorRequestDto {}

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

