/**
 * @moneyworks/core
 * 
 * The canonical core TypeScript library for MoneyWorks
 * Provides shared types, interfaces, models, and utilities
 * 
 * For better tree-shaking, prefer importing from subpaths:
 * - `@moneyworks/core/types` for type definitions
 * - `@moneyworks/core/models` for data models
 * - `@moneyworks/core/utils` for utility functions
 */

// Re-export specific items for better tree-shaking
// Types
export type { MoneyWorksTable, TableField } from './types';

// Models - will be populated as we create them
// export { NameModel } from './models/name';

// Utilities - will be populated as we create them
// export { nameHelpers } from './utils/name-helpers';

// Constants
export { TABLE_NAMES, FIELD_TYPES } from './constants';

// Version info
export const version = '0.1.0' as const;