/**
 * Core type definitions for MoneyWorks
 */

/**
 * Base interface for all MoneyWorks tables
 */
export interface MoneyWorksTable {
  /** Table name in MoneyWorks */
  tableName: string;
  /** Table description */
  description: string;
}

/**
 * Represents a field in a MoneyWorks table
 */
export interface TableField {
  /** Field name as it appears in MoneyWorks */
  name: string;
  /** Field type (T=Text, N=Numeric, D=Date, etc.) */
  type: 'T' | 'N' | 'D' | 'A' | 'S' | 'B';
  /** Maximum length for text fields */
  maxLength?: number;
  /** Whether the field is required */
  required?: boolean;
  /** Field description */
  description?: string;
}

// Re-export common types
export * from './common';

// Re-export table-specific types when they exist
export * from './tables';