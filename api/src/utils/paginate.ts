export interface PaginationOptions {
  page?: number;
  count?: number;
}

export interface QueryPaginationOptions {
  skip: number;
  take: number;
}

export interface QueryPaginationResult<T = any> {
  data: T;
  count: number;
  totalPages: number;
  currentPage: number;
}

export const paginate = (
  options: PaginationOptions,
): QueryPaginationOptions => {
  if (options.page && options.count) {
    const take = options.count > 100 ? 100 : options.count; // Max 100 results
    const skip = (options.page - 1) * options.count;
    return { take, skip };
  } else {
    return {
      skip: 0,
      take: 10,
    };
  }
};
