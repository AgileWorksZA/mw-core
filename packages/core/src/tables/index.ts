/**
 * MoneyWorks Table Type System
 *
 * Provides a comprehensive generic type system for all MoneyWorks tables
 * with type-safe table names and interfaces.
 */

import type { Account, AccountCamel } from "./accounts";
import type { AssetCategories, AssetCategoriesCamel } from "./asset-categories";
import type { AssetLog, AssetLogCamel } from "./asset-log";
import type { Asset, AssetCamel } from "./assets";
import type { AutoSplit, AutoSplitCamel } from "./auto-split";
import type { Build, BuildCamel } from "./build";
import type { Contact, ContactCamel } from "./contacts";
import type { Department, DepartmentCamel } from "./departments";
import type { General, GeneralCamel } from "./general";
import type { Inventory, InventoryCamel } from "./inventory";
import type { JobSheetItem, JobSheetItemCamel } from "./job-sheet-items";
import type { Job, JobCamel } from "./jobs";
import type { Login, LoginCamel } from "./login";
import type { Memo, MemoCamel } from "./memo";
import type { Name, NameCamel } from "./names";
import type { OffLedger, OffLedgerCamel } from "./offledger";
import type { Payments, PaymentsCamel } from "./payments";
import type { Product, ProductCamel } from "./products";
import type { Reconciliation, ReconciliationCamel } from "./reconciliation";
import type { TaxRate, TaxRateCamel } from "./tax-rates";
import type { Transaction, TransactionCamel } from "./transactions";
import type { User, UserCamel } from "./user";
import type { User2, User2Camel } from "./user2";
import type { Detail, DetailCamel } from "./detail";

/**
 * Implemented table names with TypeScript interfaces
 * @description Add to this union as new tables are generated
 */
export type TableName =
  | "Name"
  | "Account"
  | "Transaction"
  | "Product"
  | "Job"
  | "Department"
  | "TaxRate"
  | "Asset"
  | "AssetCategories"
  | "AssetLog"
  | "AutoSplit"
  | "Build"
  | "Contact"
  | "General"
  | "Inventory"
  | "JobSheetItem"
  | "Login"
  | "Memo"
  | "OffLedger"
  | "Payments"
  | "Reconciliation"
  | "User"
  | "User2"
  | "Detail";

/**
 * Array of implemented table names for runtime checks
 */
export const tableNames = [
  "Name",
  "Account",
  "Transaction",
  "Product",
  "Job",
  "Department",
  "TaxRate",
  "Asset",
  "AssetCategories",
  "AssetLog",
  "AutoSplit",
  "Build",
  "Contact",
  "General",
  "Inventory",
  "JobSheetItem",
  "Login",
  "Memo",
  "OffLedger",
  "Payments",
  "Reconciliation",
  "User",
  "User2",
  "Detail",
] as const satisfies ReadonlyArray<TableName>;

/**
 * Map of table names to their TypeScript interfaces (raw MoneyWorks format)
 * @description Provides a cleaner way to map table names to types
 */
export interface TableMap {
  Name: Name;
  Account: Account;
  Transaction: Transaction;
  Product: Product;
  Job: Job;
  Department: Department;
  TaxRate: TaxRate;
  Asset: Asset;
  AssetCategories: AssetCategories;
  AssetLog: AssetLog;
  AutoSplit: AutoSplit;
  Build: Build;
  Contact: Contact;
  General: General;
  Inventory: Inventory;
  JobSheetItem: JobSheetItem;
  Login: Login;
  Memo: Memo;
  OffLedger: OffLedger;
  Payments: Payments;
  Reconciliation: Reconciliation;
  User: User;
  User2: User2;
  Detail: Detail;
}

/**
 * Map of table names to their camelCase interfaces
 * @description Developer-friendly versions with camelCase properties
 */
export interface TableMapCamel {
  Name: NameCamel;
  Account: AccountCamel;
  Transaction: TransactionCamel;
  Product: ProductCamel;
  Job: JobCamel;
  Department: DepartmentCamel;
  TaxRate: TaxRateCamel;
  Asset: AssetCamel;
  AssetCategories: AssetCategoriesCamel;
  AssetLog: AssetLogCamel;
  AutoSplit: AutoSplitCamel;
  Build: BuildCamel;
  Contact: ContactCamel;
  General: GeneralCamel;
  Inventory: InventoryCamel;
  JobSheetItem: JobSheetItemCamel;
  Login: LoginCamel;
  Memo: MemoCamel;
  OffLedger: OffLedgerCamel;
  Payments: PaymentsCamel;
  Reconciliation: ReconciliationCamel;
  User: UserCamel;
  User2: User2Camel;
  Detail: DetailCamel;
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
  Account: "Code",
  Transaction: "SequenceNumber", // Note: Transaction uses SequenceNumber, not Code
  Product: "Code",
  Job: "Code",
  Department: "Code",
  TaxRate: "TaxCode", // Note: TaxRate uses TaxCode as primary key
  Asset: "Code",
  AssetCategories: "Code",
  AssetLog: "ParentSeq", // Note: AssetLog is a subfile, uses ParentSeq to link to Asset
  AutoSplit: "MatchFunction", // Note: AutoSplit uses combination of fields
  Build: "Build.ProductSeq", // Note: Build uses ProductSeq as key
  Contact: "ParentSeq", // Note: Contact uses ParentSeq to link to Name record
  General: "Code", // Note: General uses Code with prefix to determine type
  Inventory: "ProductSeq", // Note: Inventory uses ProductSeq as primary key
  JobSheetItem: "SequenceNumber", // Note: JobSheetItem uses SequenceNumber as primary key
  Login: "UserID", // Note: Login uses UserID as primary key
  Memo: "SequenceNumber", // Note: Memo uses SequenceNumber as primary key
  OffLedger: "Name", // Note: OffLedger uses Name as primary key
  Payments: "TransSeq", // Note: Payments uses TransSeq/InvoiceSeq combination
  Reconciliation: "Account", // Note: Reconciliation uses Account/Statement combination
  User: "Key", // Note: User uses Key as primary key
  User2: "Key", // Note: User2 uses Key as primary key
  Detail: "ParentSeq", // Note: Detail is a subfile, uses ParentSeq to link to Transaction
} as const satisfies Record<TableName, string>;

/**
 * Type-safe primary key field name extractor
 */
export type PrimaryKeyField<T extends TableName> = (typeof tablePrimaryKeys)[T];

/**
 * Extract the type of the primary key value for a table
 */
export type PrimaryKeyValue<T extends TableName> = T extends TableName
  ? Table<T>[PrimaryKeyField<T> & keyof Table<T>]
  : never;

/**
 * Create a partial record for updates (all fields optional except primary key)
 */
export type PartialTable<T extends TableName> = T extends TableName
  ? Partial<Table<T>> & Pick<Table<T>, PrimaryKeyField<T> & keyof Table<T>>
  : never;

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
): string | number {
  const keyField = tablePrimaryKeys[tableName];
  // biome-ignore lint/suspicious/noExplicitAny: Type system limitation with generics
  return (record as any)[keyField] as string | number;
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
export type { Account, AccountCamel } from "./accounts";
export type { Asset, AssetCamel } from "./assets";
export type { AssetCategories, AssetCategoriesCamel } from "./asset-categories";
export type { AssetLog, AssetLogCamel } from "./asset-log";
export type { AutoSplit, AutoSplitCamel } from "./auto-split";
export type { Build, BuildCamel } from "./build";
export type { Contact, ContactCamel } from "./contacts";
export type { Department, DepartmentCamel } from "./departments";
export type {
  General,
  GeneralCamel,
  AccountCategory,
  DepartmentClassification,
  Group,
  AccountCategoryCamel,
  DepartmentClassificationCamel,
  GroupCamel,
} from "./general";
export type { Inventory, InventoryCamel } from "./inventory";
export type { Job, JobCamel } from "./jobs";
export type { JobSheetItem, JobSheetItemCamel } from "./job-sheet-items";
export type { Login, LoginCamel } from "./login";
export type { Memo, MemoCamel } from "./memo";
export type { OffLedger, OffLedgerCamel } from "./offledger";
export type { Payments, PaymentsCamel } from "./payments";
export type { Product, ProductCamel } from "./products";
export type { Reconciliation, ReconciliationCamel } from "./reconciliation";
export type { TaxRate, TaxRateCamel } from "./tax-rates";
export type { Transaction, TransactionCamel } from "./transactions";
export type { User, UserCamel } from "./user";
export type { User2, User2Camel } from "./user2";

// Re-export enums and helpers
export { AssetLogAction, isAssetLog, isAssetLogCamel } from "./asset-log";
export { DepreciationType } from "./asset-categories";
export { SplitModeType } from "./auto-split";
export {
  GeneralType,
  generalTypeGuards,
  generalConverters,
  generalHelpers,
  generalTypeAssertions,
} from "./general";
export { MemoFlags } from "./memo";
export {
  OffLedgerKind,
  offLedgerHelpers,
  offLedgerConverters,
  isOffLedger,
  isOffLedgerCamel,
} from "./offledger";
export { PaymentType, GSTBasis } from "./payments";
export { UserHelpers } from "./user";
export { 
  DetailFlags, 
  detailFieldMappings, 
  detailConverters, 
  detailHelpers,
  isDetail,
  isDetailCamel,
  validateDetailFieldLengths
} from "./detail";
