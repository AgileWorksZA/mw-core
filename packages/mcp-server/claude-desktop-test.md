# Claude Desktop MCP Server Test Instructions

## Configuration Applied

Updated `/Users/hjonck/Library/Application Support/Claude/claude_desktop_config.json` with:

```json
{
  "mcpServers": {
    "moneyworks": {
      "command": "/Users/hjonck/.bun/bin/bun",
      "args": ["--silent", "/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/packages/mcp-server/src/index.ts"],
      "env": {
        "PATH": "/Users/hjonck/.local/share/fnm/aliases/default/bin:/Users/hjonck/.bun/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
        "MW_CONFIG_PATH": "/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/packages/api/mw-config.json",
        "TICKETS_DB_PATH": "/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/packages/mcp-server/data/tickets.db",
        "MW_CACHE_DIR": "/Users/hjonck/Development/gitprojects/AgileWorksZA/mw-core/packages/api/cache"
      }
    }
  }
}
```

## Key Fixes Applied

1. **Added `--silent` flag** to suppress bun debug output that was interfering with MCP JSON protocol
2. **Direct script execution** using full path to `src/index.ts` instead of package.json script
3. **Proper environment variables** for MoneyWorks API and cache configuration

## Test Commands to Try in Claude Desktop

### 1. Test Account Tools
```
Can you show me the first 3 accounts from MoneyWorks using the accounts tool?
```

### 2. Test logTicket Tool  
```
Create a test ticket using logTicket with type "feature_request", title "Test Claude Desktop MCP Integration", and description "Testing that MoneyWorks MCP tools work in Claude Desktop interface"
```

### 3. Test Contact Search
```
Search for all customers using the names tool with limit 5
```

### 4. Test System Information
```
Get the system information using getSystemInfo to verify MoneyWorks connection
```

## Expected Results

- All 44 MCP tools should be available
- MoneyWorks API authentication should work
- Database operations should function
- Tickets should be created successfully

## Next Steps After Testing

1. Restart Claude Desktop
2. Try the test commands above
3. Verify tools are accessible and working
4. Document any issues found