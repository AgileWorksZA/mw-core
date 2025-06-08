import { createContext } from "react";
import type { JsonStoreKit } from "~/modules/json.ide/provider/store/types";
import type { VersionCursor } from "~/modules/store-kit/versioning/types";

export type JsonStoreContextType = {
  store: JsonStoreKit;
  cursor: VersionCursor;
};

export const JsonStoreContext = createContext<JsonStoreContextType | null>(
  null,
);
