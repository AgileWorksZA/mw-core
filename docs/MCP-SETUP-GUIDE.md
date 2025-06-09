# MoneyWorks MCP Server Setup Guide

## Overview

This guide provides complete setup instructions for the MoneyWorks MCP (Model Context Protocol) server, which provides AI assistants with access to MoneyWorks accounting operations through 44 specialized tools.

## 🎯 **Current Status: Production Ready**

✅ **Authentication Issues Resolved**: Complete MoneyWorks API authentication working  
✅ **MCP Server Functional**: All 44 tools operational and tested  
✅ **Database Issues Fixed**: logTicket tool working properly  
✅ **Claude Desktop Compatible**: Configuration optimized for both CLI and Desktop  

## Prerequisites

### System Requirements

1. **Bun Runtime**: Latest version installed (`curl -fsSL https://bun.sh/install | bash`)
2. **MoneyWorks DataCentre**: Version 9.2+ running and accessible
3. **Network Access**: AI environment must reach MoneyWorks server
4. **MoneyWorks Document**: Must be open and available via REST API

### MoneyWorks Server Requirements

- **REST API Enabled**: MoneyWorks DataCentre with REST API active (port 6710)
- **Document Open**: Target `.moneyworks` document must be open in DataCentre
- **User Account**: Valid MoneyWorks user with API access permissions
- **Network Access**: Server reachable from Claude environment

## Step 1: Project Setup

### 1.1 Install Dependencies

```bash
# Navigate to project root
cd mw-core

# Install all dependencies
bun install

# Set up MCP server database
cd packages/mcp-server
bun run db:migrate
```

### 1.2 Verify Project Structure

```
mw-core/
├── packages/
│   ├── api/                    # MoneyWorks API service
│   │   ├── mw-config.json     # MoneyWorks configuration
│   │   └── cache/             # API response cache
│   ├── mcp-server/            # MCP server implementation
│   │   ├── src/index.ts       # MCP server entry point
│   │   └── data/tickets.db    # Error tracking database
│   └── web/                   # Web client (optional)
└── docs/                      # Documentation
```

## Step 2: MoneyWorks Configuration

### 2.1 Create Configuration File

Create `packages/api/mw-config.json`:

```json
{
  "host": "your-moneyworks-server.local",
  "port": 6710,
  "protocol": "http",
  "dataFile": "YourCompany.moneyworks",
  "username": "support",
  "password": "your-document-password",
  "folderAuth": {
    "folderName": "YourFolder",
    "password": "your-folder-password"
  }
}
```

### 2.2 Authentication Configuration

**For Folder-Based Documents** (most common):
- **Document Auth**: `username:Document:password`
- **Folder Auth**: `folderName:Datacentre:folderPassword`
- **Both required**: System uses dual Authorization headers

**For Root-Level Documents**:
- **Document Auth Only**: Remove `folderAuth` section
- **Single header**: Only document authentication needed

### 2.3 Test MoneyWorks Connection

```bash
# Test from project root
MW_CONFIG_PATH="./packages/api/mw-config.json" bun run packages/api/src/cli/tools/test-connection.ts

# Or test manually with curl
FOLDER_CREDS=$(echo -n 'YourFolder:Datacentre:folderPassword' | base64)
DOC_CREDS=$(echo -n 'support:Document:your-document-password' | base64)

curl -H "Authorization: Basic $FOLDER_CREDS" \
     -H "Authorization: Basic $DOC_CREDS" \
     "http://your-server:6710/REST/YourCompany.moneyworks/evaluate?expr=1%2B1"
```

Expected response: `<Result>2</Result>`

## Step 3: Environment Variables

### 3.1 Required Environment Variables

```bash
# MoneyWorks Configuration (required)
MW_CONFIG_PATH="/absolute/path/to/mw-core/packages/api/mw-config.json"

# Error Tracking Database (required)
TICKETS_DB_PATH="/absolute/path/to/mw-core/packages/mcp-server/data/tickets.db"

# Cache Directory (recommended)
MW_CACHE_DIR="/absolute/path/to/mw-core/packages/api/cache"
```

### 3.2 Verify Environment Setup

```bash
# Test MCP server startup
MW_CONFIG_PATH="/full/path/to/mw-config.json" \
TICKETS_DB_PATH="/full/path/to/tickets.db" \
MW_CACHE_DIR="/full/path/to/cache" \
bun run packages/mcp-server/src/index.ts
```

Expected output: `MoneyWorks MCP server started` (to stderr)

## Step 4: Claude Code CLI Configuration

### 4.1 Add MoneyWorks MCP Server

```bash
claude mcp add-json moneyworks-server '{
  "command": "bun",
  "args": ["--cwd", "/absolute/path/to/mw-core/packages/mcp-server", "run", "dev"],
  "env": {
    "MW_CONFIG_PATH": "/absolute/path/to/mw-core/packages/api/mw-config.json",
    "TICKETS_DB_PATH": "/absolute/path/to/mw-core/packages/mcp-server/data/tickets.db", 
    "MW_CACHE_DIR": "/absolute/path/to/mw-core/packages/api/cache"
  }
}' -s user
```

### 4.2 Verify CLI Configuration

```bash
# List configured MCP servers
claude mcp list -s user

# Should show: moneyworks-server
```

### 4.3 Test Claude Code CLI

In Claude Code CLI session:
```bash
# Test account tools
accounts operation=search limit=3

# Test logTicket tool  
logTicket type=feature_request title="Test MCP Setup" description="Verifying MCP server works in Claude Code CLI"
```

## Step 5: Claude Desktop Configuration

### 5.1 Update Desktop Configuration

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "/Users/your-username/.bun/bin/bun",
      "args": ["--silent", "/absolute/path/to/mw-core/packages/mcp-server/src/index.ts"],
      "env": {
        "PATH": "/Users/your-username/.local/share/fnm/aliases/default/bin:/Users/your-username/.bun/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
        "MW_CONFIG_PATH": "/absolute/path/to/mw-core/packages/api/mw-config.json",
        "TICKETS_DB_PATH": "/absolute/path/to/mw-core/packages/mcp-server/data/tickets.db",
        "MW_CACHE_DIR": "/absolute/path/to/mw-core/packages/api/cache"
      }
    }
  }
}
```

### 5.2 Critical Configuration Notes

- **Use `--silent` flag**: Prevents bun output from interfering with MCP JSON protocol
- **Direct script execution**: Runs `src/index.ts` directly instead of package.json script  
- **Absolute paths**: All paths must be absolute, not relative
- **PATH variable**: Include all necessary binary locations

### 5.3 Test Claude Desktop

1. **Restart Claude Desktop** after configuration changes
2. **Test MCP tools**:
   - "Show me the first 3 accounts using the accounts tool"
   - "Create a test ticket using logTicket for testing MCP setup"
   - "Get system information using getSystemInfo"

## Step 6: Verification & Testing

### 6.1 Run Comprehensive Tests

```bash
# Navigate to MCP server directory
cd packages/mcp-server

# Run manual test suite (validates all core tools)
MW_CONFIG_PATH="../api/mw-config.json" \
TICKETS_DB_PATH="data/tickets.db" \
MW_CACHE_DIR="../api/cache" \
bun run test:manual
```

### 6.2 Test Core Functionality

```bash
# Test logTicket tool directly
MW_CONFIG_PATH="../api/mw-config.json" \
TICKETS_DB_PATH="data/tickets.db" \
MW_CACHE_DIR="../api/cache" \
bun run tests/samples/test-logticket.ts
```

### 6.3 Verify Error Tracking

```bash
# Check tickets database
sqlite3 packages/mcp-server/data/tickets.db "SELECT * FROM issues ORDER BY created_at DESC LIMIT 5;"
```

## Available MCP Tools

### Core Data Tools (4 tools)
- **accounts**: Search and retrieve account information
- **transactions**: Access transaction data with filtering
- **names**: Customer/supplier contact management  
- **builds**: Manufacturing/build record access

### System Tools (40 tools)
- **System Information**: `getSystemInfo`, `getSystemStatus`, `getApiCapabilities`
- **Schema Tools**: `listTables`, `describeTableSchema`, `getFieldMetadata`
- **Validation**: `getValidationRules`, `getBusinessRules`
- **Localization**: `getTableLabels`, `getSupportedLanguages`
- **Security**: `getPermissionInfo`, `getUserRoles`
- **And 30+ additional specialized tools**

### Error Tracking (1 tool)
- **logTicket**: Create bug reports, feature requests, and improvement tickets

## Troubleshooting

### Common Issues

**1. "MoneyWorks MCP server not appearing in Claude"**
- Verify absolute paths in configuration
- Check environment variables are set correctly
- Restart Claude Desktop after configuration changes
- Test MCP server startup manually

**2. "DoConnect failed -43" or "DoConnect failed -1"**  
- Verify MoneyWorks DataCentre is running
- Check network connectivity to MoneyWorks server
- Validate authentication credentials in mw-config.json
- Ensure document is open in DataCentre

**3. "NOT NULL constraint failed: issues.type"**
- **RESOLVED**: This issue has been fixed in the current version
- If encountered, verify you're using the latest version from dev/hardy branch

**4. "JSON parsing errors in Claude Desktop logs"**
- **RESOLVED**: Fixed by using `--silent` flag in configuration
- Ensure you're using the updated Claude Desktop configuration with direct script execution

**5. Cache directory errors**
- Ensure MW_CACHE_DIR points to writable directory
- Create cache directory if it doesn't exist: `mkdir -p packages/api/cache`

### Log File Locations

**Claude Desktop Logs:**
```bash
# MoneyWorks MCP server logs
tail -f ~/Library/Logs/Claude/mcp-server-moneyworks.log

# General MCP logs  
tail -f ~/Library/Logs/Claude/mcp.log
```

**Manual Testing:**
```bash
# Test MoneyWorks API connection
bun run packages/api/debug-api.ts

# Test MCP server startup
bun run packages/mcp-server/src/index.ts
```

## Advanced Configuration

### Custom Working Directory

```json
{
  "command": "/Users/username/.bun/bin/bun",
  "args": ["--cwd", "/custom/path", "--silent", "src/index.ts"]
}
```

### Multiple MoneyWorks Instances

```json
{
  "mcpServers": {
    "moneyworks-prod": {
      "command": "/Users/username/.bun/bin/bun",
      "args": ["--silent", "/path/to/mcp-server/src/index.ts"],
      "env": {
        "MW_CONFIG_PATH": "/path/to/prod-config.json"
      }
    },
    "moneyworks-test": {
      "command": "/Users/username/.bun/bin/bun", 
      "args": ["--silent", "/path/to/mcp-server/src/index.ts"],
      "env": {
        "MW_CONFIG_PATH": "/path/to/test-config.json"
      }
    }
  }
}
```

## Next Steps

Once the MCP server is operational:

1. **Explore the Revolutionary MCP Design**: See `docs/mcp-improvements/OPTIMAL-MCP-DESIGN.md`
2. **Review Improvement Roadmap**: See `docs/mcp-improvements/BACKLOG.md`  
3. **Test All 44 Tools**: Use the comprehensive test suite
4. **Implement Business Query Tool**: Next-generation natural language interface

## Support

For issues and improvements:
- **Error Tracking**: Use the logTicket tool to report issues
- **Documentation**: Check `docs/mcp-improvements/` for detailed guides
- **Testing**: Run `bun run test:manual` for validation