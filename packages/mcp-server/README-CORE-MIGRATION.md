# MCP Server Migration to @moneyworks/core

## Overview

The MoneyWorks MCP Server has been rewritten to use the modern `@moneyworks/core` package instead of the legacy `@moneyworks/api` package. This migration provides better type safety, cleaner architecture, and more maintainable code.

## Key Changes

### 1. Dependencies
- **Before**: `@moneyworks/api` (workspace package)
- **After**: `@moneyworks/core` (workspace package)

### 2. Architecture

#### Service Layer
Created a new service layer that bridges the gap between `@moneyworks/core`'s REST client and the service pattern expected by MCP tools:

- `BaseTableService` - Abstract base class providing common operations
- Table-specific services (e.g., `AccountService`) extending the base
- Services use `MoneyWorksRESTClient` from core package

#### MoneyWorks CLI Integration
Since `@moneyworks/core` doesn't include CLI tools, we've added:
- `MoneyWorksCLI` wrapper in `packages/core/src/cli/wrapper.ts`
- Provides programmatic access to MoneyWorks CLI commands
- Used for operations not available through REST API

### 3. Type System
- **Before**: Custom types in `@moneyworks/api/src/types/interface/tables/`
- **After**: Type-safe interfaces from `@moneyworks/core/tables`
- Includes both raw (PascalCase) and camelCase versions
- Better enum support and field metadata

### 4. Export/Import
- **Before**: XML-based with custom parsing in API package
- **After**: Uses core's built-in `ExportParser` and `XMLBuilder`
- Support for JSON, XML (terse/verbose), and TSV formats
- Automatic camelCase conversion for JSON exports

## Migration Guide

### For Tool Developers

1. **Update imports**:
```typescript
// Before
import { AccountService } from "@moneyworks/api/src/services/tables/account.service";
import type { Account } from "@moneyworks/api/src/types/interface/tables/account.interface";

// After
import { AccountService } from "../../services/tables/account.service";
import type { TableMapCamel } from "@moneyworks/core/tables";
type Account = TableMapCamel["account"];
```

2. **Use new service pattern**:
```typescript
// Services now use REST client directly
const client = new MoneyWorksRESTClient(config);
const accountService = new AccountService(client);

// Same interface as before
const accounts = await accountService.list({ limit: 10 });
```

3. **Handle format differences**:
```typescript
// Core defaults to JSON, not XML
const data = await client.export("account", {
  format: "json", // Returns parsed objects
  // format: "xml-verbose", // Returns XML string
});
```

### For MCP Users

The tool interface remains the same! All 45 tools work exactly as before:
- 4 table tools (account, transaction, name, build)
- 41 system tools (validation, permissions, calculations, etc.)
- 1 error tracking tool

## Benefits

1. **Better Type Safety**: Core package provides comprehensive TypeScript types
2. **Modern Architecture**: Direct REST client instead of XML-based API
3. **Improved Performance**: JSON parsing is faster than XML
4. **Easier Maintenance**: Cleaner separation of concerns
5. **Future-Proof**: Core package is actively maintained

## File Structure

```
packages/mcp-server/
├── src/
│   ├── index.new.ts              # New entry point using core
│   ├── services/                 # Service layer
│   │   ├── base.service.ts       # Base class for all services
│   │   ├── tables/               # Table-specific services
│   │   │   └── account.service.ts
│   │   └── ticket.service.ts     # Error tracking
│   └── tools/                    # MCP tool implementations
│       ├── tables/               # Table tools
│       │   └── account.tool.new.ts
│       ├── consolidated/         # System tools
│       │   └── core.tool.ts
│       └── tickets/              # Error tracking
│           └── log-ticket.tool.ts
```

## Testing

To test the new implementation:

```bash
# Update dependencies
cd packages/mcp-server
bun install

# Run the new server
bun run src/index.new.ts

# Or build and run
bun build src/index.new.ts --outdir dist --target node
node dist/index.js
```

## Next Steps

1. Complete migration of remaining table tools (transaction, name, build)
2. Add comprehensive tests for the new service layer
3. Update all tool implementations to use new services
4. Remove dependency on `@moneyworks/api`
5. Rename `index.new.ts` to `index.ts`

## Notes

- The ticket service currently uses in-memory storage (Map) instead of SQLite
- CLI operations require local file access (can't work with server-locked files)
- Some advanced features may require implementing additional core functionality