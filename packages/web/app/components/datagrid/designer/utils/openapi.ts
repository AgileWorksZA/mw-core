import type { OpenAPIV3 } from "openapi-types";
import { type GetMethod } from "../types/openApiTypes";

/**
 * Extract all GET methods from an OpenAPI specification
 * 
 * @param specJson - OpenAPI document
 * @returns Array of GET methods with extracted metadata
 */
export function extractGetMethods(specJson: OpenAPIV3.Document): GetMethod[] {
  if (!specJson || !specJson.paths) {
    return [];
  }

  const methods: GetMethod[] = [];

  for (const path in specJson.paths) {
    const pathObj = specJson.paths[path];

    if (pathObj?.get) {
      const getMethod = pathObj.get;
      const successResponse = getMethod.responses?.["200"];
      const responseSchema =
        successResponse &&
        "content" in successResponse &&
        successResponse.content?.["application/json"]?.schema;

      // Extract the model name from path, response schema or operationId
      let modelName = path.split("/").pop()?.split("?")[0] || "";

      // Convert to "title-case" and clean up
      modelName = modelName
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .trim();

      // If "model-name" is empty, try to derive from operationId or tags
      if (!modelName && getMethod.operationId) {
        const parts = getMethod.operationId.split(/(?=[A-Z])|[-_]/);
        if (parts.length > 1) {
          // Try to extract a noun that might be the model name
          modelName = parts
            .filter((part) => part.length > 2) // Skip small words
            .slice(-1)[0] // Take the last meaningful part
            .replace(/s$/, ""); // Remove trailing 's' if it's plural

          // Convert to "title-case"
          modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
        }
      }

      // Fallback to tag if no model name found yet
      if (!modelName && getMethod.tags && getMethod.tags.length > 0) {
        modelName = getMethod.tags[0]; // Use first tag as model name
      }

      // Last resort: Generic name
      if (!modelName) {
        modelName = "Resource";
      }

      methods.push({
        path,
        method: "GET",
        fullPath: path,
        description: getMethod.description || getMethod.summary || path,
        modelName,
        responseSchema: responseSchema ? responseSchema : undefined,
        parameters: getMethod.parameters,
        operationId: getMethod.operationId,
        deprecated: getMethod.deprecated,
        tags: getMethod.tags,
        security: getMethod.security,
        responses: getMethod.responses,
      });
    }
  }

  return methods;
}