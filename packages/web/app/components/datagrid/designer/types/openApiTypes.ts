import type { OpenAPIV3 } from "openapi-types";

export interface GetMethod {
  path: string;
  method: string;
  fullPath: string;
  description: string;
  modelName: string;
  responseSchema:
    | OpenAPIV3.SchemaObject
    | OpenAPIV3.ReferenceObject
    | undefined;
  parameters?: (OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject)[];
  operationId?: string;
  deprecated?: boolean;
  tags?: string[];
  security?: OpenAPIV3.SecurityRequirementObject[];
  responses?: OpenAPIV3.ResponsesObject;
}