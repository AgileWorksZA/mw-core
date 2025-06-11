/**
 * Generic converter utilities for MoneyWorks table field mappings
 */

/**
 * Converts an object from one field naming convention to another
 * @param source Source object
 * @param fieldMap Mapping of source fields to target fields
 * @returns Converted object with mapped field names
 */
export function convertFields<
  S extends object,
  T extends object,
>(source: S, fieldMap: Record<keyof T, keyof S>): T {
  const result = {} as T;

  for (const [targetKey, sourceKey] of Object.entries(fieldMap)) {
    if (typeof sourceKey === 'string' && sourceKey in source) {
      (result as Record<string, unknown>)[targetKey] =
        source[sourceKey as keyof S];
    }
  }

  return result;
}

/**
 * Creates a bidirectional converter for field mappings
 * @param fieldMap Mapping from format A to format B
 * @returns Object with toB and toA converter functions
 */
export function createConverter<
  A extends object,
  B extends object,
>(fieldMap: Record<keyof B, keyof A>) {
  // Create reverse mapping
  const reverseMap = {} as Record<keyof A, keyof B>;
  for (const [bKey, aKey] of Object.entries(fieldMap)) {
    reverseMap[aKey as keyof A] = bKey as keyof B;
  }

  return {
    toB: (source: A): B => convertFields(source, fieldMap),
    toA: (source: B): A => convertFields(source, reverseMap),
  };
}

/**
 * Type-safe partial converter for updates
 * @param source Partial source object
 * @param fieldMap Field mapping
 * @returns Partial converted object
 */
export function convertPartialFields<
  S extends object,
  T extends object,
>(source: Partial<S>, fieldMap: Record<keyof T, keyof S>): Partial<T> {
  const result: Partial<T> = {};

  for (const [targetKey, sourceKey] of Object.entries(fieldMap)) {
    if (typeof sourceKey === 'string' && sourceKey in source) {
      (result as Record<string, unknown>)[targetKey] =
        source[sourceKey as keyof S];
    }
  }

  return result;
}
