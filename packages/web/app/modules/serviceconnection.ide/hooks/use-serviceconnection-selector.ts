import type { SnapshotFromStore } from "@xstate/store";
import { useSelector as useBaseSelector } from "@xstate/react";
import { useServiceConnectionDataContext } from "~/modules/serviceconnection.ide/hooks/use-serviceconnection-context";
import type { ServiceConnectionDataStoreKit } from "../provider/store/types";

export function useServiceConnectionDataSelector<TState>(
  selector: (snapshot: SnapshotFromStore<ServiceConnectionDataStoreKit>) => TState,
) {
  const { store } = useServiceConnectionDataContext();
  if (!store) {
    throw new Error(
      "useServiceConnectionDataSelector must be used within a ServiceConnectionDataStoreContext",
    );
  }
  return useBaseSelector(store, selector);
}