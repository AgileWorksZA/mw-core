---
name: Implementing MoneyWorks Entities
description: Full-stack implementation workflow for new MoneyWorks entities (Transaction, Job, Account, etc.). Creates types in canonical, repository in data, controller in api, registers in TableRegistry, and optionally adds web routes. Use when adding new entity support to the SDK, implementing CRUD for MW tables, or scaffolding entity layers.
---

# Implementing MoneyWorks Entities

Transform a MoneyWorks table into a fully-supported SDK entity with types, repository, controller, API registration, and optional web UI. This workflow was battle-tested on Product entity implementation (PROD-001).

## Quick Start (Automated)

Use the automation scripts to generate all boilerplate files in seconds:

```bash
# Step 1: Generate all boilerplate files
bun .claude/skills/moneyworks-entity-implementation/scripts/scaffold-entity.ts \
  --entity="Transaction" \
  --table="Transaction" \
  --primaryKey="SequenceNumber" \
  --displayName="Transactions" \
  --description="Financial transaction records"

# Step 2: Update all export locations (4 files updated automatically)
bun .claude/skills/moneyworks-entity-implementation/scripts/update-exports.ts \
  --entity="Transaction"

# Step 3: Run typecheck
bun tsc --project packages/canonical/tsconfig.json --noEmit
bun tsc --project packages/data/tsconfig.json --noEmit

# Step 4: Customize generated files with actual MoneyWorks fields
# - Edit enums.ts with actual type values
# - Edit types.ts with all fields from MoneyWorks schema
# - Add numeric field list to repository postProcess()
```

**What the scripts create:**
- `packages/canonical/src/entities/{entity}/enums.ts` - Enum definitions
- `packages/canonical/src/entities/{entity}/types.ts` - TypeScript interfaces
- `packages/canonical/src/entities/{entity}/index.ts` - Barrel exports
- `packages/data/src/repositories/{entity}.repository.ts` - Data repository
- `packages/api/src/controllers/{entity}.ts` - API controller

**What update-exports.ts handles:**
1. `packages/canonical/src/index.ts` - Entity export
2. `packages/data/src/repositories/index.ts` - Repository export
3. `packages/data/src/index.ts` - Export + both factory functions
4. `packages/api/src/registry/table-registry.ts` - Controller registration

---

## Core Principle

**Follow the 7-layer stack in order.** Each layer depends on the previous. Missing the TableRegistry registration (Layer 5) is the most common mistake - it makes your entity "unavailable" despite all code being correct.

## Prerequisites

Before starting, gather:
1. **Entity name** - Exact MoneyWorks table name (e.g., "Transaction", "Job", "Account")
2. **Primary key field** - Usually "Code", "SequenceNumber", or similar
3. **Display name** - Human-readable plural (e.g., "Transactions", "Jobs")
4. **Field list** - Export sample data to discover fields

## Implementation Protocol

### Layer 1: Canonical Types

**File**: `packages/canonical/src/entities/{entity}/types.ts`

```typescript
/**
 * MoneyWorks {Entity} Type Definitions
 *
 * @moneyworks-entity {Entity}
 * @moneyworks-table {Entity}
 * @moneyworks-dsl PURE
 *
 * @ai-instruction USE ONLY MoneyWorks field names. NEVER translate.
 */

import type { AccountCode } from "@moneyworks/utilities";

export interface MoneyWorks{Entity} {
  /** Primary key field */
  {PrimaryKey}: string;

  // Add all fields from MoneyWorks schema...
}

export interface MoneyWorks{Entity}CreateInput {
  // Required fields for creation
}

export interface MoneyWorks{Entity}UpdateInput {
  // Optional fields for updates
}

export interface MoneyWorks{Entity}Filter {
  // Query filter options
}
```

**Also create**: `packages/canonical/src/entities/{entity}/enums.ts` if entity has enumerated types.

**Export**: Add to `packages/canonical/src/entities/{entity}/index.ts`:
```typescript
export * from "./types";
export * from "./enums";
```

### Layer 2: Repository

**File**: `packages/data/src/repositories/{entity}.repository.ts`

```typescript
/**
 * MoneyWorks {Entity} Repository
 *
 * @moneyworks-entity {Entity}
 * @moneyworks-dsl PURE
 */

import type {
  MoneyWorks{Entity},
  MoneyWorks{Entity}CreateInput,
  MoneyWorks{Entity}UpdateInput,
} from "@moneyworks/canonical/entities/{entity}";
import { BaseMoneyWorksRepository } from "./base.repository";

export class {Entity}Repository extends BaseMoneyWorksRepository<
  MoneyWorks{Entity},
  MoneyWorks{Entity}CreateInput,
  MoneyWorks{Entity}UpdateInput
> {
  protected readonly tableName = "{Entity}";
  protected readonly primaryKey = "{PrimaryKey}";

  protected postProcess(record: any): MoneyWorks{Entity} {
    // Parse numeric fields, add branded types
    const numericFields = ["Hash", "Flags", /* ... */];
    const processed: any = { ...record };

    for (const field of numericFields) {
      if (processed[field] !== undefined) {
        processed[field] = Number(processed[field]) || 0;
      }
    }

    return processed as MoneyWorks{Entity};
  }

  protected prepare(input: MoneyWorks{Entity}CreateInput | MoneyWorks{Entity}UpdateInput): any {
    // Convert typed input back to MW format
    return { ...input };
  }

  // Add specialized query methods (findByX, searchByY, etc.)
}
```

### Layer 3: Export Repository

**File**: `packages/data/src/repositories/index.ts` - Add export:
```typescript
export { {Entity}Repository } from "./{entity}.repository";
```

**File**: `packages/data/src/index.ts` - Add export:
```typescript
export { {Entity}Repository } from "./repositories/{entity}.repository";
```

### Layer 4: Controller

**File**: `packages/api/src/controllers/{entity}.ts`

```typescript
/**
 * {Entity} Controller
 *
 * @moneyworks-dsl PURE
 */

import type { SmartMoneyWorksClient } from "@moneyworks/data";
import { {Entity}Repository } from "@moneyworks/data";
import { BaseTableController, type TableExportParams } from "./base-table";

export class {Entity}Controller extends BaseTableController {
  readonly tableName = "{Entity}";
  readonly displayName = "{DisplayName}";
  readonly description = "{Description of entity in MoneyWorks}";
  private repo: {Entity}Repository;

  constructor(client: SmartMoneyWorksClient) {
    super(client);
    this.repo = new {Entity}Repository(client);
  }

  protected getPrimaryKey(): string {
    return "{PrimaryKey}";
  }

  protected validateTableSpecific(params: TableExportParams): void {
    // Add entity-specific validation if needed
  }
}
```

### Layer 5: TableRegistry Registration (CRITICAL)

**File**: `packages/api/src/registry/table-registry.ts`

```typescript
// Add import at top
import { {Entity}Controller } from "../controllers/{entity}";

// In registerTables() method, add:
this.register(new {Entity}Controller(this.client));

// Remove from 'upcoming' array if present
private upcoming = [
  // "Entity",  <-- REMOVE if it was here
];
```

**Why this matters**: Without registration, `/api/v1/tables` won't list your entity and all API calls will return 404. This is the #1 missed step (documented in Weave as Q:painpoint-table-registry).

### Layer 6: Web Routes (Optional)

**List Route**: `packages/web1/app/routes/{entity}.tsx`
**Detail Route**: `packages/web1/app/routes/{entity}.$code.tsx`

Follow patterns from `products.tsx` and `products.$code.tsx`.

### Layer 7: Route Registration & Navigation (Optional)

**File**: `packages/web1/app/routes.ts`
```typescript
route("{entity}", "routes/{entity}.tsx"),
route("{entity}/:code", "routes/{entity}.$code.tsx"),
```

**Navigation**: Add link in `packages/web1/app/components/navigation.tsx`

## Verification Checklist

```bash
# 1. TypeScript compilation
bun run typecheck

# 2. API server starts
cd packages/api && bun run dev

# 3. Entity appears in available tables
curl http://localhost:3400/api/v1/tables \
  -H "Authorization: Bearer $TOKEN"
# Should show "{Entity}" in "available" array

# 4. Data export works
curl "http://localhost:3400/api/v1/tables/{Entity}?limit=5" \
  -H "Authorization: Bearer $TOKEN"

# 5. Schema endpoint works
curl "http://localhost:3400/api/v1/tables/{Entity}/schema" \
  -H "Authorization: Bearer $TOKEN"
```

## Critical Learnings from PROD-001

| ID | Issue | Solution |
|----|-------|----------|
| L-001 | TSV field order differs from XML | Create `{ENTITY}_TSV_FIELD_MAPPING` constant with correct field order |
| L-002 | Type fields use character codes | Parse as strings ('P', 'S', 'A'), not numbers |
| L-003 | Elysia error handler doesn't propagate | Add try/catch in route handlers for MW query errors |
| L-004 | MoneyWorks query syntax | Use function-based: `left(Code,2)="BA"` not SQL-like CONTAINS |

## TSV Field Mapping Discovery

When TSV parsing fails or fields are misaligned:

```bash
# Export one record with headers
curl "http://localhost:3400/api/v1/tables/{Entity}?format=compact-headers&limit=1" \
  -H "Authorization: Bearer $TOKEN"
```

Parse the header row to get exact field order, then create:

```typescript
export const {ENTITY}_TSV_FIELD_MAPPING: string[] = [
  "Field1",
  "Field2",
  // ... exact order from TSV headers
];
```

## Common Pitfalls

1. **Forgetting TableRegistry** - Entity works locally but API returns "not available"
2. **Wrong field order in TSV mapping** - Data parses but values are in wrong columns
3. **Type field as number** - MoneyWorks uses single characters ('P', 'S'), not enum numbers
4. **Missing package exports** - Repository created but not exported from index.ts
5. **Not running typecheck** - Type errors discovered in production

## Files Affected (Complete List)

**Canonical** (types):
- `packages/canonical/src/entities/{entity}/types.ts`
- `packages/canonical/src/entities/{entity}/enums.ts`
- `packages/canonical/src/entities/{entity}/index.ts`

**Data** (repository):
- `packages/data/src/repositories/{entity}.repository.ts`
- `packages/data/src/repositories/index.ts`
- `packages/data/src/index.ts`
- `packages/data/src/parsers/moneyworks-field-mappings.ts` (TSV mapping)

**API** (controller + registry):
- `packages/api/src/controllers/{entity}.ts`
- `packages/api/src/registry/table-registry.ts` (CRITICAL)

**Web** (optional):
- `packages/web1/app/routes/{entity}.tsx`
- `packages/web1/app/routes/{entity}.$code.tsx`
- `packages/web1/app/routes.ts`
- `packages/web1/app/components/navigation.tsx`

## Reference Implementations

Use these as templates:
- **Account** (ACCT-001): Complete full-stack implementation with specialized query methods
- **Product** (PROD-001): Full implementation with all layers
- **TaxRate**: Simpler entity, good for reference
- **Name**: Contact/customer entity with complex fields

## Success Metrics

Implementation is complete when:
- [ ] TypeScript compiles with zero errors
- [ ] Entity appears in `/api/v1/tables` "available" array
- [ ] Data export returns properly structured records
- [ ] Schema endpoint returns field definitions
- [ ] Web routes render list and detail views (if applicable)
- [ ] Loom story updated with completed status

## When to Use This Skill

- Implementing new MoneyWorks entities: Transaction, Job, Account, StockMovement
- Adding CRUD support for additional MW tables
- Scaffolding entity support for Loom stories
- Extending SDK with new data entities
