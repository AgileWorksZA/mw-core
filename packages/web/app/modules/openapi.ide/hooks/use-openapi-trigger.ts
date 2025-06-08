import { useContext } from "react";
import { OpenAPIStoreContext } from "~/modules/openapi.ide/provider/types";

export function useOpenAPITrigger() {
  const trigger = useContext(OpenAPIStoreContext)?.store?.trigger;
  if (!trigger) {
    throw new Error(
      "OpenAPI trigger must be used within an OpenAPIStoreContext.Provider",
    );
  }
  return trigger;
}
