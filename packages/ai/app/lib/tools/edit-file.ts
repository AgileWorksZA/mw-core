/**
 * Edit file tool - Perform exact string replacements in files
 */

import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import { validatePath, SecurityError } from "./security";

/**
 * Get context around a match position
 */
function getContext(content: string, position: number, contextLines: number = 2): string {
  const lines = content.split("\n");
  let currentPos = 0;
  let matchLine = 0;

  for (let i = 0; i < lines.length; i++) {
    if (currentPos + lines[i].length >= position) {
      matchLine = i;
      break;
    }
    currentPos += lines[i].length + 1; // +1 for newline
  }

  const startLine = Math.max(0, matchLine - contextLines);
  const endLine = Math.min(lines.length - 1, matchLine + contextLines);

  const contextLines_ = lines.slice(startLine, endLine + 1);
  return contextLines_
    .map((line, index) => {
      const lineNum = startLine + index + 1;
      const marker = lineNum === matchLine + 1 ? ">" : " ";
      return `${marker}${lineNum}\t${line}`;
    })
    .join("\n");
}

/**
 * Edit file tool using betaTool pattern with JSON Schema
 */
export const editFileTool = betaTool({
  name: "edit_file",
  description:
    "Perform exact string replacement in a file. By default, the old_string must be unique in the file (use replace_all: true for multiple replacements). Returns success message with context around the change.",
  inputSchema: {
    type: "object" as const,
    properties: {
      file_path: {
        type: "string",
        description: "Absolute file path to edit",
      },
      old_string: {
        type: "string",
        description: "The exact string to replace (must be unique in the file)",
      },
      new_string: {
        type: "string",
        description: "The replacement string",
      },
      replace_all: {
        type: "boolean",
        description:
          "If true, replace all occurrences. If false (default), the old_string must be unique.",
      },
    },
    required: ["file_path", "old_string", "new_string"] as const,
  },
  run: async (input) => {
    try {
      // Validate path is within PROJECT_ROOT
      const validatedPath = await validatePath(input.file_path);

      // Read the file
      const file = Bun.file(validatedPath);
      const exists = await file.exists();

      if (!exists) {
        return `Error: File not found: ${input.file_path}`;
      }

      const content = await file.text();

      // Check for old_string existence
      const occurrences = content.split(input.old_string).length - 1;

      if (occurrences === 0) {
        return `Error: Could not find the specified string in ${input.file_path}.\n\nSearched for:\n\`\`\`\n${input.old_string}\n\`\`\`\n\nMake sure the string matches exactly, including whitespace and indentation.`;
      }

      const replaceAll = input.replace_all ?? false;

      if (!replaceAll && occurrences > 1) {
        // Find positions of all occurrences
        const positions: number[] = [];
        let pos = content.indexOf(input.old_string);
        while (pos !== -1) {
          positions.push(pos);
          pos = content.indexOf(input.old_string, pos + 1);
        }

        // Build error message with context for each occurrence
        let errorMsg = `Error: Found ${occurrences} occurrences of the string in ${input.file_path}. The string must be unique unless replace_all is true.\n\nOccurrences found at:`;

        for (let i = 0; i < Math.min(positions.length, 3); i++) {
          errorMsg += `\n\n--- Occurrence ${i + 1} ---\n${getContext(content, positions[i])}`;
        }

        if (positions.length > 3) {
          errorMsg += `\n\n... and ${positions.length - 3} more occurrences`;
        }

        return errorMsg;
      }

      // Perform the replacement
      let newContent: string;
      let replacementCount: number;

      if (replaceAll) {
        newContent = content.split(input.old_string).join(input.new_string);
        replacementCount = occurrences;
      } else {
        newContent = content.replace(input.old_string, input.new_string);
        replacementCount = 1;
      }

      // Write the file
      await Bun.write(validatedPath, newContent);

      // Get context around the first change
      const changePosition = content.indexOf(input.old_string);
      const context = getContext(newContent, changePosition);

      return `Successfully replaced ${replacementCount} occurrence(s) in ${input.file_path}\n\nContext around change:\n${context}`;
    } catch (error) {
      if (error instanceof SecurityError) {
        return `Security Error: ${error.message}`;
      }
      return `Error editing file: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
