# Bug Ticket: Fields Parameter Not Working in TableService

## Issue Summary
The `fields` parameter in TableService.getData() is not working correctly, causing API calls to return null values for all fields when a fields array is specified.

## Root Cause
In `/packages/api/src/services/tables/base/table.service.ts`:

1. Line 71: When fields are specified, format is set to `undefined` instead of properly formatting the fields
   ```typescript
   format: params.fields ? undefined : "xml-verbose",
   ```

2. Line 72: The fields parameter is commented out and never passed to the API
   ```typescript
   // fields: params.fields ?? (this.fields as string[]),
   ```

## Impact
- Name tool was returning null values for all fields when listing records
- Any tool using the fields parameter would experience the same issue

## Temporary Fix Applied
Removed the `fields` parameter from name tool's getData calls to use the default behavior which returns all fields properly.

## Permanent Fix Needed
The TableService needs to be updated to:
1. Properly pass the fields parameter to the MoneyWorksApiService
2. Ensure the format is set correctly when fields are specified
3. The MoneyWorksApiService already has proper support for fields (lines 120-137)

## Affected Code
- `/packages/api/src/services/tables/base/table.service.ts` - lines 71-72
- Any tools that use the fields parameter in getData()

## Test Case
```typescript
// This should return only specified fields, not null values
const result = await nameService.getData({
  fields: ["Code", "Name", "Email"],
  limit: 10
});
```

## Priority
High - This affects data retrieval for AI agents using the MCP tools