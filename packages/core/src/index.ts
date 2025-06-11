/**
 * @moneyworks/core
 *
 * The canonical core TypeScript library for MoneyWorks
 * Provides shared types, interfaces, models, and utilities
 *
 * For better tree-shaking, prefer importing from subpaths:
 * - `@moneyworks/core/types` for type definitions
 * - `@moneyworks/core/tables` for table interfaces
 * - `@moneyworks/core/export-import` for REST API functionality
 * - `@moneyworks/core/utils` for utility functions
 */

// Core types
export type { MoneyWorksTable, TableField } from "./types";

// Table system
export * from "./tables";

// Export/Import system
export * from "./export-import";

// Constants
export { TABLE_NAMES, FIELD_TYPES } from "./constants";

// Version info
export const version = "0.1.0" as const;
