# API Get Specification

## Overview

The `api-get` file type is a data source configuration that connects an OpenAPI specification with a service connection to create executable GET endpoints. This file type serves as a bridge between API definitions and runtime data fetching, enabling dynamic data retrieval based on OpenAPI specifications.

## Purpose

- Define reusable API GET configurations
- Map OpenAPI endpoints to service connections
- Configure query parameters and path variables
- Generate type-safe data fetching configurations
- Serve as data sources for other IDE components (e.g., DataGrid)

## File Structure

```typescript
interface ApiGetConfig {
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
    operationId?: string;     // From OpenAPI spec
    summary?: string;         // From OpenAPI spec
    description?: string;     // From OpenAPI spec
  };

  // Parameter Configuration
  parameters: {
    path?: Record<string, {
      value: string | number | boolean;
      source?: 'static' | 'variable' | 'context';
      variableName?: string;
    }>;
    query?: Record<string, {
      value: string | number | boolean | string[];
      source?: 'static' | 'variable' | 'context';
      variableName?: string;
      required?: boolean;
    }>;
    headers?: Record<string, {
      value: string;
      source?: 'static' | 'variable' | 'context';
      variableName?: string;
    }>;
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
```

## Input Requirements

### 1. OpenAPI File
- Must be a valid OpenAPI 3.x specification
- Must contain at least one GET endpoint
- Should have proper schema definitions for responses

### 2. Service Connection File
- Must define base URL and authentication
- Must be compatible with the OpenAPI specification's servers

## Features

### 1. Endpoint Selection
- Filter and display only GET methods from OpenAPI spec
- Group endpoints by tags or paths
- Search functionality for large APIs
- Preview of endpoint documentation

### 2. Parameter Configuration
- **Path Parameters**: Auto-detected from endpoint path
- **Query Parameters**: Based on OpenAPI parameter definitions
- **Headers**: Custom headers or from OpenAPI spec
- Support for:
  - Static values
  - Variable bindings (from IDE context)
  - Context values (runtime resolution)

### 3. Response Handling
- JSONPath support for data extraction
- Error handling with custom paths
- Response transformation pipeline
- Type inference from OpenAPI schemas

### 4. Variable Output
- Configurable output variable names
- Automatic type generation from OpenAPI schemas
- Support for loading states and error handling
- Metadata extraction (headers, status, etc.)

## UI Components

### NewFile Component
```typescript
// Components needed:
- SelectFileByType for OpenAPI selection
- SelectFileByType for Service Connection selection
- Name and description inputs
- Validation for required fields
```

### Editor Component
```typescript
// Main sections:
1. Source Configuration
   - Display selected OpenAPI file
   - Display selected Service Connection
   - Option to change sources

2. Endpoint Selector
   - Searchable list of GET endpoints
   - Endpoint details preview
   - Operation ID and description display

3. Parameter Editor
   - Dynamic form based on endpoint parameters
   - Value source selector (static/variable/context)
   - Variable picker for IDE context variables
   - Validation based on OpenAPI schema

4. Response Configuration
   - JSONPath editor for data extraction
   - Transformation pipeline builder
   - Preview with sample data

5. Output Configuration
   - Variable name configuration
   - Type preview
   - Usage examples
```

## Integration Points

### 1. With DataGrid
- Api-get files appear as data source options
- Automatic column generation from response schema
- Real-time data updates

### 2. With Other IDE Files
- Can reference variables from other files
- Can be used as input for other data transformations
- Supports chaining multiple API calls

### 3. With Form Designer
- Can populate form select options
- Can provide initial form values
- Can handle form submissions (future: api-post)

## Example Usage

```json
{
  "id": "api-get-users-list",
  "name": "Get Users List",
  "description": "Fetches paginated list of users",
  "version": "1.0.0",
  "sources": {
    "openApiFile": "openapi-petstore",
    "serviceConnection": "petstore-prod"
  },
  "endpoint": {
    "path": "/users",
    "operationId": "getUsers",
    "summary": "List all users"
  },
  "parameters": {
    "query": {
      "limit": {
        "value": 20,
        "source": "static"
      },
      "offset": {
        "value": "currentPage",
        "source": "variable",
        "variableName": "pagination.offset"
      }
    }
  },
  "response": {
    "dataPath": "$.data.users",
    "errorPath": "$.error"
  },
  "output": {
    "data": "usersList",
    "loading": "usersLoading",
    "error": "usersError"
  }
}
```

## Implementation Considerations

### 1. Validation
- Validate OpenAPI file exists and is valid
- Validate Service Connection exists
- Ensure selected endpoint exists in OpenAPI spec
- Validate parameter values against OpenAPI schemas

### 2. Type Safety
- Generate TypeScript types from OpenAPI schemas
- Provide type hints in editor
- Runtime type validation option

### 3. Error Handling
- Network errors
- Authentication failures
- Schema validation errors
- Transformation errors

### 4. Performance
- Implement request caching
- Debounce parameter changes
- Lazy load large OpenAPI specs
- Efficient re-rendering on data updates

## Future Enhancements

1. **Request Batching**: Combine multiple requests
2. **Pagination Support**: Built-in pagination handlers
3. **Retry Logic**: Configurable retry strategies
4. **WebSocket Support**: For real-time endpoints
5. **GraphQL Support**: Extend beyond REST APIs
6. **Mock Data**: Generate mock data from schemas
7. **Request History**: Track and replay requests
8. **Performance Metrics**: Monitor API performance