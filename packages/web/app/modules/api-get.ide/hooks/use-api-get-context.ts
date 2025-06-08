import { createContext, useContext } from "react";
import type { ApiGetStoreKit } from "../provider/store/types";

export const ApiGetContext = createContext<ApiGetStoreKit | null>(null);

export function useApiGetContext() {
  const context = useContext(ApiGetContext);
  if (!context) {
    throw new Error("useApiGetContext must be used within ApiGetProvider");
  }
  return context;
}