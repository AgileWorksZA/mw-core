import type { SnapshotFromStore } from "@xstate/store";
import { useSelector as useBaseSelector } from "@xstate/react";
import { useJsonFileContext } from "~/modules/json.ide/hooks/use-json-file-context";
import type { JsonStoreKit } from "../provider/store/types";

export function useJsonFileSelector<TState>(
  selector: (snapshot: SnapshotFromStore<JsonStoreKit>) => TState,
) {
  const { store } = useJsonFileContext();
  if (!store) {
    throw new Error(
      "useJsonFileSelector must be used within a JsonFileStoreContext",
    );
  }
  return useBaseSelector(store, selector);
}
