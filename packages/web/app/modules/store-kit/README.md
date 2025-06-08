# Store-Kit Module

A comprehensive document synchronization and versioning framework with enterprise-grade features for offline-capable, real-time applications.

## Overview

Store-Kit bridges client-side state management (XState Store) with server-side persistence, providing full version tracking, offline capabilities, conflict resolution, and real-time synchronization.

## Key Features

### 🚀 Performance
- **IndexedDB Cache**: Better performance and storage limits than localStorage
- **Change Batching**: Combines multiple changes into single sync operations
- **Smart Caching**: LRU cache with memory management
- **Debounced Sync**: Prevents excessive server calls

### 🔒 Reliability
- **Retry Logic**: Exponential backoff with jitter
- **Offline Queue**: Automatic queuing when offline
- **Error Recovery**: Comprehensive error handling
- **Conflict Resolution**: Multiple strategies for concurrent edits

### 🎯 Flexibility
- **Sync Strategies**: Optimistic, pessimistic, and real-time modes
- **Pluggable Storage**: Works with any storage adapter
- **Custom Conflict Resolution**: Field-level merge strategies
- **Event-Driven**: Hooks for all sync lifecycle events

### 🛠 Developer Experience
- **Debug Mode**: Comprehensive logging
- **Metrics**: Track sync performance and reliability
- **TypeScript**: Full type safety
- **Zero Config**: Works out of the box with sensible defaults

## Architecture

```
store-kit/
├── README.md              # This file
├── index.ts              # Public API exports
├── types.ts              # Core type definitions
├── hooks/                # React hooks
│   ├── use-server-sync.ts         # Basic sync hook
│   └── use-enhanced-server-sync.ts # Full-featured sync
├── versioning/           # Version tracking system
│   ├── store.ts         # XState version store
│   ├── tracking.ts      # Document tracking (uses IndexedDB)
│   ├── types.ts         # Version types
│   └── hooks/           # Version-specific hooks
├── sync/                 # Synchronization utilities
│   ├── errors.ts        # Error types and handling
│   ├── retry-manager.ts # Retry logic
│   ├── strategies.ts    # Sync strategies
│   ├── offline-queue.ts # Offline operation queue
│   ├── change-batcher.ts # Batching system
│   └── conflict-resolver.ts # Conflict resolution
└── cache/                # Caching layer
    └── indexed-db-cache.ts # IndexedDB implementation
```

## Usage

### Basic Setup

```typescript
import { useServerSync } from "~/modules/store-kit";
import { createStore } from "@xstate/store";

// Create your store
const store = createStore({
  context: { count: 0, name: "Example" },
  on: {
    increment: (context) => ({ ...context, count: context.count + 1 }),
    setName: (context, event: { name: string }) => ({ ...context, name: event.name }),
  },
});

// Use server sync
function MyComponent() {
  const sync = useServerSync({
    type: "document",
    id: "123",
    store,
    cursor: serverCursor, // From server
    storageFn: async ({ context, delta, cursor }) => {
      // Your API call here
      const response = await fetch(`/api/documents/123`, {
        method: 'POST',
        body: JSON.stringify({ context, delta }),
      });
      return response.json();
    },
  });
  
  // Store changes are automatically synced!
  store.send({ type: "increment" });
}
```

### Enhanced Setup with All Features

```typescript
import { useEnhancedServerSync } from "~/modules/store-kit";

function MyComponent() {
  const {
    sync,
    flush,
    getMetrics,
    processOfflineQueue,
    getOfflineQueueSize,
  } = useEnhancedServerSync({
    type: "document",
    id: "123",
    store,
    cursor: serverCursor,
    
    // Sync strategy
    strategy: 'optimistic', // or 'pessimistic', 'realtime'
    
    // Performance
    enableBatching: true,
    batchSize: 10,
    batchAge: 1000, // ms
    
    // Reliability
    enableOfflineQueue: true,
    maxRetries: 3,
    
    // Conflict resolution
    conflictResolution: 'field-level',
    fieldStrategies: {
      'lastModified': 'remote',
      'content': 'merge',
      'title': 'local',
    },
    
    // Developer experience
    debug: true,
    metrics: true,
    
    // Callbacks
    onError: (error) => console.error('Sync failed:', error),
    onSyncStart: () => setLoading(true),
    onSyncComplete: (cursor) => setLoading(false),
    onConflict: (conflicts) => console.log('Conflicts:', conflicts),
    onOfflineChange: (queueSize) => setOfflineCount(queueSize),
    
    // Storage function
    storageFn: async ({ context, delta, cursor }) => {
      const response = await fetch(`/api/documents/123`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, delta, cursor }),
      });
      return response.json();
    },
  });
  
  // Use the enhanced features
  const metrics = getMetrics();
  console.log('Sync metrics:', metrics);
}
```

## Sync Strategies

### Optimistic (Default)
```typescript
strategy: 'optimistic',
strategyOptions: {
  debounceMs: 500,
  minChangeSize: 10, // Skip tiny changes
}
```
- Assumes success and syncs in background
- Best for most use cases
- Minimal UI latency

### Pessimistic
```typescript
strategy: 'pessimistic'
```
- Waits for server confirmation
- Best for critical data
- Prevents conflicts but slower UX

### Real-time
```typescript
strategy: 'realtime',
strategyOptions: {
  throttleMs: 100, // Prevent spam
}
```
- Syncs immediately on every change
- Best for collaborative editing
- Higher server load

## Conflict Resolution

### Simple Strategies
```typescript
conflictResolution: 'local'  // Always prefer local changes
conflictResolution: 'remote' // Always prefer server changes
conflictResolution: 'error'  // Throw error on conflict
```

### Field-Level Resolution
```typescript
conflictResolution: 'field-level',
fieldStrategies: {
  // Specific strategies per field
  'metadata.updatedAt': 'remote',
  'content': 'merge',
  'title': 'local',
  'tags': 'merge', // Combines arrays
}
```

## Error Handling

```typescript
onError: (error: SyncError) => {
  if (error.isRetryable()) {
    // Will be retried automatically
    console.log('Temporary error:', error.details.message);
  } else {
    // Permanent failure
    console.error('Sync failed:', error.details);
    
    switch (error.details.type) {
      case 'conflict':
        // Handle conflict
        break;
      case 'validation':
        // Fix validation error
        break;
      case 'network':
        // Show offline indicator
        break;
    }
  }
}
```

## Offline Support

When offline, changes are automatically queued:

```typescript
// Monitor offline queue
const queueSize = await getOfflineQueueSize();
if (queueSize > 0) {
  console.log(`${queueSize} changes waiting to sync`);
}

// Manually process queue when reconnected
await processOfflineQueue();

// Clear queue if needed
await clearOfflineQueue();
```

## Performance Optimization

### Batching
Multiple rapid changes are combined:
```typescript
store.send({ type: 'updateField1', value: 'A' });
store.send({ type: 'updateField2', value: 'B' });
store.send({ type: 'updateField3', value: 'C' });
// Results in one sync with all changes
```

### Metrics
Track sync performance:
```typescript
const metrics = getMetrics();
console.log({
  totalSyncs: metrics.totalSyncs,
  successRate: metrics.successfulSyncs / metrics.totalSyncs,
  avgSyncTime: metrics.avgSyncTime,
  offlineQueueSize: metrics.offlineQueueSize,
});
```

## Migration from Basic to Enhanced

```typescript
// Before (basic)
const sync = useServerSync({
  type, id, store, cursor, storageFn
});

// After (enhanced with same behavior)
const { sync } = useEnhancedServerSync({
  type, id, store, cursor, storageFn,
  // All other options have sensible defaults
});
```

## Best Practices

1. **Choose the Right Strategy**: Use optimistic for most cases, pessimistic for critical data
2. **Handle Errors**: Always provide `onError` callback
3. **Monitor Offline Queue**: Show UI indicators when offline
4. **Test Conflict Resolution**: Simulate concurrent edits in development
5. **Use Debug Mode**: Enable during development for insights
6. **Clean Up**: Ensure components unmount properly

## Troubleshooting

### Changes Not Syncing
- Check debug logs with `debug: true`
- Verify `storageFn` returns `{ ok: true }`
- Check browser DevTools for IndexedDB data

### High Memory Usage
- Reduce cache size in storage adapter
- Enable compression for large documents
- Clear old IndexedDB entries periodically

### Conflicts
- Use field-level resolution for complex documents
- Implement custom merge logic for arrays
- Consider using CRDTs for automatic conflict resolution

## Future Enhancements

- [ ] WebSocket support for real-time sync
- [ ] CRDT integration for automatic conflict resolution
- [ ] Sync status UI components
- [ ] Differential sync for large documents
- [ ] Multi-tab synchronization