import { useEffect, useRef } from "react";
import { subscribeToContextUpdates } from "./subscribe";
import type { ContextUpdateEvent } from "./subscribe";

export interface UseContextSubscriptionOptions {
  type: string;
  id: string;
  sessionId: string;
  onUpdate?: (event: ContextUpdateEvent) => void;
  onError?: (error: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  enabled?: boolean;
}

/**
 * Hook to subscribe to context updates for a specific document.
 * Automatically manages subscription lifecycle and filters out updates from the same session.
 * 
 * @example
 * function MyComponent() {
 *   const sessionId = useSessionId(); // Get your session ID
 *   
 *   useContextSubscription({
 *     type: "ide",
 *     id: "project1",
 *     sessionId,
 *     onUpdate: (event) => {
 *       console.log("Context updated by another session:", event);
 *       // Refresh your local state, refetch data, etc.
 *     },
 *     onConnect: () => console.log("Connected to context updates"),
 *     onDisconnect: () => console.log("Disconnected from context updates"),
 *   });
 * }
 */
export function useContextSubscription({
  type,
  id,
  sessionId,
  onUpdate,
  onError,
  onConnect,
  onDisconnect,
  enabled = true,
}: UseContextSubscriptionOptions) {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled || !type || !id || !sessionId) {
      return;
    }

    // Clean up any existing subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Create new subscription
    const unsubscribe = subscribeToContextUpdates({
      type,
      id,
      sessionId,
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
  }, [type, id, sessionId, enabled, onUpdate, onError, onConnect, onDisconnect]);

  return {
    close: () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    },
  };
}

/**
 * Hook to subscribe to multiple context updates at once.
 * 
 * @example
 * function MyComponent() {
 *   const sessionId = useSessionId();
 *   
 *   useMultipleContextSubscriptions({
 *     sessionId,
 *     subscriptions: [
 *       {
 *         type: "ide",
 *         id: "project1",
 *         onUpdate: (event) => console.log("Project 1 updated:", event),
 *       },
 *       {
 *         type: "ide",
 *         id: "project2",
 *         onUpdate: (event) => console.log("Project 2 updated:", event),
 *       },
 *     ],
 *   });
 * }
 */
export function useMultipleContextSubscriptions({
  sessionId,
  subscriptions,
  enabled = true,
}: {
  sessionId: string;
  subscriptions: Array<{
    type: string;
    id: string;
    onUpdate?: (event: ContextUpdateEvent) => void;
    onError?: (error: Event) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
  }>;
  enabled?: boolean;
}) {
  const unsubscribeRefs = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (!enabled || !sessionId || !subscriptions.length) {
      return;
    }

    // Clean up any existing subscriptions
    unsubscribeRefs.current.forEach((unsubscribe) => unsubscribe());
    unsubscribeRefs.current = [];

    // Create new subscriptions
    const unsubscribes = subscriptions.map((sub) =>
      subscribeToContextUpdates({
        ...sub,
        sessionId,
      })
    );

    unsubscribeRefs.current = unsubscribes;

    // Cleanup on unmount or when dependencies change
    return () => {
      unsubscribeRefs.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeRefs.current = [];
    };
  }, [sessionId, subscriptions, enabled]);

  return {
    closeAll: () => {
      unsubscribeRefs.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeRefs.current = [];
    },
  };
}