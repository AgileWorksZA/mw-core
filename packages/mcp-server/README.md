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

### Configuration File

Create a `mw-config.json` file:

```json
{
  "host": "localhost",
  "port": 6710,
  "dataFile": "YourCompany.moneyworks",
  "username": "ApiUser",
  "password": "yourpassword",
  "folderName": "CompanyFolder",
  "folderPassword": "folderPassword"
}
```

### Environment Variables

The MCP server supports the following environment variables:

- `MW_CONFIG_PATH` - Path to the MoneyWorks configuration file (default: `./mw-config.json`)
- `TICKETS_DB_PATH` - Path to the SQLite database for error tracking (default: `./data/tickets.db`)
- `NODE_ENV` - Environment mode (`development`, `production`, `test`)
- `DEBUG` - Enable debug logging (set to `true` or `1`)

### Docker Setup

For containerized deployments:

```dockerfile
FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY packages/mcp-server/package.json ./packages/mcp-server/
COPY packages/core/package.json ./packages/core/

# Install dependencies
RUN bun install

# Copy source files
COPY . .

# Build the server
RUN cd packages/mcp-server && bun run build

# Expose MCP port (stdio)
EXPOSE 8080

# Set environment variables
ENV MW_CONFIG_PATH=/config/mw-config.json
ENV TICKETS_DB_PATH=/data/tickets.db

# Run the server
CMD ["bun", "run", "packages/mcp-server/dist/index.js"]
```

Docker Compose example:

```yaml
version: '3.8'
services:
  mcp-server:
    build: .
    volumes:
      - ./config:/config
      - ./data:/data
    environment:
      - MW_CONFIG_PATH=/config/mw-config.json
      - TICKETS_DB_PATH=/data/tickets.db
    restart: unless-stopped
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration file (usually at `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "/path/to/.bun/bin/bun",
      "args": ["run", "/path/to/mw-core/packages/mcp-server/src/index.ts"],
      "env": {
        "MW_CONFIG_PATH": "/path/to/mw-core/packages/core/mw-config.json",
        "TICKETS_DB_PATH": "/path/to/mw-core/packages/mcp-server/data/tickets.db"
      }
    }
  }
}
```

Then restart Claude Desktop for the changes to take effect.

### With Claude Code

For Claude Code (the CLI tool), add the MCP server to your configuration:

```bash
# Add the MCP server
claude mcp add moneyworks /path/to/.bun/bin/bun run /path/to/mw-core/packages/mcp-server/src/index.ts

# Or with explicit configuration
claude mcp add-json moneyworks '{
  "command": "/Users/your-username/.bun/bin/bun",
  "args": ["run", "src/index.ts"],
  "cwd": "/path/to/mw-core/packages/mcp-server",
  "env": {
    "MW_CONFIG_PATH": "/path/to/mw-config.json",
    "TICKETS_DB_PATH": "/path/to/tickets.db"
  }
}' -s user

# List available MCP servers
claude mcp list

# Remove if needed
claude mcp remove moneyworks
```

### With TypeScript/Node.js Client

You can also use the MCP server programmatically from TypeScript/Node.js:

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

// Spawn the MCP server process
const serverProcess = spawn("bun", [
  "run",
  "/path/to/mw-core/packages/mcp-server/src/index.ts"
], {
  env: {
    ...process.env,
    MW_CONFIG_PATH: "/path/to/mw-config.json",
    TICKETS_DB_PATH: "/path/to/tickets.db"
  }
});

// Create MCP client
const transport = new StdioClientTransport({
  command: serverProcess,
  stderr: serverProcess.stderr
});

const client = new Client({
  name: "moneyworks-client",
  version: "1.0.0"
});

// Connect to the server
await client.connect(transport);

// List available tools
const tools = await client.listTools();
console.log("Available tools:", tools);

// Call a tool
const result = await client.callTool({
  name: "account_operations",
  arguments: {
    operation: "search",
    searchTerm: "sales"
  }
});

console.log("Search results:", result);

// Clean up
await client.close();
```

### With OpenAI-Compatible APIs

For integration with OpenAI-compatible APIs, you can create a bridge:

```typescript
import express from "express";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// ... MCP client setup as above ...

const app = express();
app.use(express.json());

// Convert MCP tools to OpenAI function format
app.get("/v1/functions", async (req, res) => {
  const tools = await client.listTools();
  const functions = tools.tools.map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.inputSchema
  }));
  res.json({ functions });
});

// Execute function calls
app.post("/v1/functions/:name/execute", async (req, res) => {
  try {
    const result = await client.callTool({
      name: req.params.name,
      arguments: req.body
    });
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("OpenAI-compatible API running on port 3000");
});
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