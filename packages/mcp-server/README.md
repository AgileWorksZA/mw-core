# MoneyWorks MCP Server

An MCP (Model Context Protocol) server that provides AI assistants with access to MoneyWorks accounting operations, complete with automatic error tracking and ticket creation.

## Features

- **Direct Service Integration**: Uses existing MoneyWorks service classes from the main project
- **Error Tracking**: Automatic SQLite-based ticketing system for failures
- **Type Safety**: Full TypeScript with Zod validation
- **Session Tracking**: Links errors to specific AI sessions
- **No Duplicate Code**: Leverages all existing services and configurations

## Prerequisites

1. **MoneyWorks DataCentre Server**: Must be running and accessible (✅ Validated)
2. **MoneyWorks Document**: Must be open and available via REST API (✅ Working)
3. **Network Access**: Claude environment must reach MoneyWorks server (✅ Confirmed)
4. **Authentication**: Valid MoneyWorks user credentials (✅ **FULLY RESOLVED**)

**Authentication Status**: All MoneyWorks authentication issues have been resolved. The system now correctly handles:
- Dual authorization headers for folder-based documents
- Proper URL encoding for folder paths (`%2f` separators)
- Correct document password authentication
- Full compatibility with MoneyWorks DataCentre 9.2.1b5

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

3. Configure MoneyWorks connection (choose one method):

   **Method A: Configuration File** (Recommended)
   ```bash
   # Create or verify mw-config.json in packages/api/
   {
     "host": "your-moneyworks-server.local",
     "port": 6710,
     "protocol": "http",
     "dataFile": "YourCompany.moneyworks", 
     "username": "ApiUser",
     "password": "yourpassword",
     "folderAuth": {
       "folderName": "CompanyFolder",
       "password": "folderpassword"
     }
   }
   ```

   **Method B: Environment Variables**
   ```bash
   export MW_HOST="your-moneyworks-server.local"
   export MW_PORT="6710"
   export MW_PROTOCOL="http"
   export MW_DATA_FILE="YourCompany.moneyworks"
   export MW_USERNAME="ApiUser" 
   export MW_PASSWORD="yourpassword"
   export MW_FOLDER_NAME="CompanyFolder"
   export MW_FOLDER_PASSWORD="folderpassword"
   ```

4. Test MoneyWorks connection:
```bash
# From workspace root
MW_CONFIG_PATH="./packages/api/mw-config.json" bun run cli list-moneyworks

# Or test with curl (using your actual config values):
FOLDER_CREDS=$(echo -n 'Agileworks:Datacentre:shalom1024' | base64)
DOC_CREDS=$(echo -n 'support:Document:shalom1024' | base64)

curl -H "Authorization: Basic $FOLDER_CREDS" \
     -H "Authorization: Basic $DOC_CREDS" \
     "http://hjonck-pro.local:6710/REST/AgileWorks%20Information%20Systems%20Main%20GL%20To%20Fix.moneyworks/evaluate?expr=1%2B1"
```

5. Run the MCP server:
```bash
# From workspace root 
bun run dev:mcp
```

## MoneyWorks Authentication

The MCP server uses **dual-header authentication** with TWO separate Authorization headers:

1. **Folder Authentication**: `folderName:Datacentre:folderPassword` (Base64 encoded)
2. **Document Authentication**: `username:Document:password` (Base64 encoded)

**HTTP Headers Required:**
```
Authorization: Basic <base64-encoded-folder-credentials>
Authorization: Basic <base64-encoded-document-credentials>
```

**Credential Format:**
- Folder: `folderName:Datacentre:folderPassword`
- Document: `username:Document:password`

**REST API Pattern:**
```
http://{host}:{port}/REST/{dataFile}/
```

**Important**: Both Authorization headers use the same header name but contain different credentials. This is MoneyWorks' unique dual-authentication approach.

**Implementation Note**: The current MoneyWorks API service combines both credentials into a single Authorization header (comma-separated). While this works for the current configuration, the official MoneyWorks specification requires two separate headers with identical names. Some HTTP libraries may require special handling for duplicate header names.

## Required Environment Variables

For MCP server operation, these environment variables are required:

```bash
# MoneyWorks Configuration (required)
MW_CONFIG_PATH="/path/to/mw-config.json"

# Error Tracking Database (required)  
TICKETS_DB_PATH="/path/to/tickets.db"

# Cache Directory (optional)
MW_CACHE_DIR="/path/to/cache"
```

## Claude Code CLI Configuration

Configure the MCP server for Claude Code CLI:

```bash
claude mcp add-json moneyworks '{
  "command": "/Users/your-username/.bun/bin/bun",
  "args": ["run", "dev:mcp"],
  "cwd": "/path/to/mw-core",
  "env": {
    "MW_CONFIG_PATH": "/path/to/mw-core/packages/api/mw-config.json",
    "MW_CACHE_DIR": "/path/to/mw-core/packages/api/cache",
    "TICKETS_DB_PATH": "/path/to/mw-core/packages/mcp-server/data/tickets.db"
  }
}' -s user
```

## Claude Desktop Configuration

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "/Users/your-username/.bun/bin/bun",
      "args": ["run", "dev:mcp"],
      "cwd": "/path/to/mw-core",
      "env": {
        "MW_CONFIG_PATH": "/path/to/mw-core/packages/api/mw-config.json",
        "MW_CACHE_DIR": "/path/to/mw-core/packages/api/cache", 
        "TICKETS_DB_PATH": "/path/to/mw-core/packages/mcp-server/data/tickets.db"
      }
    }
  }
}
```

**Important Notes:**
- Use **absolute paths** for all file references
- Set **working directory** (`cwd`) to the workspace root
- Use **workspace script** (`dev:mcp`) instead of direct file execution
- Include **all required environment variables**

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

## Troubleshooting

### Connection Issues

**Error: "DoConnect failed -43"**

This indicates MoneyWorks DataCentre connectivity issues:

1. **Verify MoneyWorks DataCentre is running:**
   ```bash
   # Test if server is reachable
   curl -I http://your-server:6710/
   ```

2. **Check document availability:**
   ```bash
   # Test basic REST API access (requires TWO Authorization headers)
   FOLDER_CREDS=$(echo -n 'folderName:Datacentre:folderPassword' | base64)
   DOC_CREDS=$(echo -n 'username:Document:password' | base64)
   
   curl -H "Authorization: Basic $FOLDER_CREDS" \
        -H "Authorization: Basic $DOC_CREDS" \
        http://your-server:6710/REST/YourDocument.moneyworks/evaluate?expr=1+1
   ```

3. **Verify network connectivity:**
   - Ensure Claude environment can reach MoneyWorks server
   - Check firewall settings on port 6710
   - Verify hostname resolution

4. **Validate credentials:**
   - Test username/password in MoneyWorks directly
   - Verify folder authentication if required
   - Check user permissions for REST API access

**Error: "File not found on server"**

1. **Verify document name:**
   - Check exact spelling and case sensitivity
   - Ensure `.moneyworks` extension is included
   - Verify document is open in MoneyWorks DataCentre

2. **Check document permissions:**
   - Ensure user has access to the document
   - Verify folder authentication is correct

**MCP Server Not Appearing in Claude**

1. **Check MCP configuration scope:**
   ```bash
   claude mcp list -s user    # Should show moneyworks
   claude mcp list -s local   # Check local scope too
   ```

2. **Verify working directory:**
   - MCP server must run from workspace root (`mw-core`)
   - Use `cwd` parameter in configuration

3. **Test MCP server startup:**
   ```bash
   # Manual test
   MW_CONFIG_PATH="/path/to/config.json" \
   TICKETS_DB_PATH="/path/to/tickets.db" \
   bun run dev:mcp
   ```

### Environment Variable Issues

**Config file not found:**
```bash
# Verify file exists and is readable
ls -la /path/to/mw-config.json

# Test with absolute path
MW_CONFIG_PATH="/full/absolute/path/to/mw-config.json" bun run dev:mcp
```

**Database initialization errors:**
```bash
# Recreate database
rm -f packages/mcp-server/data/tickets.db
bun run db:migrate
```

## Development

To add a new tool:
1. Create a new file in `src/tools/`
2. Define the schema and tool implementation
3. Register it in `src/index.ts`
4. Update `mcp.json`

## System Prompt

Use the system prompt from `/docs/mcp-server-plan.md` to configure your AI assistant for MoneyWorks-specific tasks.