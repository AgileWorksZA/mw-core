/**
 * MoneyWorks Table Type System
 *
 * Provides a comprehensive generic type system for all MoneyWorks tables
 * with type-safe table names and interfaces.
 */

// Import table interfaces as they are generated
import type { Name, NameCamel } from "./names";

/**
 * Implemented table names with TypeScript interfaces
 * @description Add to this union as new tables are generated
 */
export type TableName = "Name"; // | "Account" | "Transaction" | etc...

/**
 * Array of implemented table names for runtime checks
 */
export const tableNames = ["Name"] as const satisfies ReadonlyArray<TableName>;

/**
 * Map of table names to their TypeScript interfaces (raw MoneyWorks format)
 * @description Provides a cleaner way to map table names to types
 */
export interface TableMap {
  Name: Name;
  // Account: Account;
  // Transaction: Transaction;
  // Product: Product;
  // Job: Job;
  // Department: Department;
  // Add more as implemented
}

/**
 * Map of table names to their camelCase interfaces
 * @description Developer-friendly versions with camelCase properties
 */
export interface TableMapCamel {
  Name: NameCamel;
  // Account: AccountCamel;
  // Transaction: TransactionCamel;
  // Product: ProductCamel;
  // Job: JobCamel;
  // Department: DepartmentCamel;
  // Add more as implemented
}

/**
 * Generic table type resolver (raw MoneyWorks format)
 * @template T - The table name
 * @example
 * ```typescript
 * type NameRecord = Table<"Name">; // Resolves to Name interface
 * const record: Table<"Name"> = { Code: "CUST001", Name: "Acme Corp", ... };
 * ```
 */
export type Table<T extends TableName> = T extends keyof TableMap
  ? TableMap[T]
  : never;

/**
 * Generic table type resolver (camelCase format)
 * @template T - The table name
 * @example
 * ```typescript
 * type NameRecord = TableCamel<"Name">; // Resolves to NameCamel interface
 * const record: TableCamel<"Name"> = { code: "CUST001", name: "Acme Corp", ... };
 * ```
 */
export type TableCamel<T extends TableName> = T extends keyof TableMapCamel
  ? TableMapCamel[T]
  : never;

/**
 * Union of all implemented table types
 */
export type AnyTable = TableMap[keyof TableMap];

/**
 * Extract table name from a table type
 * @example
 * ```typescript
 * type TableOfName = TableNameFromType<Name>; // "Name"
 * ```
 */
export type TableNameFromType<T> = T extends TableMap[infer K extends
  keyof TableMap]
  ? K
  : never;

/**
 * Common fields present in all MoneyWorks tables
 */
export interface CommonTableFields {
  /** Last modification timestamp (ISO 8601 format) */
  ModTime?: string;
  /** User who last modified the record */
  ModUser?: string;
}

/**
 * Ensure a type has common MoneyWorks fields
 */
export type WithCommonFields<T> = T & CommonTableFields;

/**
 * Extract all field names from a table
 */
export type TableFields<T extends TableName> = keyof Table<T>;

/**
 * Extract only required fields from a table
 */
export type RequiredTableFields<T extends TableName> = {
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  [K in keyof Table<T>]-?: {} extends Pick<Table<T>, K> ? never : K;
}[keyof Table<T>];

/**
 * Extract only optional fields from a table
 */
export type OptionalTableFields<T extends TableName> = {
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  [K in keyof Table<T>]-?: {} extends Pick<Table<T>, K> ? K : never;
}[keyof Table<T>];

/**
 * Primary key configuration for each table
 * @description Uses exact MoneyWorks field names (PascalCase)
 */
export const tablePrimaryKeys = {
  Name: "Code",
  // Account: "Code",
  // Transaction: "SequenceNumber", // Note: Transaction uses SequenceNumber, not Code
  // Product: "Code",
  // Job: "Code",
  // Department: "Code",
} as const satisfies Record<TableName, string>;

/**
 * Type-safe primary key field name extractor
 */
export type PrimaryKeyField<T extends TableName> = (typeof tablePrimaryKeys)[T];

/**
 * Extract the type of the primary key value for a table
 */
export type PrimaryKeyValue<T extends TableName> = Table<T>[PrimaryKeyField<T>];

/**
 * Create a partial record for updates (all fields optional except primary key)
 */
export type PartialTable<T extends TableName> = Partial<Table<T>> &
  Pick<Table<T>, PrimaryKeyField<T>>;

/**
 * Type guard to check if a value is a valid table name
 */
export function isTableName(value: unknown): value is TableName {
  return typeof value === "string" && tableNames.includes(value as TableName);
}

/**
 * Get the primary key value from a table record
 */
export function getPrimaryKey<T extends TableName>(
  tableName: T,
  record: Table<T>,
): PrimaryKeyValue<T> {
  const keyField = tablePrimaryKeys[tableName];
  return record[keyField as keyof Table<T>] as PrimaryKeyValue<T>;
}

/**
 * Type guard with type narrowing for table records
 * @example
 * ```typescript
 * if (isTableType(record, "Name")) {
 *   // record is now typed as Name
 *   console.log(record.CustomerType);
 * }
 * ```
 */
export function isTableType<T extends TableName>(
  record: unknown,
  tableName: T,
): record is Table<T> {
  if (typeof record !== "object" || record === null) {
    return false;
  }

  // Check for primary key presence
  const primaryKeyField = tablePrimaryKeys[tableName];
  return primaryKeyField in record;
}

// Re-export table interfaces
export type { Name, NameCamel } from "./names";
