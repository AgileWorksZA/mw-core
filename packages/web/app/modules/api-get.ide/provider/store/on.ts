import type { EventHandlers } from "~/modules/store-kit";
import type { ApiGetEventPayloads, ApiGetEmitPayloads, ApiGetFileContext } from "./types";

export const on: EventHandlers<ApiGetFileContext, ApiGetEventPayloads, ApiGetEmitPayloads> = {
  update: (context, event) => {
    const updates = event.context;
    return {
      ...context,
      ...updates,
      data: {
        ...context.data,
        ...updates.data,
      },
    };
  },
  
  "endpoint:selected": (context, event) => {
    // Handle endpoint selection
    console.log("Endpoint selected:", event.endpoint);
    return context;
  },
  
  "test:start": (context, event) => {
    // Handle test start
    console.log("Test started for:", event.documentId);
    return context;
  },
  
  "test:complete": (context, event) => {
    // Handle test completion
    console.log("Test completed:", event.documentId, event.success);
    return context;
  },
  
  "parameter:changed": (context, event) => {
    // Handle parameter change
    console.log("Parameter changed:", event.name, event.value);
    return context;
  },
};