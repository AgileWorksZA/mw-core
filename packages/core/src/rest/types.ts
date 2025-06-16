/**
 * MoneyWorks REST API Types
 *
 * Core types for REST API communication with MoneyWorks.
 */

import type { TableName } from "../tables";

/**
 * MoneyWorks connection configuration
 */
export interface MoneyWorksConfig {
  /** Server hostname or IP address */
  host: string;

  /** REST API port (default: 6710) */
  port: number;

  /** MoneyWorks data file name */
  dataFile: string;

  /** Document username */
  username: string;

  /** Document password (optional - some operations may not require authentication) */
  password?: string;

  /** Optional folder password for two-level authentication */
  folderPassword?: string;

  /** Optional folder name for two-level authentication */
  folderName?: string;

  /** Use HTTPS instead of HTTP */
  useSSL?: boolean;

  /** Request timeout in milliseconds */
  timeout?: number;

  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Export format options
 */
export type ExportFormat =
  | "json" // JSON format (converts from XML internally)
  | "xml-terse" // Compact XML format
  | "xml-verbose" // Formatted XML with indentation
  | "tsv" // Tab-separated values
  | { template: string } // Custom template with field placeholders
  | { script: string }; // MWScript function

/**
 * Authentication headers for REST API
 */
export interface AuthHeaders {
  /** Document-level authentication */
  Authorization: string;

  /** Optional folder-level authentication */
  "Authorization-Folder"?: string;

  /** Index signature for compatibility with HeadersInit */
  [key: string]: string | undefined;
}

/**
 * Export operation options
 */
export interface ExportOptions {
  /** Export format */
  format?: ExportFormat;

  /** MoneyWorks filter expression */
  filter?: string;

  /** Starting record number (0-based) */
  start?: number;

  /** Maximum records to return */
  limit?: number;

  /** Sort order expression */
  orderBy?: string;

  /** Include calculated fields */
  includeCalculated?: boolean;

  /** No linger - release connection immediately */
  noLinger?: boolean;
}

/**
 * Import operation options
 */
export interface ImportOptions {
  /** Import mode */
  mode?: "create" | "update" | "upsert";

  /** Enable validation before import */
  validate?: boolean;

  /** Fields to auto-calculate */
  workItOut?: string[];

  /** Calculated field expressions */
  calculated?: Record<string, string>;

  /** Skip duplicate checking */
  allowDuplicates?: boolean;

  /** Continue on error */
  continueOnError?: boolean;
}

/**
 * REST API response
 */
export interface RESTResponse<T = unknown> {
  /** Success status */
  success: boolean;

  /** Response data */
  data?: T;

  /** Error message if failed */
  error?: string;

  /** Error details */
  details?: unknown;

  /** HTTP status code */
  status: number;

  /** Response headers */
  headers: Record<string, string>;
}

/**
 * Import result
 */
export interface ImportResult {
  /** Whether the import was successful */
  success?: boolean;
  
  /** Total count of imported records */
  count?: number;
  
  /** Sequence numbers of created records */
  sequenceNumbers?: number[];
  
  /** Number of records processed */
  processed?: number;

  /** Number of records created */
  created?: number;

  /** Number of records updated */
  updated?: number;

  /** Number of errors */
  errors?: number;

  /** Error details */
  errorDetails?: Array<{
    record: number;
    field?: string;
    message: string;
  }>;

  /** Warning messages */
  warnings?: string[];
}

/**
 * Export metadata
 */
export interface ExportMetadata {
  /** Table name */
  table: TableName;

  /** Total record count */
  totalCount: number;

  /** Exported record count */
  exportedCount: number;

  /** Export format used */
  format: ExportFormat;

  /** Filter applied */
  filter?: string;

  /** Export timestamp */
  timestamp: Date;
}

/**
 * Streaming export options
 */
export interface StreamOptions extends ExportOptions {
  /** Records per chunk */
  chunkSize?: number;

  /** Progress callback */
  onProgress?: (progress: {
    current: number;
    total?: number;
    percentage?: number;
  }) => void;
}

/**
 * MoneyWorks error codes
 */
export enum MoneyWorksErrorCode {
  /** Authentication failed */
  AUTH_FAILED = "AUTH_FAILED",

  /** Document not found */
  DOCUMENT_NOT_FOUND = "DOCUMENT_NOT_FOUND",

  /** Invalid request */
  INVALID_REQUEST = "INVALID_REQUEST",

  /** Validation error */
  VALIDATION_ERROR = "VALIDATION_ERROR",

  /** Duplicate record */
  DUPLICATE_RECORD = "DUPLICATE_RECORD",

  /** Record not found */
  RECORD_NOT_FOUND = "RECORD_NOT_FOUND",

  /** Permission denied */
  PERMISSION_DENIED = "PERMISSION_DENIED",

  /** Server error */
  SERVER_ERROR = "SERVER_ERROR",

  /** Timeout */
  TIMEOUT = "TIMEOUT",
  
  /** Invalid response format */
  INVALID_RESPONSE = "INVALID_RESPONSE",

  /** Unknown error */
  UNKNOWN = "UNKNOWN",
}

/**
 * REST endpoint paths
 */
export const REST_ENDPOINTS = {
  VERSION: "/version",
  LIST: "/list",
  EXPORT: "/export",
  IMPORT: "/import",
  EVALUATE: "/evaluate",
  POST: "/post",
  REPORT: "/doreport",
  FORM: "/doform",
  IMAGE: "/image",
} as const;

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<MoneyWorksConfig> = {
  port: 6710,
  useSSL: false,
  timeout: 30000,
  debug: false,
} as const;
