# MoneyWorks MCP Server

A Model Context Protocol (MCP) server for MoneyWorks, enabling AI agents to interact with MoneyWorks data and functionality.

## Features

- **Export MoneyWorks data** in multiple formats (compact, full, schema-enriched)
- **Evaluate MWScript expressions** through the REST API
- **Discover table schemas** with field metadata
- **Progressive entity support** - new entities added as they're vetted

## Available Tools

### mw_export
Export data from MoneyWorks tables with support for filtering, sorting, and multiple output formats.

```json
{
  "table": "TaxRate",
  "exportFormat": "full",
  "filter": "TaxCode='GST10'",
  "limit": 100
}
```

### mw_eval
Evaluate MWScript expressions for calculations and data manipulation.

```json
{
  "expression": "1 + 1"
}
```

### mw_schema
Get field structure and metadata for MoneyWorks tables.

```json
{
  "table": "TaxRate"
}
```

### mw_list_tables
List available, vetted, and upcoming MoneyWorks tables.

## Configuration

The server reads MoneyWorks connection details from:
1. Environment variable: `MW_CONFIG_PATH`
2. Default location: `./mw-config.json`

Example configuration:
```json
{
  "host": "localhost",
  "port": 6990,
  "username": "your-username",
  "password": "your-password",
  "dataFile": "your-datafile"
}
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "node",
      "args": ["/path/to/mw-core/packages/mcp-server/dist/index.js"],
      "env": {
        "MW_CONFIG_PATH": "/path/to/mw-config.json"
      }
    }
  }
}
```

### Development

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev

# Build for production
bun run build

# Run production build
bun run start
```

## Design Principles

1. **Pure MoneyWorks DSL** - Preserve MoneyWorks terminology and conventions
2. **Developer Experience** - Clear APIs with helpful error messages
3. **Progressive Enhancement** - Add entities as they're vetted
4. **LLM Context Quality** - Provide structured data that preserves meaning

## Currently Available Entities

- **TaxRate** - Tax codes and rates

## Upcoming Entities

- Account - Chart of accounts
- Transaction - Financial transactions  
- Name - Customers and suppliers
- Product - Inventory items
- Job - Projects
- Category1/2 - Custom categories