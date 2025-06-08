import type {
  StoreContext,
  StoreKit,
  StoreKitEmitted,
  StoreKitEvents,
} from "~/modules/store-kit/types";
import type { EventObject, Subscription } from "@xstate/store";
import type { VersionCursor } from "~/modules/store-kit/versioning/types";
import { type Delta, diff } from "jsondiffpatch";
import { useEffect, useRef } from "react";
import { useDebounceCallback } from "~/lib/use-debounce-callback";
import { Tracking } from "~/modules/store-kit/versioning/tracking";
import { SyncError } from "~/modules/store-kit/sync/errors";
import { RetryManager } from "~/modules/store-kit/sync/retry-manager";

export interface UseServerSyncOptions<TContext> {
  type: string;
  id: string;
  store: StoreKit<TContext, any, any, any, any>;
  cursor: VersionCursor;
  maxWait?: number;
  maxRetries?: number;
  debug?: boolean;
  onError?: (error: SyncError) => void;
  onSyncStart?: () => void;
  onSyncComplete?: (cursor: VersionCursor) => void;
  storageFn: (config: {
    context: TContext;
    delta: Delta;
    cursor: VersionCursor;
  }) => Promise<VersionCursor & { ok: boolean }>;
}

export function useServerSync<
  TContext extends StoreContext,
  TEventPayloadsBase,
  TEmittedPayloadsBase,
  TEvents extends EventObject = StoreKitEvents<TEventPayloadsBase>,
  TEmittedPayloads extends EventObject = StoreKitEmitted<TEmittedPayloadsBase>,
  TStoreKitContext extends StoreKit<
    TContext,
    TEmittedPayloadsBase,
    TEventPayloadsBase,
    TEvents,
    TEmittedPayloads
  > = StoreKit<
    TContext,
    TEmittedPayloadsBase,
    TEventPayloadsBase,
    TEvents,
    TEmittedPayloads
  >,
>({
  type,
  id,
  store,
  cursor,
  maxWait = 500,
  maxRetries = 3,
  debug = false,
  onError,
  onSyncStart,
  onSyncComplete,
  storageFn,
}: UseServerSyncOptions<TContext>) {
  const ref = useRef<Subscription | null>(null);
  const retryManager = useRef(new RetryManager({
    maxRetries,
    onRetry: (error, attempt) => {
      if (debug) {
        console.log(`[store-kit] Retry attempt ${attempt + 1} after error:`, error);
      }
    },
  }));

  const logger = debug ? console : { log: () => {}, error: () => {}, warn: () => {} };

  const sync = useDebounceCallback(async (context: TContext) => {
    try {
      onSyncStart?.();
      
      const serverContext = await Tracking.getServerContext<TContext>({ type, id });
      const delta = diff(serverContext, context);
      
      if (!delta) {
        logger.log("[store-kit] No changes to sync");
        return;
      }

      logger.log("[store-kit] Syncing", { delta, context, serverContext });

      const syncResult = await retryManager.current.execute(
        () => storageFn({ context, delta, cursor }),
        { documentType: type, documentId: id }
      );

      logger.log("[store-kit] Sync result", syncResult);

      if (syncResult.ok) {
        const newCursor: VersionCursor = {
          next: syncResult.next,
          previous: syncResult.previous,
          latest: syncResult.latest,
          timestamp: syncResult.timestamp,
        };
        
        logger.log("[store-kit] Synced document:", syncResult);
        
        await Tracking.saveServerContext({
          type,
          id,
          cursor: newCursor,
          context,
        });
        
        onSyncComplete?.(newCursor);
      } else {
        throw new SyncError({
          type: 'storage',
          message: 'Failed to sync document - server returned not ok',
          retryable: false,
        });
      }
    } catch (error) {
      const syncError = SyncError.fromError(error, {
        documentType: type,
        documentId: id,
        operation: 'write',
      });
      
      logger.error("[store-kit] Sync error:", syncError);
      onError?.(syncError);
      
      // Re-throw if not retryable
      if (!syncError.isRetryable()) {
        throw syncError;
      }
    }
  }, maxWait);

  useEffect(() => {
    if (ref.current) {
      ref.current.unsubscribe();
      ref.current = null;
    }

    // Initialize server context
    (async () => {
      try {
        await Tracking.initServerContext({
          type,
          id,
          cursor,
          context: store.getSnapshot().context,
        });
        logger.log("[store-kit] Store initialized", store.getSnapshot().context);
      } catch (error) {
        logger.error("[store-kit] Failed to initialize store:", error);
      }
    })();

    // Subscribe to store changes
    ref.current = store.subscribe(async (state) => {
      logger.log("[store-kit] Store updated", state);
      Tracking.clientContextChanged({ id, type });
      await sync(state.context);
    });

    // Return cleanup function
    return () => {
      if (ref.current) {
        ref.current.unsubscribe();
        ref.current = null;
      }
    };
  }, [store, cursor, sync, type, id, logger]);
  
  return sync;
}