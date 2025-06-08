/**
 * Enhanced hook for resolving all internal types including ProjectVariable and ProjectSecret
 */

import { useMemo } from "react";
import { useIdeSelector } from "./use-ide-selector";
import { resolveInternalTypes, createResolutionContext } from "../utils/internal-resolver";
import type { Variables, Project } from "../types";

/**
 * Hook to resolve variables with comprehensive internal type support
 */
export function useVariableResolver(fileId: string, path: string = "", type: "input" | "output" = "output") {
  return useIdeSelector((state) => {
    // Return undefined for empty id
    if (!fileId) {
      return undefined;
    }

    const file = state.context.files[fileId];
    if (!file) {
      return undefined;
    }

    // Get the appropriate variables based on type
    let variables: Variables<any>;
    if (type === "input") {
      variables = file.mapping.input.variables;
    } else {
      if (file.mapping.output.variables === false) {
        return null;
      }
      variables = file.mapping.output.variables === true
        ? file.mapping.input.variables
        : file.mapping.output.variables;
    }

    // Navigate to the specified path
    let current: any = variables;
    if (path && path !== "/" && path !== "") {
      const parts = path.split("/").filter(Boolean);
      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = current[part];
        } else {
          return undefined;
        }
      }
    }

    return current;
  });
}

/**
 * Hook to get resolved (actual) values for variables by resolving all internal types
 */
export function useResolvedVariables(fileId: string, type: "input" | "output" = "output") {
  const rawVariables = useVariableResolver(fileId, "", type);
  
  return useIdeSelector((state) => {
    return useMemo(async () => {
      if (!rawVariables || !fileId) {
        return rawVariables;
      }

      // Create project from state
      const project: Project = {
        id: state.context.id || "current-project",
        name: state.context.name || "Current Project",
        fileOrder: state.context.fileOrder || [],
        expandedPaths: state.context.expandedPaths || [],
        files: state.context.files || {},
        environmentConfig: state.context.environmentConfig
      };

      // Create resolution context
      const context = createResolutionContext(project, fileId);

      // Resolve all internal types
      try {
        return await resolveInternalTypes(rawVariables, context);
      } catch (error) {
        console.error("Error resolving variables:", error);
        return rawVariables; // Return raw variables if resolution fails
      }
    }, [rawVariables, fileId, state.context]);
  });
}

/**
 * Hook to resolve a specific variable path with internal type resolution
 */
export function useResolvedVariable(fileId: string, path: string, type: "input" | "output" = "output") {
  const rawVariable = useVariableResolver(fileId, path, type);
  
  return useIdeSelector((state) => {
    return useMemo(async () => {
      if (rawVariable === undefined || !fileId) {
        return rawVariable;
      }

      // If it's not an internal type, return as-is
      if (!rawVariable || typeof rawVariable !== "object" || !("internal" in rawVariable)) {
        return rawVariable;
      }

      // Create project from state
      const project: Project = {
        id: state.context.id || "current-project",
        name: state.context.name || "Current Project", 
        fileOrder: state.context.fileOrder || [],
        expandedPaths: state.context.expandedPaths || [],
        files: state.context.files || {},
        environmentConfig: state.context.environmentConfig
      };

      // Create resolution context
      const context = createResolutionContext(project, fileId);

      // Resolve the internal type
      try {
        return await resolveInternalTypes(rawVariable, context);
      } catch (error) {
        console.error("Error resolving variable:", error);
        return rawVariable; // Return raw variable if resolution fails
      }
    }, [rawVariable, fileId, path, state.context]);
  });
}

/**
 * Hook for backwards compatibility with existing useManifestOutputVariable
 */
export function useManifestOutputVariable(id: string, path: string) {
  return useVariableResolver(id, path, "output");
}

/**
 * Hook to get all available project variables for variable input UI
 */
export function useProjectVariables(environmentId?: string) {
  return useIdeSelector((state) => {
    const config = state.context.environmentConfig;
    if (!config) return [];

    const targetEnvironmentId = environmentId || config.activeEnvironment;
    const variables: Array<{
      key: string;
      type: "variable" | "secret";
      source: "global" | "environment";
      environment?: string;
    }> = [];

    // Add environment-specific variables
    if (targetEnvironmentId && config.environments[targetEnvironmentId]) {
      const env = config.environments[targetEnvironmentId];
      
      // Environment variables
      for (const key of Object.keys(env.variables)) {
        variables.push({
          key,
          type: "variable",
          source: "environment",
          environment: targetEnvironmentId
        });
      }
      
      // Environment secrets
      for (const key of Object.keys(env.secrets)) {
        variables.push({
          key,
          type: "secret",
          source: "environment", 
          environment: targetEnvironmentId
        });
      }
    }

    // Add global variables
    for (const key of Object.keys(config.globals.variables)) {
      variables.push({
        key,
        type: "variable",
        source: "global"
      });
    }

    // Add global secrets
    for (const key of Object.keys(config.globals.secrets)) {
      variables.push({
        key,
        type: "secret",
        source: "global"
      });
    }

    return variables;
  });
}