/**
 * Tools registry for Claude Code-like capabilities
 * Exports all available tools for the Anthropic toolRunner
 */

// Export individual tools
export { readFileTool } from "./read-file";
export { writeFileTool } from "./write-file";
export { editFileTool } from "./edit-file";
export { bashTool } from "./bash";
export { globTool } from "./glob";
export { grepTool } from "./grep";

// Import tools for registry
import { readFileTool } from "./read-file";
import { writeFileTool } from "./write-file";
import { editFileTool } from "./edit-file";
import { bashTool } from "./bash";
import { globTool } from "./glob";
import { grepTool } from "./grep";

/**
 * All available tools for use with Anthropic's toolRunner
 */
export const allTools = [
  readFileTool,
  writeFileTool,
  editFileTool,
  bashTool,
  globTool,
  grepTool,
];

/**
 * Tool names for reference
 */
export const toolNames = [
  "read_file",
  "write_file",
  "edit_file",
  "bash",
  "glob",
  "grep",
] as const;

export type ToolName = (typeof toolNames)[number];

/**
 * Tool descriptions for system prompt
 */
export const toolDescriptions = `
You have access to the following tools to help you complete tasks:

1. **read_file** - Read contents of a file. Supports offset and limit for large files.
2. **write_file** - Write content to a file. Creates parent directories if needed.
3. **edit_file** - Perform exact string replacement in a file. String must be unique unless replace_all is true.
4. **bash** - Execute shell commands with timeout. Returns stdout, stderr, and exit code.
5. **glob** - Find files matching a pattern (e.g., "**/*.ts" for all TypeScript files).
6. **grep** - Search for regex patterns in files with context lines.

When working with files:
- Always use absolute paths
- Use read_file first to understand file contents before editing
- Use glob to discover files when needed
- Use grep to search for patterns across the codebase
- Use bash for running commands like tests, builds, git operations
`;
