/**
 * Key conversion utilities for MoneyWorks tables
 */

/**
 * Converts a PascalCase string to camelCase
 * @param str PascalCase string
 * @returns camelCase string
 */
export function pascalToCamelCase(str: string): string {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Converts a camelCase string to PascalCase
 * @param str camelCase string
 * @returns PascalCase string
 */
export function camelToPascalCase(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Aliases for compatibility
export const toCamelCase = pascalToCamelCase;
export const fromCamelCase = camelToPascalCase;

/**
 * Converts object keys from PascalCase to camelCase
 * @param obj Object with PascalCase keys
 * @returns Object with camelCase keys
 */
export function keysToCamelCase<T extends object>(
  obj: T,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[pascalToCamelCase(key)] = value;
  }
  return result;
}

/**
 * Converts object keys from camelCase to PascalCase
 * @param obj Object with camelCase keys
 * @returns Object with PascalCase keys
 */
export function keysToPascalCase<T extends object>(
  obj: T,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[camelToPascalCase(key)] = value;
  }
  return result;
}

/**
 * Type conversion helpers (placeholder for asset-log compatibility)
 */
export const convertKeysToType = keysToCamelCase;

export const TypeConverters = {
  toCamelCase: keysToCamelCase,
  toPascalCase: keysToPascalCase,
};
