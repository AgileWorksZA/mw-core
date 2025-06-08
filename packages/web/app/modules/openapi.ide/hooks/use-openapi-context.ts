import { useContext } from "react";
import { OpenAPIStoreContext } from "../provider/types";

export function useOpenAPIContext() {
  const context = useContext(OpenAPIStoreContext);
  if (!context) {
    throw new Error("useOpenAPIContext must be used within OpenAPIProvider");
  }
  return context;
}
