# Generate MoneyWorks Table Types

Generate comprehensive TypeScript interfaces for MoneyWorks tables by analyzing their documentation.

## Usage

```
/project:generate-mw-table-types table="<table-name>"
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
   export interface MoneyWorks[TableName] {
     // Fields with comprehensive JSDoc
   }
   ```

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

### Quality Requirements

- Every field must have comprehensive JSDoc
- Include `@example` tags where helpful
- Note any MoneyWorks-specific quirks
- Use TypeScript best practices (camelCase properties)
- Make optional fields optional with `?`
- Export all types appropriately

Save the generated TypeScript to the path specified in `outputPath`.

## Example

```
/project:generate-mw-table-types table="names"
```

This will trigger the JavaScript handler which validates the input and prepares context, then Claude will analyze the documentation and generate the interface.