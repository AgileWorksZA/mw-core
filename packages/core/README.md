# @moneyworks/core

The canonical core TypeScript library for MoneyWorks, providing shared types, interfaces, models, and utilities across the entire ecosystem.

## Overview

This package serves as the single source of truth for:
- TypeScript type definitions
- Domain models and interfaces
- Shared validation schemas (using Zod)
- Common utilities and helpers
- MoneyWorks business logic abstractions

## Installation

```bash
bun add @moneyworks/core
```

## Usage

```typescript
import { Account, Transaction, Contact } from '@moneyworks/core/models';
import { MoneyWorksDate, Currency } from '@moneyworks/core/types';
import { validateAccount, formatCurrency } from '@moneyworks/core/utils';

// Use the imported types and utilities
const account: Account = {
  // ... account properties
};
```

## Project Structure

```
packages/core/
├── src/
│   ├── index.ts           # Main entry point
│   ├── types/             # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── common.ts      # Common/shared types
│   │   ├── api.ts         # API-related types
│   │   └── ...
│   ├── models/            # Domain models
│   │   ├── index.ts
│   │   ├── account.ts
│   │   ├── transaction.ts
│   │   ├── contact.ts
│   │   └── ...
│   ├── schemas/           # Zod validation schemas
│   │   ├── index.ts
│   │   └── ...
│   ├── utils/             # Utility functions
│   │   ├── index.ts
│   │   ├── date.ts
│   │   ├── currency.ts
│   │   └── ...
│   └── constants/         # Shared constants
│       ├── index.ts
│       └── ...
├── tests/                 # Test files
├── docs/                  # Documentation
├── package.json
├── tsconfig.json
└── README.md
```

## Development

```bash
# Build the library
bun run build

# Watch mode for development
bun run dev

# Run tests
bun test

# Type checking
bun run lint
```

## API Documentation

### Types

Core TypeScript type definitions for MoneyWorks entities and operations.

### Models

Domain models representing MoneyWorks business entities:
- `Account` - Chart of accounts
- `Transaction` - Financial transactions
- `Contact` - Customers, suppliers, and other contacts
- `Product` - Inventory items and services
- `Job` - Projects and jobs
- And more...

### Schemas

Zod schemas for runtime validation of MoneyWorks data.

### Utils

Utility functions for common operations:
- Date formatting and parsing
- Currency calculations
- Data validation
- Business logic helpers

## Contributing

This is the core library for MoneyWorks. All changes should:
1. Maintain backward compatibility
2. Include comprehensive TypeScript types
3. Have corresponding tests
4. Be well-documented

## License

Private - MoneyWorks internal use only