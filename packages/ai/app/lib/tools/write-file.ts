/**
 * Write file tool - Write content to files in the project directory
 */

import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import { validatePath, SecurityError } from "./security";
import { dirname } from "node:path";
import { mkdir } from "node:fs/promises";

/**
 * Write file tool using betaTool pattern with JSON Schema
 */
export const writeFileTool = betaTool({
  name: "write_file",
  description:
    "Write content to a file in the project directory. Creates parent directories if they don't exist. Overwrites the file if it already exists.",
  inputSchema: {
    type: "object" as const,
    properties: {
      file_path: {
        type: "string",
        description: "Absolute file path to write to",
      },
      content: {
        type: "string",
        description: "Content to write to the file",
      },
    },
    required: ["file_path", "content"] as const,
  },
  run: async (input) => {
    try {
      // Validate path is within PROJECT_ROOT
      const validatedPath = await validatePath(input.file_path);

      // Create parent directories if needed
      const parentDir = dirname(validatedPath);
      await mkdir(parentDir, { recursive: true });

      // Write the file using Bun.write
      await Bun.write(validatedPath, input.content);

      // Calculate some stats
      const lines = input.content.split("\n").length;
      const bytes = new TextEncoder().encode(input.content).length;

      return `Successfully wrote ${bytes} bytes (${lines} lines) to ${input.file_path}`;
    } catch (error) {
      if (error instanceof SecurityError) {
        return `Security Error: ${error.message}`;
      }
      return `Error writing file: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
