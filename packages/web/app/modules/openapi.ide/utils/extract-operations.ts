import type { OpenAPIV3 } from "openapi-types";
import type { OpenAPIOperation } from "../types";

export function extractOperations(spec: OpenAPIV3.Document): OpenAPIOperation[] {
  const operations: OpenAPIOperation[] = [];
  
  if (!spec.paths) return operations;
  
  for (const [path, pathItem] of Object.entries(spec.paths)) {
    if (!pathItem) continue;
    
    const methods = ["get", "post", "put", "patch", "delete", "options", "head"] as const;
    
    for (const method of methods) {
      const operation = pathItem[method];
      if (!operation) continue;
      
      operations.push({
        operationId: operation.operationId || `${method}_${path.replace(/[^a-zA-Z0-9]/g, "_")}`,
        method: method.toUpperCase(),
        path,
        summary: operation.summary,
        description: operation.description,
        parameters: [
          ...(pathItem.parameters || []),
          ...(operation.parameters || [])
        ] as OpenAPIV3.ParameterObject[],
        requestBody: operation.requestBody as OpenAPIV3.RequestBodyObject,
        responses: operation.responses,
        tags: operation.tags
      });
    }
  }
  
  return operations;
}

export function extractSchemas(spec: OpenAPIV3.Document): Record<string, OpenAPIV3.SchemaObject> {
  if (!spec.components?.schemas) return {};
  
  const schemas: Record<string, OpenAPIV3.SchemaObject> = {};
  
  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    if ("$ref" in schema) continue; // Skip references for now
    schemas[name] = schema as OpenAPIV3.SchemaObject;
  }
  
  return schemas;
}

export function extractServers(spec: OpenAPIV3.Document): string[] {
  if (!spec.servers || spec.servers.length === 0) {
    return ["http://localhost"];
  }
  
  return spec.servers.map(server => server.url);
}