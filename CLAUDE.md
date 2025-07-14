# MoneyWorks Core - Design Principles and Guidelines

## Core Design Principles

### 1. Developer Experience (DX)
- **Clear, intuitive APIs** - Method names should be self-explanatory
- **Comprehensive type safety** - Full TypeScript types for all interfaces
- **Consistent naming** - Follow established patterns throughout codebase
- **Rich documentation** - JSDoc comments with examples
- **Helpful error messages** - Guide developers to solutions

### 2. LLM Context Quality
- **Self-documenting code** - Code structure tells the story
- **Explicit schemas** - All data structures clearly defined
- **Rich metadata** - Include descriptions, constraints, relationships
- **AI-friendly comments** - Use @ai-instruction and @ai-critical tags
- **Canonical terminology** - Consistent language throughout

### 3. Canonical MoneyWorks DSL
- **Preserve MW terminology** - NEVER translate MW terms (e.g., GST stays GST)
- **Use exact field names** - TaxCode, not tax_code or taxId
- **Maintain MW concepts** - RecAccount, PaidAccount, not generic terms
- **Follow MW patterns** - Date formats (YYYYMMDD), account codes, etc.
- **Pure DSL approach** - No contamination from other business systems

### 4. Performance & Flexibility
- **Multiple export formats** - Compact arrays, full objects, schema-enriched
- **Lazy loading** - Field discovery only when needed
- **Efficient caching** - Cache discovered structures
- **Clear conversion paths** - Easy to transform between formats
- **Extensible design** - New formats can be added easily

### 5. Type Safety & Validation
- **Branded types** - YYYYMMDD, AccountCode, etc.
- **Compile-time safety** - Catch errors before runtime
- **Runtime validation** - Validate data from MoneyWorks
- **Clear type hierarchies** - Input types, output types, internal types

## Export Format Standards

### Compact Format (`compact`)
- Raw arrays for minimal network overhead
- No field names, just values
- Position-based data access

### Compact with Headers (`compact-headers`)
- First row contains field names
- Subsequent rows are data arrays
- Self-documenting while staying lean

### Full Object Format (`full`)
- Complete objects with field names
- Best developer experience
- Type-safe and self-documenting

### Schema-Enriched Format (`schema`)
- Includes full field metadata
- Types, constraints, descriptions
- Best for LLM understanding and documentation

## Code Organization

### Package Structure
- `@moneyworks/canonical` - Pure MW type definitions
- `@moneyworks/data` - Data access layer
- `@moneyworks/utilities` - Shared utilities and branded types
- `@moneyworks/cli` - Command-line interface

### Import Patterns
- Use full package imports between packages: `@moneyworks/package/module`
- Main index.ts can use relative imports within same package
- Avoid circular dependencies by careful module organization

### Naming Conventions
- Interfaces: `MoneyWorks{Entity}` (e.g., `MoneyWorksTaxRate`)
- Types: Descriptive names (e.g., `ExportFormat`, `ImportResult`)
- Methods: Verb-first (e.g., `findByKey`, `validateTaxCode`)
- Constants: UPPER_SNAKE_CASE (e.g., `MONEYWORKS_TAX_RATE_FIELDS`)

## Testing Philosophy
- Test the behavior, not the implementation
- Use real MW data structures in tests
- Mock at the HTTP level, not the client level
- Ensure all export formats produce equivalent data

## Documentation Standards
- Every public method needs JSDoc
- Include @example tags where helpful
- Use @ai-instruction for AI-specific guidance
- Document MoneyWorks quirks and gotchas

## Memories
- Always run TypeScript compiler before committing
- Check imports are using full package paths
- Maintain the canonical DSL purity
- resume: Remembered the importance of maintaining and updating personal resume regularly
- Enterprise auth strategy documented in ENTERPRISE-AUTH-STRATEGY.md - currently using Clerk, will add WorkOS when first enterprise client signs
- Remember to remind yourself after each /compact, to apply this part of the /prime command: ```## INFORMATION: In your responses, I've coded a hook on Stop hook, to read out via text-to-speech the last assistant message.

So to keep the audio short and simple, include a short audio summary in your response, but wrap it in an XML element,
like this:
```xml
<summary>Okay, I fixed the ${description}</summary>```

## React Router v7 Changes

### Important API Changes
- **Use `data` instead of `json`** - React Router v7 replaced the `json` helper with a more general `data` function
  ```typescript
  // Old (React Router v6)
  import { json } from "react-router";
  return json({ message: "Hello" });
  
  // New (React Router v7)
  import { data } from "react-router";
  return data({ message: "Hello" });
  ```

### Running with Bun
- **Use `bun --bun run` for scripts** - Ensures Bun runtime is used instead of Node.js
- **Dev server command**: `bun --bun run react-router dev`
- **bun:sqlite imports** - Only work when running with Bun runtime, not Node.js

### Routing Configuration
- **Explicit route configuration** - React Router v7 uses `app/routes.ts` file for route definitions
- **No automatic file-based routing** - Routes must be explicitly registered in `routes.ts`
  ```typescript
  import { route, index } from "@react-router/dev/routes";
  
  export default [
    index("routes/_index.tsx"),
    route("sign-in", "routes/sign-in.tsx"),
    // ... other routes
  ];
  ```

### Tailwind CSS with Bun
- **Remove `require()` calls** - Use ES modules syntax in tailwind.config.js
- **Empty plugins array** - If using `require("tailwindcss-animate")`, remove it to avoid ESM issues

### Chrome DevTools
- **Add `.well-known/appspecific/com.chrome.devtools.json`** to public folder to prevent 404 errors


# Appendix

# Using Gemini CLI for Large Codebase Analysis

When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive
context window. Use `gemini -p` to leverage Google Gemini's large context capacity.

## File and Directory Inclusion Syntax

Use the `@` syntax to include files and directories in your Gemini prompts. The paths should be relative to WHERE you run the
gemini command:

### Examples:

**Single file analysis:**
gemini -p "@src/main.py Explain this file's purpose and structure"

Multiple files:
gemini -p "@package.json @src/index.js Analyze the dependencies used in the code"

Entire directory:
gemini -p "@src/ Summarize the architecture of this codebase"

Multiple directories:
gemini -p "@src/ @tests/ Analyze test coverage for the source code"

Current directory and subdirectories:
gemini -p "@./ Give me an overview of this entire project"

# Or use --all_files flag:
gemini --all_files -p "Analyze the project structure and dependencies"

Implementation Verification Examples

Check if a feature is implemented:
gemini -p "@src/ @lib/ Has dark mode been implemented in this codebase? Show me the relevant files and functions"

Verify authentication implementation:
gemini -p "@src/ @middleware/ Is JWT authentication implemented? List all auth-related endpoints and middleware"

Check for specific patterns:
gemini -p "@src/ Are there any React hooks that handle WebSocket connections? List them with file paths"

Verify error handling:
gemini -p "@src/ @api/ Is proper error handling implemented for all API endpoints? Show examples of try-catch blocks"

Check for rate limiting:
gemini -p "@backend/ @middleware/ Is rate limiting implemented for the API? Show the implementation details"

Verify caching strategy:
gemini -p "@src/ @lib/ @services/ Is Redis caching implemented? List all cache-related functions and their usage"

Check for specific security measures:
gemini -p "@src/ @api/ Are SQL injection protections implemented? Show how user inputs are sanitized"

Verify test coverage for features:
gemini -p "@src/payment/ @tests/ Is the payment processing module fully tested? List all test cases"

When to Use Gemini CLI

Use gemini -p when:
- Analyzing entire codebases or large directories
- Comparing multiple large files
- Need to understand project-wide patterns or architecture
- Current context window is insufficient for the task
- Working with files totaling more than 100KB
- Verifying if specific features, patterns, or security measures are implemented
- Checking for the presence of certain coding patterns across the entire codebase

Important Notes

- Paths in @ syntax are relative to your current working directory when invoking gemini
- The CLI will include file contents directly in the context
- No need for --yolo flag for read-only analysis
- Gemini's context window can handle entire codebases that would overflow Claude's context
- When checking implementations, be specific about what you're looking for to get accurate results

## Memories
- no more mock data