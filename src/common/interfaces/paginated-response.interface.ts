export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
