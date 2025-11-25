---
name: moneyworks-api-testing
description: Test MoneyWorks REST API endpoints during development. Use when verifying entity implementations, discovering table fields, debugging API responses, testing MWScript expressions, or generating TypeScript interfaces from schemas. Invoke when user asks to test API, check tables, export data, or discover fields.
---

# MoneyWorks API Testing

Quick CLI tools for testing the MoneyWorks REST API during development. Use these scripts to verify entity implementations, discover field structures, and debug issues.

## Prerequisites

1. **API Server Running**: Start with `bun run api` from project root (port 3400)
2. **Bearer Token**: Get from authentication or set in environment

## Token Configuration

Scripts read the token in this priority order:
1. `--token=xxx` command line argument
2. `MW_TOKEN` environment variable
3. `.env` file in project root (`MW_TOKEN=xxx`)

## Quick Reference

| Script | Purpose | Example |
|--------|---------|---------|
| `health.ts` | Check API connectivity | `bun health.ts` |
| `tables.ts` | List available tables | `bun tables.ts` |
| `schema.ts` | Get table schema | `bun schema.ts --table=Account` |
| `export.ts` | Export table data | `bun export.ts --table=Account --limit=5` |
| `labels.ts` | Get field labels | `bun labels.ts --table=Account` |
| `discover-fields.ts` | Generate TypeScript interface | `bun discover-fields.ts --table=Job` |
| `mwscript.ts` | Execute MWScript expression | `bun mwscript.ts --expr="1+1"` |
| `template.ts` | Evaluate template against table | `bun template.ts --table=Account --template="[Code]"` |

## Scripts

### health.ts - Check API Health

```bash
bun .claude/skills/moneyworks-api-testing/scripts/health.ts

# Output:
# API Status: healthy
# MoneyWorks: ok
# Uptime: 12345ms
```

### tables.ts - List Available Tables

```bash
bun .claude/skills/moneyworks-api-testing/scripts/tables.ts

# Output:
# Available Tables (8):
#   - Account
#   - Name
#   - Product
#   - TaxRate
#   - Transaction
#   ...
#
# Upcoming Tables (3):
#   - Job
#   - StockMovement
#   ...
```

### schema.ts - Get Table Schema

```bash
bun .claude/skills/moneyworks-api-testing/scripts/schema.ts --table=Account

# Options:
#   --table=Name     Table name (required)
#   --format=json    Output format: json, table (default: table)

# Output shows field names, types, constraints
```

### export.ts - Export Table Data

```bash
# Basic export (5 records, JSON)
bun .claude/skills/moneyworks-api-testing/scripts/export.ts --table=Account --limit=5

# With filter
bun .claude/skills/moneyworks-api-testing/scripts/export.ts --table=Account --filter='left(Code,2)="BA"'

# Different formats
bun .claude/skills/moneyworks-api-testing/scripts/export.ts --table=Account --format=compact-headers
bun .claude/skills/moneyworks-api-testing/scripts/export.ts --table=Account --format=schema

# Options:
#   --table=Name     Table name (required)
#   --limit=100      Max records (default: 100)
#   --offset=0       Skip records (default: 0)
#   --filter=expr    MoneyWorks filter expression
#   --format=fmt     compact, compact-headers, full, schema (default: full)
#   --orderBy=field  Sort field
```

### labels.ts - Get Field Labels

```bash
bun .claude/skills/moneyworks-api-testing/scripts/labels.ts --table=Account

# Options:
#   --table=Name     Table name (required)
#   --lang=en        Language code (default: en)

# Output shows field names with human-readable labels
```

### discover-fields.ts - Generate TypeScript Interface

**High-value script** - Generates TypeScript interface from MoneyWorks schema:

```bash
bun .claude/skills/moneyworks-api-testing/scripts/discover-fields.ts --table=Job

# Options:
#   --table=Name        Table name (required)
#   --primaryKey=Code   Primary key field (default: Code)
#   --output=file.ts    Write to file instead of stdout

# Output:
# /**
#  * MoneyWorks Job Entity
#  * @moneyworks-entity Job
#  */
# export interface MoneyWorksJob {
#   /** @moneyworks-field Code @moneyworks-type T(15) */
#   Code: string;
#   /** @moneyworks-field Description @moneyworks-type T(255) */
#   Description?: string;
#   // ... all fields with types and JSDoc
# }
```

This is extremely useful when implementing new entities - run this first to get the TypeScript interface, then customize.

### mwscript.ts - Execute MWScript Expression

```bash
# Simple expression
bun .claude/skills/moneyworks-api-testing/scripts/mwscript.ts --expr="1+1"

# Date functions
bun .claude/skills/moneyworks-api-testing/scripts/mwscript.ts --expr="Today()"

# Options:
#   --expr=string    MWScript expression to evaluate (required)

# Output:
# Expression: 1+1
# Result: 2
# Data Type: number
# Execution Time: 12.34ms
```

### template.ts - Evaluate Template Against Table

```bash
bun .claude/skills/moneyworks-api-testing/scripts/template.ts \
  --table=Account \
  --template="[Code] - [Description]" \
  --limit=5

# With filter
bun .claude/skills/moneyworks-api-testing/scripts/template.ts \
  --table=Account \
  --template="[Code]: [Description]" \
  --filter='Active=true'

# Options:
#   --table=Name       Table name (required)
#   --template=str     Template with [FieldName] placeholders (required)
#   --limit=100        Max records (default: 100)
#   --filter=expr      MoneyWorks filter expression

# Output:
# Results (5 records):
#   1001 - Cash at Bank
#   1002 - Accounts Receivable
#   ...
```

## Integration with Entity Implementation

These scripts integrate with the entity implementation workflow:

```bash
# 1. Check if table is available
bun .claude/skills/moneyworks-api-testing/scripts/tables.ts

# 2. Discover field structure
bun .claude/skills/moneyworks-api-testing/scripts/discover-fields.ts --table=Job > job-types.ts

# 3. Scaffold entity with discovered types
bun .claude/skills/moneyworks-entity-implementation/scripts/scaffold-entity.ts --entity=Job

# 4. Verify implementation
bun .claude/skills/moneyworks-api-testing/scripts/export.ts --table=Job --limit=3
```

## Common Use Cases

### Verify Entity Registration
After implementing a new entity, verify it's available:
```bash
bun tables.ts | grep Account
# Should show Account in "Available" section
```

### Debug Filter Expressions
Test MWScript filter syntax before using in code:
```bash
bun export.ts --table=Account --filter='left(Code,2)="BA"' --limit=3
```

### Explore Table Structure
Before implementing types, see what fields exist:
```bash
bun schema.ts --table=Transaction --format=json | jq '.fields[] | {name, type}'
```

### Generate Type Definitions
Automatically create TypeScript interface:
```bash
bun discover-fields.ts --table=StockMovement --primaryKey=SequenceNumber > stock-movement.ts
```

## Troubleshooting

### "No token provided"
Set the token via one of:
- `--token=YOUR_TOKEN` argument
- `export MW_TOKEN=YOUR_TOKEN`
- Add `MW_TOKEN=YOUR_TOKEN` to `.env` file

### "Connection refused"
Ensure API server is running: `bun run api`

### "Table not found"
Check available tables: `bun tables.ts`
The table might be in "upcoming" (not yet implemented).

### "Invalid filter expression"
MoneyWorks uses function-based syntax:
- Correct: `left(Code,2)="BA"`
- Wrong: `Code LIKE "BA%"`

Use `mwscript.ts` to test expressions before using in filters.
