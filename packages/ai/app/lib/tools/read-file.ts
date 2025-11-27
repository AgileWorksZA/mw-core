/**
 * Read file tool - Read contents of files from the project directory
 */

import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import { validatePath, SecurityError } from "./security";

/**
 * Add line numbers to content
 */
function addLineNumbers(content: string, startLine: number = 1): string {
  const lines = content.split("\n");
  const maxLineNumWidth = String(startLine + lines.length - 1).length;

  return lines
    .map((line, index) => {
      const lineNum = String(startLine + index).padStart(maxLineNumWidth, " ");
      return `${lineNum}\t${line}`;
    })
    .join("\n");
}

/**
 * Read file tool using betaTool pattern with JSON Schema
 */
export const readFileTool = betaTool({
  name: "read_file",
  description:
    "Read contents of a file from the project directory. Returns the file content with line numbers. Use offset and limit to read large files in chunks.",
  inputSchema: {
    type: "object" as const,
    properties: {
      file_path: {
        type: "string",
        description: "Absolute file path to read",
      },
      offset: {
        type: "number",
        description:
          "Line number to start reading from (1-based). If not provided, reads from beginning.",
      },
      limit: {
        type: "number",
        description: "Maximum number of lines to read. If not provided, reads entire file.",
      },
    },
    required: ["file_path"] as const,
  },
  run: async (input) => {
    try {
      // Validate path is within PROJECT_ROOT
      const validatedPath = await validatePath(input.file_path);

      // Read the file using Bun.file
      const file = Bun.file(validatedPath);
      const exists = await file.exists();

      if (!exists) {
        return `Error: File not found: ${input.file_path}`;
      }

      const content = await file.text();
      const lines = content.split("\n");

      // Handle offset and limit
      const startLine = input.offset ?? 1;
      const startIndex = startLine - 1; // Convert to 0-based index

      if (startIndex >= lines.length) {
        return `Error: Offset ${startLine} exceeds file length (${lines.length} lines)`;
      }

      const endIndex = input.limit ? startIndex + input.limit : lines.length;
      const selectedLines = lines.slice(startIndex, endIndex);
      const selectedContent = selectedLines.join("\n");

      // Add line numbers
      const numberedContent = addLineNumbers(selectedContent, startLine);

      // Add metadata
      const totalLines = lines.length;
      const showingEnd = Math.min(endIndex, totalLines);
      const metadata =
        input.offset || input.limit
          ? `\n\n[Showing lines ${startLine}-${showingEnd} of ${totalLines} total]`
          : "";

      return numberedContent + metadata;
    } catch (error) {
      if (error instanceof SecurityError) {
        return `Security Error: ${error.message}`;
      }
      return `Error reading file: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
