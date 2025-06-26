/**
 * Generic Field Converter
 * 
 * Converts field names between camelCase (TypeScript) and PascalCase (MoneyWorks).
 * This is the generic pattern that can be used for any table.
 */

/**
 * Convert camelCase to PascalCase
 */
export function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert PascalCase to camelCase
 */
export function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Generic object key converter
 */
export function convertKeys<T extends Record<string, any>>(
  obj: T,
  converter: (key: string) => string
): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = converter(key);
    
    // Handle nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[newKey] = convertKeys(value, converter);
    } else if (Array.isArray(value)) {
      // Handle arrays of objects
      result[newKey] = value.map(item => 
        item && typeof item === 'object' ? convertKeys(item, converter) : item
      );
    } else {
      result[newKey] = value;
    }
  }
  
  return result;
}

/**
 * Convert object from camelCase to PascalCase
 */
export function camelToPascal<T extends Record<string, any>>(obj: T): Record<string, any> {
  return convertKeys(obj, toPascalCase);
}

/**
 * Convert object from PascalCase to camelCase
 */
export function pascalToCamel<T extends Record<string, any>>(obj: T): Record<string, any> {
  return convertKeys(obj, toCamelCase);
}

/**
 * Handle MoneyWorks lowercase XML field names
 * XML exports use lowercase, while TSV uses PascalCase
 */
export function normalizeFieldName(fieldName: string, format: 'xml' | 'tsv' = 'tsv'): string {
  if (format === 'xml') {
    // XML uses lowercase
    return fieldName.toLowerCase();
  }
  // TSV uses PascalCase
  return toPascalCase(fieldName);
}