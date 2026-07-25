export type SortOrder = "asc" | "desc" | 1 | -1;

export type SortOptions = Record<string, SortOrder>;

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface SearchOptions {
  searchKeyword?: string;
  searchFields?: string[];
  filter?: Record<string, any>;
  sort?: SortOptions | string;
  page?: number;
  limit?: number;
  select?: string | Record<string, number>;
  populate?: any;
}

export interface SearchPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SearchResult<T> {
  data: T[];
  meta: SearchPaginationMeta;
}
