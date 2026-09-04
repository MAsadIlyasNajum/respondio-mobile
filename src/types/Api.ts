export interface PaginatedResponse<T> {
  total: number;
  limit: number;
  offset: number;
  results: T[];
}
