# DataGrid Architecture Plan

## Overview

This document outlines the architecture for integrating DataGrid components with API data sources using the IDE's file-based adapter system. The design prioritizes simplicity, reusability, and URL-driven state management.

## Core Architecture

```
OpenAPI Spec (openapi) - API documentation/schema
    ↓
API Connection (api-connection) - Base URL, authentication config
    ↓
API Endpoint (api-endpoint) - Specific endpoint + parameter config
    ↓
DataSource (data-source) - Data fetching & transformation recipe
    ↓ (used by)
Regular Routes (/accounting/creditors) - Standard routes with DataGrid components
```

## File Type Adapters

### 1. OpenAPI Adapter (`openapi`)
- **Purpose**: Parse and expose API operations from OpenAPI/Swagger specs
- **Input**: OpenAPI JSON/YAML file
- **Output**: Available operations, schemas, servers

### 2. API Connection Adapter (`api-connection`)
- **Purpose**: Store base configuration for API access
- **Input**: Server URL, authentication details
- **Output**: Configured connection details
- **Security**: Uses `FromData` for credentials to avoid storing secrets

### 3. API Endpoint Adapter (`api-endpoint`)
- **Purpose**: Configure specific API endpoint calls
- **Input**: 
  - Connection reference (Pointer to api-connection)
  - Operation ID from OpenAPI
  - Static parameters
- **Output**: Endpoint configuration ready for execution

### 4. DataSource Adapter (`data-source`)
- **Purpose**: Define data fetching and transformation logic
- **Input**: References to one or more api-endpoints
- **Output**: Transformation rules for shaping data

```typescript
interface DataSourceContext {
  // What data to fetch
  endpoints: Array<{
    id: string;
    ref: Pointer; // -> api-endpoint
  }>;
  
  // How to transform it
  transform: {
    extract?: string; // JSONPath: "$.data.items"
    merge?: {
      strategy: "concat" | "join" | "lookup";
      config?: any;
    };
    reshape?: {
      rows: string; // JSONPath to array
      totalCount?: string; // JSONPath to count
    };
  };
}
```

## Route Implementation

Routes are standard React Router routes that:
1. Parse DataGrid state from URL parameters
2. Load and execute DataSource(s)
3. Render DataGrid component(s)

### Example Route

```typescript
// app/routes/accounting.creditors.tsx
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  
  // Parse URL state
  const gridState = {
    page: Number(url.searchParams.get("page") || 1),
    pageSize: Number(url.searchParams.get("pageSize") || 50),
    sortBy: url.searchParams.get("sortBy"),
    sortOrder: url.searchParams.get("sortOrder"),
    filters: parseFiltersFromURL(url)
  };
  
  // Execute data source with URL params
  const data = await executeDataSource("creditors-list", gridState);
  
  return { data, gridState };
}

export default function CreditorsRoute() {
  const { data, gridState } = useLoaderData<typeof loader>();
  
  return (
    <DataGrid
      data={data.rows}
      totalCount={data.totalCount}
      state={gridState}
      onStateChange={updateURLState}
      columns={creditorsColumns}
    />
  );
}
```

## URL State Management

All DataGrid state lives in URL parameters:
- `page=2` - Current page
- `pageSize=50` - Items per page
- `sortBy=name&sortOrder=asc` - Sorting
- `filter.status=active&filter.amount=gt:1000` - Filters

### Multiple Grids on One Page

Use prefixed parameters:
- `creditors.page=1&creditors.sortBy=name`
- `debtors.page=2&debtors.filter.status=overdue`

## Key Design Principles

1. **No Magic Routes** - Just regular routes with DataGrid components
2. **URL-Driven** - All state in URL for shareability
3. **Separation of Concerns**:
   - DataSource = What data and how to fetch it
   - Route = Where to display it and URL state management
   - DataGrid = How to display it
4. **Reusability** - Same DataSource can be used by multiple routes
5. **Extensibility** - Easy to add new data sources and transformations

## Implementation Order

1. Create OpenAPI adapter to parse API specs
2. Create API Connection adapter for base configuration
3. Create API Endpoint adapter for specific endpoints
4. Create DataSource adapter for data recipes
5. Create `executeDataSource` utility function
6. Integrate with existing DataGrid component
7. Create example routes demonstrating usage

## Future Considerations

- **Live Updates**: Could be added at route level using WebSockets
- **Write Operations**: Will use Forms with store-kit or standard POST
- **Caching**: Can be added to executeDataSource utility
- **Virtual Scrolling**: For large datasets, implement in DataGrid
- **Export**: Add data export capabilities to DataGrid

## Implementation Status

### Phase 1: OpenAPI Module ✅
- [x] Create OpenAPI file type for IDE
  - Adapter registered with IDE system
  - Provider and store implementation complete
  - Types and interfaces defined
- [x] Import OpenAPI specs (URL, file upload, or paste)
  - NewFile component with three import methods
  - Server-side fetching to avoid CORS
  - Automatic filename inference from spec title
  - Stores specs in public/resources folder
- [x] Display OpenAPI documentation
  - Custom ApiDocumentation component
  - Shows operations, parameters, responses, schemas
  - Grouped by tags with expandable sections
  - Refresh capability for URL-based specs
- [x] Expose schema and endpoints as outputs
  - `openApiPath` as primary output (path to public resource)
  - Parsed operations, schemas, servers exposed
  - Source information tracked (type, URL, filename)
  
### Known Issues
- [ ] SSR issue with FileTree component using useNavigate
- [ ] Need to add resource cleanup when IDE file is deleted
- [ ] YAML support not yet implemented (JSON only)

### Phase 2: API Connection Module (Next)
- [ ] Create api-connection adapter
- [ ] UI for connection configuration
- [ ] Secure credential handling with FromData
- [ ] Connection testing capabilities

### Phase 3: API Endpoint Module
- [ ] Create api-endpoint adapter
- [ ] Reference OpenAPI operations
- [ ] Parameter configuration UI
- [ ] Preview/test endpoint calls

### Phase 4: DataSource Module
- [ ] Create data-source adapter
- [ ] Transform configuration UI
- [ ] Multiple endpoint support
- [ ] JSONPath integration

### Phase 5: Integration
- [ ] Create executeDataSource utility
- [ ] Update DataGrid component
- [ ] Create example routes
- [ ] Documentation and tutorials

## Benefits

- Uses existing IDE patterns and infrastructure
- No new routing concepts to learn
- Fully shareable URLs with complete state
- Easy to test and debug
- Natural composition of multiple data sources