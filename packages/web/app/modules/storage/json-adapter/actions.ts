import type { Delta } from "jsondiffpatch";
import type { ActionFunctionArgs } from "react-router";
import { storageEvents } from "~/modules/storage/events/storage-events.server";
/*
 * React Router action creators for JSON storage adapter
 */
import type { StorageAdapter } from "~/modules/storage/types";
import type { WriteResult } from "~/modules/storage/types";
import { getRequestConfig } from "~/modules/storage/utils";

export function createPOSTAction<TContext>(
	adapter: StorageAdapter<TContext>,
	config?: {
		defaultContext?: TContext; // Used by adapter if creating a new doc from delta
		type?: string; // Override the document type this action is for. If not passed we'll pick it up from the URL
		id?: string; // Override the document id this action is for. If not passed we'll pick it up from the URL
	},
) {
	const { defaultContext } = config || {};

	return async function POST(args: ActionFunctionArgs) {
		const { id, type } = getRequestConfig(args, config);

		const requestJson = await args.request.json();
		const url = new URL(args.request.url);
		const timestampForBranch = url.searchParams.has("timestamp")
			? Number(url.searchParams.get("timestamp"))
			: undefined;

		const { context, delta, sessionId } = requestJson as {
			context?: TContext;
			delta?: Delta;
			sessionId: string;
		};
		console.log(`Update from ${sessionId}`);
		let result: WriteResult;
		if (timestampForBranch) {
			if (!context) {
				// For branching, the payload should define the new state.
				// A delta can be provided to show how it changed from `stateAtAfterTimestamp`.
				throw new Response(
					JSON.stringify({
						error: true,
						message:
							"Full context is preferred when replacing history from a specific timestamp.",
					}),
					{ status: 400, headers: { "Content-Type": "application/json" } },
				);
			}
			result = await adapter.replaceHistory({
				type,
				id: id,
				afterTimestamp: timestampForBranch,
				defaultContext,
				payload: { context, delta }, // Pass both context and delta
			});
		} else {
			result = await adapter.write({
				type,
				id: id,
				payload: { context, delta },
				defaultContext,
			});
		}
		// Emit the event for this sessionId to other clients
		storageEvents.emitUpdate({
			type,
			id,
			cursor: result.cursor,
			sessionId,
			timestamp: result.cursor.timestamp,
			operation: timestampForBranch ? "replace" : "write",
		});

		return result;
	};
}

export function createDELETEAction<TContext>(
	adapter: StorageAdapter<TContext>,
	config?: {
		defaultContext?: TContext; // Used by adapter if creating a new doc from delta
		type?: string; // Override the document type this action is for. If not passed we'll pick it up from the URL
		id?: string; // Override the document id this action is for. If not passed we'll pick it up from the URL
	},
) {
	return async function DELETE(args: ActionFunctionArgs) {
		try {
			const { id, type } = getRequestConfig(args, config);

			await adapter.deleteDocument({ type, id });
			return { type, id };
		} catch (error: any) {
			console.error(
				`Error in DELETE action for ${args.params.type}/${args.params.id}:`,
				error,
			);

			// Handle our custom error types
			if (error.name === "StorageError") {
				throw new Response(
					JSON.stringify({
						error: true,
						message: error.message,
						code: error.code,
					}),
					{
						status: error.status || 500,
						headers: { "Content-Type": "application/json" },
					},
				);
			}

			throw error;
		}
	};
}
