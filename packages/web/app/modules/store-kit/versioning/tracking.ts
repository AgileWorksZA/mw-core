import type { StoreContext } from "node_modules/@xstate/store/dist/declarations/src/types";
import { validateParams } from "~/modules/store-kit/versioning/utils";
import { versionStore } from "~/modules/store-kit/versioning/store";
import type { VersionCursor } from "~/modules/store-kit/versioning/types";
import { emitServerSynced } from "~/modules/store-kit/versioning/hooks/use-server-sync-emit";
import { getCache } from "~/modules/store-kit/cache/indexed-db-cache";

const cache = getCache();

/**
 * Clean context object to remove non-serializable values before persisting
 */
function cleanContext<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => cleanContext(item)) as T;
  }
  
  // Handle objects
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip functions and promises
      if (typeof value === 'function' || value instanceof Promise) {
        console.warn(`Skipping non-serializable value for key "${key}"`);
        continue;
      }
      // Skip secretStore to avoid storing secrets in IndexedDB
      if (key === 'secretStore') {
        continue;
      }
      cleaned[key] = cleanContext(value);
    }
    return cleaned;
  }
  
  // Return primitive values as-is
  return obj;
}

export async function initServerContext<TContext extends StoreContext>({
  type,
  id,
  cursor,
  context,
}: { type: string; id: string; cursor: VersionCursor; context: TContext }) {
  validateParams(type, context, id);
  
  // Save the current server state to IndexedDB
  const key = `store-${type}-${id}`;
  const cleanedContext = cleanContext(context);
  await cache.set(key, cleanedContext, cursor.timestamp || undefined);
  
  versionStore.trigger.initialize({
    id: key,
    cursor,
  });
}

export function clientContextChanged({
  type,
  id,
}: { type: string; id: string }) {
  validateParams(type, {}, id);
  if (`store-${type}-undefined` === `store-${type}-${id}`) {
    throw new Error("undefined");
  }
  versionStore.trigger.increment({ id: `store-${type}-${id}` });
}

export async function saveServerContext({
  type,
  id,
  cursor,
  context,
}: { type: string; id: string; cursor: VersionCursor; context: StoreContext }) {
  validateParams(type, {}, id);
  
  const key = `store-${type}-${id}`;
  versionStore.trigger.save({ id: key, cursor });
  
  const cleanedContext = cleanContext(context);
  await cache.set(key, cleanedContext, cursor.timestamp || undefined);
  emitServerSynced(type, id, cursor);
}

/**
 * Check if a document has unsaved changes it'll return the changes that have not yet been saved.
 *
 * @param type Document type name
 * @param id Document identifier
 * @returns The context from cache if it exists
 */
export async function getServerContext<TContext>({
  type,
  id,
}: { type: string; id: string }): Promise<TContext> {
  validateParams(type, {}, id);
  
  if (typeof window === "undefined") {
    throw new Error("Cannot access cache in server environment");
  }
  
  const key = `store-${type}-${id}`;
  const data = await cache.get(key);
  
  if (!data) {
    throw new Error("No data");
  }
  
  return data as TContext;
}

export const Tracking = {
  initServerContext,
  clientContextChanged,
  saveServerContext,
  getServerContext,
};