# Setting up MoneyWorks MCP Server with Claude Desktop

## Quick Setup (Using bunx with source)

1. **Find your Claude Desktop configuration file:**
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Edit the configuration file** and add the MoneyWorks MCP server:

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "bunx",
      "args": ["tsx", "/Users/hgeldenhuys/WebstormProjects/mw-core/packages/mcp-server/src/index.ts"],
      "env": {
        "MW_CONFIG_PATH": "/Users/hgeldenhuys/WebstormProjects/mw-core/mw-config.json"
      }
    }
  }
}
```

Or if you prefer using bun directly:

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

3. **Make sure your MoneyWorks config exists** at the path specified in `MW_CONFIG_PATH`

4. **Restart Claude Desktop** to load the new MCP server

## Verifying the Setup

Once Claude Desktop restarts, you can verify the MCP server is working by asking Claude:

- "Can you list the available MoneyWorks tables?"
- "What tools do you have for MoneyWorks?"
- "Can you export TaxRate data from MoneyWorks?"

## Troubleshooting

If the MCP server doesn't appear to be working:

1. **Check Claude Desktop logs:**
   - macOS: `~/Library/Logs/Claude/`
   - Look for any error messages related to the MCP server

2. **Test the server manually:**
   ```bash
   cd /Users/hgeldenhuys/WebstormProjects/mw-core
   bun run packages/mcp-server/src/index.ts
   ```
   This should output: "MoneyWorks MCP Server started"

3. **Ensure dependencies are installed:**
   ```bash
   cd /Users/hgeldenhuys/WebstormProjects/mw-core
   bun install
   ```

4. **Check the config file path:**
   - Make sure `MW_CONFIG_PATH` points to a valid MoneyWorks configuration file
   - The file should contain your MoneyWorks connection details

## Alternative: Using npx

If bunx doesn't work, you can try npx:

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "npx",
      "args": ["tsx", "/Users/hgeldenhuys/WebstormProjects/mw-core/packages/mcp-server/src/index.ts"],
      "env": {
        "MW_CONFIG_PATH": "/Users/hgeldenhuys/WebstormProjects/mw-core/mw-config.json"
      }
    }
  }
}
```

## Using without tsx

If you want to avoid tsx, you can use bun directly since it supports TypeScript:

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "bun",
      "args": ["/Users/hgeldenhuys/WebstormProjects/mw-core/packages/mcp-server/src/index.ts"],
      "env": {
        "MW_CONFIG_PATH": "/Users/hgeldenhuys/WebstormProjects/mw-core/mw-config.json"
      }
    }
  }
}
```