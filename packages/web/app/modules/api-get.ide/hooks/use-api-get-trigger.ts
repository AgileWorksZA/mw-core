import { useApiGetContext } from "./use-api-get-context";
import { useCallback } from "react";
import type { ApiGetConfig } from "../types";

export function useApiGetTrigger() {
  const store = useApiGetContext();
  
  const updateDocument = useCallback((updates: Partial<ApiGetConfig>) => {
    store.send({
      type: "update",
      context: {
        data: updates,
      },
    });
  }, [store]);

  const selectEndpoint = useCallback((endpoint: string) => {
    store.emit({
      type: "endpoint:selected",
      "endpoint:selected": { endpoint },
    });
  }, [store]);

  return {
    updateDocument,
    selectEndpoint,
  };
}