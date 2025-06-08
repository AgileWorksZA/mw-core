/**
 * Enhanced server sync hook with all improvements
 */

import { useEffect, useRef, useCallback } from "react";
import type { Subscription } from "@xstate/store";
import type { Delta } from "jsondiffpatch";
import type { StoreKit, StoreContext } from "~/modules/store-kit/types";
import type { VersionCursor } from "~/modules/store-kit/versioning/types";
import { Tracking } from "~/modules/store-kit/versioning/tracking";
import { SyncError } from "~/modules/store-kit/sync/errors";
import { RetryManager } from "~/modules/store-kit/sync/retry-manager";
import { getOfflineQueue } from "~/modules/store-kit/sync/offline-queue";
import { ChangeBatcher } from "~/modules/store-kit/sync/change-batcher";
import {
  createSyncStrategy,
  type SyncStrategy,
} from "~/modules/store-kit/sync/strategies";
import {
  createConflictResolver,
  type ConflictResolver,
} from "~/modules/store-kit/sync/conflict-resolver";

export interface UseEnhancedServerSyncOptions<TContext extends StoreContext> {
  // Basic adapter
  type: string;
  id: string;
  store: StoreKit<TContext, any, any, any, any>;
  cursor: VersionCursor;

  // Sync strategy
  strategy?: "optimistic" | "pessimistic" | "realtime";
  strategyOptions?: any;

  // Performance
  enableBatching?: boolean;
  batchSize?: number;
  batchAge?: number;

  // Reliability
  enableOfflineQueue?: boolean;
  maxRetries?: number;

  // Conflict resolution
  conflictResolution?: "local" | "remote" | "field-level" | "error";
  fieldStrategies?: Record<string, "local" | "remote" | "merge">;

  // Developer experience
  debug?: boolean;
  metrics?: boolean;

  // Callbacks
  onError?: (error: SyncError) => void;
  onSyncStart?: () => void;
  onSyncComplete?: (cursor: VersionCursor) => void;
  onConflict?: (conflicts: any[]) => void;
  onOfflineChange?: (queueSize: number) => void;

  // Storage function
  storageFn: (config: {
    context: TContext;
    delta: Delta;
    cursor: VersionCursor;
  }) => Promise<VersionCursor & { ok: boolean }>;
}

interface SyncMetrics {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  retries: number;
  conflicts: number;
  avgSyncTime: number;
  offlineQueueSize: number;
}

export function useEnhancedServerSync<TContext extends StoreContext>(
  options: UseEnhancedServerSyncOptions<TContext>,
) {
  const {
    type,
    id,
    store,
    cursor,
    strategy = "optimistic",
    strategyOptions,
    enableBatching = true,
    batchSize = 10,
    batchAge = 1000,
    enableOfflineQueue = true,
    maxRetries = 3,
    conflictResolution = "remote",
    fieldStrategies,
    debug = false,
    metrics = false,
    onError,
    onSyncStart,
    onSyncComplete,
    onConflict,
    onOfflineChange,
    storageFn,
  } = options;

  // Refs
  const subscriptionRef = useRef<Subscription | null>(null);
  const syncStrategyRef = useRef<SyncStrategy<TContext>>();
  const conflictResolverRef = useRef<ConflictResolver<TContext>>();
  const retryManagerRef = useRef<RetryManager>();
  const changeBatcherRef = useRef<ChangeBatcher<TContext>>();
  const offlineQueueRef = useRef(getOfflineQueue());
  const metricsRef = useRef<SyncMetrics>({
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    retries: 0,
    conflicts: 0,
    avgSyncTime: 0,
    offlineQueueSize: 0,
  });

  // Logger
  const logger = debug
    ? {
        log: (...args: any[]) => console.log("[store-kit]", ...args),
        error: (...args: any[]) => console.error("[store-kit]", ...args),
        warn: (...args: any[]) => console.warn("[store-kit]", ...args),
      }
    : { log: () => {}, error: () => {}, warn: () => {} };

  // Initialize strategies
  if (!syncStrategyRef.current) {
    syncStrategyRef.current = createSyncStrategy<TContext>(
      strategy,
      strategyOptions || {},
    );
  }

  if (!conflictResolverRef.current) {
    conflictResolverRef.current = createConflictResolver<TContext>(
      conflictResolution === "field-level" ? "field-level" : "simple",
      conflictResolution === "field-level"
        ? { fieldStrategies }
        : { strategy: conflictResolution },
    );
  }

  if (!retryManagerRef.current) {
    retryManagerRef.current = new RetryManager({
      maxRetries,
      onRetry: (error, attempt) => {
        metricsRef.current.retries++;
        logger.log(`Retry attempt ${attempt + 1}`, error);
      },
    });
  }

  // Core sync function
  const performSync = useCallback(
    async (context: TContext, previousContext: TContext): Promise<void> => {
      const startTime = Date.now();
      metricsRef.current.totalSyncs++;

      try {
        onSyncStart?.();

        const syncPayload = syncStrategyRef.current!.prepareSync(
          context,
          previousContext,
        );

        if (!syncPayload.delta) {
          logger.log("No changes to sync");
          return;
        }

        logger.log("Syncing", syncPayload);

        const syncResult = await retryManagerRef.current!.execute(
          () =>
            storageFn({
              context: syncPayload.context,
              delta: syncPayload.delta!,
              cursor,
            }),
          { documentType: type, documentId: id },
        );

        if (syncResult.ok) {
          const newCursor: VersionCursor = {
            next: syncResult.next,
            previous: syncResult.previous,
            latest: syncResult.latest,
            timestamp: syncResult.timestamp,
          };

          await Tracking.saveServerContext({
            type,
            id,
            cursor: newCursor,
            context,
          });

          metricsRef.current.successfulSyncs++;
          onSyncComplete?.(newCursor);

          // Process offline queue if reconnected
          if (enableOfflineQueue) {
            await processOfflineQueue();
          }
        } else {
          throw new SyncError({
            type: "storage",
            message: "Server returned not ok",
            retryable: false,
          });
        }
      } catch (error) {
        metricsRef.current.failedSyncs++;

        const syncError = SyncError.fromError(error, {
          documentType: type,
          documentId: id,
          operation: "write",
        });

        logger.error("Sync failed", syncError);
        onError?.(syncError);

        // Add to offline queue if enabled and retryable
        if (enableOfflineQueue && syncError.isRetryable()) {
          await offlineQueueRef.current.add({
            type,
            documentId: id,
            operation: "write",
            payload: { context, previousContext } as any,
          });

          const queueSize = await offlineQueueRef.current.size();
          metricsRef.current.offlineQueueSize = queueSize;
          onOfflineChange?.(queueSize);
        }

        throw syncError;
      } finally {
        const elapsed = Date.now() - startTime;
        metricsRef.current.avgSyncTime =
          (metricsRef.current.avgSyncTime *
            (metricsRef.current.totalSyncs - 1) +
            elapsed) /
          metricsRef.current.totalSyncs;
      }
    },
    [
      type,
      id,
      cursor,
      storageFn,
      logger,
      onSyncStart,
      onSyncComplete,
      onError,
      onOfflineChange,
      enableOfflineQueue,
    ],
  );

  // Process offline queue
  const processOfflineQueue = useCallback(async () => {
    if (!enableOfflineQueue) return;

    await offlineQueueRef.current.deduplicate();

    await offlineQueueRef.current.process(async (operation) => {
      if (operation.operation === "write") {
        const { context, previousContext } = operation.payload as { context: TContext; previousContext: TContext };
        await performSync(context, previousContext);
      }
      // Handle other operations as needed
    });

    const queueSize = await offlineQueueRef.current.size();
    metricsRef.current.offlineQueueSize = queueSize;
    onOfflineChange?.(queueSize);
  }, [enableOfflineQueue, performSync, onOfflineChange]);

  // Initialize change batcher if enabled
  if (enableBatching && !changeBatcherRef.current) {
    changeBatcherRef.current = new ChangeBatcher<TContext>({
      maxBatchSize: batchSize,
      maxBatchAge: batchAge,
      onFlush: async (batch) => {
        logger.log("Flushing batch", batch);
        const serverContext = await Tracking.getServerContext<TContext>({
          type,
          id,
        });
        await performSync(batch.finalContext, serverContext);
      },
    });
  }

  // Main sync handler
  const handleSync = useCallback(
    async (context: TContext) => {
      const previousContext = await Tracking.getServerContext<TContext>({
        type,
        id,
      });

      if (enableBatching) {
        changeBatcherRef.current!.add({
          timestamp: Date.now(),
          previous: previousContext,
          current: context,
        });
      } else {
        const change = { previous: previousContext, current: context };

        if (syncStrategyRef.current!.shouldSync(change)) {
          syncStrategyRef.current!.scheduleSync(() =>
            performSync(context, previousContext),
          );
        }
      }
    },
    [type, id, enableBatching, performSync],
  );

  // Initialize and subscribe
  useEffect(() => {
    // Cleanup previous subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    // Initialize
    (async () => {
      try {
        await Tracking.initServerContext({
          type,
          id,
          cursor,
          context: store.getSnapshot().context,
        });
        logger.log("Store initialized");

        // Process any queued operations
        if (enableOfflineQueue) {
          await processOfflineQueue();
        }
      } catch (error) {
        logger.error("Failed to initialize", error);
      }
    })();

    // Subscribe to changes
    subscriptionRef.current = store.subscribe(async (state) => {
      logger.log("Store updated", state);
      Tracking.clientContextChanged({ id, type });

      try {
        await handleSync(state.context);
      } catch (error) {
        // Error already handled in handleSync
      }
    });

    // Cleanup
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }

      if (changeBatcherRef.current) {
        changeBatcherRef.current.clear();
      }

      syncStrategyRef.current?.cancelPendingSync();
    };
  }, [
    store,
    type,
    id,
    cursor,
    logger,
    handleSync,
    processOfflineQueue,
    enableOfflineQueue,
  ]);

  // Public API
  return {
    // Manual sync trigger
    sync: handleSync,

    // Force flush of pending changes
    flush: async () => {
      if (changeBatcherRef.current) {
        await changeBatcherRef.current.flush();
      }
    },

    // Get metrics
    getMetrics: () => (metrics ? { ...metricsRef.current } : null),

    // Process offline queue manually
    processOfflineQueue,

    // Get offline queue size
    getOfflineQueueSize: async () => {
      return enableOfflineQueue ? await offlineQueueRef.current.size() : 0;
    },

    // Clear offline queue
    clearOfflineQueue: async () => {
      if (enableOfflineQueue) {
        await offlineQueueRef.current.clear();
      }
    },
  };
}
