import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from "../constants";
import { PaginationMeta } from "../types/common";

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Parse page and limit query parameters and calculate skip offset.
 */
export const parsePagination = (
  rawPage?: any,
  rawLimit?: any
): ParsedPagination => {
  let page = Number(rawPage);
  let limit = Number(rawLimit);

  if (isNaN(page) || page < 1) {
    page = DEFAULT_PAGE;
  }

  if (isNaN(limit) || limit < 1) {
    limit = DEFAULT_LIMIT;
  } else if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Calculate PaginationMeta payload for paginated responses.
 */
export const calculateMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit) || 0;
  return {
    page,
    limit,
    total,
    totalPages,
  };
};
