import type { OpenAPIV3 } from "openapi-types";
import type { FileContext } from "~/modules/ide/types";

export interface OpenAPIOperation {
  operationId: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  parameters?: OpenAPIV3.ParameterObject[];
  requestBody?: OpenAPIV3.RequestBodyObject;
  responses?: OpenAPIV3.ResponsesObject;
  tags?: string[];
}

export type OpenAPIDocument = OpenAPIV3.Document;

export type OpenAPISourceType = "url" | "file" | "paste";

export interface OpenAPISourceInfo {
  type: OpenAPISourceType;
  url?: string;
  fileName?: string;
  lastFetched?: string; // ISO date string
}

// The data stored in the IDE
export interface OpenAPIData {
  // Source information
  source: OpenAPISourceInfo;

  // Local resource path (where the spec is stored in public folder)
  resourcePath?: string;

  // The actual OpenAPI document (cached for quick access)
  document: OpenAPIDocument;
}

// The full context including the data wrapper
export interface OpenAPIFileContext extends FileContext {
  data: OpenAPIData;
}

// Store types - the context includes the data wrapper
export type OpenAPIContext = OpenAPIFileContext;
