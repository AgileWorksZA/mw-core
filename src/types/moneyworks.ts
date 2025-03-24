// MoneyWorks types

/**
 * Query parameters for list endpoints
 */
export interface QueryParams {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: string;
  filter?: string;
}

/**
 * Pagination metadata
 */
export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  prev: string | null;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

/**
 * Filter operator types
 */
export type FilterOperator = 
  | 'eq'   // Equal to
  | 'ne'   // Not equal to
  | 'gt'   // Greater than
  | 'lt'   // Less than
  | 'gte'  // Greater than or equal to
  | 'lte'  // Less than or equal to
  | 'in'   // In list of values
  | 'like'; // Pattern matching

/**
 * Parsed filter
 */
export interface ParsedFilter {
  field: string;
  operator: FilterOperator;
  value: string;
}

/**
 * Batch operation
 */
export interface BatchOperation {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  body?: any;
}

/**
 * Batch operation result
 */
export interface BatchOperationResult {
  status: 'success' | 'error';
  operation: BatchOperation;
  result?: any;
  error?: string;
}

/**
 * Batch response
 */
export interface BatchResponse {
  operations: BatchOperationResult[];
}
