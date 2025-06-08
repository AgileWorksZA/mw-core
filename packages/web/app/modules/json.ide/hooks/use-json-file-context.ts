import { JsonStoreContext } from "~/modules/json.ide/provider/types";
import { useContext } from "react";

export function useJsonFileContext<TState>() {
  const context = useContext(JsonStoreContext);
  if (!context) {
    throw new Error(
      "useJsonFileContext must be used within a JsonFileStoreContext",
    );
  }
  return context;
}
