import { Types } from "mongoose";
import ApiError from "./apiError";
import { parsePagination, ParsedPagination } from "./pagination";

/**
 * Validate if a string is a valid MongoDB ObjectId.
 * Throws ApiError.badRequest if validation fails.
 */
export const validateObjectId = (id: string, paramName = "ID"): void => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest(`Invalid ${paramName} format: ${id}`);
  }
};

/**
 * Parse pagination query parameters.
 * Delegates to parsePagination helper.
 */
export const parsePaginationParams = (query: any): ParsedPagination => {
  return parsePagination(query?.page, query?.limit);
};
