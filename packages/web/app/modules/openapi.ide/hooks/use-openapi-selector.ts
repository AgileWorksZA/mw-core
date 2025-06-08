import type { SnapshotFromStore } from "@xstate/store";
import { useSelector as useBaseSelector } from "@xstate/react";
import { useOpenAPIContext } from "./use-openapi-context";
import type { OpenAPIStoreKit } from "~/modules/openapi.ide/provider/store/types";

export function useOpenAPISelector<TState>(
  selector: (snapshot: SnapshotFromStore<OpenAPIStoreKit>) => TState,
): TState {
  const { store } = useOpenAPIContext();

  if (!store) {
    throw new Error(
      "useOpenAPISelector must be used within an OpenAPIStoreContext",
    );
  }

  return useBaseSelector(store, selector);
}
