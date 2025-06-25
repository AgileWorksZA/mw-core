# @moneyworks/data

MoneyWorks data access layer providing REST client and repository pattern for clean data operations.

## 🎯 Purpose

This package provides:
- **MoneyWorks REST Client** with proper authentication
- **Repository Pattern** for each MW entity
- **Data Parsing** between MW formats and typed data
- **Type-Safe Queries** using MW search syntax

## 🚀 Quick Start

### Basic Usage

```typescript
import { createDataLayer } from '@moneyworks/data';

// Create client and repositories
const { client, repositories } = await createDataLayer('./mw-config.json');

// Use repositories
const taxRates = await repositories.taxRate.findAll();
const gst10 = await repositories.taxRate.findByKey('GST10');
```

### Direct Client Usage

```typescript
import { MoneyWorksClient, loadConfig } from '@moneyworks/data';

const config = await loadConfig();
const client = new MoneyWorksClient(config);

// Test connection
const isConnected = await client.testConnection();

// Direct API calls
const response = await client.get('TaxRate', {
  search: "TaxCode CONTAINS 'GST'",
  limit: 10
});
```

### Repository Pattern

```typescript
import { TaxRateRepository } from '@moneyworks/data';

const taxRateRepo = new TaxRateRepository(client);

// Find with MoneyWorks search syntax
const gstRates = await taxRateRepo.find("TaxCode CONTAINS 'GST'");

// CRUD operations
const newRate = await taxRateRepo.create({
  TaxCode: 'GST15',
  PaidAccount: '2-1520' as AccountCode,
  RecAccount: '2-1510' as AccountCode,
  Date: d`20240401`,
  Rate1: 10,
  Rate2: 15
});

// Update
await taxRateRepo.update('GST15', {
  Rate2: 15.5
});

// Delete
await taxRateRepo.delete('GST15');
```

## 📋 Configuration

### Config File Format

```json
{
  "host": "localhost",
  "port": 6710,
  "protocol": "http",
  "dataFile": "acme.moneyworks",
  "username": "ApiUser",
  "password": "password123",
  "folderAuth": {
    "folderName": "CompanyFolder",
    "folderPassword": "folderPass"
  }
}
```

### Environment Variables

Override config file with environment variables:

```bash
MW_HOST=server.company.com
MW_PORT=6710
MW_PROTOCOL=https
MW_DATA_FILE=production.moneyworks
MW_USERNAME=ApiUser
MW_PASSWORD=secret
MW_FOLDER_NAME=CompanyFolder
MW_FOLDER_PASSWORD=folderSecret
MW_CONFIG_PATH=/path/to/mw-config.json
```

## 🏗️ Architecture

### Client Layer

The `MoneyWorksClient` handles:
- REST API communication
- Dual authentication (folder + document)
- Error handling
- Request/response formatting

### Repository Layer

Each repository:
- Extends `BaseMoneyWorksRepository`
- Implements entity-specific parsing
- Provides typed CRUD operations
- Handles MW search syntax

### Parser Layer

Data parsers handle:
- MW date formats → YYYYMMDD branded types
- MW numbers → JavaScript numbers
- MW enums → TypeScript enums
- Null/empty value handling

## 🔧 Creating New Repositories

To add a new entity repository:

```typescript
import { BaseMoneyWorksRepository } from '@moneyworks/data';
import { MoneyWorksAccount } from '@moneyworks/canonical/accounts';

export class AccountRepository extends BaseMoneyWorksRepository<
  MoneyWorksAccount,
  MoneyWorksAccountCreateInput,
  MoneyWorksAccountUpdateInput
> {
  protected readonly tableName = 'Account';
  protected readonly primaryKey = 'Code';

  protected parse(raw: any): MoneyWorksAccount {
    return {
      Code: raw.Code as AccountCode,
      Description: raw.Description,
      AccountType: parseMWEnum(raw.AccountType, MoneyWorksAccountType),
      // ... parse all fields
    };
  }

  protected prepare(data: any): any {
    // Convert typed data back to MW format
    return {
      Code: data.Code,
      Description: data.Description,
      AccountType: data.AccountType?.toString(),
      // ... prepare all fields
    };
  }
}
```

## 🔍 MoneyWorks Search Syntax

The repository `find()` method accepts MW search expressions:

```typescript
// Exact match
await repo.find("TaxCode='GST10'");

// Contains
await repo.find("TaxCode CONTAINS 'GST'");

// Comparison
await repo.find("Rate1 > 10");

// Date comparison
await repo.find("Date >= '20240101'");

// Combining conditions
await repo.find("TaxCode CONTAINS 'GST' AND Rate1 > 0");
```

## 🛡️ Error Handling

```typescript
try {
  const result = await taxRateRepo.create(invalidData);
} catch (error) {
  if (error.code === 'MW_ERROR') {
    console.error('MoneyWorks error:', error.message);
  } else if (error.code === 'MW_TIMEOUT') {
    console.error('Request timed out');
  }
}
```

## 📚 API Reference

### Client Methods

- `get(table, params)` - Retrieve records
- `post(table, data)` - Create record
- `put(table, key, data)` - Update record
- `delete(table, key)` - Delete record
- `testConnection()` - Test MW connection

### Repository Methods

- `find(search?, params?)` - Find with search
- `findByKey(key)` - Find by primary key
- `findAll(params?)` - Get all records
- `create(data)` - Create new record
- `update(key, data)` - Update record
- `delete(key)` - Delete record
- `exists(key)` - Check existence
- `count(search?)` - Count matching records

### Parser Functions

- `parseMWDate()` - Parse to YYYYMMDD
- `parseMWNumber()` - Parse to number
- `parseMWBoolean()` - Parse to boolean
- `parseMWEnum()` - Parse to enum value
- `formatMWDate()` - Format for MW
- `formatMWNumber()` - Format number
- And more...

## ⚠️ Important Notes

1. **Authentication**: MoneyWorks uses specific auth format
2. **Search Syntax**: Use MW search expressions, not SQL
3. **Data Types**: All dates are YYYYMMDD, all codes are branded
4. **Read-Only Fields**: GST finalization fields cannot be updated
5. **Primary Keys**: Cannot be changed after creation

This package provides the foundation for all MoneyWorks data operations!