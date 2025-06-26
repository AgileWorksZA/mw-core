/**
 * Date utilities for MoneyWorks
 */

// Re-export types
export type { HHMMSS, Period as PeriodType, YYYYMMDD as YYYYMMDDType } from "@moneyworks/utilities/types/branded";

// Export utilities without the tagged template aliases that conflict with type names
export * from "@moneyworks/utilities/date/period";
export * from "@moneyworks/utilities/date/yyyymmdd";

// Export tagged template literals (d and p), but not their aliases
export { d } from "@moneyworks/utilities/date/yyyymmdd";
export { p } from "@moneyworks/utilities/date/period";
