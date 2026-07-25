export type ComplaintStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED" | "CLOSED";
export type ComplaintPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface ComplaintCommentDto {
  _id: string;
  user: { _id: string; name: string; role: string };
  text: string;
  createdAt: string;
}

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
  assignedTo?: { _id: string; name: string };
  attachments?: string[];
  timeline: ComplaintTimelineItemDto[];
  comments: ComplaintCommentDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateComplaintRequestDto {
  title: string;
  description: string;
  category: string;
  priority?: ComplaintPriority;
  attachments?: string[];
}

export interface UpdateComplaintStatusRequestDto {
  status: ComplaintStatus;
  assignedTo?: string;
  note?: string;
}

export interface AddComplaintCommentRequestDto {
  text: string;
}

export interface ComplaintListResponseDto {
  success: boolean;
  data: ComplaintDto[];
  pagination: {
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
