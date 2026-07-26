/**
 * Shared API Response Types aligned with Express Backend ApiResponse wrapper.
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalItems?: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
  pagination?: PaginationMeta;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta?: PaginationMeta;
  pagination?: PaginationMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorPayload {
  statusCode: number;
  message: string;
  details?: ApiErrorDetail[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}
