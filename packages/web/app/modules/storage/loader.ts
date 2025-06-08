import type { LoaderFunctionArgs } from "react-router";
import type { StorageAdapter, ReadResult } from "./types";
import { getRequestConfig } from "./utils";

/*
 * Represents a function that loads a context from storage.
 */
export type StorageLoader<TContext> = (
  args: LoaderFunctionArgs,
) => Promise<TContext>;

/*
 * Creates a loader function that reads a context from storage via the provided adapter.
 */
export function createStorageLoader<TContext>(
  adapter: StorageAdapter<TContext>,
  config?: {
    defaultContext?: TContext;
    type?: string;
    id?: string; // Override the document id this action is for. If not passed we'll pick it up from the URL
  },
): (args: LoaderFunctionArgs) => Promise<ReadResult<TContext>> {
  const { defaultContext } = config || {};

  return async (args: LoaderFunctionArgs): Promise<ReadResult<TContext>> => {
    const url = new URL(args.request.url);
    const timestamp = url.searchParams.has("timestamp")
      ? Number(url.searchParams.get("timestamp"))
      : undefined;

    const { id, type } = getRequestConfig(args, config);

    try {
      return adapter.read({
        type,
        id,
        defaultContext,
        timestamp,
      });
    } catch (error: any) {
      console.error(`Error in generic loader for ${type}/${id}:`, error);

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

      // Legacy error handling
      try {
        const errData = JSON.parse(error.message);
        if (errData.error && errData.message) {
          throw new Response(JSON.stringify(errData), {
            status: errData.status || 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch {}

      throw new Error(`Failed to load document: ${error.message}`);
    }
  };
}
