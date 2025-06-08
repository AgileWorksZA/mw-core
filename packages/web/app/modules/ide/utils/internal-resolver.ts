/**
 * Universal internal type resolver for IDE variable mapping
 * 
 * This utility resolves all internal types (Pointer, Parameter, FromData, ProjectVariable, ProjectSecret)
 * during variable execution or display. It integrates with the existing pointer resolution from
 * useManifestOutputVariable and adds support for the new ProjectVariable and ProjectSecret types.
 */

import type { 
  InternalTypes, 
  Pointer, 
  Parameter, 
  FromData, 
  ProjectVariable, 
  ProjectSecret,
  Project,
  Variables
} from "../types";
import { resolveProjectVariable, resolveProjectSecret } from "./variable-resolver";

/**
 * Result of resolving an internal type
 */
export interface InternalResolutionResult {
  value: any;
  error?: string;
  type: string;
}

/**
 * Context needed for resolving internal types
 */
export interface ResolutionContext {
  project: Project;
  currentFileId: string;
  currentFileData?: any; // For from-data resolution
  maxDepth?: number;
  processedPointers?: Set<string>;
}

/**
 * Resolve a single internal type to its actual value
 */
export async function resolveInternalType(
  internal: InternalTypes<any>,
  context: ResolutionContext,
  depth = 0
): Promise<InternalResolutionResult> {
  const maxDepth = context.maxDepth || 10;
  
  // Prevent infinite recursion
  if (depth >= maxDepth) {
    return {
      value: internal,
      error: `Maximum resolution depth (${maxDepth}) exceeded`,
      type: internal.internal
    };
  }

  try {
    switch (internal.internal) {
      case "pointer":
        return await resolvePointer(internal as Pointer, context, depth);
      
      case "parameter":
        return resolveParameter(internal as Parameter<any>);
      
      case "from-data":
        return resolveFromData(internal as FromData<any>, context);
      
      case "project-variable":
        return await resolveProjectVariableInternal(internal as ProjectVariable, context);
      
      case "project-secret":
        return await resolveProjectSecretInternal(internal as ProjectSecret, context);
      
      default:
        return {
          value: internal,
          error: `Unknown internal type: ${(internal as any).internal}`,
          type: (internal as any).internal || "unknown"
        };
    }
  } catch (error) {
    return {
      value: internal,
      error: error instanceof Error ? error.message : String(error),
      type: internal.internal
    };
  }
}

/**
 * Resolve a pointer to another file's output
 */
async function resolvePointer(
  pointer: Pointer, 
  context: ResolutionContext, 
  depth: number
): Promise<InternalResolutionResult> {
  const pointerId = `${pointer.type}:${pointer.id}:${pointer.path || ""}`;
  const processedPointers = context.processedPointers || new Set<string>();

  // Check for circular references
  if (processedPointers.has(pointerId)) {
    return {
      value: pointer,
      error: `Circular reference detected: ${pointerId}`,
      type: "pointer"
    };
  }

  processedPointers.add(pointerId);

  // Get the target file
  const targetFile = context.project.files[pointer.id];
  if (!targetFile) {
    return {
      value: undefined,
      error: `Target file not found: ${pointer.id}`,
      type: "pointer"
    };
  }

  // Get output variables
  let outputVariables: Variables<any>;
  if (targetFile.mapping.output.variables === false) {
    return {
      value: null,
      error: `Target file has no output: ${pointer.id}`,
      type: "pointer"
    };
  }
  
  outputVariables = targetFile.mapping.output.variables === true
    ? targetFile.mapping.input.variables
    : targetFile.mapping.output.variables;

  // Navigate to the specific path if provided
  let resolvedValue: any = outputVariables;
  if (pointer.path) {
    const pathParts = pointer.path.split("/").filter(Boolean);
    for (const part of pathParts) {
      if (resolvedValue && typeof resolvedValue === "object") {
        resolvedValue = resolvedValue[part];
      } else {
        return {
          value: undefined,
          error: `Path not found: ${pointer.path} in file ${pointer.id}`,
          type: "pointer"
        };
      }
    }
  }

  // Recursively resolve if the resolved value is also an internal type
  if (resolvedValue && typeof resolvedValue === "object" && "internal" in resolvedValue) {
    const newContext = {
      ...context,
      processedPointers: new Set(processedPointers)
    };
    return await resolveInternalType(resolvedValue as InternalTypes<any>, newContext, depth + 1);
  }

  return {
    value: resolvedValue,
    type: "pointer"
  };
}

/**
 * Resolve a parameter (parameters are not resolved at runtime, they're placeholders)
 */
function resolveParameter(parameter: Parameter<any>): InternalResolutionResult {
  // Parameters are typically resolved during execution/runtime by external systems
  // For now, we return a placeholder or the parameter itself
  return {
    value: `{{parameter:${parameter.name}}}`,
    type: "parameter"
  };
}

/**
 * Resolve from-data reference to current file's internal data
 */
function resolveFromData(fromData: FromData<any>, context: ResolutionContext): InternalResolutionResult {
  if (!context.currentFileData) {
    return {
      value: undefined,
      error: "Current file data not available for from-data resolution",
      type: "from-data"
    };
  }

  // Navigate to the specified path in the current file's data
  let current = context.currentFileData;
  if (fromData.path) {
    const pathParts = fromData.path.split("/").filter(Boolean);
    for (const part of pathParts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return {
          value: undefined,
          error: `From-data path not found: ${fromData.path}`,
          type: "from-data"
        };
      }
    }
  }

  return {
    value: current,
    type: "from-data"
  };
}

/**
 * Resolve a project variable
 */
async function resolveProjectVariableInternal(
  projectVar: ProjectVariable, 
  context: ResolutionContext
): Promise<InternalResolutionResult> {
  const resolvedValue = await resolveProjectVariable(projectVar, context.project);
  
  if (resolvedValue === null) {
    return {
      value: undefined,
      error: `Project variable not found: ${projectVar.key}${projectVar.environmentId ? ` in environment ${projectVar.environmentId}` : ''}`,
      type: "project-variable"
    };
  }

  return {
    value: resolvedValue,
    type: "project-variable"
  };
}

/**
 * Resolve a project secret
 */
async function resolveProjectSecretInternal(
  projectSecret: ProjectSecret, 
  context: ResolutionContext
): Promise<InternalResolutionResult> {
  const resolvedValue = await resolveProjectSecret(projectSecret, context.project);
  
  if (resolvedValue === null) {
    return {
      value: undefined,
      error: `Project secret not found: ${projectSecret.key}${projectSecret.environmentId ? ` in environment ${projectSecret.environmentId}` : ''}`,
      type: "project-secret"
    };
  }

  return {
    value: resolvedValue,
    type: "project-secret"
  };
}

/**
 * Recursively resolve all internal types in a variables object
 */
export async function resolveInternalTypes(
  variables: Variables<any>,
  context: ResolutionContext,
  depth = 0
): Promise<any> {
  const maxDepth = context.maxDepth || 10;
  
  // Prevent infinite recursion
  if (depth >= maxDepth) {
    return variables;
  }

  // Handle internal types
  if (variables && typeof variables === "object" && "internal" in variables) {
    const result = await resolveInternalType(variables as InternalTypes<any>, context, depth);
    return result.error ? variables : result.value; // Return original if error
  }

  // Handle objects
  if (variables && typeof variables === "object" && !Array.isArray(variables)) {
    const resolved: any = {};
    for (const [key, value] of Object.entries(variables)) {
      resolved[key] = await resolveInternalTypes(value, context, depth + 1);
    }
    return resolved;
  }

  // Handle arrays
  if (Array.isArray(variables)) {
    const resolved = [];
    for (const item of variables) {
      resolved.push(await resolveInternalTypes(item, context, depth + 1));
    }
    return resolved;
  }

  // Return primitive values as-is
  return variables;
}

/**
 * Create a resolution context from project and current file
 */
export function createResolutionContext(
  project: Project,
  currentFileId: string,
  currentFileData?: any,
  options?: {
    maxDepth?: number;
  }
): ResolutionContext {
  return {
    project,
    currentFileId,
    currentFileData,
    maxDepth: options?.maxDepth || 10,
    processedPointers: new Set()
  };
}

/**
 * Convenience function to resolve all variables in a file's input/output
 */
export async function resolveFileVariables(
  project: Project,
  fileId: string,
  type: "input" | "output" = "output",
  currentFileData?: any
): Promise<any> {
  const file = project.files[fileId];
  if (!file) {
    throw new Error(`File not found: ${fileId}`);
  }

  const variables = type === "input" 
    ? file.mapping.input.variables
    : file.mapping.output.variables === true
      ? file.mapping.input.variables
      : file.mapping.output.variables;

  if (variables === false) {
    return null;
  }

  const context = createResolutionContext(project, fileId, currentFileData);
  return await resolveInternalTypes(variables, context);
}