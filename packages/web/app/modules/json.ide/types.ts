// This is a JSON file artifact module
import type { FileContext } from "~/modules/ide/types";
import type { JsonObject, JsonValue, JsonSchema } from "./types/json";

/**
 * The context for the JSON artifact
 * Contains the JSON data and optional schema
 */
export interface JsonFileContext extends FileContext {
  /**
   * The JSON data
   */
  data: JsonObject;

  /**
   * Optional JSON Schema for validation
   */
  schema?: JsonSchema;
}

/**
 * Empty context for initializing a new JSON artifact
 */
export const blankContext: JsonFileContext = {
  data: {},
};

/**
 * Edit event type for the JSON artifact
 */
export interface JsonEditEvent {
  /**
   * Type of edit operation
   */
  type: "update" | "delete" | "rename" | "add";

  /**
   * Path to the edited value (e.g. "users.0.name")
   */
  path: string;

  /**
   * New value for update/add operations
   */
  value?: JsonValue;

  /**
   * Old key name for rename operations
   */
  oldKey?: string;

  /**
   * New key name for rename operations
   */
  newKey?: string;
}

/**
 * Type for validation results
 */
export interface ValidationResult {
  /**
   * Whether the validation was successful
   */
  valid: boolean;

  /**
   * Error message if validation failed
   */
  message?: string;

  /**
   * Path to the invalid value
   */
  path?: string;

  /**
   * Detailed validation errors
   */
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

/**
 * Re-export JSON types for convenience
 */
export * from "./types/json";
