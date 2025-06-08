/**
 * React hooks for environment system
 */

import { useState, useEffect, useCallback } from "react";
import { useEnvironmentStore } from "./store";
import { resolveVariable, resolveTemplate, getAllVariables } from "./resolver";
import type { ResolvedVariable } from "./types";

/**
 * Hook to get the current active environment
 */
export function useActiveEnvironment() {
  const { config } = useEnvironmentStore();
  
  return {
    environmentId: config.activeEnvironment,
    environment: config.activeEnvironment 
      ? config.environments[config.activeEnvironment]
      : null,
    isGlobal: !config.activeEnvironment
  };
}

/**
 * Hook to resolve a variable value
 */
export function useVariable(key: string, environmentId?: string) {
  const { config } = useEnvironmentStore();
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function resolve() {
      try {
        setLoading(true);
        setError(null);
        const resolved = await resolveVariable(key, config, environmentId);
        if (!cancelled) {
          setValue(resolved?.value || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    resolve();
    
    return () => {
      cancelled = true;
    };
  }, [key, config, environmentId]);
  
  return { value, loading, error };
}

/**
 * Hook to resolve a template string with variables
 */
export function useTemplate(template: string, environmentId?: string) {
  const { config } = useEnvironmentStore();
  const [resolved, setResolved] = useState<string>(template);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function resolve() {
      try {
        setLoading(true);
        setError(null);
        const result = await resolveTemplate(template, config, environmentId);
        if (!cancelled) {
          setResolved(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setResolved(template); // Fallback to original
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    resolve();
    
    return () => {
      cancelled = true;
    };
  }, [template, config, environmentId]);
  
  return { resolved, loading, error };
}

/**
 * Hook to get all available variables
 */
export function useVariables(environmentId?: string) {
  const { config } = useEnvironmentStore();
  const [variables, setVariables] = useState<ResolvedVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function loadVariables() {
      try {
        setLoading(true);
        setError(null);
        const vars = await getAllVariables(config, environmentId);
        if (!cancelled) {
          setVariables(vars);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    loadVariables();
    
    return () => {
      cancelled = true;
    };
  }, [config, environmentId]);
  
  return { variables, loading, error };
}

/**
 * Hook to manage environment state
 */
export function useEnvironmentManager() {
  const store = useEnvironmentStore();
  
  const setVariable = useCallback(async (
    key: string, 
    value: string, 
    options?: {
      type?: "variable" | "secret";
      source?: "global" | "environment";
      environmentId?: string;
      description?: string;
    }
  ) => {
    const { 
      type = "variable", 
      source = "global", 
      environmentId,
      description 
    } = options || {};
    
    if (source === "global") {
      if (type === "variable") {
        store.setGlobalVariable(key, value, description);
      } else {
        await store.setGlobalSecret(key, value, description);
      }
    } else if (environmentId) {
      if (type === "variable") {
        store.setEnvironmentVariable(environmentId, key, value);
      } else {
        await store.setEnvironmentSecret(environmentId, key, value);
      }
    }
  }, [store]);
  
  const deleteVariable = useCallback(async (
    key: string,
    options?: {
      type?: "variable" | "secret";
      source?: "global" | "environment";
      environmentId?: string;
    }
  ) => {
    const { 
      type = "variable", 
      source = "global", 
      environmentId 
    } = options || {};
    
    if (source === "global") {
      if (type === "variable") {
        store.deleteGlobalVariable(key);
      } else {
        await store.deleteGlobalSecret(key);
      }
    } else if (environmentId) {
      if (type === "variable") {
        store.deleteEnvironmentVariable(environmentId, key);
      } else {
        await store.deleteEnvironmentSecret(environmentId, key);
      }
    }
  }, [store]);
  
  return {
    config: store.config,
    activeEnvironment: store.config.activeEnvironment,
    environments: store.config.environments,
    setActiveEnvironment: store.setActiveEnvironment,
    createEnvironment: store.createEnvironment,
    updateEnvironment: store.updateEnvironment,
    deleteEnvironment: store.deleteEnvironment,
    setVariable,
    deleteVariable,
    resolveVariable: store.resolveVariable,
    resolveTemplate: store.resolveTemplate,
    exportEnvironment: store.exportEnvironment,
    importEnvironment: store.importEnvironment
  };
}