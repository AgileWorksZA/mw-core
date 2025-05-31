# MoneyWorks MCP Server

An MCP (Model Context Protocol) server that provides AI assistants with access to MoneyWorks accounting operations, complete with automatic error tracking and ticket creation.

## Features

- **Direct Service Integration**: Uses existing MoneyWorks service classes from the main project
- **Error Tracking**: Automatic SQLite-based ticketing system for failures
- **Type Safety**: Full TypeScript with Zod validation
- **Session Tracking**: Links errors to specific AI sessions
- **No Duplicate Code**: Leverages all existing services and configurations

## Setup

1. Install dependencies:
```bash
cd mcp-server
bun install
```

2. Set up the database:
```bash
bun run db:migrate
```

3. Ensure MoneyWorks configuration exists:
   - Either create `mw-config.json` in the parent directory
   - Or set environment variables as defined in the main project

4. Run the server:
```bash
bun run dev
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "bun",
      "args": ["run", "/path/to/mcp-server/src/index.ts"],
      "env": {
        "MW_CONFIG_PATH": "/path/to/mw-config.json"
      }
    }
  }
}
```

## Available Tools

- **searchAccounts**: Search accounts by code, description, type, or category
- **getAccount**: Get a specific account by code
- **listAccountFields**: List all available fields for accounts
- More tools coming soon for other tables...

## Error Tracking

All errors are automatically logged to SQLite with:
- User prompt that caused the error
- API endpoint that failed
- Error details and stack trace
- Session ID for tracking
- Automatic categorization with tags

View tickets:
```bash
sqlite3 data/tickets.db "SELECT * FROM issues WHERE status='open';"
```

## Development

To add a new tool:
1. Create a new file in `src/tools/`
2. Define the schema and tool implementation
3. Register it in `src/index.ts`
4. Update `mcp.json`

## System Prompt

Use the system prompt from `/docs/mcp-server-plan.md` to configure your AI assistant for MoneyWorks-specific tasks.