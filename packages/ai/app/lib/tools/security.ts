/**
 * Security utilities for tool execution
 * Ensures file operations are restricted to PROJECT_ROOT
 */

import { resolve, normalize, relative } from "node:path";
import { realpath } from "node:fs/promises";

/**
 * Get the project root directory from environment or default to cwd
 */
export function getProjectRoot(): string {
  return process.env.PROJECT_ROOT || process.cwd();
}

/**
 * SecurityError thrown when path validation fails
 */
export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SecurityError";
  }
}

/**
 * Validate that a given path is within PROJECT_ROOT
 * - Prevents path traversal attacks (../)
 * - Resolves symlinks to check real location
 * - Returns the resolved absolute path if valid
 *
 * @param inputPath - The path to validate (can be relative or absolute)
 * @returns The resolved absolute path
 * @throws SecurityError if path is outside PROJECT_ROOT
 */
export async function validatePath(inputPath: string): Promise<string> {
  const projectRoot = getProjectRoot();

  // Normalize and resolve the input path
  const normalizedInput = normalize(inputPath);

  // Resolve to absolute path (relative to PROJECT_ROOT if not absolute)
  const absolutePath = normalizedInput.startsWith("/")
    ? resolve(normalizedInput)
    : resolve(projectRoot, normalizedInput);

  // Check for obvious path traversal attempts in the string itself
  if (inputPath.includes("..")) {
    // Even if it resolves within root, reject explicit .. usage for safety
    const relativePath = relative(projectRoot, absolutePath);
    if (relativePath.startsWith("..")) {
      throw new SecurityError(
        `Path traversal detected: "${inputPath}" resolves outside PROJECT_ROOT`
      );
    }
  }

  // Verify the path is within PROJECT_ROOT
  const relativeToRoot = relative(projectRoot, absolutePath);
  if (relativeToRoot.startsWith("..") || relativeToRoot.startsWith("/")) {
    throw new SecurityError(
      `Access denied: "${inputPath}" is outside PROJECT_ROOT (${projectRoot})`
    );
  }

  // For existing files, also verify the real path after resolving symlinks
  try {
    const realPath = await realpath(absolutePath);
    const realRelative = relative(projectRoot, realPath);
    if (realRelative.startsWith("..") || realRelative.startsWith("/")) {
      throw new SecurityError(
        `Symlink escape detected: "${inputPath}" resolves to "${realPath}" outside PROJECT_ROOT`
      );
    }
    return realPath;
  } catch (error) {
    // File doesn't exist yet - that's OK for write operations
    // The path is already validated to be within PROJECT_ROOT
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return absolutePath;
    }
    throw error;
  }
}

/**
 * Validate a directory path for glob/grep operations
 * Similar to validatePath but doesn't require the path to exist
 *
 * @param inputPath - The directory path to validate
 * @returns The resolved absolute path
 * @throws SecurityError if path is outside PROJECT_ROOT
 */
export function validateDirectoryPath(inputPath: string): string {
  const projectRoot = getProjectRoot();

  // Normalize and resolve the input path
  const normalizedInput = normalize(inputPath);

  // Resolve to absolute path (relative to PROJECT_ROOT if not absolute)
  const absolutePath = normalizedInput.startsWith("/")
    ? resolve(normalizedInput)
    : resolve(projectRoot, normalizedInput);

  // Verify the path is within PROJECT_ROOT
  const relativeToRoot = relative(projectRoot, absolutePath);
  if (relativeToRoot.startsWith("..") || relativeToRoot.startsWith("/")) {
    throw new SecurityError(
      `Access denied: "${inputPath}" is outside PROJECT_ROOT (${projectRoot})`
    );
  }

  return absolutePath;
}
