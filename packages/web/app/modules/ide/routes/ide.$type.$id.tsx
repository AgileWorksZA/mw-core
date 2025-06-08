/**
 * File-Specific Route Module
 *
 * This module provides the loader for a specific file in the IDE system.
 * It handles:
 * 1. Loading file content
 * 2. Loading the project context to get file metadata
 * 3. Resolving any dependencies (pointers) that the file may reference
 */
import {
  createStorageLoader,
  type StorageAdapter,
} from "~/modules/storage";
import type { LoaderFunctionArgs } from "react-router";
import type {
  FileContext,
  OutputVariables,
  Pointer,
  Project,
  PublicMapping,
  ResolveResult,
} from "~/modules/ide/types";
import { config } from "~/modules/ide/adapter/config";
import { json_file_adapter } from "~/modules/storage/json-adapter/storage.server";
import { extractInternals } from "~/modules/ide/utils/extract-internals";

/**
 * Extracts the output variables from a file's mapping.
 * These are the variables that this file provides to other files.
 *
 * If the output is true, it provides all input variables.
 * Otherwise, it provides only specifically defined output variables.
 */
export function getOutputVariables(mapping: PublicMapping<any, any>) {
  if (!mapping.output) {
    console.log("No input variables");
    return undefined;
  }
  // recipeA pattern for picking variables
  return mapping.output.variables === true
    ? mapping.input.variables
    : (mapping.output as OutputVariables<any>).variables;
}

// Define adapters for both files and projects
const projectAdapter = json_file_adapter as unknown as StorageAdapter<Project>;
const fileAdapter = json_file_adapter as unknown as StorageAdapter<FileContext>;

// Use the json_file_adapter to read the file by its type and id
const dependencyLoader = createStorageLoader<FileContext>(fileAdapter);

/**
 * File-specific loader
 *
 * This loader is responsible for:
 * 1. Loading the specific file's content based on type and id from the URL
 * 2. Loading the project context to access file metadata
 * 3. Resolving any dependencies (pointers) that this file references
 */

async function loader(args: LoaderFunctionArgs) {
  const { data, cursor } = await dependencyLoader(args);
  const { params } = args;
  const { type, id } = params;
  if (!type || !id) {
    throw new Response(
      JSON.stringify({
        error: true,
        message: "Type and ID are required",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  console.log("FILE", { data, cursor });
  // We'll resolve all the dependencies in the input
  const projectLoader = createStorageLoader<Project>(projectAdapter, {
    type: config.type,
    id: config.type,
    defaultContext: {
      name: config.type,
      id: config.type,
      files: {},
      fileOrder: [],
      fileTypes: [],
      expandedPaths: [],
    } as Project,
  });
  const project = (await projectLoader(args)).data;
  const manifest = project.files[id];
  console.log({ project }, manifest);
  if (!manifest) {
    throw new Response(
      JSON.stringify({
        error: true,
        message: `File with ID ${id} not found in project`,
      }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    );
  }

  const variables = getOutputVariables(
    manifest.mapping as PublicMapping<any, any>,
  );
  if (!variables) {
    console.log("No input variables");
    return {
      data,
      cursor,
      resolved: [],
    };
  }

  // Track processed pointers to avoid circular references
  const processedPointers = new Set<string>();

  // Recursive function to resolve pointers
  async function resolvePointer(
    pointer: Pointer,
    path: string,
    depth = 0,
    maxDepth = 10, // Maximum recursion depth to prevent infinite loops
  ): Promise<ResolveResult> {
    // Create a unique identifier for this pointer to detect circular references
    const pointerId = `${pointer.type}:${pointer.id}:${pointer.path}`;

    // Check for circular references or maximum recursion depth
    if (processedPointers.has(pointerId) || depth >= maxDepth) {
      return {
        path,
        pointer,
        resolved: null,
        error: processedPointers.has(pointerId)
          ? "Circular reference detected"
          : "Maximum recursion depth reached",
        depth,
      };
    }

    // Mark this pointer as processed
    processedPointers.add(pointerId);

    try {
      const dependency = project.files[pointer.id];

      // Get output variables from the dependency
      const dependencyOutput = getOutputVariables(dependency.mapping);
      if (!dependencyOutput) {
        return {
          path,
          pointer,
          resolved: null,
          error: "No output variables found in dependency",
          depth,
        };
      }

      // Navigate to the specific path in the dependency output if provided
      let resolvedValue: any = dependencyOutput;
      if (pointer.path) {
        // Split the path and traverse the object
        const pathParts = pointer.path.split("/").filter(Boolean);
        for (const part of pathParts) {
          if (resolvedValue && typeof resolvedValue === "object") {
            resolvedValue = resolvedValue[part];
          } else {
            return {
              path,
              pointer,
              resolved: null,
              error: `Path '${pointer.path}' not found in dependency output`,
              depth,
            };
          }
        }
      }

      // Check if the resolved value is itself a pointer
      if (
        resolvedValue &&
        typeof resolvedValue === "object" &&
        resolvedValue.internal === "pointer"
      ) {
        // Recursively resolve this pointer
        return await resolvePointer(resolvedValue as Pointer, path, depth + 1);
      }
      // Check if the resolved value contains more pointers that need resolving
      if (resolvedValue && typeof resolvedValue === "object") {
        const nestedPointers = extractInternals(resolvedValue, "pointer");

        if (nestedPointers.length > 0) {
          // Recursively resolve nested pointers
          const resolvedNestedPointers = await Promise.all(
            nestedPointers.map(({ path: nestedPath, pointer: nestedPointer }) =>
              resolvePointer(nestedPointer, nestedPath, depth + 1),
            ),
          );

          // Create a map of resolved nested pointers for easier access
          const resolvedNestedMap = new Map<string, any>();
          for (const resolved of resolvedNestedPointers) {
            if (resolved.resolved !== null) {
              resolvedNestedMap.set(resolved.path, resolved.resolved);
            }
          }

          // Replace pointers in the resolved value with their resolved values
          // Deep copy resolvedValue to avoid modifying the original
          const resolvedValueWithNestedResolved = JSON.parse(
            JSON.stringify(resolvedValue),
          );

          // Apply all the nested resolutions to the resolved value
          resolvedNestedMap.forEach((value, nestedPath) => {
            // Find the parent object and property to update
            const pathParts = nestedPath.split("/").filter(Boolean);
            let current: any = resolvedValueWithNestedResolved;

            for (let i = 0; i < pathParts.length - 1; i++) {
              if (current && typeof current === "object") {
                current = current[pathParts[i]];
              }
            }

            // Update the property with the resolved value
            if (current && typeof current === "object") {
              const lastPart = pathParts[pathParts.length - 1];
              current[lastPart] = value;
            }
          });

          resolvedValue = resolvedValueWithNestedResolved;
        }
      }

      return {
        path,
        pointer,
        resolved: resolvedValue,
        error: null,
        depth,
      };
    } catch (error) {
      return {
        path,
        pointer,
        resolved: null,
        error: error instanceof Error ? error.message : String(error),
        depth,
      };
    } finally {
      // Remove this pointer from the processed set after resolution
      // Only for non-circular references - for debugging
      if (depth === 0) {
        processedPointers.delete(pointerId);
      }
    }
  }

  // recipeA pattern for picking variables
  const pointers = extractInternals(variables, "pointer");

  // Resolve all the pointers and return the resolved values
  const resolved = await Promise.all(
    pointers.map(async ({ path, pointer }) => resolvePointer(pointer, path)),
  );

  return {
    data,
    cursor,
    resolved,
  };
}

export { loader };
