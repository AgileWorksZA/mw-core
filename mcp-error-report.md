# MoneyWorks MCP Error Report

## Issue Summary
Unable to execute basic account counting operation due to parameter validation errors across multiple MCP functions.

## Attempted Operations

### 1. account_operations - Attempt 1
```json
{
  "action": "count"
}
```
**Error Response:**
```json
{
  "expected": "'search' | 'get' | 'listFields'",
  "received": "undefined",
  "code": "invalid_type",
  "path": ["operation"],
  "message": "Required"
}
```

### 2. account_operations - Attempt 2
```json
{
  "operation": "search",
  "search": {}
}
```
**Error:** Same as above - "operation" field required but not recognized

### 3. account_operations - Attempt 3
```json
{
  "operation": "search",
  "params": {
    "query": ""
  }
}
```
**Error:** Same validation error on "operation" field

### 4. moneyworks_core - Attempt 1
```json
{
  "operation": "count",
  "table": "account"
}
```
**Error Response:**
```json
[
  {
    "expected": "'validation' | 'permission' | 'schema' | 'dataRelationship' | 'calculation' | 'sequence' | 'constant' | 'searchExpression' | 'system'",
    "received": "undefined",
    "code": "invalid_type",
    "path": ["category"],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": ["operation"],
    "message": "Required"
  }
]
```

### 5. moneyworks_core - Attempt 2
```json
{
  "category": "system",
  "operation": "count",
  "params": {
    "table": "account"
  }
}
```
**Error:** Same validation errors - both "category" and "operation" marked as required but undefined

### 6. log_ticket
```json
{
  "category": "error",
  "description": "Unable to count accounts...",
  "details": {...}
}
```
**Error Response:**
```json
{
  "expected": "'log' | 'list' | 'update' | 'stats'",
  "received": "undefined",
  "code": "invalid_type",
  "path": ["operation"],
  "message": "Required"
}
```

## Key Issues

1. **Parameter Mismatch**: The MCP functions expect an "operation" parameter, but when provided, it's reported as "undefined"
2. **Schema Validation**: The validation is failing even when providing the exact values listed in the error messages
3. **Inconsistent Parameter Names**: Some functions expect "action", others "operation"
4. **Missing Documentation**: The function schemas in the available tools don't clearly specify the required parameter structure

## Recommendations for MCP Developer

1. **Review Parameter Parsing**: Check how the MCP server is parsing the function parameters from Claude's function calls
2. **Verify Schema Definitions**: Ensure the JSONSchema definitions match the actual parameter expectations
3. **Add Debug Logging**: Log the raw parameters received by the MCP server to identify where the disconnect occurs
4. **Provide Clear Examples**: Include working examples in the function descriptions showing the exact parameter structure required

## Expected Behavior
For a simple account count, one would expect:
```json
// Either this:
{
  "operation": "search",
  "params": {
    "table": "account",
    "count": true
  }
}

// Or this:
{
  "operation": "count",
  "table": "account"
}
```

## Environment
- Claude Opus 4
- MoneyWorks MCP Server
- Date: June 12, 2025