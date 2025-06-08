import type { OpenAPIV3 } from "openapi-types";
import { type SchemaProperty } from "../../types/schemaTypes";
import { type SchemaProperties } from "~/components/datagrid/designer/types";
import { extractSchemaProperties } from "./extractSchemaProperties";

/**
 * Get properties from the response data schema using a configurable JSON path
 * 
 * @param schema - The schema to extract properties from
 * @param dataPath - The path to data in the response (e.g., "data.items")
 * @param onError - Optional callback for error messages
 * @returns Array of schema properties
 */
export function getResponseDataProperties(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
  dataPath = "data",
  onError?: (message: string) => void,
): SchemaProperty[] {
  if (!schema) return [];

  // Handle nested paths (e.g., "data.items")
  const pathParts = dataPath.split(".");

  // Only try to navigate the path if there's actually a path specified
  if (dataPath && pathParts.length > 0) {
    // Start with the schema
    let currentSchema:
      | OpenAPIV3.SchemaObject
      | OpenAPIV3.ReferenceObject
      | undefined = schema;
    let found = true;

    // Navigate through each part of the path
    for (const part of pathParts) {
      if (part && !("$ref" in currentSchema)) {
        const schemaObj = currentSchema as OpenAPIV3.SchemaObject;

        // For arrays, look at the items
        if (schemaObj.type === "array" && schemaObj.items) {
          currentSchema = schemaObj.items;
          continue;
        }

        // For objects, look at the properties
        if (schemaObj.properties?.[part]) {
          currentSchema = schemaObj.properties[part];
        } else {
          // Path part not found
          found = false;
          if (onError) {
            onError(
              `Property '${part}' not found in the schema path '${dataPath}'`,
            );
          }
          break;
        }
      } else {
        // Cannot traverse a reference object
        found = false;
        if (onError) {
          onError(
            `Cannot navigate path '${dataPath}' through a reference object at '${part}'`,
          );
        }
        break;
      }
    }

    // If we found the nested property, extract from it
    if (found) {
      return extractSchemaProperties(currentSchema);
    }
  }

  // If "path" was not found or empty, process the schema directly
  return extractSchemaProperties(schema);
}

/**
 * Transform schema properties into a simplified JSON representation
 * 
 * @param schema - The schema to extract properties from
 * @param dataPath - The path to data in the response (e.g., "data.items")
 * @param onError - Optional callback for error messages
 * @returns Record of property names to their metadata
 */
export function transformSchemaProperties(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
  dataPath = "data",
  onError?: (message: string) => void,
): SchemaProperties {
  const properties = getResponseDataProperties(schema, dataPath, onError);
  const result: SchemaProperties = {};

  for (const prop of properties) {
    result[prop.name] = {
      type: Array.isArray(prop.type)
        ? prop.type.join(" | ")
        : prop.type || "unknown",
      ...(prop.format && { format: prop.format }),
      required: prop.required,
      nullable: !!prop.nullable,
      ...(prop.description && { description: prop.description }),
      ...(prop.enum && { enum: prop.enum }),
    };
  }

  return result;
}