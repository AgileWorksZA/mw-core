# Server-Sent Events (SSE) for Store-Kit Updates

This document explains how to subscribe to real-time updates for store-kit documents using Server-Sent Events.

## Overview

The store-kit now supports real-time subscriptions to document updates via Server-Sent Events (SSE). This allows clients to receive immediate notifications when a document is modified, without polling.

## Features

- **Real-time Updates**: Receive updates as soon as they happen
- **Automatic Reconnection**: Built-in reconnection on connection loss
- **Heartbeat**: Keeps connections alive with periodic heartbeats
- **Session Tracking**: Each update includes the session ID of who made the change
- **Multiple Subscription Levels**: Subscribe to specific documents, document types, or all updates

## API Endpoint

### Subscribe to Document Updates

```
GET /api/sse/context/{type}/{id}
```

Subscribes to updates for a specific document.

**Event Types:**
- `connected`: Initial connection established
- `update`: Document was updated
- `:heartbeat`: Keep-alive signal (every 30 seconds)

**Update Event Data:**
```typescript
{
  type: string;         // Document type
  id: string;          // Document ID
  cursor: {            // Version information
    timestamp: number | null;
    latest: number;
    previous: number | null;
    next: number | null;
  };
  sessionId?: string;  // Who made the update
  timestamp: number;   // When the update occurred
  operation: "write" | "delete" | "replace";
}
```

## Client Usage

### Using the Plain Function (Non-React)

```typescript
import { subscribeToStoreUpdates } from "~/modules/store-kit/sse/subscribe";

// Subscribe to updates
const unsubscribe = subscribeToStoreUpdates({
  type: "chat",
  id: "main",
  onUpdate: (event) => {
    console.log("Document updated:", event);
    // Handle the update
  },
  onError: (error) => {
    console.error("SSE error:", error);
  },
  onConnect: () => {
    console.log("Connected to SSE");
  },
  onDisconnect: () => {
    console.log("Disconnected from SSE");
  },
});

// Later, clean up
unsubscribe();
```

### Multiple Subscriptions

```typescript
import { subscribeToMultipleStores } from "~/modules/store-kit/sse/subscribe";

const unsubscribeAll = subscribeToMultipleStores([
  { type: "chat", id: "main", onUpdate: handleChatUpdate },
  { type: "ide", id: "project1", onUpdate: handleIdeUpdate },
  { type: "api", id: "config", onUpdate: handleApiUpdate },
]);

// Unsubscribe from all at once
unsubscribeAll();
```

### Managed Subscription

```typescript
import { createManagedSubscription } from "~/modules/store-kit/sse/subscribe";

const subscription = createManagedSubscription({
  type: "chat",
  id: "main",
  onUpdate: handleUpdate,
});

// Start/stop as needed
subscription.start();
console.log(subscription.isActive()); // true

subscription.stop();
console.log(subscription.isActive()); // false

// Restart (disconnects and reconnects)
subscription.restart();
```

### Using the React Hook

```typescript
import { useSSESubscription } from "~/modules/store-kit/hooks/use-sse-subscription";

function MyComponent() {
  const { close } = useSSESubscription({
    type: "chat",
    id: "main",
    onUpdate: (event) => {
      console.log("Document updated:", event);
      // React to the update (e.g., refetch data, show notification)
    },
    onError: (error) => {
      console.error("SSE error:", error);
    },
    onConnect: () => {
      console.log("SSE connected");
    },
    onDisconnect: () => {
      console.log("SSE disconnected");
    },
    enabled: true, // Can disable subscription conditionally
  });

  // Close connection when needed
  // close();
}
```

### Direct EventSource Usage

```typescript
// Create connection
const eventSource = new EventSource("/api/sse/context/chat/main");

// Listen for updates
eventSource.addEventListener("update", (event) => {
  const data = JSON.parse(event.data);
  console.log("Update received:", data);
});

// Handle errors
eventSource.addEventListener("error", (event) => {
  console.error("Connection error:", event);
});

// Clean up
eventSource.close();
```

## Server Implementation

The server automatically emits events when documents are updated through the storage adapter:

1. **Write Operations**: Emits when a document is created or updated
2. **Delete Operations**: Emits when a document is deleted
3. **Replace History**: Emits when document history is replaced

Each event includes:
- Full version cursor information
- Session ID of the updater
- Timestamp of the update
- Type of operation performed

## Use Cases

1. **Collaborative Editing**: Multiple users editing the same document
2. **Real-time Dashboards**: Live updates without polling
3. **Change Notifications**: Alert users when data changes
4. **Audit Trails**: Track who made what changes when
5. **Optimistic UI Updates**: Confirm when server has processed changes

## Performance Considerations

- SSE connections are long-lived HTTP connections
- Each connection uses server resources
- Heartbeats prevent proxy timeouts
- Automatic reconnection handles network issues
- Consider connection limits when scaling

## Security

- SSE endpoints should be authenticated
- Consider rate limiting for connections
- Session IDs help track update sources
- No sensitive data in event payloads

## Example: Live Update Indicator

```typescript
function LiveUpdateIndicator({ type, id }: { type: string; id: string }) {
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [updaterSession, setUpdaterSession] = useState<string | null>(null);

  useSSESubscription({
    type,
    id,
    onUpdate: (event) => {
      setLastUpdate(event.timestamp);
      setUpdaterSession(event.sessionId || "unknown");
    },
  });

  if (!lastUpdate) return null;

  return (
    <div className="text-sm text-gray-500">
      Last updated: {new Date(lastUpdate).toLocaleTimeString()}
      {updaterSession && ` by session ${updaterSession.slice(0, 8)}...`}
    </div>
  );
}
```

## Debugging

Enable console logging to see SSE activity:
- Connection established: `[store-kit] SSE connected`
- Updates received: `[store-kit] SSE update received`
- Errors: `[store-kit] SSE error`

Check browser DevTools Network tab for:
- EventStream connections
- Heartbeat messages
- Update events