/**
 * Grep tool - Search for patterns in files
 */

import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import { validateDirectoryPath, SecurityError, getProjectRoot } from "./security";
import { join, relative } from "node:path";

interface GrepMatch {
  file: string;
  line: number;
  content: string;
  context: {
    before: string[];
    after: string[];
  };
}

/**
 * Grep tool using betaTool pattern with JSON Schema
 */
export const grepTool = betaTool({
  name: "grep",
  description:
    "Search for a regex pattern in files. Returns matching lines with file path, line number, and surrounding context. Use the glob parameter to filter which files to search.",
  inputSchema: {
    type: "object" as const,
    properties: {
      pattern: {
        type: "string",
        description: "Regular expression pattern to search for",
      },
      path: {
        type: "string",
        description: "Directory or file to search in. Defaults to PROJECT_ROOT.",
      },
      glob: {
        type: "string",
        description:
          'File pattern filter (e.g., "*.ts", "*.{ts,tsx}"). Only searches matching files.',
      },
      context_lines: {
        type: "number",
        description:
          "Number of context lines to show before and after each match (default: 2)",
      },
      case_insensitive: {
        type: "boolean",
        description: "If true, search is case-insensitive",
      },
      max_matches: {
        type: "number",
        description: "Maximum number of matches to return (default: 50)",
      },
    },
    required: ["pattern"] as const,
  },
  run: async (input) => {
    try {
      // Compile the regex
      const caseInsensitive = input.case_insensitive ?? false;
      let regex: RegExp;
      try {
        regex = new RegExp(input.pattern, caseInsensitive ? "gi" : "g");
      } catch (regexError) {
        return `Error: Invalid regex pattern "${input.pattern}": ${regexError instanceof Error ? regexError.message : String(regexError)}`;
      }

      // Validate and get search path
      let searchPath = getProjectRoot();
      if (input.path) {
        try {
          searchPath = validateDirectoryPath(input.path);
        } catch (error) {
          if (error instanceof SecurityError) {
            return `Security Error: ${error.message}`;
          }
          throw error;
        }
      }

      const contextLines = input.context_lines ?? 2;
      const maxMatches = input.max_matches ?? 50;

      // Determine files to search
      const filesToSearch: string[] = [];

      // Use glob to find files
      const globPattern = input.glob || "**/*";
      const fileGlob = new Bun.Glob(globPattern);

      for await (const file of fileGlob.scan({
        cwd: searchPath,
        dot: false,
        onlyFiles: true,
        followSymlinks: false,
      })) {
        // Skip binary-looking files and common non-text files
        const skipExtensions = [
          ".png",
          ".jpg",
          ".jpeg",
          ".gif",
          ".ico",
          ".svg",
          ".woff",
          ".woff2",
          ".ttf",
          ".eot",
          ".mp3",
          ".mp4",
          ".zip",
          ".tar",
          ".gz",
          ".pdf",
          ".exe",
          ".dll",
          ".so",
          ".dylib",
        ];
        if (skipExtensions.some((ext) => file.toLowerCase().endsWith(ext))) {
          continue;
        }
        filesToSearch.push(join(searchPath, file));
      }

      if (filesToSearch.length === 0) {
        return `No files found to search in ${searchPath}${input.glob ? ` matching "${input.glob}"` : ""}`;
      }

      // Search files
      const matches: GrepMatch[] = [];
      let totalMatches = 0;
      const filesWithMatches = new Set<string>();

      for (const filePath of filesToSearch) {
        if (matches.length >= maxMatches) break;

        try {
          const file = Bun.file(filePath);
          const content = await file.text();
          const lines = content.split("\n");

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Reset regex lastIndex for each line
            regex.lastIndex = 0;
            if (regex.test(line)) {
              totalMatches++;
              filesWithMatches.add(filePath);

              if (matches.length < maxMatches) {
                // Get context
                const beforeStart = Math.max(0, i - contextLines);
                const afterEnd = Math.min(lines.length - 1, i + contextLines);

                matches.push({
                  file: relative(getProjectRoot(), filePath),
                  line: i + 1, // 1-based line numbers
                  content: line,
                  context: {
                    before: lines.slice(beforeStart, i),
                    after: lines.slice(i + 1, afterEnd + 1),
                  },
                });
              }
            }
          }
        } catch {
          // Skip files that can't be read (binary, permissions, etc.)
          continue;
        }
      }

      if (matches.length === 0) {
        return `No matches found for pattern "${input.pattern}" in ${filesToSearch.length} files`;
      }

      // Format output
      let output = `Found ${totalMatches} match(es) in ${filesWithMatches.size} file(s)`;
      if (totalMatches > maxMatches) {
        output += ` (showing first ${maxMatches})`;
      }
      output += `:\n`;

      for (const match of matches) {
        output += `\n--- ${match.file}:${match.line} ---\n`;

        // Context before
        if (match.context.before.length > 0) {
          for (let i = 0; i < match.context.before.length; i++) {
            const lineNum = match.line - match.context.before.length + i;
            output += ` ${lineNum}\t${match.context.before[i]}\n`;
          }
        }

        // Matching line (highlighted)
        output += `>${match.line}\t${match.content}\n`;

        // Context after
        if (match.context.after.length > 0) {
          for (let i = 0; i < match.context.after.length; i++) {
            const lineNum = match.line + i + 1;
            output += ` ${lineNum}\t${match.context.after[i]}\n`;
          }
        }
      }

      return output;
    } catch (error) {
      if (error instanceof SecurityError) {
        return `Security Error: ${error.message}`;
      }
      return `Error executing grep: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
