/**
 * Pagination metadata format.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Generic paginated result interface.
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Common notification payload interface.
 */
export interface NotificationPayload {
  title: string;
  body: string;
  userIds: string[];
  data?: Record<string, unknown>;
}
