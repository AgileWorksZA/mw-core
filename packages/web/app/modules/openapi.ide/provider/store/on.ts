import type { OpenAPIContext } from "../../types";
import type { EventHandlers } from "~/modules/store-kit/types";
import { rawReturn } from "mutative";
import type {
  OpenAPIEmitPayloads,
  OpenAPIEventPayloads,
} from "~/modules/openapi.ide/provider/store/types";

export const on: EventHandlers<
  OpenAPIContext,
  OpenAPIEventPayloads,
  OpenAPIEmitPayloads
> = {
  update: (context, event, enqueue) => {
    if (!event.noEmit) {
      enqueue.emit.updated();
    }
    return rawReturn({
      ...context,
      ...event.context,
    });
  },

  fetchFromUrl: async (context, event, enqueue) => {
    try {
      const response = await fetch("/api/openapi/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: event.url }),
      });

      const result = await response.json();

      if (response.ok) {
        enqueue.emit.fetched({ document: result.data });
        return rawReturn({
          ...context,
          data: {
            ...context.data,
            document: result.data,
            source: {
              ...context.data.source,
              url: event.url,
              lastFetched: new Date().toISOString(),
            },
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch OpenAPI spec:", error);
    }
    return context;
  },

  saveToPublic: async (context, event, enqueue) => {
    // Note: In production, this would be handled server-side
    // For now, we just update the context with the resource path
    const manifestId = context.data?.source?.fileName || "openapi";
    const resourcePath = `/resources/openapi/${manifestId}.json`;

    enqueue.emit.saved({ resourcePath });

    return rawReturn({
      ...context,
      data: {
        ...context.data,
        resourcePath,
      },
    });
  },
};
