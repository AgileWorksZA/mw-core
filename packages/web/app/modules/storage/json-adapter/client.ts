import type { Delta } from "jsondiffpatch";
import type { VersionCursor } from "~/modules/store-kit/versioning/types";

export function useSyncDocument<Context>(type: string, id: string, sessionId: string) {
  return async ({
    context,
    delta,
    cursor,
  }: { context: Context; delta: Delta; cursor: VersionCursor }) => {
    // Ensure we have valid inputs
    if (!type || !id || !context) {
      throw new Error("Invalid inputs");
    }
    return fetch(
      cursor.timestamp !== cursor.latest
        ? `/api/context/${type}/${id}?timestamp=${cursor.timestamp}`
        : `/api/context/${type}/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:
          JSON.stringify({ delta }).length > JSON.stringify({ context }).length
            ? JSON.stringify({ context, sessionId })
            : JSON.stringify({ delta, sessionId }),
      },
    ).then(async (response) => {
      // Extract timestamp info from response
      const result = (await response.json()) as {
        next: number | null;
        previous: number | null;
        latest: number;
        timestamp: number;
      };

      // Return timestamp info along with success status
      return {
        ok: response.ok,
        timestamp: result?.timestamp,
        previous: result?.previous,
        next: result?.next,
        latest: result?.latest,
      } as VersionCursor & { ok: boolean };
    });
  };
}
