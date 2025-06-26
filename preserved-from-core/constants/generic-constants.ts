/**
 * Generic MoneyWorks Constants
 * 
 * Low-level constants that apply to all tables
 */

// API related constants
export const API_VERSION = "1.0.0" as const;
export const DEFAULT_PAGE_SIZE = 50 as const;
export const MAX_PAGE_SIZE = 1000 as const;
export const DEFAULT_TIMEOUT = 30000 as const; // 30 seconds

// Date/Time formats
export const MW_DATE_FORMAT = "YYYYMMDD" as const;
export const MW_TIME_FORMAT = "HHMMSS" as const;
export const MW_DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss" as const;
export const MW_TIMESTAMP_FORMAT = "ISO8601" as const;

// Field types (MoneyWorks internal codes)
export const MW_FIELD_TYPES = {
  TEXT: "T",
  NUMERIC: "N",
  DATE: "D",
  ALPHANUMERIC: "A",
  SPECIAL: "S",
  BOOLEAN: "B",
} as const;

// Data type formats
export const MW_DATA_FORMATS = {
  BOOLEAN_TRUE: "1",
  BOOLEAN_FALSE: "0",
  EMPTY_DATE: "",
  EMPTY_STRING: "",
  NULL_VALUE: "",
} as const;

// Export formats
export const MW_EXPORT_FORMATS = {
  TSV: "tsv",           // Default, no format param needed
  XML_TERSE: "xml-terse",
  XML_VERBOSE: "xml-verbose",
} as const;

// HTTP Status codes
export const MW_HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

// Special numeric constants
export const MW_NUMERIC = {
  SIGN_BIT: 0x80000000,  // Used for overpayment flags
  PERIOD_MULTIPLIER: 100, // Year * 100 + month
  MAX_DECIMAL_PLACES: 6,
} as const;

// Character encoding
export const MW_ENCODING = "UTF-8" as const;

// REST endpoints (generic pattern)
export const MW_ENDPOINTS = {
  EXPORT: "/export",
  IMPORT: "/import",
  EVALUATE: "/evaluate",
  VERSION: "/version",
  LIST: "/list",
} as const;