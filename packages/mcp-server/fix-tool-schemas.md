# MCP Server Tool Registration Fix

## Problem Identified

The MCP server tools are incorrectly passing `ZodObject` instances to `server.tool()` instead of raw Zod shapes. According to the MCP SDK type definitions, the `server.tool()` method expects a `ZodRawShape` (the object passed to `z.object()`), not the result of `z.object()`.

## Current (Incorrect) Pattern

```typescript
// INCORRECT: Creating a ZodObject
const accountInputSchema = z.object({
  operation: z.enum(["search", "get"]).describe("Operation to perform"),
  // ... other fields
});

server.tool(
  "account_operations",
  "Description",
  accountInputSchema, // ❌ This is wrong - passing ZodObject
  async (params) => { /* ... */ }
);
```

## Solution

### Option 1: Use Raw Shape Directly

```typescript
// CORRECT: Define raw shape
const accountInputShape = {
  operation: z.enum(["search", "get"]).describe("Operation to perform"),
  // ... other fields
};

// Optional: Create schema for validation
const accountInputSchema = z.object(accountInputShape);

server.tool(
  "account_operations",
  "Description",
  accountInputShape, // ✅ Correct - passing raw shape
  async (params) => {
    // Can still use schema for validation
    const input = accountInputSchema.parse(params);
    // ...
  }
);
```

### Option 2: Use .shape Property

```typescript
// Define schema as usual
const accountInputSchema = z.object({
  operation: z.enum(["search", "get"]).describe("Operation to perform"),
  // ... other fields
});

server.tool(
  "account_operations",
  "Description",
  accountInputSchema.shape, // ✅ Use .shape to extract raw shape
  async (params) => {
    const input = accountInputSchema.parse(params);
    // ...
  }
);
```

## Files That Need Fixing

All tool registration files need to be updated:

1. `/src/tools/tables/account.tool.ts`
2. `/src/tools/tables/transaction.tool.ts`
3. `/src/tools/tables/name.tool.ts`
4. `/src/tools/tables/build.tool.ts`
5. `/src/tools/consolidated/core.tool.ts`
6. `/src/tools/tickets/log-ticket.tool.ts`

## Quick Fix Script

To fix all files, you can use this sed command:

```bash
# For each file, replace the schema parameter with .shape
find src/tools -name "*.tool.ts" -exec sed -i.bak 's/\(server\.tool([^,]*,[^,]*,\s*\)\([a-zA-Z]*Schema\)/\1\2.shape/g' {} \;
```

Or manually update each file to use one of the two patterns shown above.

## Why This Matters

This issue is likely causing Claude Desktop to not recognize the tool parameters correctly because:

1. The MCP SDK expects a specific type (`ZodRawShape`) for parameter schemas
2. Passing a `ZodObject` instead may cause the SDK to not properly extract parameter information
3. This could lead to tools appearing without parameters or with incorrect parameter definitions

## Testing the Fix

After applying the fix, test with:

1. Restart the MCP server
2. Check if Claude Desktop now recognizes all tool parameters
3. Verify tools can be called with the correct arguments