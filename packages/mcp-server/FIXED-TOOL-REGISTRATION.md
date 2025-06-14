# MCP Server Tool Registration Fix - Applied

## Issue Identified

The MCP server tools were incorrectly passing `ZodObject` instances (created by `z.object()`) to the `server.tool()` method. This caused the schema to be placed in the `annotations` field instead of the `inputSchema` field, which prevented Claude Desktop from recognizing the tool parameters.

## Root Cause

The MCP SDK's `server.tool()` method expects:
- A `ZodRawShape` (the raw object with Zod types as values)
- NOT a `ZodObject` (the result of calling `z.object()`)

When passing a `ZodObject`, the SDK doesn't throw an error but incorrectly assigns it to the `annotations` field instead of properly processing it as an input schema.

## Fix Applied

All tool registration files have been updated to use the `.shape` property:

### Files Fixed:
1. ✅ `/src/tools/tables/account.tool.ts`
2. ✅ `/src/tools/tables/transaction.tool.ts`
3. ✅ `/src/tools/tables/name.tool.ts`
4. ✅ `/src/tools/tables/build.tool.ts`
5. ✅ `/src/tools/consolidated/core.tool.ts`
6. ✅ `/src/tools/tickets/log-ticket.tool.ts`

### Change Pattern:
```typescript
// Before (incorrect):
server.tool(
  "tool_name",
  "description",
  schemaObject,     // ❌ ZodObject
  async (params) => { /* ... */ }
);

// After (correct):
server.tool(
  "tool_name",
  "description",
  schemaObject.shape,  // ✅ Raw shape
  async (params) => { /* ... */ }
);
```

## Verification

The fix ensures:
- Tool parameters are properly recognized by the MCP SDK
- The schema is placed in the `inputSchema` field (not `annotations`)
- Claude Desktop should now see all tool parameters correctly

## Next Steps

1. Restart the MCP server
2. Restart Claude Desktop
3. Verify that all tools now show their parameters correctly in Claude Desktop

## Test Results

Created test files demonstrating:
- The issue with incorrect registration
- The correct registration pattern
- How the SDK handles both cases differently

The test confirmed that when using `.shape`, the inputSchema is properly set, allowing Claude Desktop to recognize the tool parameters.