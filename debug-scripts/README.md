# Debug Scripts

This directory contains debugging and testing scripts created during the MoneyWorks authentication and MCP integration development sessions.

## Scripts Overview

### `auth-verification.js`
**Purpose**: Validate MoneyWorks dual authentication header generation  
**Created**: During authentication debugging session  
**Status**: Historical - authentication issues are now fixed  
**Note**: Uses old password format - created before password fix  

**What it does**:
- Tests authentication header implementations
- Validates credential string formatting
- Compares Base64 encoding with test vectors
- Identifies header structure differences

### `debug-api.ts`
**Purpose**: Test MoneyWorks API service configuration and functionality  
**Created**: During authentication debugging session  
**Status**: Working validation tool  

**What it does**:
- Loads MoneyWorks configuration
- Tests API service connectivity
- Validates basic operations (expression evaluation, table exports)
- Confirms authentication works correctly

### `debug-config.js`
**Purpose**: Verify configuration file loading and validation  
**Created**: During authentication debugging session  
**Status**: Utility tool for config validation  

**What it does**:
- Checks mw-config.json existence and parsing
- Displays configuration with masked passwords
- Validates required authentication fields

### `test-config.ts`
**Purpose**: Comprehensive MCP server configuration validation  
**Created**: During MCP integration debugging session  
**Status**: Essential pre-startup validation tool  

**What it does**:
- Validates environment variables
- Tests workspace dependencies
- Verifies database connectivity
- Tests MCP tool imports (115 tools)
- Validates MCP SDK integration

## Usage

These scripts can be run independently to validate different aspects of the system:

```bash
# Test configuration loading
node debug-scripts/debug-config.js

# Test API service functionality  
cd packages/api && bun run ../../debug-scripts/debug-api.ts

# Comprehensive MCP server validation
cd packages/mcp-server && bun run ../../debug-scripts/test-config.ts

# Historical authentication analysis
node debug-scripts/auth-verification.js
```

## Key Discoveries

1. **Authentication Fix**: MoneyWorks requires array format for dual headers: `Authorization: [folderAuth, documentAuth]`
2. **Password Correction**: Document password changed from `shalom1024` to `support1024`
3. **Parameter Binding**: SQLite requires positional parameters (`?`) not named parameters (`$param`)
4. **Schema Validation**: Zod schemas need `.nullable().optional()` for database fields

## Current Status

- ✅ Authentication system: **FULLY WORKING**
- ✅ MCP server integration: **OPERATIONAL**  
- ✅ Error tracking (logTicket): **FIXED**
- ✅ 115 MoneyWorks tools: **AVAILABLE**

These scripts represent the debugging journey and can be used for future troubleshooting or validation.