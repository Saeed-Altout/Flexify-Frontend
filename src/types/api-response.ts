/**
 * Standard API Response Format
 * Matches the backend response structure
 */

export type ResponseStatus = "success" | "error";

/**
 * Pagination metadata for list responses
 */
export type IPaginationMeta = {
  page: number;
  total: number;
  limit: number;
  totalPages: number;
  isNextPage: boolean;
  isPrevPage: boolean;
};

/**
 * Standard API Response
 */
export type IApiResponse<T> = {
  status: ResponseStatus;
  message: string;
  lang: string;
  timestamp: string;
  data: T;
};
