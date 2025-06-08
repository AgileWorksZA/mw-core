import { useCallback } from "react";
import type { OpenAPIV3 } from "openapi-types";
import { transformSchemaProperties } from "../utils/schema/transformProperties";
import { validateDataPath } from "../utils/schema/pathValidation";
import { DesignerContext } from "~/components/datagrid/designer/types";

/**
 * Hook for processing OpenAPI schemas
 */
export function useSchemaProcessing() {
  /**
   * Processes a schema and returns properties based on the data path
   */
  const processSchema = useCallback((
    schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
    dataPath: string,
    onError?: (message: string) => void,
  ) => {
    if (!schema) return {};
    return transformSchemaProperties(schema, dataPath, onError);
  }, []);

  /**
   * Validates if a data path is valid for a given schema
   */
  const isPathValid = useCallback((
    schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
    dataPath: string,
  ): boolean => {
    return validateDataPath(schema, dataPath);
  }, []);

  /**
   * Updates the context with new properties based on the schema and path
   */
  const updateSchemaProperties = useCallback((
    schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
    dataPath: string,
    onError?: (message: string) => void,
  ) => {
    const properties = processSchema(schema, dataPath, onError);
    
    // Update properties in context
    DesignerContext.trigger.update({
      update: { properties },
    });
    
    return properties;
  }, [processSchema]);

  return {
    processSchema,
    isPathValid,
    updateSchemaProperties,
  };
}