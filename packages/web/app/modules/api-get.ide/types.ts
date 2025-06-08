export interface ApiGetConfig {
  // Metadata
  id: string;
  name: string;
  description?: string;
  version: string;
  createdAt: string;
  updatedAt: string;

  // Source References
  sources: {
    openApiFile: string;      // Reference to OpenAPI file ID
    serviceConnection: string; // Reference to Service Connection file ID
  };

  // Endpoint Configuration
  endpoint: {
    path: string;             // e.g., "/users/{userId}"
    method: "get";            // Always GET for this file type
    operationId?: string;     // From OpenAPI spec
    summary?: string;         // From OpenAPI spec
    description?: string;     // From OpenAPI spec
  };

  // Parameter Configuration
  parameters: {
    path?: Record<string, ParameterConfig>;
    query?: Record<string, ParameterConfig>;
    headers?: Record<string, ParameterConfig>;
  };

  // Response Configuration
  response: {
    dataPath?: string;        // JSONPath to extract data from response
    errorPath?: string;       // JSONPath to extract error from response
    transformations?: Array<{
      type: 'map' | 'filter' | 'reduce' | 'custom';
      config: any;
    }>;
  };

  // Caching Configuration
  cache?: {
    enabled: boolean;
    ttl?: number;             // Time to live in seconds
    invalidateOn?: string[];  // Events that invalidate cache
  };

  // Output Variables
  output: {
    data: string;             // Variable name for response data
    error?: string;           // Variable name for error data
    loading?: string;         // Variable name for loading state
    metadata?: string;        // Variable name for response metadata
  };
}

export interface ParameterConfig {
  value: string | number | boolean | string[];
  source?: 'static' | 'variable' | 'context';
  variableName?: string;
  required?: boolean;
  description?: string;
  schema?: any; // OpenAPI schema
}

export interface OpenApiOperation {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Array<{
    name: string;
    in: 'path' | 'query' | 'header';
    required?: boolean;
    description?: string;
    schema?: any;
  }>;
  responses?: Record<string, any>;
}

export interface EndpointOption {
  path: string;
  method: string;
  operation: OpenApiOperation;
}