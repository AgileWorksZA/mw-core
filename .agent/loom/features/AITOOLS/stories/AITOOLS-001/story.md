# AITOOLS-001: Add Claude Code-like Tool Capabilities to AI Package

## Why (Root Motivation)

Transform AI from advisor to active collaborator - multiply developer effectiveness by enabling autonomous coding assistance.

**5 Whys Analysis:**
1. Why? To allow Claude to perform actual coding tasks - reading files, making edits, running commands - rather than just answering questions about code
2. Why? The existing chat is passive - Claude can advise but cannot act. Tool use enables Claude to be a true pair programmer that implements suggestions
3. Why? Developer productivity dramatically increases when the AI can handle routine coding tasks: reading code context, making changes, running tests, searching patterns
4. Why? MoneyWorks SDK development involves repetitive patterns (entity implementation, 9-file structure). An agentic Claude can automate these workflows
5. Root: **Multiply developer effectiveness by enabling AI to autonomously perform coding tasks within the MoneyWorks codebase**

## Description

Enhance the packages/ai React Router 7 app with server-side tools that Claude can invoke autonomously. The implementation uses the Anthropic SDK's `betaZodTool` and `toolRunner` pattern for type-safe tool definitions and automatic execution loops.

### Tools to Implement

1. **read_file** - Read file contents from the project directory
   - Input: file_path (string)
   - Output: file contents or error message
   - Security: Path must be within PROJECT_ROOT

2. **write_file** - Write/create files in the project directory
   - Input: file_path (string), content (string)
   - Output: success message or error
   - Security: Path must be within PROJECT_ROOT

3. **edit_file** - Exact string replacement in files
   - Input: file_path (string), old_string (string), new_string (string)
   - Output: success message with diff or error
   - Security: old_string must be unique in file

4. **bash** - Execute shell commands
   - Input: command (string), timeout_ms (optional, default 30000)
   - Output: stdout, stderr, exit_code
   - Security: Configurable allowed commands or working directory

5. **glob** - Find files matching glob patterns
   - Input: pattern (string), path (optional)
   - Output: array of matching file paths
   - Example: `**/*.ts` matches all TypeScript files

6. **grep** - Search file contents with regex
   - Input: pattern (string), path (optional), glob (optional)
   - Output: matching lines with file:line context
   - Example: `function\s+\w+` finds function definitions

### Architecture

```
packages/ai/app/
  lib/
    tools/
      index.ts        # Tool definitions and registry
      read-file.ts    # Read tool implementation
      write-file.ts   # Write tool implementation
      edit-file.ts    # Edit tool implementation
      bash.ts         # Bash execution tool
      glob.ts         # Glob pattern matching
      grep.ts         # Regex search tool
      security.ts     # Path validation, sandboxing
    anthropic.server.ts  # Extended with toolRunner
  components/
    chat/
      tool-call.tsx   # Tool call display component
  routes/
    _index.tsx        # Updated action with toolRunner
```

### Key Implementation Details

1. **Tool Definition Pattern**
```typescript
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

export const readFileTool = betaZodTool({
  name: "read_file",
  description: "Read the contents of a file",
  inputSchema: z.object({
    file_path: z.string().describe("Absolute path to the file to read"),
  }),
  run: async ({ file_path }) => {
    // Implementation with security checks
  },
});
```

2. **ToolRunner Usage**
```typescript
const result = await anthropic.beta.messages.toolRunner({
  model: DEFAULT_MODEL,
  max_tokens: 4096,
  tools: [readFileTool, writeFileTool, editFileTool, bashTool, globTool, grepTool],
  messages,
  system: SYSTEM_PROMPT,
}).finalMessage();
```

3. **Security Measures**
- PROJECT_ROOT environment variable defines allowed file access
- Path traversal prevention (no `..` escapes)
- Bash command execution with timeout
- Output size limits

## Acceptance Criteria

- [ ] **AC-001**: Tool definitions exist for read_file, write_file, edit_file, bash, glob, and grep in app/lib/tools/
- [ ] **AC-002**: Each tool uses betaZodTool from @anthropic-ai/sdk/helpers/beta/zod with Zod input schemas
- [ ] **AC-003**: Server action uses anthropic.beta.messages.toolRunner() for automatic tool execution loop
- [ ] **AC-004**: File tools (read, write, edit) restrict access to configurable PROJECT_ROOT directory via environment variable
- [ ] **AC-005**: Bash tool executes commands with configurable timeout (default 30s) and returns stdout/stderr
- [ ] **AC-006**: Chat UI displays tool calls with name, inputs, and results in collapsible format
- [ ] **AC-007**: Tool execution errors are caught and returned as tool results (not thrown)
- [ ] **AC-008**: TypeScript compilation passes with zero errors (bun run typecheck)
- [ ] **AC-009**: Dev server starts and tool execution works end-to-end (user asks Claude to read a file, Claude uses tool, result shown)
- [ ] **AC-010**: Glob tool supports patterns like '**/*.ts' and returns matching file paths
- [ ] **AC-011**: Grep tool supports regex patterns and returns matching lines with file/line context
- [ ] **AC-012**: Edit tool uses exact string replacement (old_string -> new_string) with uniqueness validation
- [ ] **AC-013**: Streaming response shows tool execution progress (tool name and status) before final response

## Weave Knowledge

**Patterns Applied:**
- `E:full-stack-story-pattern` - Complete feature from backend tools through UI display
- `Pi:validate-before-import` - Validate tool inputs before execution

**Pain Points to Avoid:**
- `Q:dev-server-memory-pressure` - May need static validation if browser testing blocked

**Reference Implementation:**
- AIPOC-001 provides the existing chat infrastructure
- Claude Code tools provide the conceptual model for tool behavior

## Complexity: Complex
Estimated 1-3 days. Multiple new files (6 tools + security + UI component), Anthropic SDK beta APIs, security considerations.

## Priority: High
Foundational capability that unlocks future AI-assisted development workflows.

## Dependencies
- AIPOC-001 (completed) - Base AI chat infrastructure
- @anthropic-ai/sdk ^0.39.0 - Already installed
- zod - Need to add to package.json
