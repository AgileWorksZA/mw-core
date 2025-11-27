# Retrospective: AITOOLS-001

**Story:** Add Claude Code-like Tool Capabilities to AI Package
**Completed:** 2025-11-27T07:45:00.000Z
**Duration:** ~2 hours (estimated from task structure)

---

## Summary

Successfully implemented 6 Claude Code-like tools (read_file, write_file, edit_file, bash, glob, grep) in the packages/ai React Router 7 app. The tools enable Claude to autonomously read code, make changes, run commands, and search the codebase within the MoneyWorks ecosystem.

---

## What Went Well

### 1. Architecture Decision - Separate Security Module
Creating `security.ts` as a standalone module for path validation was excellent. It ensured consistent security across all file tools and made the codebase more maintainable.

### 2. Bun.Glob API
Leveraging Bun's native Glob API eliminated the need for external dependencies (node-glob) and provided seamless async iteration over file matches.

### 3. Error Handling Pattern
Returning error strings instead of throwing exceptions ensures Claude always receives feedback. This is critical for agentic workflows where Claude needs to understand what went wrong to adjust its approach.

### 4. Tool Runner with Iteration Limit
Setting `max_iterations: 10` prevents runaway loops while still allowing complex multi-step operations.

### 5. Collapsible UI Component
The ToolCall component with expand/collapse functionality provides a clean user experience without overwhelming the chat interface with verbose tool outputs.

---

## What Could Be Improved

### 1. Better Zod Integration Research
The pivot from betaZodTool to betaTool with raw JSON Schema was necessary but could have been anticipated with better upfront research on ESM compatibility.

### 2. Streaming Implementation
The current streaming implementation (`runWithToolsStreaming`) is functional but not fully integrated into the UI. The non-streaming `runWithTools` is used in _index.tsx.

### 3. Test Coverage
No unit tests were added for the tool implementations. While the tools work end-to-end, unit tests would improve confidence and enable safer refactoring.

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| betaTool over betaZodTool | ESM compatibility with React Router 7 / Vite |
| max_iterations: 10 | Balance between capability and safety |
| Separate security.ts | Single source of truth for path validation |
| Error strings over throws | Claude needs feedback to adjust approach |
| Filter process.env in bash | Vite adds non-string values that Bun.spawn rejects |

---

## Learnings

### Technical Learnings

1. **Anthropic SDK ESM Behavior**: The SDK has multiple helper entry points with different bundler compatibility. `@anthropic-ai/sdk/helpers/beta/json-schema` works better than `/beta/zod` in Vite/React Router projects.

2. **Bun APIs**: Bun.Glob and Bun.file() provide clean, native alternatives to Node.js ecosystem packages. Prefer these over npm dependencies.

3. **Tool Error Patterns**: LLM tools should never throw - always return error information as the result so the model can learn and adapt.

### Process Learnings

1. **Security First**: Creating the security module first (T-002) before any file tools was the right sequencing. All subsequent tools inherited validated path handling.

2. **Parallel Development**: The tool implementations (T-003 through T-008) were independent and could have been developed in parallel after security.ts.

---

## Automation Opportunities

### High Value: Tool Testing Script
Create a script to automatically test all 6 tools with sample inputs and verify expected outputs. This would catch regressions during SDK updates.

**Effort:** ~2 hours
**Impact:** Prevents silent failures when Anthropic SDK updates

### Medium Value: Tool Code Generator
After implementing multiple tool stories, consider a generator skill for creating new tools with the betaTool pattern, security integration, and error handling boilerplate.

**Effort:** ~4 hours
**Impact:** Reduces tool creation time by ~50%

### Low Value (Defer): Streaming Integration
Fully integrate the streaming implementation into the UI for real-time tool progress. Currently works but not used in production code path.

**Effort:** ~4 hours
**Impact:** Better UX but not blocking

---

## Metrics

- **ACs Defined:** 13
- **ACs Passed:** 13 (100%)
- **Tasks Defined:** 16
- **Tasks Completed:** 16 (100%)
- **Files Created:** 8 (tools/* directory)
- **Files Modified:** 3 (anthropic.server.ts, _index.tsx, message.tsx)
- **TypeScript Errors:** 0

---

## Weave Dimension Updates

### E (Epistemology) - Patterns
- `E:betatool-json-schema-pattern`: Use betaTool with raw JSON Schema for React Router 7 / Vite compatibility

### Q (Qualia) - Pain Points
- `Q:anthropic-sdk-esm-compat`: Different helper imports have different ESM behaviors

### Pi (Praxeology) - Best Practices
- `Pi:tool-error-strings`: Return error strings from tools, never throw
- `Pi:security-module-first`: Create security/validation module before feature modules

### M (Modality) - Decisions
- `M:betatool-over-betazodtool`: Chose JSON Schema over Zod for SDK compatibility

---

## Next Steps

1. Consider adding unit tests for tool implementations
2. Integrate streaming into UI for better UX
3. Monitor for Anthropic SDK updates that might affect betaTool behavior
4. Use this implementation as reference for future tool additions
