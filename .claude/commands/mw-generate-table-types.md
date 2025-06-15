# Generate MoneyWorks Table Types

Generate comprehensive TypeScript interfaces for MoneyWorks tables by analyzing their documentation.

## Usage

```
/project:mw-generate-table-types table="<table-name>"
```

## Arguments

- `table` (required): The name of the MoneyWorks table (e.g., "names", "accounts", "transactions")

## Description

This command analyzes MoneyWorks table documentation to generate type-rich TypeScript interfaces. The JavaScript component handles validation and context preparation, while Claude performs the documentation analysis and type generation.

## Implementation Instructions

When the command executes, you will receive a context object with:

1. **action**: Whether to "create" or "update" an existing interface
2. **documentationUrl**: The URL to fetch and analyze
3. **outputPath**: Where to save the generated TypeScript file
4. **patterns**: Common and table-specific patterns to apply
5. **relatedTables**: Other tables that reference this one

### Generation Process

1. **Fetch the Documentation**
   - Use WebFetch or similar tool to get the HTML content from `documentationUrl`
   - Parse the table structure and field definitions

2. **Analyze Table Structure**
   - Identify all fields with their types (T=Text, N=Numeric, D=Date, etc.)
   - Note field lengths, constraints, and special behaviors
   - Pay special attention to the patterns provided in the context

3. **Generate TypeScript Interface**
   ```typescript
   /**
    * MoneyWorks [TableName] Table Interface
    * [Comprehensive description from documentation]
    * 
    * @see [documentationUrl]
    */
   export interface [TableName] {
     // Fields with comprehensive JSDoc
   }
   ```
   
   **Important**: Name the interface with just the singular table name (e.g., `Name`, not `MoneyWorksName`)

4. **Create Enums for Coded Fields**
   - Use the `examples.enumPattern` if provided
   - Create enums for fields with specific allowed values
   - Include JSDoc for each enum value

5. **Generate Helper Functions**
   - If `patterns.specific.hasFlags` is true, create flag encoding/decoding helpers
   - Use the `examples.flagHelpers` pattern if provided

6. **Handle Special Cases**
   - Apply table-specific exceptions from `patterns.specific.exceptionalFields`
   - Handle related tables appropriately
   - Note any unique behaviors in JSDoc comments

### Field Type Mapping

- **T (Text)**: `string` with `@maxLength` JSDoc
- **N (Numeric)**: `number` with precision info
- **D (Date)**: `Date | string` with format notes
- **A (Alphanumeric)**: `string` with pattern constraints
- **S (Special/Timestamp)**: `string` (ISO format)
- **B (Boolean)**: `boolean` or `0 | 1` depending on context

### Field Naming Convention

**IMPORTANT**: Use exact MoneyWorks field names (PascalCase) for API compatibility:
- `Code` not `code`
- `CustomerType` not `customerType`
- `CreditLimit` not `creditLimit`

### Generate Two Interfaces

1. **Raw Interface** - Exact MoneyWorks field names:
   ```typescript
   export interface [TableName] {
     Code: string;
     Name: string;
     CustomerType: NameType;
     // etc...
   }
   ```

2. **CamelCase Interface** - Developer-friendly version:
   ```typescript
   export interface [TableName]Camel {
     code: string;
     name: string;
     customerType: NameType;
     // etc...
   }
   ```

3. **Conversion Utilities**:
   ```typescript
   export const [tableName]Converters = {
     toCamelCase(raw: [TableName]): [TableName]Camel { ... },
     fromCamelCase(camel: [TableName]Camel): [TableName] { ... }
   };
   ```

### Group Related Fields

For fields that are logically grouped (like balances), create sub-interfaces:
```typescript
export interface CreditorBalances {
  Current: number;
  Days30: number;
  Days60: number;
  Days90Plus: number;
}

// In the main interface:
CreditorBalances?: CreditorBalances;
```

### Add Relationship Metadata

For fields that reference other tables, add JSDoc annotations:
```typescript
/**
 * Sales person code
 * @maxLength 5
 * @relationship References User.Code
 */
SalesPerson?: string;
```

### Quality Requirements

- Every field must have comprehensive JSDoc
- Include `@example` tags where helpful
- Note any MoneyWorks-specific quirks
- Use exact MoneyWorks field names for the raw interface
- Make optional fields optional with `?`
- Export all types and utilities appropriately
- Add `@relationship` tags for foreign key fields

Save the generated TypeScript to the path specified in `outputPath`.

### Update Index File

After generating the table interface, update `packages/core/src/tables/index.ts`:

1. Import the new interface:
   ```typescript
   import type { [TableName] } from "./[table-name]";
   ```

2. Add to `TableName` union:
   ```typescript
   export type TableName = "Name" | "[TableName]"; // Add your table
   ```

3. Add to `tableNames` array:
   ```typescript
   export const tableNames = ["Name", "[TableName]"] as const;
   ```

4. Add to `TableMap` interface:
   ```typescript
   export interface TableMap {
     Name: Name;
     [TableName]: [TableName]; // Add your mapping
   }
   ```

5. Add to `tablePrimaryKeys`:
   ```typescript
   export const tablePrimaryKeys = {
     Name: "Code", // Use exact MoneyWorks field name
     [TableName]: "[PrimaryKeyField]", // Add primary key field
   } as const;
   ```

6. Export the type:
   ```typescript
   export type { [TableName] } from "./[table-name]";
   ```

## Example

```
/project:mw-generate-table-types table="names"
```

This will trigger the JavaScript handler which validates the input and prepares context, then Claude will analyze the documentation and generate the interface.