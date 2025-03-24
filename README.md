# MoneyWorks Core API

This project provides a REST API for interacting with MoneyWorks Datacentre using TypeScript and Elysia.js running on Bun.

## Features

- TypeScript type definitions for MoneyWorks data structures
- RESTful API endpoints for accessing MoneyWorks data
- Automatic conversion between MoneyWorks and JSON formats
- Support for both folder and document authentication
- Pagination, sorting, and filtering
- Swagger documentation

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

### Names (Customers/Suppliers)

- `GET /api/names` - List names with pagination and filtering
- `GET /api/names/:id` - Get a specific name by code or sequence number

Query parameters:
- `limit` - Number of records to return (default: 10)
- `offset` - Number of records to skip (default: 0)
- `sort` - Field to sort by (e.g., "Code")
- `order` - Sort order ("asc" or "desc", default: "asc")
- `search` - MoneyWorks search expression (e.g., "Code=`ACME`") 

### Other Endpoints (coming soon)

- Accounts
- Transactions
- Products
- Jobs

## Build and Deploy

To build the project for production:
```bash
bun run build
```

To run in production:
```bash
bun run start
```

## License

[MIT](LICENSE)