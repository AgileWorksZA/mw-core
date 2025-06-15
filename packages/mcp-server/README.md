# MoneyWorks MCP Server

Model Context Protocol (MCP) server for MoneyWorks accounting software, providing AI assistants with structured access to MoneyWorks data and operations.

## Overview

This MCP server provides 45 tools across two main categories:
- **4 Table Tools**: Direct access to core MoneyWorks tables (accounts, transactions, names, builds)
- **41 System Tools**: Validation, permissions, schemas, calculations, and more

Built with **@moneyworks/core** for type-safe, modern MoneyWorks integration.

## Features

- 🔒 **Secure Authentication**: Dual authentication support (folder + document)
- 📊 **Comprehensive Data Access**: All major MoneyWorks tables
- 🔍 **Advanced Search**: MoneyWorks expression language support
- 📈 **Real-time Calculations**: Evaluate expressions and aggregations
- 🎯 **Type-Safe**: Full TypeScript support with @moneyworks/core
- 🐛 **Error Tracking**: Built-in ticket system for continuous improvement
- 🚀 **High Performance**: Direct REST API integration

## Architecture

```
MCP Server
├── Services Layer          # Wraps @moneyworks/core REST client
│   ├── BaseTableService    # Common operations for all tables
│   └── Table Services      # Specific services for each table
├── Tools Layer            # MCP tool implementations
│   ├── Table Tools        # 4 core table operations
│   └── Core Tool          # 41 system operations
└── Infrastructure
    ├── REST Client        # From @moneyworks/core
    ├── CLI Wrapper        # MoneyWorks CLI integration
    └── Ticket Service     # Error tracking with SQLite
```

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mw-core.git
cd mw-core

# Install dependencies
bun install

# Configure MoneyWorks connection
cp packages/api/mw-config.json packages/mcp-server/mw-config.json
# Edit mw-config.json with your MoneyWorks server details
```

## Configuration

Create a `mw-config.json` file:

```json
{
  "host": "localhost",
  "port": 6710,
  "protocol": "http",
  "dataFile": "YourCompany.moneyworks",
  "username": "ApiUser",
  "password": "yourpassword",
  "folderAuth": {
    "folderName": "CompanyFolder",
    "password": "folderPassword"
  }
}
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "bun",
      "args": ["run", "/path/to/mw-core/packages/mcp-server/src/index.ts"],
      "env": {
        "MW_CONFIG_PATH": "/path/to/mw-config.json"
      }
    }
  }
}
```

### With Claude CLI

```bash
claude mcp add-json moneyworks '{
  "command": "/Users/your-username/.bun/bin/bun",
  "args": ["run", "src/index.ts"],
  "cwd": "/path/to/mw-core/packages/mcp-server",
  "env": {
    "MW_CONFIG_PATH": "/path/to/mw-config.json",
    "TICKETS_DB_PATH": "/path/to/tickets.db"
  }
}' -s user
```

## Available Tools

### Table Tools (4)

1. **account_operations** - Chart of accounts management
   - Search accounts by code, description, type
   - Get account balances and hierarchies
   - Filter by active status, balance, parent

2. **transaction_operations** - Transaction management
   - Search by date, account, name, type
   - Get posted/unposted transactions
   - Find outstanding invoices

3. **name_operations** - Customer/supplier management
   - Search by name, email, phone
   - Filter customers vs suppliers
   - Check credit status and balances

4. **build_operations** - Manufacturing/inventory
   - Track builds by product, date, location
   - Analyze cost variances
   - Monitor production quantities

### System Tools (41)

Accessed through the `moneyworks_core` tool with categories:

- **validation**: Field validation, code checks, expression testing
- **permission**: User permissions, table access, security audit
- **schema**: Table schemas, field metadata, relationships
- **dataRelationship**: Find related records across tables
- **calculation**: Evaluate expressions, aggregations
- **sequence**: Get next sequence numbers
- **constant**: System constants (TODAY, VERSION, etc.)
- **searchExpression**: Build and test search expressions
- **system**: Version info, custom exports, reports

### Error Tracking Tool (1)

**log_ticket** - Track and manage errors for continuous improvement
- Log errors with context
- List and filter tickets
- Track resolution status
- Generate statistics

## Examples

### Search for Accounts
```json
{
  "tool": "account_operations",
  "arguments": {
    "operation": "search",
    "searchTerm": "sales",
    "accountType": "IN",
    "onlyActive": true
  }
}
```

### Get Recent Transactions
```json
{
  "tool": "transaction_operations", 
  "arguments": {
    "operation": "search",
    "fromDate": "20240101",
    "toDate": "20241231",
    "onlyPosted": true
  }
}
```

### Evaluate Expression
```json
{
  "tool": "moneyworks_core",
  "arguments": {
    "category": "calculation",
    "operation": "calculate",
    "expression": "Sum(Account.Balance, Type=\"IN\")"
  }
}
```

## Development

```bash
# Run in development mode
bun run dev

# Build for production
bun run build

# Run tests
bun test

# Reset ticket database
bun run db:reset
```

## Migration from @moneyworks/api

This server has been completely rewritten to use `@moneyworks/core` instead of the legacy `@moneyworks/api` package. Benefits include:

- ✅ Better type safety with comprehensive TypeScript interfaces
- ✅ Modern REST client with JSON support (faster than XML)
- ✅ Cleaner architecture with service layer pattern
- ✅ Direct access to MoneyWorks CLI for advanced operations
- ✅ Improved error handling and tracking

The tool interfaces remain unchanged, ensuring backward compatibility for existing AI assistants.

## Troubleshooting

### Connection Issues
- Verify MoneyWorks Datacentre is running
- Check firewall settings for port 6710
- Ensure REST API is enabled in MoneyWorks
- Verify authentication credentials

### Performance
- Use pagination for large datasets
- Enable `debug: true` in config for detailed logs
- Check MoneyWorks server resources

### Error Tracking
- Errors are automatically logged to SQLite database
- Use `log_ticket` tool to review and manage errors
- Check `data/tickets.db` for persistent storage

## License

MIT