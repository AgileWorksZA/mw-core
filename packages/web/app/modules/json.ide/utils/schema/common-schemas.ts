import type { JSONSchemaType } from 'ajv';

/**
 * Common JSON Schema types that can be reused throughout the application
 */

/**
 * Basic string schema
 */
export const stringSchema: JSONSchemaType<string> = {
  type: 'string'
};

/**
 * Basic number schema
 */
export const numberSchema: JSONSchemaType<number> = {
  type: 'number'
};

/**
 * Basic boolean schema
 */
export const booleanSchema: JSONSchemaType<boolean> = {
  type: 'boolean'
};

/**
 * Basic null schema
 */
export const nullSchema = {
  type: 'null'
};

/**
 * Basic array schema (for any[])
 */
export const anyArraySchema = {
  type: 'array',
  items: {}
};

/**
 * Basic object schema (for Record<string, any>)
 */
export const anyObjectSchema = {
  type: 'object',
  additionalProperties: true
};

/**
 * Schema for a string array
 */
export const stringArraySchema: JSONSchemaType<string[]> = {
  type: 'array',
  items: { type: 'string' }
};

/**
 * Schema for a number array
 */
export const numberArraySchema: JSONSchemaType<number[]> = {
  type: 'array',
  items: { type: 'number' }
};

/**
 * Schema for a boolean array
 */
export const booleanArraySchema: JSONSchemaType<boolean[]> = {
  type: 'array',
  items: { type: 'boolean' }
};

/**
 * Creates a schema for a string enum
 * 
 * @param values The valid enum values
 * @returns A JSON Schema for the enum
 */
export function createStringEnumSchema<T extends string>(values: readonly T[]): JSONSchemaType<T> {
  return {
    type: 'string',
    enum: values as unknown as [T, ...T[]]
  };
}

/**
 * Creates a schema for a record with specific value type
 * 
 * @param valueSchema The schema for the record values
 * @returns A JSON Schema for the record
 */
export function createRecordSchema<T>(valueSchema: JSONSchemaType<T> | Record<string, any>): Record<string, any> {
  return {
    type: 'object',
    additionalProperties: valueSchema
  };
}

/**
 * Creates a schema for a typed array
 * 
 * @param itemSchema The schema for array items
 * @returns A JSON Schema for the array
 */
export function createArraySchema<T>(itemSchema: JSONSchemaType<T> | Record<string, any>): Record<string, any> {
  return {
    type: 'array',
    items: itemSchema
  };
}

/**
 * Creates a union schema (oneOf)
 * 
 * @param schemas The schemas to union
 * @returns A JSON Schema for the union
 */
export function createUnionSchema(schemas: Array<Record<string, any>>): Record<string, any> {
  return {
    oneOf: schemas
  };
}

/**
 * Schema for any valid JSON value
 */
export const anyJsonSchema = createUnionSchema([
  stringSchema,
  numberSchema,
  booleanSchema,
  nullSchema,
  anyArraySchema,
  anyObjectSchema
]);

/**
 * Schema for a JSON primitive (string, number, boolean, null)
 */
export const jsonPrimitiveSchema = createUnionSchema([
  stringSchema,
  numberSchema,
  booleanSchema,
  nullSchema
]);