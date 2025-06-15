# TypeScript Compilation Fixes

## Summary of Changes

### 1. Field Converter (src/converters/field-converter.ts)
- Removed non-existent fields from field mappings:
  - Detail table: Removed 'tags', 'colour', 'userNum', 'userText', 'flag', 'memo'
  - Account table: Removed 'inactive', 'sequenceNumber'
  - Transaction table: Removed 'contra', 'cancelled', 'colour', 'user1-8'
  - Name table: Fixed field names (e.g., 'delivery1-4' instead of 'deliveryAddr1-4')
  - Product table: Removed non-existent fields like 'minimumStock', 'maximumStock', etc.
- Removed unused 'table' parameter from generic functions

### 2. REST Types (src/rest/types.ts)
- Added index signature to AuthHeaders interface for HeadersInit compatibility

### 3. Tables Index (src/tables/index.ts)
- Added explicit export for DetailCamel type

### 4. Transaction Builder (src/import/transaction-builder.ts)
- Fixed import for DetailCamel
- Changed 'tax' field to 'taxAmount' on TransactionCamel

### 5. XML Builder (src/xml/builder.ts)
- Removed unused 'table' parameter from processRecord function
- Added Detail import
- Fixed type assertion for validateDetailFieldLengths

### 6. XML Parser (src/xml/parser.ts)
- Added missing imports (TableMap, Transaction)
- Fixed type assertions and casts
- Fixed parseBoolean parameter type to include boolean
- Fixed index access on parsed objects

### 7. Export Parser (src/export/parser.ts)
- Added TableMap import
- Fixed optional chaining for headers array
- Added unused parameter prefixes (_template, _script)

### 8. REST Client (src/rest/client.ts)
- Removed unused XMLParser import
- Added cleanHeaders method to remove undefined values from headers
- Fixed Number.parseInt calls with explicit radix
- Added type assertions for JSON parsing

### 9. REST Auth (src/rest/auth.ts)
- Removed unused username and password variables

### 10. Import Builder (src/import/builder.ts)
- Fixed XMLBuilder.validate to XMLBuilder.validateRecord

### 11. Schemas Generator (src/schemas/generator.ts)
- Changed generateZodSchema return type to z.ZodTypeAny
- Added 'as any' cast for zodToJsonSchema compatibility

All TypeScript compilation errors have been resolved while maintaining type safety where possible.