# MCP Server Debug

Comprehensive debugging workflow for MoneyWorks MCP server issues:

1. **MCP server status**:
   - Check if MCP server process is running
   - Verify Claude Code can detect MCP tools
   - List all available MCP tools and their status
   - Test basic MCP protocol communication

2. **MoneyWorks connectivity**:
   - Test direct connection to MoneyWorks API
   - Verify authentication credentials are working
   - Check if MoneyWorks DataCentre is accessible
   - Validate API endpoint responses

3. **Configuration analysis**:
   - Review `mw-config.json` for correct settings
   - Check environment variables are properly set
   - Verify MCP server configuration in Claude Code
   - Validate file paths and permissions

4. **Tool-specific debugging**:
   - Test individual MCP tools (listTables, getAccounts, etc.)
   - Check error logs for specific tool failures
   - Verify data transformation and schema validation
   - Test edge cases and error handling

5. **Performance analysis**:
   - Check response times for MCP tool calls
   - Monitor memory usage during operations
   - Identify any bottlenecks or timeout issues
   - Verify connection pooling efficiency

6. **Log analysis**:
   - Review MCP server logs for errors
   - Check Claude Code logs for MCP communication issues
   - Analyze MoneyWorks API response patterns
   - Identify recurring problems or warnings

7. **Resolution steps**:
   - Provide specific fixes for identified issues
   - Suggest configuration optimizations
   - Recommend monitoring or alerting improvements
   - Document solutions for future reference

Arguments: $ARGUMENTS (optional: specific MCP tool or error to debug)