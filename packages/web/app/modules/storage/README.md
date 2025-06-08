# Storage Module

A high-performance, versioned document storage system with advanced features for production use.

## Overview

The storage module provides a generic, adapter-based persistence layer for document storage with full version control capabilities. It's designed for high concurrency, performance, and reliability.

## Key Features

### 🚀 Performance Optimizations
- **Async I/O**: All file operations use async/await for non-blocking performance
- **LRU Caching**: In-memory cache with configurable size and memory limits
- **Compression**: Automatic gzip compression for documents over threshold size
- **Snapshot Strategy**: Periodic snapshots for fast history reconstruction

### 🔒 Reliability & Concurrency
- **File Locking**: Prevents concurrent write conflicts
- **Collision-Free Timestamps**: Uses timestamp generator with counters for high-frequency writes
- **Proper Error Handling**: Typed error classes with HTTP status codes
- **Soft Delete**: Documents moved to trash instead of permanent deletion

### 🎯 Developer Experience
- **Type Safety**: Full TypeScript support with generics
- **Validation Support**: Optional schema validation and sanitization
- **React Router Integration**: Ready-to-use loader and action creators
- **Extensible Architecture**: Easy to implement new storage adapters

## Architecture

```
storage/
├── README.md              # This file
├── index.ts              # Public API exports
├── types.ts              # Core interfaces (StorageAdapter, configs)
├── errors.ts             # Error classes (StorageError, etc.)
├── loader.ts             # Generic React Router loader creator
├── utils.ts              # Shared utilities
└── json-adapter/         # JSON file storage implementation
    ├── index.ts          # JSON adapter exports
    ├── adapter.ts        # JsonFileAdapter implementation
    ├── client.ts         # Client-side sync utilities
    ├── actions.ts        # React Router action creators
    ├── loader.ts         # Pre-configured loader
    ├── storage.server.ts # Server-side exports
    └── lib/              # Implementation details
        ├── cache.ts              # LRU cache
        ├── compression.ts        # Gzip compression
        ├── file-lock.ts         # Concurrency control
        ├── timestamp-generator.ts # Collision-free timestamps
        └── fs-utils.ts          # Filesystem utilities
```

## Usage

### Basic Setup

```typescript
import { JsonFileAdapter } from "~/modules/storage/json-adapter";
import { createStorageLoader } from "~/modules/storage";
import { createPOSTAction } from "~/modules/storage/json-adapter/actions";

// Create adapter instance
const adapter = new JsonFileAdapter({
  basePath: "./data",
  cacheSize: 200,
  enableCompression: true,
  compressionThreshold: 2048, // 2KB
});

// Create React Router loader
export const loader = createStorageLoader(adapter, {
  defaultContext: { id: "", name: "", data: {} },
});

// Create React Router action
export const action = createPOSTAction(adapter);

// Or use pre-configured exports
import { loader, POST, DELETE } from "~/modules/storage/json-adapter";
```

### Advanced Configuration

```typescript
const adapter = new JsonFileAdapter({
  basePath: "./data",
  
  // Performance tuning
  cacheSize: 500,
  cacheMaxMemoryMB: 100,
  snapshotInterval: 25, // Create snapshot every 25 versions
  
  // Compression settings
  enableCompression: true,
  compressionThreshold: 1024, // Compress documents > 1KB
  
  // Validation
  validator: (data): data is MyType => {
    return typeof data === "object" && "id" in data;
  },
  
  // Data sanitization
  sanitizer: (data) => {
    // Remove sensitive fields
    const { password, ...safe } = data;
    return safe;
  },
});
```

### Version Control

```typescript
// Read specific version
const result = await adapter.read({
  type: "document",
  id: "123",
  timestamp: 1735124500000,
});

// Branch from a specific point in history
await adapter.replaceHistory({
  type: "document",
  id: "123",
  afterTimestamp: 1735124500000,
  payload: { context: newData },
});
```

### Error Handling

```typescript
try {
  await adapter.read({ type: "doc", id: "123" });
} catch (error) {
  if (error instanceof DocumentNotFoundError) {
    // Handle 404
  } else if (error instanceof ValidationError) {
    // Handle validation failure
  }
}
```

## File Structure

Documents are stored with the following structure:
```
{basePath}/
└── {type}/
    └── {id}/
        ├── _.json                    # Latest version
        ├── {timestamp}.json          # Version file
        ├── {timestamp}.json.gz       # Compressed version
        ├── {timestamp}.snapshot.json # Periodic snapshot
        └── {old}.{new}.json.branch   # Archived branch
```

## Performance Considerations

1. **Cache Hit Rate**: Monitor cache effectiveness with `adapter.cache.stats`
2. **Compression**: Larger documents benefit more from compression
3. **Snapshots**: Adjust `snapshotInterval` based on version frequency
4. **Memory Usage**: Configure `cacheMaxMemoryMB` based on available RAM

## Migration from Legacy

If migrating from the old synchronous implementation:

1. Update imports to use new adapter
2. Add `await` to all storage operations
3. Update error handling to use new error types
4. Configure performance settings based on usage patterns

## Future Enhancements

- [ ] Database adapter implementation
- [ ] S3/Cloud storage adapter
- [ ] Real-time sync capabilities
- [ ] Conflict resolution strategies
- [ ] Migration utilities