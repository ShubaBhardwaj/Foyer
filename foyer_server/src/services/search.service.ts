import { Model } from "mongoose";
import {
  SearchOptions,
  SearchResult,
  SearchPaginationMeta,
} from "../types/search.types";
import { buildSearchQuery, buildSortOptions } from "../utils/search.util";
import { parsePagination } from "../utils/pagination";

/**
 * SearchService — Generic, domain-agnostic MongoDB search and pagination service.
 */
class SearchService {
  /**
   * Execute a generic paginated search query against any Mongoose model.
   */
  async search<T>(
    model: Model<T>,
    options: SearchOptions = {}
  ): Promise<SearchResult<T>> {
    const { page, limit } = parsePagination(options.page, options.limit);
    const skip = (page - 1) * limit;

    const query = buildSearchQuery(
      options.searchKeyword,
      options.searchFields,
      options.filter
    );

    const sortObj = buildSortOptions(options.sort);

    let mongoQuery = model.find(query).sort(sortObj).skip(skip).limit(limit);

    if (options.select) {
      mongoQuery = mongoQuery.select(options.select) as typeof mongoQuery;
    }

    if (options.populate) {
      mongoQuery = mongoQuery.populate(options.populate) as typeof mongoQuery;
    }

    const [data, totalItems] = await Promise.all([
      mongoQuery.exec() as Promise<T[]>,
      model.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 0;

    const meta: SearchPaginationMeta = {
      page,
      limit,
      total: totalItems,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return {
      data,
      meta,
    };
  }
}

export default new SearchService();
