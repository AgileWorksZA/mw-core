import { useContext } from "react";
import { ServiceConnectionDataStoreContext } from "~/modules/serviceconnection.ide/provider/types";

export function useServiceConnectionDataContext() {
  const context = useContext(ServiceConnectionDataStoreContext);
  if (!context) {
    throw new Error(
      "useServiceConnectionDataContext must be used within a ServiceConnectionDataStoreContext",
    );
  }
  return context;
}