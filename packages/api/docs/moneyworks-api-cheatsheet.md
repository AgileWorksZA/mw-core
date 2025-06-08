# MoneyWorks API Cheatsheet

This document provides a reference for working with the MoneyWorks API, focusing on RESTful operations, data querying, and pagination.

## API Base URL

```
http://localhost:3000
```

API documentation is available at `/swagger`.

## Authentication

MoneyWorks Datacentre REST API uses **Basic Password** authentication with two possible levels:

### Single-level Authentication (Document only)
Used when the MoneyWorks server doesn't require folder-level login.

```
Authorization: Basic Um9ib3Q6RG9jdW1lbnQ6czNjcmV0
```

This is a Base64-encoded string of `username:Document:password`.

### Two-level Authentication (Folder + Document) ✅ **VALIDATED**
Required when the MoneyWorks server is configured with "Require Folder Name and Password to Connect (ASP mode)".

**Working Implementation:**
```typescript
// Dual headers as array (recommended for Axios)
headers: {
  Authorization: [folderAuth, documentAuth]
}
```

**Raw HTTP Headers:**
```
Authorization: Basic QWdpbGV3b3JrczpEYXRhY2VudHJlOnNoYWxvbTEwMjQ=
Authorization: Basic c3VwcG9ydDpEb2N1bWVudDpzdXBwb3J0MTAyNA==
```

Where:
- **Document auth**: Base64-encoded `username:Document:password`
- **Folder auth**: Base64-encoded `foldername:Datacentre:folderpassword`

**Alternative formats that work:**
```
# Comma-separated single header
Authorization: Basic QWdpbGV3b3JrczpEYXRhY2VudHJlOnNoYWxvbTEwMjQ=, Basic c3VwcG9ydDpEb2N1bWVudDpzdXBwb3J0MTAyNA==

# CURL with duplicate headers
curl -H "Authorization: Basic QWdpbGV3b3JrczpEYXRhY2VudHJlOnNoYWxvbTEwMjQ=" \
     -H "Authorization: Basic c3VwcG9ydDpEb2N1bWVudDpzdXBwb3J0MTAyNA==" \
     "http://server:6710/REST/Folder%2fDocument.moneyworks/export?table=name"
```

### Configuration Example
When using the MoneyWorks Python client, create an mw.ini file:

```ini
[mw_server]
HOST = example.moneyworks.net.nz
PORT = 6710
DATA_FILE = Folder/sub folder/Document.moneyworks
USERNAME = Admin
PASSWORD = YourPassword
```

For servers requiring folder authentication, use the connection URL:
```
https://server:6710/REST/Folder%2fSubfolder%2fThe%20Document.moneyworks/command?param=value
```

## Common Data Structures

### Account

Accounts represent general ledger accounts in the MoneyWorks system.

**Key fields:**
- `SequenceNumber`: Unique identifier (indexed)
- `Code`: Account code (max length: 8, indexed)
- `Type`: Account type (indexed)
- `Description`: Account description (max length: 64)
- `TaxCode`: Tax code reference (max length: 6)

**Example query:**
```http
GET /api/accounts?limit=10&offset=0
```

### Transaction

Transactions represent financial transactions in the MoneyWorks system.

**Key fields:**
- `SequenceNumber`: Unique identifier (indexed)
- `OurRef`: Reference number (max length: 12, indexed)
- `TransDate`: Transaction date (indexed)
- `Type`: Transaction type (max length: 4, indexed)
- `NameCode`: Name code (max length: 12, indexed)
- `Description`: Description (max length: 1024)
- `Gross`: Gross amount
- `Status`: Status code (max length: 2, indexed)

**Example query:**
```http
GET /api/transactions?limit=10&offset=0
```

## Querying Data

### Basic Query Parameters

| Parameter | Description                        | Example                   |
|-----------|------------------------------------| --------------------------|
| `limit`   | Maximum number of results to return| `?limit=25`               |
| `offset`  | Number of records to skip          | `?offset=50`              |
| `sort`    | Field to sort by                   | `?sort=TransDate`         |
| `order`   | Sort order (asc/desc)              | `?order=desc`             |
| `filter`  | Field filter expression            | `?filter=Type:eq:INVOICE` |

### Filtering Syntax

The filter parameter uses the following syntax:
```
filter=field:operator:value
```

**Operators:**
- `eq`: Equal to
- `ne`: Not equal to
- `gt`: Greater than
- `lt`: Less than
- `gte`: Greater than or equal to
- `lte`: Less than or equal to
- `in`: In a list of values (comma-separated)
- `like`: Pattern matching (with % wildcard)

**Examples:**
```http
GET /api/transactions?filter=TransDate:gte:2023-01-01
GET /api/accounts?filter=Type:eq:ASSET
GET /api/names?filter=NameCode:like:CUST%
```

### Complex Filtering

Multiple filters can be combined using the `&` operator:

```http
GET /api/transactions?filter=TransDate:gte:2023-01-01&filter=Type:eq:INVOICE
```

## Pagination

Pagination is handled using the `limit` and `offset` parameters:

```http
GET /api/transactions?limit=25&offset=0
```

The API response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "total": 1250,
    "limit": 25,
    "offset": 0,
    "next": "/api/transactions?limit=25&offset=25",
    "prev": null
  }
}
```

## MoneyWorks REST API Endpoints

MoneyWorks Datacentre REST API provides several command verbs for interacting with the server:

### Server Information Commands

#### version
Get the server version number
```
GET /REST/server/version
```

#### list
List documents (databases) on the server
```
GET /REST/server/list
```

### Document Operations

All document operations require the document path in the URL:
```
https://server:6710/REST/DocumentName.moneyworks/command?param=value
```

For documents in subfolders:
```
https://server:6710/REST/Folder%2fSubfolder%2fDocumentName.moneyworks/command?param=value
```

### Data Operations

#### export
Extract data from MoneyWorks. This is the primary method for retrieving data from the database.

```
GET /REST/Document.moneyworks/export/table=name&search=left(code,1)=`A`&format=xml
```

Parameters:
- `table`: **Required**. The table to query (see [Appendix A](https://cognito.co.nz/manual/moneyworks_appendix_appendix_afield_descriptions.html) of manual for table names)
  - Common tables: `name` (customers/suppliers), `transaction`, `account`, `product`, `job`

- `search`: *Optional*. URL-encoded search expression. If omitted, returns all records (use with caution - may be very large!)
  - Uses MoneyWorks search syntax
  - String constants must be enclosed in backticks: `code=\`ACME\``
  - Example: `Category1=\`NORTH\``
  - Example: `TransDate>={d'2023-01-01'}`
  - Relational searches across tables are supported: `exists(detail.account=\`4000\`)`

- `format`: *Optional*. Output format. If omitted, returns canonical text export
  - `xml`: Basic XML format suitable for importing
  - `xml-terse`: Omits blank/zero values and non-importable system fields
  - `xml-verbose`: Includes all data, with system="true" attribute for non-importable fields
  - Custom format: URL-encoded format string where expressions in square brackets are evaluated
    - Example: `[Code], [Name]\n` (URL-encoded)

- `sort`: *Optional*. Sort expression. Can be a field name or expression
  - Example: `NameCode`
  - Example: `TransDate`

- `direction`: *Optional*. `ascending` (default) or `descending`

- `start`: *Optional*. Start offset when format is XML (for pagination)

- `limit`: *Optional*. Maximum number of records to return when format is XML (for pagination)

Examples:

Basic XML export of all customers in the NORTH category:
```
GET /REST/Acme.moneyworks/export/table=name&search=Category1%3d%22NORTH%22&format=xml
```

Formatted export returning just code and name:
```
GET /REST/Acme.moneyworks/export/table=name&format=%5BCode%5D%2C%20%5BName%5D%0A
```

Paginated XML export of transactions:
```
GET /REST/Acme.moneyworks/export/table=transaction&sort=TransDate&direction=descending&start=0&limit=10&format=xml
```

Response formats:

XML format response:
```xml
<?xml version="1.0"?>
<table name="Name" count="2" start="0" found="6">
  <n>
    <code>ACME</code>
    <n>ACME Corporation</n>
    <email>info@acme.com</email>
    <productpricing>A</productpricing>
  </n>
  <n>
    <code>WIDGET</code>
    <n>Widget Industries</n>
    <contact>John Smith</contact>
    <email>john@widget.com</email>
  </n>
</table>
```

The XML structure varies by table, with record elements matching the table name (abbreviated):
- `name` table: `<n>` elements
- `transaction` table: `<t>` elements with nested `<subfile>` and `<detail>` elements
- `account` table: `<a>` elements

#### import
Import data into MoneyWorks. This allows creating or updating records in the database.

```
POST /REST/Document.moneyworks/import/return_seq=true
Content-Type: text/xml

<xml data>
```

Parameters:
- `return_seq`: *Optional*. When set to `true`, returns the sequence number of the last record updated or created.

The XML data must conform to the MoneyWorks XML import format, which is compatible with the XML export format.

Basic structure:
```xml
<?xml version="1.0"?>
<table name="transaction">
  <transaction>
    <type>DI</type>             <!-- Document Invoice -->
    <ourref>INV12345</ourref>   <!-- Invoice number -->
    <transdate>20230315</transdate>
    <namecode>ACME</namecode>
    <description>Monthly services</description>
    <gross>1500.00</gross>
    <subfile name="detail">
      <detail>
        <account>4100</account>
        <net>1500.00</net>
        <description>Consulting Services</description>
        <taxcode>GST</taxcode>
      </detail>
    </subfile>
  </transaction>
</table>
```

Important notes:

1. Dates must be in `YYYYMMDD` format
2. Numbers must not have thousand separators and must use `.` as decimal separator
3. Field order matters for fields with special behavior:
   - The `type` field should come before fields with `work-it-out="true"` attribute
   - Prerequisite data for calculated fields must precede those fields
4. Invalid records will not be imported, and the response will include error information

Special attributes for the `<table>` element:

For transactions:
- `create_names="true"`: Create customer/supplier records if they don't exist
- `create_jobs="true"`: Create job records if they don't exist
- `post="true" seqnum="N"`: Post the transaction after import
- `update="true" seqnum="N"`: Update an existing transaction (for Debtor Invoices)

For other tables (Names, Jobs, Products):
- `update="true"`: Update existing records

Example responses:

Success:
```
created 1; updated 0
```

With `return_seq=true`:
```
12345
```

Error:
```
[ERROR] Error description here...
```

#### evaluate
Evaluate an expression in the context of the document. This is useful when you only need a single data point.

```
GET /REST/Document.moneyworks/evaluate/expr=expression
```

Parameters:
- `expr`: **Required**. URL-encoded MoneyWorks expression to evaluate

Examples:

Get today's date:
```
GET /REST/Acme.moneyworks/evaluate/expr=Today%28%29
```
Response:
```
31/01/11
```

Look up a customer's balance:
```
GET /REST/Acme.moneyworks/evaluate/expr=Lookup%28%22ACME%22%2C%22Name.DBalance%22%29
```
Response:
```
1250.75
```

#### post
Post a transaction that has already been created/imported. This changes a draft transaction to a posted transaction.

```
POST /REST/Document.moneyworks/post/seqnum=12345
```

Parameters:
- `seqnum`: **Required**. The sequence number of the transaction to post

Response:
- Success: `OK`
- Failure: `not posted`

#### doform
Print a form to PDF. Used for generating invoices, statements, and other documents.

```
GET /REST/Document.moneyworks/doform/form=invoice&search=sequencenumber=`12345`
```

Parameters:
- `form`: **Required**. The name of the form to use (must exist on the server)
- `search`: **Required**. Search expression to identify the record(s) to print
- `format`: *Optional*. Defaults to PDF

Response:
- The binary content of the generated PDF document
- Content-Type will be application/pdf

Available forms can be obtained using the list command:
```
GET /REST/Acme.moneyworks/list/folder=forms
```

### Custom Wrapper API Endpoints

Our wrapper API provides simplified access:

#### Accounts

```http
GET /api/accounts
GET /api/accounts/:id
POST /api/accounts
PUT /api/accounts/:id
DELETE /api/accounts/:id
```

#### Transactions

```http
GET /api/transactions
GET /api/transactions/:id
POST /api/transactions
PUT /api/transactions/:id
DELETE /api/transactions/:id
```

#### Names (Customers/Suppliers)

```http
GET /api/names
GET /api/names/:id
POST /api/names
PUT /api/names/:id
DELETE /api/names/:id
```

#### Products

```http
GET /api/products
GET /api/products/:id
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

## Request/Response Examples

### Get Transactions with Filtering and Pagination

**Request:**
```http
GET /api/transactions?filter=TransDate:gte:2023-01-01&filter=Type:eq:INVOICE&limit=10&offset=0
```

**Response:**
```json
{
  "data": [
    {
      "SequenceNumber": 12345,
      "OurRef": "INV12345",
      "TransDate": "2023-03-15",
      "EnterDate": "2023-03-15",
      "DueDate": "2023-04-15",
      "Period": 3,
      "Type": "INVC",
      "TheirRef": "PO98765",
      "NameCode": "CUSTOMER1",
      "Description": "March 2023 Services",
      "Gross": 1500.00,
      "Status": "OP"
    },
    // ... more transactions
  ],
  "pagination": {
    "total": 156,
    "limit": 10,
    "offset": 0,
    "next": "/api/transactions?filter=TransDate:gte:2023-01-01&filter=Type:eq:INVOICE&limit=10&offset=10",
    "prev": null
  }
}
```

### Create a New Transaction

**Request:**
```http
POST /api/transactions
Content-Type: application/json

{
  "OurRef": "INV12346",
  "TransDate": "2023-03-16",
  "DueDate": "2023-04-16",
  "Type": "INVC",
  "TheirRef": "PO98766",
  "NameCode": "CUSTOMER1",
  "Description": "Additional March 2023 Services",
  "Gross": 500.00,
  "Status": "OP"
}
```

**Response:**
```json
{
  "SequenceNumber": 12346,
  "LastModifiedTime": "2023-03-16T10:25:30Z",
  "OurRef": "INV12346",
  "TransDate": "2023-03-16",
  "EnterDate": "2023-03-16",
  "DueDate": "2023-04-16",
  "Period": 3,
  "Type": "INVC",
  "TheirRef": "PO98766",
  "NameCode": "CUSTOMER1",
  "Description": "Additional March 2023 Services",
  "Gross": 500.00,
  "Status": "OP"
}
```

## Error Handling

The API uses standard HTTP status codes:

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Unprocessable Entity
- 500: Internal Server Error

Error responses include a message explaining the issue:

```json
{
  "status": 400,
  "message": "Invalid filter format. Expected field:operator:value",
  "code": "INVALID_FILTER"
}
```

## TypeScript Implementation Notes

When implementing the MoneyWorks API client in TypeScript:

1. Use Axios or Fetch API with proper error handling for HTTP requests
2. Implement proper Base64 encoding for authentication headers
3. Create type definitions for all API responses
4. Use environment variables for server credentials

Example authentication setup:

```typescript
// Utility function for Basic auth
const createBasicAuthHeader = (username: string, realm: string, password: string): string => {
  const credentials = `${username}:${realm}:${password}`;
  const encoded = Buffer.from(credentials).toString('base64');
  return `Basic ${encoded}`;
};

// For document-only auth
const documentAuth = createBasicAuthHeader('Robot', 'Document', 's3cret');

// For folder+document auth (when required)
const documentAuth = createBasicAuthHeader('Robot', 'Document', 's3cret');
const folderAuth = createBasicAuthHeader('Some Folder', 'Datacentre', 'folderPassword');
const headers = {
  'Authorization': `${documentAuth}, ${folderAuth}`
};
```

## Security Considerations

When working with the MoneyWorks API:

1. **Always use HTTPS** for production environments
2. Create dedicated API users with minimal permissions
3. Never expose folder/document credentials in client-side code
4. Implement request throttling to prevent abuse
5. Regularly rotate passwords for API users
6. Monitor API logs for suspicious activity

## Batch Operations

Batch operations allow you to perform multiple actions in a single API call:

```http
POST /api/batch
Content-Type: application/json

{
  "operations": [
    {
      "method": "GET",
      "path": "/api/accounts/ASSET001"
    },
    {
      "method": "POST",
      "path": "/api/transactions",
      "body": {
        "OurRef": "INV12347",
        "TransDate": "2023-03-17",
        "Type": "INVC",
        "NameCode": "CUSTOMER1",
        "Description": "Batch created invoice",
        "Gross": 750.00
      }
    }
  ]
}
```