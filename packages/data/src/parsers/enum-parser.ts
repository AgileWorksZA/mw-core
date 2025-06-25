/**
 * MoneyWorks Enum Parser
 * 
 * @moneyworks-dsl PURE
 */

/**
 * Parse MoneyWorks enum value
 */
export function parseMWEnum<T extends Record<string, any>>(
  value: string | number | null | undefined,
  enumType: T,
  defaultValue: T[keyof T]
): T[keyof T] {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  
  const stringValue = String(value);
  
  // Check if value exists in enum
  if (Object.values(enumType).includes(stringValue)) {
    return stringValue as T[keyof T];
  }
  
  // Try numeric value
  const numValue = parseInt(stringValue, 10);
  if (!isNaN(numValue) && Object.values(enumType).includes(numValue)) {
    return numValue as T[keyof T];
  }
  
  return defaultValue;
}