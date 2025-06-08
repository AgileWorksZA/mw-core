import type { SnapshotFromStore } from "@xstate/store";
import { useSelector as useBaseSelector } from "@xstate/store/react";
import { useChatStore } from "~/modules/chat";
import type { ChatStoreKit } from "~/modules/chat";

export function useChatSelector<TState>(
  selector: (snapshot: SnapshotFromStore<ChatStoreKit>) => TState,
): TState {
  const store = useChatStore();

  if (!store) {
    throw new Error(
      "useChatSelector must be used within a ChatProvider",
    );
  }

  return useBaseSelector(store, selector);
}