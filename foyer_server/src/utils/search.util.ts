import { SortOptions } from "../types/search.types";

/**
 * Escapes regex special characters in user input strings to prevent regex injection.
 */
export const escapeRegex = (text: string): string => {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

/**
 * Builds a MongoDB filter combining base filter conditions with `$or` regex matches across search fields.
 */
export const buildSearchQuery = (
  searchKeyword?: string,
  searchFields?: string[],
  baseFilter: Record<string, any> = {}
): Record<string, any> => {
  const query: Record<string, any> = { ...baseFilter };

  if (searchKeyword && searchFields && searchFields.length > 0) {
    const sanitized = escapeRegex(searchKeyword.trim());
    if (sanitized) {
      const regex = new RegExp(sanitized, "i");
      const searchConditions = searchFields.map((field) => ({
        [field]: regex,
      }));

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }
  }

  return query;
};

/**
 * Normalizes sort options into a Mongoose-compatible sort object.
 */
export const buildSortOptions = (
  sort?: SortOptions | string
): Record<string, 1 | -1> => {
  if (!sort) {
    return { createdAt: -1 };
  }

  if (typeof sort === "string") {
    const sortObj: Record<string, 1 | -1> = {};
    const parts = sort.split(",");
    parts.forEach((part) => {
      const trimmed = part.trim();
      if (trimmed.startsWith("-")) {
        sortObj[trimmed.slice(1)] = -1;
      } else {
        sortObj[trimmed] = 1;
      }
    });
    return Object.keys(sortObj).length > 0 ? sortObj : { createdAt: -1 };
  }

  const normalized: Record<string, 1 | -1> = {};
  Object.entries(sort).forEach(([key, val]) => {
    if (val === "asc" || val === 1) {
      normalized[key] = 1;
    } else if (val === "desc" || val === -1) {
      normalized[key] = -1;
    }
  });

  return Object.keys(normalized).length > 0 ? normalized : { createdAt: -1 };
};
