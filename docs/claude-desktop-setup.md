# Claude Desktop MCP Setup for MoneyWorks

## Configuration Steps

1. **Add to Claude Desktop Config**

Add this to your Claude Desktop settings (usually at `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "/Users/hgeldenhuys/.bun/bin/bun",
      "args": ["run", "/Users/hgeldenhuys/WebstormProjects/mw-core/packages/mcp-server/src/index.ts"],
      "env": {
        "MW_CONFIG_PATH": "/Users/hgeldenhuys/WebstormProjects/mw-core/packages/core/mw-config.json",
        "TICKETS_DB_PATH": "/Users/hgeldenhuys/WebstormProjects/mw-core/packages/mcp-server/data/tickets.db"
      }
    }
  }
}
```

2. **Ensure MoneyWorks Config is Valid**

The config at `/Users/hgeldenhuys/WebstormProjects/mw-core/packages/core/mw-config.json` should be:

```json
{
  "host": "localhost",
  "port": 6710,
  "dataFile": "acme.moneyworks",
  "username": "Herman Geldenhuys",
  "password": "",
  "folderPassword": "",
  "folderName": ""
}
```

3. **Build the MCP Server**

```bash
cd /Users/hgeldenhuys/WebstormProjects/mw-core/packages/mcp-server
bun run build
```

4. **Test the Server Standalone**

```bash
MW_CONFIG_PATH=/Users/hgeldenhuys/WebstormProjects/mw-core/packages/core/mw-config.json \
bun run /Users/hgeldenhuys/WebstormProjects/mw-core/packages/mcp-server/src/index.ts
```

You should see:
```
MoneyWorks MCP Server v2.0.0 running with @moneyworks/core
Connected to: localhost:6710/acme.moneyworks
Tools registered: 45 (4 table + 41 system)
Ready for AI assistant connections
```

5. **Restart Claude Desktop**

After updating the config, restart Claude Desktop for the changes to take effect.

## Troubleshooting

### Issue: Parameter validation errors

If you see errors like:
```json
{
  "expected": "'search' | 'get' | 'listFields'",
  "received": "undefined",
  "code": "invalid_type",
  "path": ["operation"],
  "message": "Required"
}
```

This was fixed by ensuring all tool registrations use `.shape` on Zod schemas:
```typescript
server.tool("name", "description", schema.shape, handler);
```

### Issue: Folder authentication error

If you see:
```
error: Folder name provided without folder password
```

Ensure both `folderName` and `folderPassword` are either both empty or both have values.

### Issue: Connection errors

Ensure MoneyWorks server is running on the specified host and port.

## Available Tools

The MCP server provides 45 tools:

### Table Operations (4 tools)
- `account_operations` - Account management
- `transaction_operations` - Transaction management  
- `name_operations` - Customer/supplier management
- `build_operations` - Build/assembly management

### Core Operations (41 tools via `moneyworks_core`)
Including:
- Export/import operations
- Report generation
- System information
- Expression evaluation
- And many more...

### Utility (1 tool)
- `log_ticket` - Error tracking and logging