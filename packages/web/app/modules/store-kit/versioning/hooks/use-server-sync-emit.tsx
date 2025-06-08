import { useEffect } from "react";
import type { VersionCursor } from "~/modules/store-kit/versioning/types";

const VERSION_SYNC_EVENT = "onServerSynced";

export function useServerSyncedCallback(callback: (event: Event) => void) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.addEventListener(VERSION_SYNC_EVENT, callback);
    return () => {
      window.removeEventListener(VERSION_SYNC_EVENT, callback);
    };
  }, [callback]);
}

export function emitServerSynced(
  name: string,
  id: string,
  cursor: VersionCursor,
) {
  if (typeof window === "undefined") {
    return;
  }
  return () =>
    window.dispatchEvent(
      new CustomEvent(VERSION_SYNC_EVENT, {
        detail: { id: `store-${name}-${id}`, cursor },
      }),
    );
}
