# @moneyworks/core

The canonical core TypeScript library for MoneyWorks, providing shared types, interfaces, models, utilities, and REST API client for the entire ecosystem.

## Overview

This package serves as the single source of truth for:
- TypeScript type definitions for all MoneyWorks tables
- REST API client with full export/import support
- XML and TSV parsing/building
- JSON Schema generation for validation
- Common utilities and helpers
- Type-safe builders for complex operations

## Installation

```bash
bun add @moneyworks/core
```

## Quick Start

```typescript
import { createClient, exportFrom, importInto } from '@moneyworks/core';

// Create client
const client = createClient({
  host: 'localhost',
  port: 6710,
  dataFile: 'acme.moneyworks',
  username: 'admin',
  password: 'password'
});

// Export data
const customers = await exportFrom('Name')
  .where('Type=1')
  .limit(100)
  .execute(client);

// Import data
await importInto('Product')
  .add({
    code: 'WIDGET001',
    description: 'Premium Widget',
    sellPrice: 99.99
  })
  .execute(client);
```

## Features

### REST API Client

Type-safe REST client with authentication support:
- Single and two-level authentication
- All REST endpoints (export, import, evaluate, post, etc.)
- Streaming support for large datasets
- Progress callbacks

### Export System

Flexible export with multiple formats:
- XML (terse and verbose)
- TSV (tab-separated values)
- Custom templates with MWScript
- Type-safe query builders
- Streaming for large datasets

### Import System

Type-safe import builders:
- XML generation from TypeScript objects
- Transaction builder with detail lines
- Batch imports with validation
- Work-it-out field support
- Calculated field expressions

### Table Definitions

Complete TypeScript interfaces for all MoneyWorks tables:
- 24+ table definitions
- CamelCase and PascalCase interfaces
- Field converters and helpers
- Type guards and validators

### JSON Schema Generation

Optional validation with JSON Schemas:
- Auto-generated from TypeScript interfaces
- AJV validation support
- Field constraints and formats
- Use for external validation

## Project Structure

```
packages/core/
├── src/
│   ├── index.ts              # Main entry point
│   ├── tables/               # Table interfaces
│   │   ├── index.ts
│   │   ├── names.ts          # Customer/supplier
│   │   ├── accounts.ts       # Chart of accounts
│   │   ├── transactions.ts   # Financial transactions
│   │   ├── products.ts       # Inventory items
│   │   ├── detail.ts         # Transaction lines
│   │   └── ...              # 20+ more tables
│   ├── rest/                 # REST API client
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   └── types.ts
│   ├── export/               # Export functionality
│   │   ├── builder.ts
│   │   ├── parser.ts
│   │   └── template.ts
│   ├── import/               # Import functionality
│   │   ├── builder.ts
│   │   └── transaction-builder.ts
│   ├── xml/                  # XML handling
│   │   ├── parser.ts
│   │   └── builder.ts
│   ├── schemas/              # JSON schemas
│   │   ├── generator.ts
│   │   └── *.schema.json
│   └── converters/           # Field converters
│       └── field-converter.ts
├── examples/                 # Usage examples
├── scripts/                  # Build scripts
├── package.json
└── README.md
```

## Usage Examples

### Basic Export

```typescript
import { createClient, exportFrom } from '@moneyworks/core';

const client = createClient(config);

// Export with filtering and sorting
const invoices = await exportFrom('Transaction')
  .where('TypeCode="DI"')
  .whereField('period', '=', 7)
  .orderBy('transDate', 'DESC')
  .limit(100)
  .execute(client);
```

### Custom Template Export

```typescript
import { ExportTemplate } from '@moneyworks/core';

// Use pre-built template
const report = await client.export('Name', {
  format: ExportTemplate.name.addressLabel,
  filter: 'Type=1'
});

// Custom template
const custom = await client.export('Transaction', {
  format: {
    template: `
Invoice: [OurRef]
Customer: [NameCode]
Total: $[Gross]
{[Detail.Description]: $[Detail.Gross]}
`
  }
});
```

### Import with Validation

```typescript
import { importInto } from '@moneyworks/core';

const builder = importInto('Product', { validate: true })
  .mode('upsert')
  .add({
    code: 'WIDGET001',
    description: 'Premium Widget',
    sellPrice: 99.99,
    stockOnHand: 100
  })
  .workItOut('stockValue');

const result = await builder.execute(client);
```

### Transaction with Details

```typescript
import { buildTransaction } from '@moneyworks/core';

const transaction = buildTransaction()
  .setHeader({
    nameCode: 'CUST001',
    transDate: new Date(),
    description: 'Sales Invoice'
  })
  .addInventoryLine('4100', 'WIDGET001', 2, 99.99)
  .addLine('2100', 19.99, 'GST 10%')
  .addLine('1100', -219.97, 'Balance due');

await transaction.execute(client);
```

### Streaming Large Datasets

```typescript
const stream = client.exportStream('Transaction', {
  filter: 'Period>=1',
  chunkSize: 1000,
  onProgress: ({ current, total, percentage }) => {
    console.log(`Progress: ${percentage}%`);
  }
});

for await (const batch of stream) {
  // Process batch
  await processBatch(batch);
}
```

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Type checking
bun run typecheck

# Generate JSON schemas
bun run generate:schemas

# Run examples
bun run example:export-import
```

## API Documentation

See [/docs/moneyworks-export-import-design.md](../../docs/moneyworks-export-import-design.md) for detailed API documentation.

### Key Exports

- `MoneyWorksRESTClient` - Main REST client
- `createClient()` - Client factory
- `exportFrom()` - Export builder
- `importInto()` - Import builder  
- `buildTransaction()` - Transaction builder
- `ExportTemplate` - Pre-built templates
- All table interfaces and types

## Contributing

This is the core library for MoneyWorks. All changes should:
1. Maintain backward compatibility
2. Include comprehensive TypeScript types
3. Have corresponding tests
4. Be well-documented

## License

Private - MoneyWorks internal use only