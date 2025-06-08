import { useState, useCallback } from "react";
import type { OpenAPIV3 } from "openapi-types";
import { extractGetMethods } from "../utils/openapi";
import { type GetMethod } from "../types/openApiTypes";
import { DesignerContext } from "~/components/datagrid/designer/types";

/**
 * Hook for loading and processing OpenAPI specifications
 */
export function useOpenApiLoader(initialUrl = "") {
  const [url, setUrl] = useState<string>(initialUrl);
  const [spec, setSpec] = useState<string>("");
  const [getMethods, setGetMethods] = useState<GetMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Loads an OpenAPI specification from the given URL
   */
  const loadSpec = useCallback(async (logFn?: (message: string, level?: "info" | "warning" | "error") => void, urlOverride?: string) => {
    const targetUrl = urlOverride || url;
    setLoading(true);
    setError(null);
    if (logFn) logFn(`Loading ${targetUrl}`, "info");

    try {
      const response = await fetch(targetUrl);
      if (logFn) logFn(`Loaded ${targetUrl}`, "info");

      const text = await response.text();
      setSpec(text);

      try {
        const specJson = JSON.parse(text) as OpenAPIV3.Document;

        // Store the entire documentation in the context
        DesignerContext.trigger.update({
          update: { documentation: specJson },
        });

        const methods = extractGetMethods(specJson);
        setGetMethods(methods);

        if (methods.length > 0) {
          if (logFn) logFn(`Found ${methods.length} GET methods`, "info");
        } else {
          if (logFn) logFn("No GET methods found in the specification", "warning");
        }

        return { specJson, methods };
      } catch (e) {
        const errorMsg = `Failed to parse specification: ${e}`;
        setError(errorMsg);
        if (logFn) logFn(errorMsg, "error");
        return null;
      }
    } catch (e) {
      const errorMsg = `Failed to load ${targetUrl}: ${e}`;
      setError(errorMsg);
      if (logFn) logFn(errorMsg, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, [url]);

  /**
   * Reset the loader state
   */
  const resetLoader = useCallback(() => {
    setSpec("");
    setGetMethods([]);
    setError(null);
  }, []);

  return {
    url,
    setUrl,
    spec,
    getMethods,
    loading,
    error,
    loadSpec,
    resetLoader,
  };
}