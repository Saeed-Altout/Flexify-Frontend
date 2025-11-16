/**
 * Standard API Response Format
 * Matches the backend response structure
 */

export type ResponseStatus = "success" | "error";

/**
 * Pagination metadata for list responses
 */
export interface IPaginationMeta {
  page: number;
  total: number;
  limit: number;
  totalPages: number;
  isNextPage: boolean;
  isPrevPage: boolean;
}

/**
 * Wrapped data structure for single item responses
 */
export interface ISingleItemData<T> {
  data: T;
}

/**
 * Wrapped data structure for array responses with pagination
 */
export interface IArrayDataWithMeta<T> {
  data: T[];
  meta: IPaginationMeta;
}

/**
 * Standard API Response
 */
export interface IApiResponse<T> {
  status: ResponseStatus;
  message: string;
  lang: string;
  timestamp: string;
  data: T | null;
}

/**
 * Type for single item API responses
 */
export type ISingleItemApiResponse<T> = IApiResponse<ISingleItemData<T>>;

/**
 * Type for array API responses with pagination
 */
export type IArrayApiResponse<T> = IApiResponse<IArrayDataWithMeta<T>>;

