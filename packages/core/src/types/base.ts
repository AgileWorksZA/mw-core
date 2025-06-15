/**
 * Base types and interfaces for MoneyWorks tables
 */

/**
 * ISO 8601 timestamp string
 */
export type Timestamp = string;

/**
 * Base interface for all MoneyWorks tables
 */
export interface BaseTable {
  LastModifiedTime?: Timestamp;
}

/**
 * Base interface for tables with a Code field
 */
export interface CodedTable extends BaseTable {
  Code: string;
}

/**
 * Base interface for tables with a SequenceNumber field
 */
export interface SequencedTable extends BaseTable {
  SequenceNumber: number;
}
