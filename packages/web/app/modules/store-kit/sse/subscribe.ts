import type { VersionCursor } from "~/modules/store-kit/versioning/types";

export interface SSEUpdateEvent {
  type: string;
  id: string;
  cursor: VersionCursor;
  sessionId?: string;
  timestamp: number;
  operation: "write" | "delete" | "replace";
}

export interface SubscriptionOptions {
  type: string;
  id: string;
  onUpdate?: (event: SSEUpdateEvent) => void;
  onError?: (error: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

/**
 * Subscribe to Server-Sent Events for store-kit document updates.
 * This is a plain function that can be used outside of React components.
 * 
 * @param options Subscription configuration
 * @returns Unsubscribe function to close the connection
 * 
 * @example
 * const unsubscribe = subscribeToStoreUpdates({
 *   type: "chat",
 *   id: "main",
 *   onUpdate: (event) => console.log("Update:", event),
 *   onError: (error) => console.error("Error:", error),
 * });
 * 
 * // Later, clean up
 * unsubscribe();
 */
export function subscribeToStoreUpdates(options: SubscriptionOptions): () => void {
  const { type, id, onUpdate, onError, onConnect, onDisconnect } = options;

  // Validate required parameters
  if (!type || !id) {
    console.error("[store-kit] subscribeToStoreUpdates: type and id are required");
    return () => {}; // Return no-op unsubscribe
  }

  // Create EventSource connection
  const eventSource = new EventSource(`/api/sse/context/${type}/${id}`);
  let isConnected = false;

  // Handle connection established
  const handleConnected = (event: MessageEvent) => {
    isConnected = true;
    console.log("[store-kit] SSE connected:", event.data);
    onConnect?.();
  };

  // Handle updates
  const handleUpdate = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data) as SSEUpdateEvent;
      console.log("[store-kit] SSE update received:", data);
      onUpdate?.(data);
    } catch (error) {
      console.error("[store-kit] Failed to parse SSE update:", error);
    }
  };

  // Handle errors
  const handleError = (event: Event) => {
    console.error("[store-kit] SSE error:", event);
    
    if (isConnected) {
      isConnected = false;
      onDisconnect?.();
    }
    
    onError?.(event);
    // EventSource will automatically reconnect
  };

  // Attach event listeners
  eventSource.addEventListener("connected", handleConnected);
  eventSource.addEventListener("update", handleUpdate);
  eventSource.addEventListener("error", handleError);

  // Return unsubscribe function
  return () => {
    // Remove event listeners
    eventSource.removeEventListener("connected", handleConnected);
    eventSource.removeEventListener("update", handleUpdate);
    eventSource.removeEventListener("error", handleError);
    
    // Close connection
    eventSource.close();
    
    if (isConnected) {
      isConnected = false;
      onDisconnect?.();
    }
    
    console.log(`[store-kit] SSE disconnected: ${type}/${id}`);
  };
}

/**
 * Subscribe to multiple documents at once.
 * Returns a function to unsubscribe from all.
 * 
 * @example
 * const unsubscribeAll = subscribeToMultipleStores([
 *   { type: "chat", id: "main", onUpdate: handleChatUpdate },
 *   { type: "ide", id: "project1", onUpdate: handleIdeUpdate },
 * ]);
 * 
 * // Later, clean up all subscriptions
 * unsubscribeAll();
 */
export function subscribeToMultipleStores(
  subscriptions: SubscriptionOptions[]
): () => void {
  const unsubscribes = subscriptions.map((options) => 
    subscribeToStoreUpdates(options)
  );

  // Return function to unsubscribe from all
  return () => {
    unsubscribes.forEach((unsubscribe) => unsubscribe());
  };
}

/**
 * Create a managed subscription that can be started and stopped.
 * Useful for dynamic subscriptions that need to be toggled.
 * 
 * @example
 * const subscription = createManagedSubscription({
 *   type: "chat",
 *   id: "main",
 *   onUpdate: handleUpdate,
 * });
 * 
 * subscription.start();
 * // ... later
 * subscription.stop();
 * // ... can start again
 * subscription.start();
 */
export function createManagedSubscription(options: SubscriptionOptions) {
  let unsubscribe: (() => void) | null = null;
  
  return {
    start: () => {
      if (unsubscribe) {
        console.warn("[store-kit] Subscription already active");
        return;
      }
      unsubscribe = subscribeToStoreUpdates(options);
    },
    
    stop: () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    },
    
    isActive: () => unsubscribe !== null,
    
    restart: () => {
      if (unsubscribe) {
        unsubscribe();
      }
      unsubscribe = subscribeToStoreUpdates(options);
    },
  };
}