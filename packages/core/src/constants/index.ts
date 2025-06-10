/**
 * Shared constants for MoneyWorks
 */

// API related constants
export const API_VERSION = '1.0.0' as const;
export const DEFAULT_PAGE_SIZE = 50 as const;
export const MAX_PAGE_SIZE = 1000 as const;

// Date formats
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD' as const;
export const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss' as const;

// System constants
export const SYSTEM_USER_ID = 'system' as const;

// MoneyWorks table names
export const TABLE_NAMES = {
  ACCOUNTS: 'accounts',
  NAMES: 'names',
  PRODUCTS: 'products',
  TRANSACTIONS: 'transactions',
  JOBS: 'jobs',
  CONTACTS: 'contacts',
  ASSETS: 'assets',
  DEPARTMENTS: 'departments',
  INVENTORY: 'inventory',
  JOB_SHEET_ITEMS: 'job-sheet-items',
  TAX_RATE: 'tax-rate',
} as const;

// MoneyWorks field types
export const FIELD_TYPES = {
  TEXT: 'T',
  NUMERIC: 'N',
  DATE: 'D',
  ALPHANUMERIC: 'A',
  SPECIAL: 'S',
  BOOLEAN: 'B',
} as const;

// Export as frozen object for immutability
export const CONSTANTS = Object.freeze({
  API_VERSION,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATETIME_FORMAT,
  SYSTEM_USER_ID,
  TABLE_NAMES,
  FIELD_TYPES,
} as const);