import type { Pointer, Variables } from "../types";

import { extractInternals } from "~/modules/ide/utils/extract-internals";

/**
 * Checks if a pointer would create a circular dependency in the mapping
 *
 * @param pointer The pointer to check
 * @param sourceFileId The ID of the file containing this pointer
 * @param files Map of all files in the project
 * @returns Object with result and path of circular dependency if found
 */
export function detectCircularDependency(
  pointer: Pointer,
  sourceFileId: string,
  files: Record<string, { mapping: { output: any } }>,
): { hasCircular: boolean; path: string[] } {
  const visited = new Set<string>();
  const path: string[] = [sourceFileId];

  function checkPointer(
    currentPointer: Pointer,
    currentPath: string[],
  ): boolean {
    // If we've visited this file before, we have a cycle
    const pointerId = currentPointer.id;
    if (visited.has(pointerId)) {
      return true;
    }

    // If this points back to our source file, we have a cycle
    if (pointerId === sourceFileId) {
      return true;
    }

    // Mark this file as visited
    visited.add(pointerId);
    currentPath.push(pointerId);

    // Check if the target file exists
    const targetFile = files[pointerId];
    if (!targetFile) {
      // Target file doesn't exist, can't be circular
      visited.delete(pointerId);
      currentPath.pop();
      return false;
    }

    // Get the output of the target file
    const output = targetFile.mapping.output;
    if (!output || output === true) {
      // No output or using input as output (can't determine, assume no circular)
      visited.delete(pointerId);
      currentPath.pop();
      return false;
    }

    // Extract pointers from the output
    const pointers = extractInternals(output.variables, "pointer");

    // Recursively check each pointer in the target file
    for (const { pointer: nestedPointer } of pointers) {
      if (checkPointer(nestedPointer, currentPath)) {
        return true;
      }
    }

    // No circular dependencies found
    visited.delete(pointerId);
    currentPath.pop();
    return false;
  }

  return {
    hasCircular: checkPointer(pointer, path),
    path,
  };
}

/**
 * Validates all pointers in a variables object for circular dependencies
 *
 * @param variables The variables to check
 * @param fileId The ID of the current file
 * @param files Map of all files in the project
 * @returns Array of validation errors
 */
export function validatePointers(
  variables: Variables<any>,
  fileId: string,
  files: Record<string, { mapping: { output: any } }>,
): Array<{ pointer: Pointer; path: string; error: string }> {
  const errors: Array<{ pointer: Pointer; path: string; error: string }> = [];

  // Extract all pointers from the variables
  const pointers = extractInternals(variables, "pointer");

  // Check each pointer for circular dependencies
  for (const { pointer, path } of pointers) {
    // Check if the target file exists
    if (!files[pointer.id]) {
      errors.push({
        pointer,
        path,
        error: `Target file with ID ${pointer.id} does not exist`,
      });
      continue;
    }

    // Check for circular dependencies
    const { hasCircular, path: circularPath } = detectCircularDependency(
      pointer,
      fileId,
      files,
    );

    if (hasCircular) {
      errors.push({
        pointer,
        path,
        error: `Circular dependency detected: ${circularPath.join(" → ")}`,
      });
    }
  }

  return errors;
}
