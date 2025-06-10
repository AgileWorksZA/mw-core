import type { EventObject, Subscription } from "@xstate/store";
import { type Delta, diff, patch } from "jsondiffpatch";
import { useEffect, useRef } from "react";
import { useDebounceCallback } from "~/lib/use-debounce-callback";
import { subscribeToContextUpdates } from "~/modules/storage/context-updates";
import { SyncError } from "~/modules/store-kit/sync/errors";
import { RetryManager } from "~/modules/store-kit/sync/retry-manager";
import type {
	StoreContext,
	StoreKit,
	StoreKitEmitted,
	StoreKitEvents,
} from "~/modules/store-kit/types";
import { Tracking } from "~/modules/store-kit/versioning/tracking";
import type { VersionCursor } from "~/modules/store-kit/versioning/types";

export interface UseServerSyncOptions<TContext extends StoreContext> {
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
	const storeSubscriptionRef = useRef<Subscription | null>(null);
	const serverUpdatesSubscriptionRef = useRef<Subscription | null>(null);
	const isServerUpdateRef = useRef(false);
	const retryManager = useRef(
		new RetryManager({
			maxRetries,
			onRetry: (error, attempt) => {
				if (debug) {
					console.log(
						`[store-kit] Retry attempt ${attempt + 1} after error:`,
						error,
					);
				}
			},
		}),
	);

	const logger = debug
		? console
		: { log: () => {}, error: () => {}, warn: () => {} };

	const sync = useDebounceCallback(async (context: TContext) => {
		try {
			onSyncStart?.();

			const serverContext = await Tracking.getServerContext<TContext>({
				type,
				id,
			});
			const delta = diff(serverContext, context);

			if (!delta) {
				logger.log("[store-kit] No changes to sync");
				return;
			}

			logger.log("[store-kit] Syncing", { delta, context, serverContext });

			const syncResult = await retryManager.current.execute(
				() => storageFn({ context, delta, cursor }),
				{ documentType: type, documentId: id },
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
					type: "storage",
					message: "Failed to sync document - server returned not ok",
					retryable: false,
				});
			}
		} catch (error) {
			const syncError = SyncError.fromError(error, {
				documentType: type,
				documentId: id,
				operation: "write",
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
		if (storeSubscriptionRef.current) {
			storeSubscriptionRef.current.unsubscribe();
			storeSubscriptionRef.current = null;
		}
		if (serverUpdatesSubscriptionRef.current) {
			serverUpdatesSubscriptionRef.current.unsubscribe();
			serverUpdatesSubscriptionRef.current = null;
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
				logger.log(
					"[store-kit] Store initialized",
					store.getSnapshot().context,
				);
			} catch (error) {
				logger.error("[store-kit] Failed to initialize store:", error);
			}
		})();

		// Subscribe to store changes
		storeSubscriptionRef.current = store.subscribe(async (state) => {
			logger.log("[store-kit] Store updated", state);
			Tracking.clientContextChanged({ id, type });

			// Don't sync if this update came from the server
			if (isServerUpdateRef.current) {
				logger.log("[store-kit] Skipping sync - update came from server");
				isServerUpdateRef.current = false;
				return;
			}

			await sync(state.context);
		});
		serverUpdatesSubscriptionRef.current = (() => {
			const unsubscribe = subscribeToContextUpdates({
				type,
				id,
				sessionId: store.sessionId,
				onUpdate: async (event) => {
					if (event.fromSessionId === store.sessionId) {
						return; // Ignore updates from the same session
					}
					try {
						let serverContext: TContext;

						// If the event includes a delta, apply it to the current context
						if (event.delta) {
							const currentContext = store.getSnapshot().context;
							serverContext = patch(currentContext, event.delta) as TContext;
							logger.log("[store-kit] Applied delta patch to current context", {
								delta: event.delta,
								result: serverContext,
							});
						} else if (event.context) {
							// If the event includes the full context, use it directly
							serverContext = event.context;
							logger.log(
								"[store-kit] Using full context from event",
								serverContext,
							);
						} else {
							throw new SyncError({
								type: "server",
								message: "Server update event missing context",
								retryable: false,
							});
						}

						// Set flag to prevent sync loop
						isServerUpdateRef.current = true;

						// Update the store with the server context
						store.trigger.update({ context: serverContext });

						// Update tracking with new server context
						await Tracking.saveServerContext({
							type,
							id,
							cursor: event.cursor,
							context: serverContext,
						});

						onSyncComplete?.(event.cursor);
					} catch (error) {
						const syncError = SyncError.fromError(error, {
							documentType: type,
							documentId: id,
							operation: "read",
						});
						logger.error(
							"[store-kit] Error syncing from server update:",
							syncError,
						);
						onError?.(syncError);
					}
				},
				onError: (error) => {
					logger.error("[store-kit] Server updates error:", error);
					onError?.(
						new SyncError({
							type: "server",
							message: "Failed to subscribe to server updates",
							retryable: true,
						}),
					);
				},
			});
			return { unsubscribe } as Subscription;
		})();

		// Return cleanup function
		return () => {
			if (storeSubscriptionRef.current) {
				storeSubscriptionRef.current.unsubscribe();
				storeSubscriptionRef.current = null;
			}
			if (serverUpdatesSubscriptionRef.current) {
				serverUpdatesSubscriptionRef.current.unsubscribe();
				serverUpdatesSubscriptionRef.current = null;
			}
		};
	}, [store, cursor, sync, type, id, logger, onError, onSyncComplete]);

	return sync;
}
