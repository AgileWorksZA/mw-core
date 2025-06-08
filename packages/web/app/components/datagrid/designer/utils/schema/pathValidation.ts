import type { OpenAPIV3 } from "openapi-types";

/**
 * Validates if a path exists in the given schema
 * 
 * @param schema - OpenAPI Schema Object or Reference
 * @param dataPath - Path string using dot notation (e.g., "data.items")
 * @returns boolean indicating if the path is valid
 */
export function validateDataPath(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
  dataPath: string,
): boolean {
  if (!schema) return false;

  // For empty path, we always treat as valid (process whole schema)
  if (!dataPath) return true;

  const pathParts = dataPath.split(".");
  let currentSchema = schema;

  // Navigate through each part of the path to validate
  for (const part of pathParts) {
    if (part && !("$ref" in currentSchema)) {
      const schemaObj = currentSchema as OpenAPIV3.SchemaObject;

      // For arrays, check the items
      if (schemaObj.type === "array" && schemaObj.items) {
        currentSchema = schemaObj.items;
        continue;
      }

      // For objects, check if the property exists
      if (schemaObj.properties?.[part]) {
        currentSchema = schemaObj.properties[part];
      } else {
        return false; // Property not found
      }
    } else {
      return false; // Can't traverse reference object
    }
  }

  return true; // All parts of the path exist
}