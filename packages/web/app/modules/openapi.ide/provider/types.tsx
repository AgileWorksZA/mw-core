import { createContext } from "react";
import type { OpenAPIStoreKit } from "./store/types";
import type { VersionCursor } from "~/modules/store-kit/versioning/types";

export interface OpenAPIStoreContextType {
  store: OpenAPIStoreKit;
  cursor: VersionCursor;
}

export const OpenAPIStoreContext = createContext<OpenAPIStoreContextType | null>(
  null,
);