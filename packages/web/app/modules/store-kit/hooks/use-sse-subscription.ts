import { useEffect, useRef } from "react";
import { subscribeToStoreUpdates } from "~/modules/store-kit/sse/subscribe";
import type { SSEUpdateEvent } from "~/modules/store-kit/sse/subscribe";

export interface UseSSESubscriptionOptions {
  type: string;
  id: string;
  onUpdate?: (event: SSEUpdateEvent) => void;
  onError?: (error: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  enabled?: boolean;
}

/**
 * Hook to subscribe to Server-Sent Events for store-kit document updates
 */
export function useSSESubscription({
  type,
  id,
  onUpdate,
  onError,
  onConnect,
  onDisconnect,
  enabled = true,
}: UseSSESubscriptionOptions) {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled || !type || !id) {
      return;
    }

    // Clean up any existing subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Create new subscription using the plain function
    const unsubscribe = subscribeToStoreUpdates({
      type,
      id,
      onUpdate,
      onError,
      onConnect,
      onDisconnect,
    });

    unsubscribeRef.current = unsubscribe;

    // Cleanup on unmount or when dependencies change
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [type, id, enabled, onUpdate, onError, onConnect, onDisconnect]);

  return {
    close: () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    },
  };
}