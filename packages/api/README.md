# MoneyWorks REST API

A modern, type-safe REST API for MoneyWorks built with ElysiaJS and designed for excellent developer experience.

## Features

- 🚀 **High Performance** - Built with Bun and ElysiaJS
- 📚 **Auto-generated Swagger** - Interactive API documentation
- 🔍 **Multiple Export Formats** - Compact, full, and schema-enriched
- 🧩 **Extensible Architecture** - Easy to add new tables
- 📊 **MWScript Evaluation** - Execute expressions via API
- 🔒 **Type-safe** - Full TypeScript with runtime validation
- 📝 **Request Tracking** - Built-in request IDs and logging

## Quick Start

```bash
# Install dependencies
/Users/hgeldenhuys/.bun/bin/bun install

# Start development server
/Users/hgeldenhuys/.bun/bin/bun run dev

# Or production
/Users/hgeldenhuys/.bun/bin/bun start
```

## Configuration

Set environment variables or create `mw-config.json`:

```bash
MW_CONFIG_PATH=./mw-config.json  # MoneyWorks config
PORT=3000                         # API port
HOST=0.0.0.0                     # API host
DISABLE_SWAGGER=false            # Disable Swagger UI
DISABLE_CORS=false               # Disable CORS
```

See `.env.example` for all available environment variables.

## Deployment

### Railway

The API is configured for easy deployment on Railway:

1. Push your code to GitHub
2. Create a new Railway project
3. Add environment variables:
   - `MW_HOST` - Your MoneyWorks server
   - `MW_USERNAME` - MoneyWorks username
   - `MW_PASSWORD` - MoneyWorks password  
   - `MW_COMPANY` - Company file name
4. Deploy directly from GitHub

Railway will automatically detect the Dockerfile and deploy the API.

### Docker

Build and run with Docker:

```bash
# Build from monorepo root
docker build -f packages/api/Dockerfile -t mw-api .

# Run with environment variables
docker run -p 3000:3000 \
  -e MW_HOST=your-server \
  -e MW_USERNAME=your-user \
  -e MW_PASSWORD=your-pass \
  -e MW_COMPANY=your-company \
  mw-api
```

### Manual Deployment

For manual deployment on a VPS:

```bash
# Clone the repository
git clone https://github.com/your-org/mw-core.git
cd mw-core

# Install dependencies
bun install

# Set environment variables
export MW_HOST=your-server
export MW_USERNAME=your-user
export MW_PASSWORD=your-pass
export MW_COMPANY=your-company

# Start the API
bun run api:start
```

## API Endpoints

### Tables

```bash
# List available tables
GET /api/v1/tables

# Export table data
GET /api/v1/tables/TaxRate?format=full&limit=10

# Get table schema
GET /api/v1/tables/TaxRate/schema
```

### MWScript Evaluation

```bash
# Evaluate expression
POST /api/v1/eval
{
  "expression": "1 + 1"
}
```

### System

```bash
# Health check
GET /api/v1/health

# Version info
GET /api/v1/version
```

## Export Formats

The API supports multiple export formats via the `format` query parameter:

### `full` (default)
Complete objects with field names:
```json
[
  { "TaxCode": "GST10", "Description": "GST 10%", "Rate": 10.0 }
]
```

### `compact`
Raw arrays for minimal overhead:
```json
[
  ["GST10", "GST 10%", 10.0]
]
```

### `compact-headers`
Arrays with field names in first row:
```json
[
  ["TaxCode", "Description", "Rate"],
  ["GST10", "GST 10%", 10.0]
]
```

### `schema`
Objects with complete field metadata:
```json
{
  "schema": {
    "TaxCode": { "type": "string", "maxLength": 20 },
    "Rate": { "type": "number" }
  },
  "data": [...]
}
```

## Adding New Tables

1. Create a controller extending `BaseTableController`:

```typescript
export class AccountController extends BaseTableController {
  readonly tableName = 'Account';
  readonly displayName = 'Chart of Accounts';
  readonly description = 'Account definitions';
  
  protected getPrimaryKey(): string {
    return 'AccountCode';
  }
}
```

2. Register in `table-registry.ts`:

```typescript
this.register(new AccountController(this.client));
```

That's it! The table is now available through all API endpoints.

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "TABLE_NOT_FOUND",
    "message": "Table Account is not yet available",
    "details": {
      "available": ["TaxRate"],
      "requested": "Account"
    },
    "requestId": "mw-12345-abcdef"
  }
}
```

## Development

```bash
# Run with auto-reload
/Users/hgeldenhuys/.bun/bin/bun run dev

# Type checking
/Users/hgeldenhuys/.bun/bin/bun run typecheck

# Build
/Users/hgeldenhuys/.bun/bin/bun run build
```

## Architecture

- **Controllers** - Business logic for each table
- **Routes** - HTTP endpoint definitions
- **Schemas** - Request/response validation
- **Middleware** - Cross-cutting concerns
- **Registry** - Table management

The API is designed to be extended as new MoneyWorks tables are vetted and added to the canonical module.