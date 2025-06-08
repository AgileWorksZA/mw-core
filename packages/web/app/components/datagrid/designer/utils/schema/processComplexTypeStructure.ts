import type { OpenAPIV3 } from "openapi-types";
import { type SchemaPropertyType, type ProcessedSchema } from "../../types/schemaTypes";

/**
 * Process schema with complex anyOf/oneOf structures
 * 
 * @param schema - OpenAPI schema object or reference
 * @returns Processed schema information with type, format, description, and nullable flag
 */
export function processComplexTypeStructure(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
): ProcessedSchema & { description?: string } {
  if ("$ref" in schema) {
    return { type: "object" };
  }

  const schemaObj = schema as OpenAPIV3.SchemaObject;
  
  // Extract the description from the parent schema if available
  const description = schemaObj.description;

  // Handle nested anyOf/oneOf structures
  if (schemaObj.anyOf || schemaObj.oneOf) {
    const typeArray = schemaObj.anyOf || schemaObj.oneOf;
    let nullable = false;
    let types: SchemaPropertyType[] = [];
    let format: string | undefined;
    // Try to find a description in the first non-null subschema if we don't have one already
    let extractedDescription = description;

    // Check for null type
    const hasNullType = typeArray?.some(
      (s) => !("$ref" in s) && (s as { type: string }).type === "null",
    );

    if (hasNullType) {
      nullable = true;
    }

    // Find all non-null types
    const nonNullSchemas = typeArray?.filter(
      (s) => "$ref" in s || (s as { type: string }).type !== "null",
    );

    // Process each non-null schema
    if (!nonNullSchemas) {
      return { type: "object", description };
    }
    
    // Find a description in the first schema with one if we don't already have one
    if (!extractedDescription && nonNullSchemas.length > 0) {
      const firstSchema = nonNullSchemas[0];
      if (!("$ref" in firstSchema) && (firstSchema as OpenAPIV3.SchemaObject).description) {
        extractedDescription = (firstSchema as OpenAPIV3.SchemaObject).description;
      }
    }
    
    for (const subSchema of nonNullSchemas) {
      if ("$ref" in subSchema) {
        types.push("object");
      } else {
        const subObj = subSchema as OpenAPIV3.SchemaObject;

        // Handle nested anyOf/oneOf
        if (subObj.anyOf || subObj.oneOf) {
          const nestedResult = processComplexTypeStructure(subObj);
          if (Array.isArray(nestedResult.type)) {
            types = [...types, ...nestedResult.type];
          } else if (nestedResult.type) {
            types.push(nestedResult.type);
          }

          // If we have a format and no existing format, use it
          if (nestedResult.format && !format) {
            format = nestedResult.format;
          }
          
          // If we still don't have a description but the nested result has one, use it
          if (!extractedDescription && nestedResult.description) {
            extractedDescription = nestedResult.description;
          }
        } else if (subObj.type) {
          types.push(subObj.type as SchemaPropertyType);

          // Keep track of format, especially for integer
          if (subObj.format && !format) {
            format = subObj.format;
          }
          
          // If we still don't have a description but this schema has one, use it
          if (!extractedDescription && subObj.description) {
            extractedDescription = subObj.description;
          }
        }
      }
    }

    // Special case: when we have a string with format integer and an integer type
    // consolidate to just integer
    if (
      types.includes("integer") &&
      types.includes("string") &&
      format === "integer"
    ) {
      types = types.filter((t) => t !== "string");
    }

    // Deduplicate types
    types = Array.from(new Set(types));

    // If we have a single type left, return it directly
    if (types.length === 1) {
      return { type: types[0], format, nullable, description: extractedDescription };
    }

    return { type: types, format, nullable, description: extractedDescription };
  }

  // Handle simple types
  return {
    type: schemaObj.type as SchemaPropertyType,
    format: schemaObj.format,
    nullable: schemaObj.nullable || false,
    description: description,
  };
}