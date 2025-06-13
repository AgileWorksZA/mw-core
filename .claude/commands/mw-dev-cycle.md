# MoneyWorks Development Cycle

Complete development cycle automation for MoneyWorks API/MCP development:

1. **Context loading**:
   - Read CLAUDE.md and README.md for project overview
   - Check current MoneyWorks API configuration (`mw-config.json`)
   - Verify MCP server configuration and tools availability
   - Review recent commits related to MoneyWorks functionality

2. **Environment verification**:
   - Check if MoneyWorks DataCentre is accessible
   - Verify MCP server can connect to MoneyWorks API
   - Test core API endpoints (accounts, transactions, names)
   - Validate authentication and permissions

3. **Development workflow**:
   - Run type checking and linting
   - Execute test suite focusing on MoneyWorks integration
   - Check API service layer functionality
   - Verify MCP tools are working correctly

4. **Documentation sync**:
   - Update API documentation if schema changes were made
   - Refresh MCP tool documentation
   - Ensure README reflects current MoneyWorks integration status

5. **Quality assurance**:
   - Test with sample MoneyWorks data queries
   - Verify error handling for authentication failures
   - Check rate limiting and connection pooling
   - Validate data transformation accuracy

6. **Deployment readiness**:
   - Ensure all dependencies are properly defined
   - Check environment variable requirements
   - Verify configuration templates are up to date
   - Test production build process

Arguments: $ARGUMENTS (optional: specific MoneyWorks feature to focus on)