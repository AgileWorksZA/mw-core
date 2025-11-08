# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **MoneyWorks Core** monorepo - a comprehensive TypeScript toolkit for integrating with MoneyWorks accounting software. The project uses Bun workspaces and consists of multiple packages providing data access, APIs, CLI tools, and web interfaces.

**Working Directory Note**: You are currently in `/packages`. The repository root is `/Users/hgeldenhuys/WebstormProjects/mw-core/`.

## Common Commands

All commands should be run from the **repository root** (one level up from packages/).

### Development
```bash
# Start development servers
bun run mw              # CLI interface
bun run api             # ElysiaJS REST API (port 3002)
bun run web             # React Router v7 web app
bun run mcp             # MCP server for AI agents

# Start multiple services
bun run api & bun run web  # API + Web together
```

### Testing
```bash
bun test                # Run all tests
bun test <file>         # Run specific test file
```

### Building
```bash
# Most packages run directly from TypeScript with Bun
bun run build:all       # Only web1 needs building for production
bun run build:cli       # Compile CLI to standalone binary
bun run mcp:build       # Build MCP server
```

### Type Checking
```bash
bun run typecheck       # Type check all packages
cd packages/api && bun run typecheck   # Check specific package
```

## Architecture Overview

### Package Structure

This is a **Bun workspace monorepo** with the following packages:

- **`@moneyworks/canonical`** - Pure MoneyWorks type definitions and domain models
  - Never contaminated by external business logic
  - Preserves exact MoneyWorks terminology (GST, TaxCode, RecAccount, etc.)
  - Uses branded types (YYYYMMDD, AccountCode)

- **`@moneyworks/data`** - Data access layer
  - REST client for MoneyWorks API
  - Repository pattern for entities
  - Parsers for different export formats (compact, full, schema-enriched)
  - Located at: `packages/data/src/`

- **`@moneyworks/utilities`** - Shared utilities
  - Date helpers (YYYYMMDD branded type)
  - JSON revivers and serializers
  - Common helper functions

- **`@moneyworks/api`** - ElysiaJS REST API server
  - Swagger documentation at `/swagger`
  - CORS enabled
  - Controllers, routes, schemas, middleware
  - Port: 3002 (configurable)

- **`@moneyworks/web1`** - React Router v7 web application
  - Uses React Router v7 with explicit route configuration
  - Clerk authentication
  - TanStack Query for data fetching
  - shadcn/ui components with Tailwind CSS
  - SQLite database for app state

- **`@moneyworks/cli`** - Command-line interface
  - Testing and data export/import
  - Interactive REPL for MoneyWorks operations

- **`@moneyworks/mcp-server`** - Model Context Protocol server
  - Enables AI agents to interact with MoneyWorks
  - Built on MCP SDK

- **`@moneyworks/chat`** - Chat/conversational interface components

- **`@moneyworks/documentation`** - Project documentation

### Key Architectural Patterns

1. **Workspace Dependencies**: Packages reference each other using `workspace:*`
   ```typescript
   import { MoneyWorksRestClient } from "@moneyworks/data/client";
   ```

2. **Canonical DSL Approach**: Never translate MoneyWorks terminology
   - Use `TaxCode` not `taxId`
   - Use `RecAccount` not `accountReceivable`
   - Preserve date format: YYYYMMDD
   - Keep exact field names from MoneyWorks

3. **Multiple Export Formats**:
   - `compact`: Raw arrays for minimal overhead
   - `compact-headers`: Arrays with field names in first row
   - `full`: Complete objects with field names
   - `schema`: Includes metadata, types, constraints

4. **Branded Types**: Type-safe wrappers for domain concepts
   ```typescript
   type YYYYMMDD = string & { readonly __brand: "YYYYMMDD" };
   type AccountCode = string & { readonly __brand: "AccountCode" };
   ```

## MoneyWorks Configuration

MoneyWorks connection settings are stored in `mw-config.json` at repository root:
```json
{
  "host": "localhost",
  "port": 6710,
  "dataFile": "acme.moneyworks",
  "username": "Herman Geldenhuys",
  "password": "",
  "folderPassword": "",
  "folderName": ""
}
```

**Never commit sensitive credentials to version control.**

## TypeScript Configuration

- Base config: `tsconfig.base.json` at repository root
- Each package has its own `tsconfig.json` extending the base
- Path mappings defined for cross-package imports
- Target: ES2022, Module: ES2022
- Uses Bun types by default

## React Router v7 Specifics (web1 package)

### Critical API Changes
- **Use `data()` not `json()`** for responses in loaders/actions
  ```typescript
  // Correct
  import { data } from "react-router";
  return data({ message: "Hello" });
  ```

### Running with Bun
- Use `bun --bun run` prefix for scripts requiring Bun runtime
- Dev command: `bun --bun run react-router dev`
- `bun:sqlite` imports only work with Bun runtime

### Routing
- Explicit route configuration in `app/routes.ts`
- No automatic file-based routing
- Routes must be manually registered

### Tailwind CSS
- Use ES modules syntax (no `require()` calls)
- Remove `require("tailwindcss-animate")` to avoid ESM issues

## Testing Strategy

- Use real MoneyWorks data structures in tests
- Mock at HTTP level, not client level
- Test behavior, not implementation
- Ensure export formats produce equivalent data
- Test files use `.test.ts` or `.spec.ts` suffix

## Development Workflow

1. **Starting Development**:
   ```bash
   cd /Users/hgeldenhuys/WebstormProjects/mw-core
   bun install
   # Configure mw-config.json if needed
   bun run api  # or mw, web, mcp
   ```

2. **Making Changes**:
   - Always run `bun run typecheck` before committing
   - Maintain canonical DSL purity (no terminology translation)
   - Use full package import paths: `@moneyworks/package/module`
   - Avoid circular dependencies

3. **Adding New Entities**:
   - Define types in `@moneyworks/canonical`
   - Add parsers in `@moneyworks/data`
   - Create repository if needed
   - Update API routes and controllers
   - Add UI components in web1

## Import Patterns

```typescript
// ✅ Correct: Full package imports between packages
import { MoneyWorksRestClient } from "@moneyworks/data/client";
import { MONEYWORKS_TAX_RATE_FIELDS } from "@moneyworks/canonical/entities/tax-rate";

// ✅ Correct: Relative imports within same package
import { parseCompactArray } from "./parsers/compact";

// ❌ Incorrect: Don't use relative paths for cross-package imports
import { MoneyWorksRestClient } from "../../data/src/client";
```

## Naming Conventions

- **Interfaces**: `MoneyWorks{Entity}` (e.g., `MoneyWorksTaxRate`)
- **Types**: Descriptive names (e.g., `ExportFormat`, `ImportResult`)
- **Methods**: Verb-first (e.g., `findByKey`, `validateTaxCode`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MONEYWORKS_TAX_RATE_FIELDS`)
- **Files**: kebab-case (e.g., `tax-rate.repository.ts`)

## Common Tasks

### Adding a New API Endpoint
1. Define schema in `packages/api/src/schemas/`
2. Create controller in `packages/api/src/controllers/`
3. Add route in `packages/api/src/routes/`
4. Register route in `packages/api/src/app.ts`

### Adding a New Repository
1. Define entity types in `packages/canonical/src/entities/`
2. Create repository in `packages/data/src/repositories/`
3. Add tests in same directory with `.test.ts` suffix
4. Export from `packages/data/src/index.ts`

### Working with Web1
1. Create route file in `packages/web1/app/routes/`
2. Register in `packages/web1/app/routes.ts`
3. Add UI components in `packages/web1/app/components/`
4. Use shadcn/ui components (never use `alert()` or `confirm()`)
5. Use toast notifications for feedback

## Environment Variables

Check `.env.example` files in relevant packages:
- Root `.env.example`: ElevenLabs API configuration
- Individual package `.env.example` files for package-specific config

## Port Allocations

- API server: 3002 (ElysiaJS)
- Web app: Configured in React Router (typically 5173 in dev)
- MoneyWorks REST API: 6710 (default)

## Key Files to Reference

- Design principles: `/CLAUDE.md` (repository root)
- Package metadata: `package.json` in each package
- TypeScript config: `tsconfig.base.json`, per-package `tsconfig.json`
- MoneyWorks config: `mw-config.json`

## Anti-Patterns to Avoid

- ❌ Don't translate MoneyWorks terminology (GST → VAT, TaxCode → taxId)
- ❌ Don't use `alert()` or `confirm()` in web UI (use shadcn dialogs)
- ❌ Don't create circular dependencies between packages
- ❌ Don't use relative imports for cross-package references
- ❌ Don't commit builds to version control (except dist/ for distribution)
- ❌ Don't mock data in initial implementations (code should work first time)

## Documentation

JSDoc comments should include:
- Clear description of purpose
- `@param` tags for all parameters
- `@returns` description
- `@example` where helpful
- `@ai-instruction` for AI-specific guidance
- `@ai-critical` for critical information

## Code Style

- Prefer `for` loops over `forEach`
- Use TypeScript for all new code
- Follow existing project conventions
- Use async/await over promise chains
- Leverage Bun's built-in APIs where possible
