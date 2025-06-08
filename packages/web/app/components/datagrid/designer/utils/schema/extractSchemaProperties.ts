import type { OpenAPIV3 } from "openapi-types";
import { type SchemaProperty, type SchemaPropertyType } from "../../types/schemaTypes";
import { processComplexTypeStructure } from "./processComplexTypeStructure";

/**
 * Helper function to extract properties from an object schema
 * 
 * @param schema - OpenAPI Schema Object
 * @returns Array of schema properties
 */
export function extractPropertiesFromObject(
  schema: OpenAPIV3.SchemaObject,
): SchemaProperty[] {
  const properties: SchemaProperty[] = [];
  const requiredProps = schema.required || [];

  if (schema.properties) {
    for (const propName in schema.properties) {
      const propSchema = schema.properties[propName];
      let type: SchemaPropertyType | SchemaPropertyType[];
      let format: string | undefined;
      let description: string | undefined;
      let enumValues: string[] | number[] | undefined;
      let nullable = false;

      if ("$ref" in propSchema) {
        type = "object";
        description = `Reference to ${propSchema.$ref}`;
      } else {
        const propSchemaObj = propSchema as OpenAPIV3.SchemaObject;

        // Handle complex type structures (anyOf, oneOf)
        if (propSchemaObj.anyOf || propSchemaObj.oneOf) {
          const typeInfo = processComplexTypeStructure(propSchemaObj);
          type = typeInfo.type;
          format = typeInfo.format;
          nullable = !!typeInfo.nullable;
          // Use the description from typeInfo if available, otherwise try the property's description
          description = typeInfo.description || propSchemaObj.description;
        } else {
          // Simple type
          type =
            (propSchemaObj as { type: string }).type === "null"
              ? undefined
              : (propSchemaObj.type as SchemaPropertyType);
          format = propSchemaObj.format;
          nullable = propSchemaObj.nullable || (propSchemaObj as { type: string }).type === "null";
          description = propSchemaObj.description;
        }
        enumValues = propSchemaObj.enum as string[] | number[] | undefined;
      }

      properties.push({
        name: propName,
        type,
        format,
        required: requiredProps.includes(propName),
        description,
        enum: enumValues,
        nullable,
      });
    }
  }

  return properties;
}

/**
 * Extract properties from a schema, handling references, arrays, and object compositions
 * 
 * @param schema - OpenAPI Schema Object or Reference
 * @returns Array of schema properties
 */
export function extractSchemaProperties(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
): SchemaProperty[] {
  if (!schema) return [];

  // Handle reference objects
  if ("$ref" in schema) {
    // In a real implementation, we'd resolve the reference
    // For now, we just show it's a reference
    return [
      {
        name: schema.$ref.split("/").pop() || "Reference",
        type: "object",
        required: false,
        description: `Reference to ${schema.$ref}`,
      },
    ];
  }

  // Now we're dealing with a SchemaObject
  const schemaObj = schema as OpenAPIV3.SchemaObject;

  // Handle array types - extract item schema
  if (schemaObj.type === "array" && schemaObj.items) {
    const itemSchema = schemaObj.items;
    // For arrays, we want to look at the item properties
    if ("$ref" in itemSchema) {
      return [
        {
          name: "items",
          type: "array",
          required: false,
          description: `Array of references to ${itemSchema.$ref}`,
        },
      ];
    }
    if ((itemSchema as OpenAPIV3.SchemaObject).properties) {
      // If items have properties, extract those
      return extractPropertiesFromObject(itemSchema as OpenAPIV3.SchemaObject);
    }
    // Simple array of primitive's type
    return [
      {
        name: "items",
        type: (itemSchema as OpenAPIV3.SchemaObject).type,
        format: (itemSchema as OpenAPIV3.SchemaObject).format,
        required: false,
      },
    ];
  }

  // Handle objects with properties directly
  if (schemaObj.properties) {
    return extractPropertiesFromObject(schemaObj);
  }

  // Handle allOf, oneOf, anyOf compositions
  if (schemaObj.allOf) {
    // Merge all schemas in allOf
    let allProperties: SchemaProperty[] = [];
    for (const subSchema of schemaObj.allOf) {
      allProperties = [...allProperties, ...extractSchemaProperties(subSchema)];
    }
    return allProperties;
  }

  if (schemaObj.oneOf || schemaObj.anyOf) {
    const compositionArray = schemaObj.oneOf || schemaObj.anyOf;

    // Check if it's an anyOf with a null type (nullable)
    if (compositionArray && compositionArray.length > 1) {
      const hasNullType = compositionArray.some(
        (s) => !("$ref" in s) && (s as { type: string }).type === "null",
      );

      if (hasNullType) {
        // Filter out the null type and process the remaining schemas
        const nonNullSchemas = compositionArray.filter(
          (s) => "$ref" in s || (s as { type: string }).type !== "null",
        );

        if (nonNullSchemas.length > 0) {
          // Process the first non-null schema but mark as nullable
          const properties = extractSchemaProperties(nonNullSchemas[0]);
          return properties.map((p) => ({ ...p, nullable: true }));
        }
      }
    }

    // Use the first schema as an example
    if (compositionArray && compositionArray.length > 0) {
      return extractSchemaProperties(compositionArray[0]);
    }
  }

  // If we reach here, it could be a simple type
  if (schemaObj.type) {
    return [
      {
        name: "value",
        type:
          (schemaObj as { type: string }).type === "null"
            ? undefined
            : schemaObj.type,
        format: schemaObj.format,
        required: false,
        description: schemaObj.description,
        enum: schemaObj.enum as string[] | number[] | undefined,
        nullable: schemaObj.nullable || (schemaObj as { type: string }).type === "null",
      },
    ];
  }

  return [];
}