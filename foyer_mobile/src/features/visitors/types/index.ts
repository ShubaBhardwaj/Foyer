export type VisitorStatus = "pending" | "approved" | "rejected";
export type GuestPassStatus = "approved" | "pending" | "rejected";

export interface VisitorStatistic {
  id: string;
  title: string;
  value: string;
  caption: string;
  iconName: "Users" | "UserCheck" | "UserX" | "Clock";
}

export interface VisitorRequest {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  unit: string;
  timeAgo: string;
  status: VisitorStatus;
  initials: string;
  avatarUrl?: string;
  vehicleNumber?: string;
  expectedTime?: string;
}

export interface ResidentHostInfo {
  name: string;
  tower: string;
  flat: string;
  phone: string;
}

export interface VisitorDetailRecord {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  vehicleNumber: string;
  expectedDate: string;
  expectedTime: string;
  checkIn?: string;
  checkOut?: string;
  visitorIdCode: string;
  status: VisitorStatus;
  initials: string;
  avatarUrl?: string;
  rejectionReason?: string;
  resident: ResidentHostInfo;
  notes?: string;
}

export interface PreApprovedGuest {
  id: string;
  guestName: string;
  phone: string;
  purpose: string;
  vehicleNumber?: string;
  residentName: string;
  unit: string;
  validUntil: string;
  validDate: string;
  validTime: string;
  status: GuestPassStatus;
  passCode: string;
  initials: string;
}

export type VisitorFilterCategory =
  | "All"
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Today's"
  | "Pre Approved";
