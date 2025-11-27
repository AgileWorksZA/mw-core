/**
 * Glob tool - Find files matching patterns
 */

import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import { validateDirectoryPath, SecurityError, getProjectRoot } from "./security";

/**
 * Glob tool using betaTool pattern with JSON Schema
 */
export const globTool = betaTool({
  name: "glob",
  description:
    'Find files matching a glob pattern. Supports patterns like "**/*.ts" for all TypeScript files, "src/**/*.tsx" for React components, etc. Returns file paths relative to search directory.',
  inputSchema: {
    type: "object" as const,
    properties: {
      pattern: {
        type: "string",
        description: 'Glob pattern to match files (e.g., "**/*.ts", "src/**/*.tsx")',
      },
      path: {
        type: "string",
        description: "Base directory to search in. Defaults to PROJECT_ROOT.",
      },
      max_results: {
        type: "number",
        description: "Maximum number of results to return (default: 100)",
      },
    },
    required: ["pattern"] as const,
  },
  run: async (input) => {
    try {
      // Validate and get search directory
      let searchDir = getProjectRoot();
      if (input.path) {
        try {
          searchDir = validateDirectoryPath(input.path);
        } catch (error) {
          if (error instanceof SecurityError) {
            return `Security Error: ${error.message}`;
          }
          throw error;
        }
      }

      const maxResults = input.max_results ?? 100;

      // Create the glob
      const glob = new Bun.Glob(input.pattern);

      // Collect matching files
      const matches: string[] = [];
      let count = 0;
      let totalFound = 0;

      for await (const file of glob.scan({
        cwd: searchDir,
        dot: false, // Exclude dotfiles by default
        onlyFiles: true,
        followSymlinks: false,
      })) {
        totalFound++;
        if (count < maxResults) {
          matches.push(file);
          count++;
        }
      }

      if (matches.length === 0) {
        return `No files found matching pattern "${input.pattern}" in ${searchDir}`;
      }

      // Sort matches for consistent output
      matches.sort();

      // Format output
      let output = `Found ${totalFound} file(s) matching "${input.pattern}"`;
      if (totalFound > maxResults) {
        output += ` (showing first ${maxResults})`;
      }
      output += `:\n\n`;
      output += matches.join("\n");

      return output;
    } catch (error) {
      if (error instanceof SecurityError) {
        return `Security Error: ${error.message}`;
      }
      return `Error executing glob: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
