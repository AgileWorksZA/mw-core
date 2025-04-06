# MoneyWorks Core API

This project provides a REST API for interacting with MoneyWorks Datacentre using TypeScript and Elysia.js running on Bun.

## Features

- TypeScript type definitions for MoneyWorks data structures
- RESTful API endpoints for accessing MoneyWorks data
- Automatic conversion between MoneyWorks and JSON formats
- Support for both folder and document authentication
- Pagination, sorting, and filtering
- Comprehensive Swagger documentation with fully-typed request/response schemas

## Setup

### Prerequisites

- [Bun](https://bun.sh/) runtime
- MoneyWorks Datacentre server with REST API enabled (port 6710 by default)
- API user account in MoneyWorks with appropriate permissions

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mw-core.git
   cd mw-core
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure MoneyWorks connection:
   - Copy `mw-config.example.json` to `mw-config.json`
   - Edit the configuration with your MoneyWorks server details:
     ```json
     {
       "host": "your-moneyworks-server.com",
       "port": 6710,
       "dataFile": "YourCompany.moneyworks",
       "username": "ApiUser",
       "password": "yourpassword",
       "folderAuth": {
         "folderName": "CompanyFolder",
         "password": "folderPassword"
       }
     }
     ```
   - If your server doesn't require folder authentication, remove the `folderAuth` section.

   Alternatively, you can use environment variables:
   ```
   MW_HOST=your-moneyworks-server.com
   MW_PORT=6710
   MW_DATA_FILE=YourCompany.moneyworks
   MW_USERNAME=ApiUser
   MW_PASSWORD=yourpassword
   MW_FOLDER_NAME=CompanyFolder
   MW_FOLDER_PASSWORD=folderPassword
   ```

## Development

To start the development server:
```bash
bun run dev
```

The API will be available at http://localhost:3131, with Swagger documentation at http://localhost:3131/swagger.

## API Endpoints

Most endpoints follow a similar RESTful pattern for CRUD operations on MoneyWorks entities:

### Common Patterns

- `GET /api/{entity}` - List entities with pagination and filtering
- `GET /api/{entity}/:id` - Get a specific entity by code or sequence number
- `GET /api/{entity}/by-sequence/:sequence` - Get a specific entity by sequence number
- `GET /api/{entity}/for-{related}/:id` - Get entities related to another entity

### Common Query Parameters

For all list endpoints:
- `limit` - Number of records to return (default: 10)
- `offset` - Number of records to skip (default: 0)
- `sort` - Field to sort by (e.g., "Code")
- `order` - Sort order ("asc" or "desc", default: "asc")
- `search` - MoneyWorks search expression (e.g., "Code=`ACME`")

### Swagger Documentation

The complete API documentation with request/response schemas is available at the `/swagger` endpoint.

### Available Entity Endpoints

- Accounts
- Auto Splits
- Bank Reconciliations
- Builds
- Departments
- Details
- Filters
- General Settings
- Jobs
- Job Sheets
- Ledger
- Links
- Lists
- Logs
- Logins
- Memos
- Messages
- Names (Customers/Suppliers)
- Off-Ledger Entries
- Payments
- Products
- Sticky Notes
- Tax Rates
- Transactions
- Users

All endpoints follow consistent patterns for:
- Listing entities with pagination and filtering
- Retrieving single entities by code or sequence number
- Related entity lookups (e.g., transactions for an account)

## Build and Deploy

To build the project for production:
```bash
bun run build
```

To run in production:
```bash
bun run start
```

## CLI Tools

The project includes several command-line tools for working with MoneyWorks data:

- `align-export` - Align TSV exports with XML-verbose exports
- `list-tables` - List all tables in the MoneyWorks database
- `list-fields` - List all fields in a specific MoneyWorks table (with optional type information)

For detailed documentation on using the CLI tools, see [mw-cli.md](docs/mw-cli.md).

## License

[MIT](LICENSE)