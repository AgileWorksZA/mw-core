/**
 * Branded types for type-safe primitives
 *
 * Branded types (also known as nominal types) allow us to create
 * distinct types that are structurally identical but nominally different.
 * This prevents accidental misuse of values.
 */

/**
 * Brand a type with a unique symbol
 */
export type Brand<T, B> = T & { readonly __brand: B };

/**
 * Extract the base type from a branded type
 */
export type Unbrand<T> = T extends Brand<infer U, unknown> ? U : T;

/**
 * Common branded string types for MoneyWorks
 */
export type YYYYMMDD = Brand<string, "YYYYMMDD">;
export type HHMMSS = Brand<string, "HHMMSS">;
export type ISODateTime = Brand<string, "ISODateTime">;
export type MoneyWorksDate = Brand<string, "MoneyWorksDate">; // Can be either YYYYMMDD or ISO
export type AccountCode = Brand<string, "AccountCode">;
export type NameCode = Brand<string, "NameCode">;
export type ProductCode = Brand<string, "ProductCode">;
export type TransactionSeq = Brand<number, "TransactionSeq">;
export type Period = Brand<number, "Period">; // YYYYMM as number
