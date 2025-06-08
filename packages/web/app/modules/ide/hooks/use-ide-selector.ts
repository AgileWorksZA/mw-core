import type { SnapshotFromStore } from "@xstate/store";
import type { ProjectStoreContextType } from "~/modules/ide/provider/types";
import { useProjectContext } from "~/modules/ide/hooks/use-project-context";
import { useSelector as useBaseSelector } from "@xstate/react";

export function useIdeSelector<TState>(
  selector: (
    snapshot: SnapshotFromStore<ProjectStoreContextType["store"]>,
  ) => TState,
) {
  const store = useProjectContext().store;
  return useBaseSelector(store, selector);
}
