import { useContext } from "react";
import { JsonStoreContext } from "~/modules/json.ide/provider/types";

export function useJsonFileTrigger() {
  const trigger = useContext(JsonStoreContext)?.store?.trigger;
  if (!trigger) {
    throw new Error(
      "JsonFile trigger must be used within a JsonFileStoreContext.Provider",
    );
  }
  return trigger;
}
