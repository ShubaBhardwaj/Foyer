export type ComplaintStatus = "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type ComplaintPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface ComplaintTimelineItemDto {
  status: ComplaintStatus;
  updatedBy: string;
  note?: string;
  timestamp: string;
}

export interface ComplaintDto {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdBy: { _id: string; name: string; flatNumber?: string; tower?: string };
  assignedTo?: { _id: string; name: string } | null;
  attachments?: string[];
  location?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateComplaintRequestDto {
  title: string;
  description: string;
  category: string;
  priority?: ComplaintPriority;
  attachments?: string[];
  location?: string;
}

export interface ResolveComplaintRequestDto {
  resolutionNotes?: string;
}

export interface ComplaintListResponseDto {
  success: boolean;
  data: ComplaintDto[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ComplaintDetailResponseDto {
  success: boolean;
  data: ComplaintDto;
}

