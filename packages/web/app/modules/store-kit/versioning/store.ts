import { createStoreWithProducer } from "@xstate/store";
import { create } from "mutative";
import type { History, VersionCursor } from "./types";

export const versionStore = createStoreWithProducer(create, {
  context: {} as History,
  on: {
    initialize: (
      context,
      event: {
        id: string;
        cursor: VersionCursor;
      },
    ) => {
      context[event.id] = {
        version: 0,
        changed: false,
        cursor: event.cursor,
        date: Date.now(),
      };
    },
    increment: (context, event: { id: string }) => {
      // Only mark as changed if not already changed
      if (!context[event.id]?.changed) {
        context[event.id] = {
          ...context[event.id],
          version: Number(context[event.id]?.version ?? 0) + 1,
          changed: true,
          date: Date.now(),
        };
      }
    },
    save: (
      context,
      event: {
        id: string;
        cursor: VersionCursor;
      },
    ) => {
      if (typeof window !== "undefined") {
        // publish an event to notify other parts of the app
        console.log("resetVersion2");
        window.dispatchEvent(
          new CustomEvent("version-synced", {
            detail: event,
          }),
        );
      }
      context[event.id] = {
        ...context[event.id],
        changed: false,
        cursor: event.cursor,
      };
    },
  },
});
