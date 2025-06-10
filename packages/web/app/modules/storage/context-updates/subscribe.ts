import type { VersionCursor } from "~/modules/store-kit/versioning/types";

export interface ContextUpdateEvent {
	type: string;
	id: string;
	cursor: VersionCursor;
	timestamp: number;
	operation: "write" | "delete" | "replace";
	fromSessionId?: string;
	context?: any;
	delta?: any;
}

export interface ContextSubscriptionOptions {
	type: string;
	id: string;
	sessionId: string;
	onUpdate?: (event: ContextUpdateEvent) => void;
	onError?: (error: Event) => void;
	onConnect?: () => void;
	onDisconnect?: () => void;
}

/**
 * Subscribe to context updates for a specific document.
 * This function filters out updates from the same session to prevent echo.
 *
 * @param options Subscription configuration including sessionId
 * @returns Unsubscribe function to close the connection
 *
 * @example
 * const unsubscribe = subscribeToContextUpdates({
 *   type: "ide",
 *   id: "project1",
 *   sessionId: "session-123",
 *   onUpdate: (event) => console.log("Context update from another session:", event),
 * });
 *
 * // Later, clean up
 * unsubscribe();
 */
export function subscribeToContextUpdates(
	options: ContextSubscriptionOptions,
): () => void {
	console.log("subscribeToContextUpdates");
	const { type, id, sessionId, onUpdate, onError, onConnect, onDisconnect } =
		options;

	// Validate required parameters
	if (!type || !id || !sessionId) {
		console.error(
			"[storage] subscribeToContextUpdates: type, id, and sessionId are required",
		);
		return () => {}; // Return no-op unsubscribe
	}

	// Create EventSource connection to our new SSE endpoint
	const eventSource = new EventSource(
		`/api/context-updates/${type}/${id}/${sessionId}`,
	);
	let isConnected = false;

	// Handle incoming messages
	const handleMessage = (event: MessageEvent) => {
		try {
			const data = JSON.parse(event.data);

			// Handle connection confirmation
			if (data.connected) {
				isConnected = true;
				console.log(`[storage] Context updates connected: ${type}/${id}`);
				onConnect?.();
				return;
			}

			// Handle update events
			console.log("[storage] Context update received:", data);
			onUpdate?.(data as ContextUpdateEvent);
		} catch (error) {
			console.error("[storage] Failed to parse context update:", error);
		}
	};

	// Handle errors
	const handleError = (event: Event) => {
		console.error("[storage] Context updates SSE error:", event);

		if (isConnected) {
			isConnected = false;
			onDisconnect?.();
		}

		onError?.(event);
		// EventSource will automatically reconnect
	};

	// Attach event listeners
	eventSource.addEventListener("message", handleMessage);
	eventSource.addEventListener("error", handleError);

	// Return unsubscribe function
	return () => {
		// Remove event listeners
		eventSource.removeEventListener("message", handleMessage);
		eventSource.removeEventListener("error", handleError);

		// Close connection
		eventSource.close();

		if (isConnected) {
			isConnected = false;
			onDisconnect?.();
		}

		console.log(`[storage] Context updates disconnected: ${type}/${id}`);
	};
}

/**
 * Subscribe to context updates for multiple documents.
 * Returns a function to unsubscribe from all.
 *
 * @example
 * const unsubscribeAll = subscribeToMultipleContexts([
 *   { type: "ide", id: "project1", sessionId: "session-123", onUpdate: handleProject1Update },
 *   { type: "ide", id: "project2", sessionId: "session-123", onUpdate: handleProject2Update },
 * ]);
 *
 * // Later, clean up all subscriptions
 * unsubscribeAll();
 */
export function subscribeToMultipleContexts(
	subscriptions: ContextSubscriptionOptions[],
): () => void {
	const unsubscribes = subscriptions.map((options) =>
		subscribeToContextUpdates(options),
	);

	// Return function to unsubscribe from all
	return () => {
		for (const unsubscribe of unsubscribes) {
			unsubscribe();
		}
	};
}

/**
 * Create a managed context subscription that can be started and stopped.
 * Useful for dynamic subscriptions that need to be toggled.
 *
 * @example
 * const subscription = createManagedContextSubscription({
 *   type: "ide",
 *   id: "project1",
 *   sessionId: "session-123",
 *   onUpdate: handleUpdate,
 * });
 *
 * subscription.start();
 * // ... later
 * subscription.stop();
 * // ... can start again
 * subscription.start();
 */
export function createManagedContextSubscription(
	options: ContextSubscriptionOptions,
) {
	let unsubscribe: (() => void) | null = null;

	return {
		start: () => {
			if (unsubscribe) {
				console.warn("[storage] Context subscription already active");
				return;
			}
			unsubscribe = subscribeToContextUpdates(options);
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
			unsubscribe = subscribeToContextUpdates(options);
		},
	};
}
