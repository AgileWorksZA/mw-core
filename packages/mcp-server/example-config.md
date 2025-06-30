# MoneyWorks MCP Server Configuration

## Claude Desktop Configuration

Add this to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "bun",
      "args": ["run", "/Users/hgeldenhuys/WebstormProjects/mw-core/packages/mcp-server/src/index.ts"],
      "env": {
        "MW_CONFIG_PATH": "/Users/hgeldenhuys/WebstormProjects/mw-core/mw-config.json"
      }
    }
  }
}
```

Or if you build it first:

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "node",
      "args": ["/Users/hgeldenhuys/WebstormProjects/mw-core/packages/mcp-server/dist/index.js"],
      "env": {
        "MW_CONFIG_PATH": "/Users/hgeldenhuys/WebstormProjects/mw-core/mw-config.json"
      }
    }
  }
}
```

## Testing the MCP Server

1. Install dependencies:
```bash
bun install
```

2. Run in development:
```bash
bun run mcp
```

3. Or build and run:
```bash
bun run mcp:build
bun run mcp:start
```

## Using with AI Agents

Once configured, AI agents can use commands like:

- "Export all tax rates from MoneyWorks"
- "What's the schema for the TaxRate table?"
- "Evaluate the expression 2+2 in MoneyWorks"
- "List available MoneyWorks tables"