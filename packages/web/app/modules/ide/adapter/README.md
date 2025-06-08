# IDE Adapter System

The IDE adapter system provides a flexible framework for creating adapters that handle different file types and data formats in the IDE.

## Overview

Adapters are modular components that provide:
- File parsing and validation
- Editor UI components
- State management with store-kit
- Server synchronization
- Output variable calculation

## Adapter Categories

Adapters are organized into strongly-typed categories:

- **Data Sources**: JSON, CSV, XML, etc.
- **API**: OpenAPI, GraphQL, AsyncAPI specifications
- **Configuration**: .env, .ini, .toml files
- **Documentation**: Markdown, AsciiDoc, reStructuredText
- **Testing**: Test specifications and results
- **Visualization**: Chart and graph definitions
- **Workflow**: Process and pipeline definitions
- **Code**: Programming language files

## Creating a New Adapter

### Using the CLI Generator

The easiest way to create a new adapter is using the CLI generator:

```bash
bun run generate:adapter
```

This interactive tool will:
1. Let you select a template category
2. Prompt for required information
3. Generate all necessary files
4. Provide next steps and dependencies

### Manual Creation

If you prefer to create an adapter manually, follow this structure:

```
app/modules/{namespace}.ide/
├── adapter/
│   ├── adapter.ts      # Main adapter registration
│   └── config.ts       # Adapter configuration
├── components/
│   ├── editor.tsx      # Main editor component
│   ├── quick-view.tsx  # Optional preview component
│   └── new-file.tsx    # Optional new file dialog
├── hooks/
│   ├── use-{namespace}-context.ts
│   ├── use-{namespace}-selector.ts
│   └── use-{namespace}-trigger.ts
├── provider/
│   ├── provider.tsx    # Context provider
│   ├── types.tsx       # Provider types
│   └── store/
│       ├── types.ts    # Store types
│       ├── on.ts       # Event handlers
│       └── emits.ts    # Event emitters
├── types.ts            # Main type definitions
└── utils/              # Utility functions
```

## Adapter API

### Configuration

```typescript
export const config: AdapterConfig = {
  type: "myformat",
  metadata: {
    name: "My Format",
    description: "Handles .myformat files",
    accept: [".myformat"],
    tags: ["data", "custom"],
    category: AdapterCategories.DATA_SOURCE,
  },
};
```

### Registration

```typescript
export const adapter = registerAdapter<MyContext, InputType, OutputType>(
  config,
  {
    Icon: FileIcon,
    Editor,
    QuickView,
    useSelector: useMySelector,
    calculateOutputs: ({ input, context }) => {
      // Calculate output variables
      return { variables: processedData };
    },
    createFromFile: async ({ file }) => {
      // Parse file and return context
      const data = await parseFile(file);
      return { data };
    },
    emptyContext: () => {
      // Return empty context for new files
      return { data: {} };
    },
    Provider,
  }
);
```

## Store Integration

Adapters use the store-kit for state management:

### Event Handlers

```typescript
export const on: EventHandlers<MyContext, EventPayloads, EmitPayloads> = {
  update: (context, event, enqueue) => {
    if (!event.noEmit) {
      enqueue.emit.updated();
    }
    return rawReturn({
      ...context,
      ...event.context,
    });
  },
  // Add custom event handlers
};
```

### Using the Store

```typescript
function MyComponent() {
  const data = useMySelector(s => s.context.data);
  const trigger = useMyTrigger();
  
  const handleUpdate = () => {
    trigger({ type: "update", context: { data: newData } });
  };
}
```

## Templates

### Available Templates

1. **Data Source Template**: For file formats that store data
2. **API Template**: For API specifications and documentation

### Template Variables

Templates support various variable types:
- `string`: Text input
- `boolean`: Yes/no choice
- `select`: Dropdown selection

### Creating Custom Templates

Add new templates to `app/modules/ide/adapter/templates/`:

```typescript
export const MyTemplate: AdapterTemplate = {
  id: "my-template",
  name: "My Template",
  description: "Template for X type adapters",
  category: AdapterCategories.MY_CATEGORY,
  variables: [
    // Define template variables
  ],
  files: [
    // Define files to generate
  ],
};
```

## Best Practices

1. **Type Safety**: Use TypeScript generics for strong typing
2. **Error Handling**: Validate files and provide clear error messages
3. **Performance**: Use selectors to minimize re-renders
4. **Documentation**: Comment complex logic and provide examples
5. **Testing**: Write tests for parsing and validation logic

## Examples

### JSON Adapter
- Simple data format handling
- Schema validation support
- Monaco editor integration

### OpenAPI Adapter
- Complex specification parsing
- URL fetching support
- Multiple source types
- Resource path management

## Programmatic API

For automated adapter generation:

```typescript
import { generateAdapter } from "~/modules/ide/adapter/generator";

const result = await generateAdapter({
  templateId: "data-source",
  variables: {
    adapterType: "csv",
    adapterName: "CSV",
    moduleNamespace: "csv",
    // ... other variables
  },
  outputDir: "./app/modules/csv.ide",
});
```

## Registering Adapters

Don't forget to import and register your adapter:

```typescript
// In your app initialization
import "~/modules/myformat.ide/adapter/adapter";
```

## Utilities

### Finding Adapters

```typescript
// By category
const apiAdapters = listAdaptersByCategory(AdapterCategories.API);

// By file type
const jsonAdapters = findAdaptersForFileType(".json");

// By tags
const dataAdapters = listAdaptersByTags(["data"]);
```

### Adapter Metadata

```typescript
const metadata = getAdapterMetadata("openapi");
// Returns: { type, name, description, category, tags, acceptedFiles }
```