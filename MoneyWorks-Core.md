# MoneyWorks Core API

A TypeScript backend service that provides REST API access to MoneyWorks accounting software data. This library serves as the bridge between web applications and the MoneyWorks accounting system.

## Overview

MoneyWorks Core API exposes MoneyWorks accounting data through a structured REST interface with:

- Comprehensive endpoints for all MoneyWorks tables
- Consistent search/filter capabilities
- Type-safe responses with TypeScript definitions
- Direct MCP (MoneyWorks Cloud Platform) integration

## Key MoneyWorks Concepts

MoneyWorks is a double-entry accounting system with these core components:

### Accounts
The chart of accounts containing asset, liability, equity, income, and expense accounts. Each account has a code, description, and type that determines its behavior in the accounting system.

### Names
Entities that your business interacts with, such as customers, suppliers, employees, and others. Names contain contact information and financial settings like credit terms and payment methods.

### Transactions
Financial transactions represent money movements between accounts. Transaction types include:
- Invoices (SI)
- Credit Notes (SC)
- Receipts (SR)
- Payments (SP)
- Journal Entries (GJ)
- Cash Transactions (CT)

### Products
Inventory and non-inventory items that can be bought, sold, or used in your business. Products include information about pricing, cost, and stock levels.

### Details
Line items within transactions that reference accounts, quantities, amounts, and optional product codes.

### Jobs
Projects or engagements that allow tracking revenues and expenses across multiple transactions.

## API Structure

The API follows a consistent RESTful pattern for all MoneyWorks entities:

### Endpoints

Each MoneyWorks table has standardized endpoints:

```
GET /api/{entity}              # Search with filters
GET /api/{entity}/{id}         # Get by ID
POST /api/{entity}             # Create
PUT /api/{entity}/{id}         # Update
DELETE /api/{entity}/{id}      # Delete (where supported)
```

Examples of available entity endpoints:
- `/api/accounts`
- `/api/names`
- `/api/transactions`
- `/api/products`
- `/api/details`
- `/api/jobs`
- `/api/bank-recs`

### Search Operations

All entity endpoints support powerful search functionality:

```http
POST /api/accounts
Content-Type: application/json

{
  "paging": {
    "limit": 20,
    "offset": 0
  },
  "search": {
    "Type": "BANK",
    "Description": "checking"
  }
}
```

Search responses include pagination information:

```json
{
  "data": [...],
  "total": 42
}
```

## MCP Integration

The API includes built-in MoneyWorks Cloud Platform (MCP) integration for direct access to MoneyWorks data. This provides a standardized interface for:

- Search operations across all tables
- Schema introspection
- Data validation

MCP Tools available through the API:

```
mcp__moneyworks__searchAccounts
mcp__moneyworks__searchNames
mcp__moneyworks__searchTransactions
mcp__moneyworks__searchProducts
mcp__moneyworks__getSchema
```

### Using MCP Directly

Client applications can access MCP functionality through the API:

```http
POST /api/mcp/moneyworks/searchAccounts
Content-Type: application/json

{
  "paging": {
    "limit": 10,
    "offset": 0
  },
  "search": {
    "Type": "ASSET"
  }
}
```

### Schema Inspection

Get the schema for any MoneyWorks table:

```http
POST /api/mcp/moneyworks/getSchema
Content-Type: application/json

{
  "tableName": "account"
}
```

## Working with MoneyWorks Data

### Date Handling

MoneyWorks dates are stored in YYYYMMDD format, but the API converts them to ISO strings:

```json
{
  "TransDate": "2023-04-15T00:00:00.000Z"
}
```

### Numeric Fields

MoneyWorks stores most numeric values with fixed precision. The API preserves this precision in responses:

```json
{
  "Gross": 1050.75,
  "Tax": 157.61
}
```

### Relationships

MoneyWorks uses sequence numbers and codes as references between tables:

- Transactions reference Names via `NameCode`
- Details reference Transactions via `ParentSeq`
- Details can reference Products via `StockCode`

## Common Operations

### Finding Accounts

```http
POST /api/accounts
Content-Type: application/json

{
  "paging": {
    "limit": 50,
    "offset": 0
  },
  "search": {
    "Type": "EXPENSE"
  }
}
```

### Creating an Invoice

```http
POST /api/transactions
Content-Type: application/json

{
  "Type": "SI",
  "NameCode": "ACME",
  "TransDate": "2023-04-15T00:00:00.000Z",
  "TheirRef": "PO12345",
  "OurRef": "INV-001"
}
```

### Adding Line Items to a Transaction

```http
POST /api/details
Content-Type: application/json

{
  "ParentSeq": 42,
  "Account": "4000",
  "StockCode": "WIDGET",
  "Description": "Premium Widget",
  "StockQty": 5,
  "UnitPrice": 100.00,
  "Tax": 75.00,
  "Gross": 575.00
}
```

### Running a Name Search

```http
POST /api/names
Content-Type: application/json

{
  "paging": {
    "limit": 20,
    "offset": 0
  },
  "search": {
    "Category1": "Customer",
    "Name": "Smith"
  }
}
```

## Error Handling

The API returns standardized error responses:

```json
{
  "error": true,
  "message": "Account not found",
  "code": "NOT_FOUND",
  "status": 404
}
```

Common error codes:
- 400: Bad Request (invalid parameters)
- 401: Unauthorized
- 404: Resource Not Found
- 500: Internal Server Error

## Authentication

API access requires authentication which is managed by the backend system. Frontend applications typically don't need to handle MoneyWorks credentials directly, as authentication is managed by the API service.

## Performance Considerations

- Use appropriate `limit` values in search operations
- Include only needed fields in search criteria
- Consider implementing caching for frequently accessed reference data

## MoneyWorks-Specific Concepts

### Transaction Types

- SI: Sales Invoice
- SC: Sales Credit
- SR: Sales Receipt
- PI: Purchase Invoice
- PC: Purchase Credit
- PP: Purchase Payment
- GJ: General Journal
- CT: Cash Transaction

### Account Types

- ASSET: Asset accounts
- LIAB: Liability accounts
- EQUITY: Equity accounts
- INCOME: Income/revenue accounts
- EXPENSE: Expense accounts
- OTHER: Special purpose accounts

### Name Kinds

- 0: Person
- 1: Debtor/Customer
- 2: Creditor/Supplier
- 3: Debtor & Creditor
- 4: Employee

### Important Fields

- `SequenceNumber`: Unique identifier for most records
- `Code`: Short identifier for accounts, products
- `Description`: Human-readable name
- `Type`: Determines behavior for accounts and transactions
- `Flags`: Bit flags that control various behaviors