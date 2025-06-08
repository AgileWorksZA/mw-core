import {useIdeSelector} from "~/modules/ide/hooks/use-ide-selector";
import type {Variables} from "~/modules/ide/types";

export function useManifestOutputVariable(id: string, path: string) {
  return useIdeSelector((state) => {
    // Return undefined for empty id
    if (!id) {
      return undefined;
    }

    // Helper function to get output variables from a file
    const getOutputVariables = (
      fileId: string,
    ): Variables<any> | null | undefined => {
      const file = state.context.files[fileId];
      if (!file) {
        return undefined;
      }
      if (file.mapping.output.variables === false) {
        return null;
      }
      return file.mapping.output.variables === true
        ? file.mapping.input.variables
        : file.mapping.output.variables;
    };

    // Recursive function to resolve pointers
    const resolveValue = (
      value: any,
      depth = 0,
      maxDepth = 10,
      processedPointers = new Set<string>(),
    ): any => {
      // Prevent infinite recursion
      if (depth >= maxDepth) {
        return value;
      }

      // Check if this is a pointer
      if (value && typeof value === "object" && value.internal === "pointer") {
        const pointerId = `${value.type}:${value.id}:${value.path || ""}`;

        // Check for circular references
        if (processedPointers.has(pointerId)) {
          return value; // Return the pointer itself to avoid infinite loop
        }

        processedPointers.add(pointerId);

        // Get the target file's output variables
        const targetVariables = getOutputVariables(value.id);
        if (!targetVariables) {
          return undefined;
        }

        // Navigate to the specific path if provided
        let resolvedValue: any = targetVariables;
        if (value.path) {
          const pathParts = value.path.split("/").filter(Boolean);
          for (const part of pathParts) {
            if (resolvedValue && typeof resolvedValue === "object") {
              resolvedValue = resolvedValue[part];
            } else {
              return undefined;
            }
          }
        }

        // Recursively resolve if the resolved value is also a pointer
        return resolveValue(
          resolvedValue,
          depth + 1,
          maxDepth,
          processedPointers,
        );
      }

      // If it's an object, recursively resolve any pointers within it
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const resolved: any = {};
        for (const [key, val] of Object.entries(value)) {
          resolved[key] = resolveValue(
            val,
            depth + 1,
            maxDepth,
            processedPointers,
          );
        }
        return resolved;
      }

      // If it's an array, recursively resolve each element
      if (Array.isArray(value)) {
        return value.map((item) =>
          resolveValue(item, depth + 1, maxDepth, processedPointers),
        );
      }

      // For primitive values, return as-is
      return value;
    };

    // Get the initial value
    const variables = getOutputVariables(id);
    if (!variables) {
      return undefined;
    }

    // Navigate to the path
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

    // Resolve any pointers in the value
    return resolveValue(current);
  });
}