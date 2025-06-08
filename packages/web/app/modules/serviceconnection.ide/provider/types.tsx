import { createContext } from "react";
import type { ServiceConnectionDataStoreKit } from "~/modules/serviceconnection.ide/provider/store/types";
import type { VersionCursor } from "~/modules/store-kit/versioning/types";

export const ServiceConnectionDataStoreContext = createContext<{
  store: ServiceConnectionDataStoreKit;
  cursor: VersionCursor;
} | null>(null);