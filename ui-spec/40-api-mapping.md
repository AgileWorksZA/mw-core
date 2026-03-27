# API Mapping — Desktop Activities → Backend Endpoints

## Overview
The Elysia JS backend at `/api/v1` exposes MoneyWorks data via a RESTful API with OpenAPI/Swagger documentation. This document maps desktop client activities to API operations.

## API Base
- **Server**: `http://localhost:3000`
- **Base Path**: `/api/v1`
- **Swagger**: `/api/v1/swagger`
- **Auth**: Token-based (Bearer token via `/api/v1/auth/token`)

## Authentication Flow
| Desktop Activity | API Endpoint | Method |
|-----------------|-------------|--------|
| File → Open / Connect | `POST /auth/token` | Exchange MW credentials for Bearer token |
| File → Switch User | `POST /auth/token` | New token with different credentials |
| Session keepalive | `POST /auth/refresh` | Refresh access token |
| File → Close | `DELETE /auth/token/:id` | Revoke token |

## Available Tables (Entity Registers)
| Table | Desktop Entity | API Endpoint |
|-------|---------------|-------------|
| `transaction` | Transactions (Invoices, Payments, Receipts, Journals, Orders, Quotes) | `GET /tables/transaction` |
| `name` | Names (Customers + Suppliers) | `GET /tables/name` |
| `product` | Items (Products, Resources, Time, Ship Methods) | `GET /tables/product` |
| `account` | Chart of Accounts (GL Accounts) | `GET /tables/account` |
| `taxrate` | Tax Rates (GST/HST/VAT codes) | `GET /tables/taxrate` |
| `contact` | Contacts (sub-records of Names) | `GET /tables/contact` |
| `detail` | Detail Line Items (transaction line items) | `GET /tables/detail` |
| `job` | Jobs (Project Costing) — *upcoming* | — |
| `category1` | Categories — *upcoming* | — |
| `category2` | Categories — *upcoming* | — |

## Table Operations
Each table supports:

| Operation | Endpoint | Method | Description |
|-----------|----------|--------|-------------|
| List/Export | `GET /tables/:table` | GET | Query and export records |
| Schema | `GET /tables/:table/schema` | GET | Field definitions and metadata |
| Import | `POST /tables/:table/import` | POST | Create/update records |
| Labels | `GET /tables/:table/labels` | GET | Human-readable field labels (i18n) |

### Export Formats
| Format | Description | Use Case |
|--------|-------------|----------|
| `full` (default) | Complete JSON objects | General API use |
| `compact` | Raw arrays (TSV) | Bulk data transfer |
| `compact-headers` | Arrays with headers | Spreadsheet export |
| `schema` | Objects with field metadata | Schema discovery, LLM context |

### Query Parameters (Export)
| Parameter | Description |
|-----------|-------------|
| `format` | Export format (full, compact, compact-headers, schema) |
| `filter` | MoneyWorks filter expression (e.g., `left(Code,2)="BA"`) |
| `limit` | Max records to return |
| `offset` | Pagination offset |
| `orderBy` | Sort field |

### Import Modes
| Mode | Description |
|------|-------------|
| `insert` | Create new records only (fails if exists) |
| `update` | Update existing only (fails if not exists) |
| `replace` | Upsert — update if exists, create if not |

## Desktop Activity → API Mapping

### Sales and Income

| Desktop Activity | API Call(s) | Notes |
|-----------------|------------|-------|
| View Quotes list | `GET /tables/transaction?filter=Type="QU"` | Filter by quote type |
| Create new Quote | `POST /tables/transaction/import` mode=insert | Transaction type = Quote |
| Convert Quote → Sales Order | `POST /tables/transaction/import` mode=update | Change type, preserve reference |
| View Sales Orders | `GET /tables/transaction?filter=Type="SO"` | |
| Ship Sales Order | `POST /tables/transaction/import` | Creates Sales Invoice + updates SO |
| View Sales Invoices | `GET /tables/transaction?filter=Type="DI"` | DI = Debtor Invoice |
| Create Sales Invoice | `POST /tables/transaction/import` | Transaction type = DI |
| View Receivables | `GET /tables/transaction?filter=Type="DI" AND Outstanding>0` | |
| Get line items for a transaction | `GET /tables/detail?filter=SequenceNumber={transSeq}` | Join via SequenceNumber |

### Cash and Banking

| Desktop Activity | API Call(s) | Notes |
|-----------------|------------|-------|
| View Receipts | `GET /tables/transaction?filter=Type="CR"` | CR = Cash Receipt |
| Create Receipt | `POST /tables/transaction/import` | Type=CR with bank account |
| View Payments | `GET /tables/transaction?filter=Type="CP"` | CP = Cash Payment |
| Create Payment | `POST /tables/transaction/import` | Type=CP |
| View bank account transactions | `GET /tables/transaction?filter=BankAccount="1000"` | Filter by bank |
| Funds Transfer | `POST /tables/transaction/import` | Creates linked journal entries |

### Purchases and Expenses

| Desktop Activity | API Call(s) | Notes |
|-----------------|------------|-------|
| View Purchase Orders | `GET /tables/transaction?filter=Type="PO"` | |
| Create Purchase Order | `POST /tables/transaction/import` | Type=PO |
| Receive Goods | `POST /tables/transaction/import` | Updates PO, may create PI |
| View Purchase Invoices | `GET /tables/transaction?filter=Type="CI"` | CI = Creditor Invoice |
| Create Purchase Invoice | `POST /tables/transaction/import` | Type=CI |
| View Payables | `GET /tables/transaction?filter=Type="CI" AND Outstanding>0` | |

### Master Data

| Desktop Activity | API Call(s) | Notes |
|-----------------|------------|-------|
| View/Search Customers | `GET /tables/name?filter=Flags contains "C"` | C flag = Customer |
| View/Search Suppliers | `GET /tables/name?filter=Flags contains "S"` | S flag = Supplier |
| Create/Edit Customer | `POST /tables/name/import` | Set Customer flag |
| Create/Edit Supplier | `POST /tables/name/import` | Set Supplier flag |
| Get customer contacts | `GET /tables/contact?filter=ParentCode="{nameCode}"` | |
| View Items | `GET /tables/product` | |
| Create/Edit Item | `POST /tables/product/import` | |
| View Accounts | `GET /tables/account` | |
| Create/Edit Account | `POST /tables/account/import` | |
| View Tax Rates | `GET /tables/taxrate` | |
| Edit Tax Rate | `POST /tables/taxrate/import` | |

### Enquiries

| Desktop Activity | API Call(s) | Notes |
|-----------------|------------|-------|
| Account Enquiry (Balances) | `POST /eval` with balance expressions | MWScript evaluation |
| Account Enquiry (Movements) | `GET /tables/transaction?filter=Account="1000"` + period filter | |
| Customer Sales | `GET /tables/detail?filter=...` | Aggregate by customer |
| Item Sales | `GET /tables/detail?filter=...` | Aggregate by item |
| Stock Enquiry | `GET /tables/product` with SOH fields | |

### System

| Desktop Activity | API Call(s) | Notes |
|-----------------|------------|-------|
| Company Details | `GET /company` | Nested or flat format |
| Company Fields | `GET /company/fields` | Field groups: basic, address, contact, accounting, tax, system |
| MWScript evaluation | `POST /eval` | Execute MoneyWorks expressions |
| Template evaluation | `POST /eval/template/:table` | Evaluate templates against table |
| Field labels (i18n) | `GET /tables/:table/labels` | Supports multiple languages |
| Supported languages | `GET /i18n/languages` | |
| UI translations | `GET /i18n/translations/:lang` | |
| Health check | `GET /health` | |
| Version | `GET /version` | |

## Transaction Type Codes (MoneyWorks DSL)
| Code | Type | Desktop Name |
|------|------|-------------|
| DI | Debtor Invoice | Sales Invoice |
| CI | Creditor Invoice | Purchase Invoice |
| CR | Cash Receipt | Receipt |
| CP | Cash Payment | Payment |
| JN | Journal | Journal Entry |
| SO | Sales Order | Sales Order |
| PO | Purchase Order | Purchase Order |
| QU | Quote | Quote |

## Data Model Relationships
```
Transaction (1) ←→ (many) Detail (line items)
    ↓ references
Name (Customer/Supplier)
    ↓ has
Contact (multiple per Name)

Detail (line item)
    ↓ references
Product (Item)
Account (GL Account)

Account
    ↓ has
TaxRate (default tax code)

Product
    ↓ references
Account (COGS, Income, Asset accounts)
TaxRate (default tax codes)
```

## Gaps / Opportunities for Web Frontend
1. **Real-time updates**: Desktop is request-response; web can use WebSockets for live data
2. **Batch operations**: API supports bulk import (up to 1000 records) — web can batch more efficiently
3. **Smart filtering**: MWScript expressions are powerful but complex — web can provide a visual query builder
4. **Dashboard data**: No dedicated dashboard endpoints yet — these need to be composed from table queries + eval
5. **Reports**: No report generation endpoint — reports are currently desktop-only rendering
6. **Bank reconciliation**: No dedicated reconciliation workflow endpoint — needs to be built
7. **Period management**: Open/Close period not exposed via API
8. **Posting**: Post/unpost transaction status changes not explicitly in API
9. **Jobs**: Table not yet available — upcoming
10. **Assets**: No asset table yet
11. **Budgets/Balances**: Accessible via eval but no dedicated table endpoint
