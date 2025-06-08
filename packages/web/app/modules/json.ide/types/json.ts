/**
 * Type definitions for JSON data structures
 */

/**
 * Represents any valid JSON value
 */
export type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonArray
  | JsonObject;

/**
 * Represents a JSON array of any valid JSON values
 */
export interface JsonArray extends Array<JsonValue> {}

/**
 * Represents a JSON object with string keys and any valid JSON values
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * Represents a JSON primitive value (string, number, boolean, null)
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * Represents a path within a JSON structure
 * e.g., "users.0.name" for accessing the name of the first user in an array
 */
export type JsonPath = string;

/**
 * Type for a function that can transform a JSON value
 */
export type JsonTransformer = (value: JsonValue) => JsonValue;

/**
 * Represents a schema reference that can be used in a JSON Schema
 */
export interface SchemaReference {
  $ref: string;
}

/**
 * Represents a JSON Schema definition (simplified)
 */
export interface JsonSchemaDefinition {
  type?: string | string[];
  title?: string;
  description?: string;
  properties?: Record<string, JsonSchemaDefinition | SchemaReference>;
  items?: JsonSchemaDefinition | SchemaReference;
  required?: string[];
  enum?: JsonPrimitive[];
  anyOf?: (JsonSchemaDefinition | SchemaReference)[];
  allOf?: (JsonSchemaDefinition | SchemaReference)[];
  oneOf?: (JsonSchemaDefinition | SchemaReference)[];
  not?: JsonSchemaDefinition | SchemaReference;
  definitions?: Record<string, JsonSchemaDefinition | SchemaReference>;
  $defs?: Record<string, JsonSchemaDefinition | SchemaReference>;
  $ref?: string;
  
  // String validations
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  
  // Number validations
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number | boolean;
  exclusiveMaximum?: number | boolean;
  multipleOf?: number;
  
  // Array validations
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  
  // Object validations
  minProperties?: number;
  maxProperties?: number;
  additionalProperties?: boolean | JsonSchemaDefinition | SchemaReference;
  patternProperties?: Record<string, JsonSchemaDefinition | SchemaReference>;
  
  // Additional keywords
  default?: JsonValue;
  examples?: JsonValue[];
  [key: string]: any; // Allow for additional schema properties
}

/**
 * Represents a JSON Schema document
 */
export interface JsonSchema extends JsonSchemaDefinition {
  $schema?: string;
  $id?: string;
}