# MoneyWorks Export/Import System Design

## Overview

This document describes the design and implementation of the MoneyWorks Export/Import system in the `@moneyworks/core` package. The system provides a type-safe TypeScript interface for interacting with the MoneyWorks REST API, supporting multiple export formats and optional validation.

## Architecture

### Core Components

1. **REST Client** - Handles authentication and HTTP communication
2. **Export System** - Supports XML (terse/verbose), TSV, and custom templates
3. **Import System** - Builds type-safe import documents
4. **XML Parser/Builder** - Converts between TypeScript objects and XML
5. **JSON Schema Generator** - Creates schemas for optional validation
6. **Type Converters** - Handles camelCase/PascalCase conversions

### Authentication

MoneyWorks supports two-level authentication:
- **Document Level**: Username/password for the MoneyWorks document
- **Folder Level**: Optional folder-level security

Both are handled via HTTP Basic Authentication headers.

## Export Formats

### 1. XML Formats
- **xml-terse**: Compact XML with minimal whitespace
- **xml-verbose**: Formatted XML with indentation

### 2. TSV Format
Tab-separated values for spreadsheet compatibility

### 3. Custom Templates
- String templates with field placeholders: `[FieldName]`
- MWScript expressions: `GetNameField([NameCode], "Name")`
- Subfile iteration: `{[Detail.Account]: [Detail.Description]}`

## Implementation

### Directory Structure

```
packages/core/src/
├── rest/
│   ├── client.ts         # Main REST client
│   ├── auth.ts          # Authentication handling
│   └── types.ts         # REST-specific types
├── export/
│   ├── builder.ts       # Export query builder
│   ├── parser.ts        # Format parsers
│   └── template.ts      # Template utilities
├── import/
│   ├── builder.ts       # Import document builder
│   └── validator.ts     # Optional validation
├── xml/
│   ├── parser.ts        # XML to TypeScript
│   └── builder.ts       # TypeScript to XML
├── schemas/
│   ├── generator.ts     # JSON Schema generator
│   └── [table].schema.json  # Generated schemas
└── converters/
    └── field-converter.ts  # Enhanced converters
```

### Key Interfaces

```typescript
// Configuration
export interface MoneyWorksConfig {
  host: string;
  port: number;
  dataFile: string;
  username: string;
  password: string;
  folderPassword?: string;
  folderName?: string;
  useSSL?: boolean;
}

// Export formats
export type ExportFormat = 
  | 'xml-terse' 
  | 'xml-verbose' 
  | 'tsv'
  | { template: string }
  | { script: string };

// Export options
export interface ExportOptions<T extends TableName> {
  format?: ExportFormat;
  filter?: string;      // MoneyWorks filter syntax
  fields?: (keyof TableMapCamel[T])[];
  start?: number;
  limit?: number;
  orderBy?: string;
}

// Import options
export interface ImportOptions {
  mode?: 'create' | 'update' | 'upsert';
  validate?: boolean;
  workItOut?: string[];
  calculated?: Record<string, string>;
}
```

## Usage Examples

### Basic Export

```typescript
import { MoneyWorksRESTClient } from '@moneyworks/core';

const client = new MoneyWorksRESTClient({
  host: 'localhost',
  port: 6710,
  dataFile: 'acme.moneyworks',
  username: 'admin',
  password: 'password'
});

// Export all customers
const customers = await client.export('Name', {
  format: 'xml-verbose',
  filter: 'Type=1'
});
```

### Custom Template Export

```typescript
// Define a custom invoice template
const invoiceTemplate = `
Invoice: [OurRef]
Date: [TransDate]
Customer: [NameCode]

Items:
{[Detail.Description]: $[Detail.Gross]}

Total: $[Gross]
`;

const invoices = await client.export('Transaction', {
  format: { template: invoiceTemplate },
  filter: 'TypeCode="DI" and Period=7'
});
```

### Import with Validation

```typescript
import { ImportBuilder } from '@moneyworks/core';

// Create import builder with validation
const builder = new ImportBuilder('Product', { validate: true });

// Add products
builder
  .add({
    code: 'PROD001',
    description: 'Widget',
    sellPrice: 99.99,
    sellUnit: 'EA'
  })
  .add({
    code: 'PROD002',
    description: 'Gadget',
    sellPrice: 149.99,
    sellUnit: 'EA'
  });

// Execute import
const result = await client.import('Product', builder);
```

### Transaction with Details

```typescript
import { TransactionBuilder } from '@moneyworks/core';

const transaction = new TransactionBuilder()
  .setHeader({
    nameCode: 'CUST001',
    transDate: new Date(),
    description: 'Invoice #1234'
  })
  .addDetail({
    account: '4100',
    gross: 1000,
    tax: 100,
    description: 'Consulting services'
  })
  .addDetail({
    account: '1100',
    debit: 1100,
    description: 'Payment received'
  });

await client.import('Transaction', [transaction.build()]);
```

## JSON Schema Validation

### Generating Schemas

```bash
# Generate all schemas
bun run generate:schemas

# Schemas are created in packages/core/src/schemas/
```

### Using Schemas

```typescript
import { Validator } from '@moneyworks/core';
import nameSchema from '@moneyworks/core/schemas/name.schema.json';

// Option 1: Built-in validator
const validator = new Validator();
const isValid = validator.validate('Name', customerData);

// Option 2: Direct AJV usage
import Ajv from 'ajv';
const ajv = new Ajv();
const validate = ajv.compile(nameSchema);

if (validate(customerData)) {
  console.log('Valid customer data');
} else {
  console.log('Validation errors:', validate.errors);
}
```

## Error Handling

```typescript
import { MoneyWorksError, ImportError, ExportError } from '@moneyworks/core';

try {
  await client.import('Name', records);
} catch (error) {
  if (error instanceof ImportError) {
    console.error('Import failed:', error.details);
    console.error('Failed records:', error.records);
  }
}
```

## Performance Considerations

### Streaming Large Exports

```typescript
// Stream large datasets
const stream = client.exportStream('Transaction', {
  filter: 'Period>=1',
  chunkSize: 1000
});

for await (const batch of stream) {
  // Process batch of transactions
  console.log(`Processing ${batch.length} transactions`);
}
```

### Batch Imports

```typescript
// Import in batches
const allProducts = [...]; // 10,000 products

for (const batch of chunk(allProducts, 1000)) {
  await client.import('Product', batch);
  console.log(`Imported ${batch.length} products`);
}
```

## Testing

```typescript
import { MockClient } from '@moneyworks/core/testing';

// Create mock client for testing
const mockClient = new MockClient();

// Add test data
mockClient.addMockData('Name', [
  { code: 'TEST001', name: 'Test Customer' }
]);

// Test your code
const customers = await mockClient.export('Name');
expect(customers).toHaveLength(1);
```

## Best Practices

1. **Always use type-safe builders** for complex operations
2. **Enable validation** for user-provided data
3. **Use streaming** for large datasets
4. **Handle errors** appropriately
5. **Test with mock client** before production
6. **Use custom templates** for reports
7. **Batch operations** for performance

## Migration Guide

### From Raw REST API

```typescript
// Before
const xml = buildXML(data);
const response = await fetch(url, { 
  method: 'POST',
  body: xml 
});

// After
await client.import('Name', data);
```

### From Manual XML Building

```typescript
// Before
const xml = `<import><name>
  <code>CUST001</code>
  <name>Acme Corp</name>
</name></import>`;

// After
await client.import('Name', [{
  code: 'CUST001',
  name: 'Acme Corp'
}]);
```

## Appendix

### MoneyWorks Filter Syntax

```
Period=7                    // Current period
Type=1                      // Customers only
Balance>0                   // Outstanding balance
Code="A*"                   // Codes starting with A
TransDate>="20240101"       // Date comparison
```

### Field Mappings

See `/packages/core/src/tables/` for complete field mappings between MoneyWorks (PascalCase) and TypeScript (camelCase) interfaces.

### REST API Reference

- [MoneyWorks REST API Documentation](https://secure.cognito.co.nz/developer/moneyworks-datacentre-rest-api/)
- [XML Import/Export Reference](https://cognito.co.nz/manual/moneyworks_export_import_xml_importing.html)

## Maintenance Notes

When updating this system:
1. Update this documentation
2. Regenerate schemas if interfaces change
3. Update tests for new features
4. Consider backward compatibility
5. Update migration guide if breaking changes