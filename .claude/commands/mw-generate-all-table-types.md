# Generate All MoneyWorks Table Types

Generate TypeScript interfaces for all MoneyWorks tables in a single operation.

## Usage

```
/project:mw-generate-all-table-types
```

Or to generate specific tables:

```
/project:mw-generate-all-table-types tables="names,accounts,products"
```

## Arguments

- `tables` (optional): Comma-separated list of table names to generate. If not provided, generates all tables.

## Description

This command orchestrates the generation of TypeScript interfaces for multiple MoneyWorks tables by calling the individual `mw-generate-table-types` command for each table.

## Implementation Instructions

Since Claude commands cannot directly call other commands programmatically, when this command is executed:

1. **Sequential Processing**
   For each table in the list, manually execute:
   ```
   /project:mw-generate-table-types table="[table-name]"
   ```

2. **Tables to Process** (in recommended order):
   - `names` - Customer/Supplier records
   - `accounts` - Chart of accounts
   - `transactions` - Financial transactions
   - `products` - Products/Services
   - `jobs` - Job/Project tracking
   - `contacts` - Additional contacts for names
   - `assets` - Fixed assets
   - `departments` - Department codes
   - `inventory` - Inventory locations/counts
   - `job-sheet-items` - Job sheet line items
   - `tax-rate` - Tax rate definitions

3. **After Each Table Generation**:
   - Verify the generated file compiles correctly
   - Check that the interface follows the established patterns
   - Ensure the index.ts file is updated

4. **Final Steps**:
   - Run full type checking: `bun run tsc --noEmit`
   - Run linter: `bun run biome check packages/core/src/tables`
   - Verify all exports in index.ts

## Process Flow

```
Start
  ↓
For each table:
  ↓
1. Generate types using mw-generate-table-types
  ↓
2. Update index.ts imports and exports
  ↓
3. Verify compilation
  ↓
Next table
  ↓
Final verification and cleanup
  ↓
Done
```

## Quality Checklist

For each generated table, ensure:

- [ ] Raw interface uses exact MoneyWorks field names (PascalCase)
- [ ] CamelCase companion interface is generated
- [ ] Converter utilities are implemented
- [ ] All fields have comprehensive JSDoc
- [ ] Foreign key relationships have @relationship tags
- [ ] Related fields are grouped into sub-interfaces where appropriate
- [ ] Enums are created for coded fields
- [ ] Helper functions are implemented for complex fields
- [ ] The interface is exported in index.ts
- [ ] TableMap and TableMapCamel are updated
- [ ] tablePrimaryKeys includes the correct primary key field

## Example Execution

To generate all tables:

1. Execute this command: `/project:mw-generate-all-table-types`
2. The command will guide you through generating each table
3. After all tables are generated, it will provide a summary

To generate specific tables:

```
/project:mw-generate-all-table-types tables="accounts,transactions"
```

This will only generate the accounts and transactions tables.