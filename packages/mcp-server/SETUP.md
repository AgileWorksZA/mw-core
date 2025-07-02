# MoneyWorks MCP Server Setup

## Claude Desktop Configuration

The MCP server needs to be configured in Claude Desktop. The configuration file is located at:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

## Configuration

Add the following to your Claude Desktop config:

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "/Users/hgeldenhuys/.bun/bin/bun",
      "args": [
        "run",
        "/Users/hgeldenhuys/WebstormProjects/mw-core/packages/mcp-server/src/index.ts"
      ],
      "directory": "/Users/hgeldenhuys/WebstormProjects/mw-core",
      "description": "MoneyWorks MCP server for export, eval, and schema",
      "env": {
        "MW_CONFIG_PATH": "/Users/hgeldenhuys/WebstormProjects/mw-core/mw-config.json"
      }
    }
  }
}
```

## Running with TypeScript

The server runs directly with Bun's built-in TypeScript support. No build step is required.

## MoneyWorks Configuration

Ensure you have a `mw-config.json` file in the root of the monorepo with your MoneyWorks connection details:

```json
{
  "host": "your-moneyworks-server",
  "port": 6710,
  "username": "your-username",
  "password": "your-password",
  "dataFile": "your-datafile"
}
```

## Restarting Claude Desktop

After updating the configuration, restart Claude Desktop for the changes to take effect.

## Available Tools

The MCP server provides the following tools:

1. **mw_export** - Export data from MoneyWorks tables
2. **mw_eval** - Evaluate MWScript expressions
3. **mw_schema** - Get field structure for tables
4. **mw_list_tables** - List available tables

## Troubleshooting

If the server fails to start:

1. Verify the paths in the config are correct
2. Check the MW_CONFIG_PATH points to a valid config file
3. Ensure Bun is installed and accessible at the specified path
4. Look for error messages in Claude Desktop logs
5. Verify all TypeScript imports use .ts extensions