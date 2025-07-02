/**
 * @moneyworks/utilities
 *
 * Shared utilities for MoneyWorks packages
 * Provides type-safe date handling, JSON parsing, and branded types.
 */

// Date utilities
export * from "./date/index";

// JSON utilities  
export * from "./json/index";

// Type utilities
export * from "./types/index";

// Version
export const version = "0.1.0" as const;
