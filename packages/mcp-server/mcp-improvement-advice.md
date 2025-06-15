# MCP Development Advice for Better First-Shot Success

Based on my experience trying to use this MCP, here's the advice I'd give to the developer:

## 1. **Simplify the Function Parameter Structure**
The biggest issue is unclear parameter requirements. Instead of nested objects or complex structures, consider flattening the parameters:

```javascript
// Current (unclear):
account_operations({ /* what goes here? */ })

// Better:
account_operations({
  operation: "search",
  searchText: "*",
  fields: ["code", "description", "balance"]
})
```

## 2. **Provide Clear Parameter Documentation**
The function descriptions need explicit parameter examples:

```javascript
{
  "description": "Search accounts",
  "name": "account_operations",
  "parameters": {
    "type": "object",
    "properties": {
      "operation": {
        "type": "string",
        "enum": ["search", "get", "listFields"],
        "description": "The operation to perform"
      },
      "searchText": {
        "type": "string",
        "description": "Search query (use * for all)"
      }
    },
    "required": ["operation"]
  }
}
```

## 3. **Add a Simple "Get Started" Function**
Create basic functions for common queries:

```javascript
// Instead of complex multi-purpose functions:
get_account_count()  // No parameters needed
list_all_accounts({ limit: 100 })
get_account_by_code({ code: "1000" })
```

## 4. **Better Error Messages**
Current errors like `"expected": "'validation' | 'permission' | 'schema'..."` don't help. Provide actionable error messages:

```
Error: Missing required parameter 'operation'. 
Expected format: { operation: "search", searchText: "your search" }
Example: account_operations({ operation: "search", searchText: "*" })
```

## 5. **Include Working Examples in Each Function Description**
Add real examples that can be copy-pasted:

```javascript
{
  "description": "Search accounts. Example: {\"operation\": \"search\", \"params\": {\"search\": \"*\"}} returns all accounts",
  "name": "account_operations",
  ...
}
```

## 6. **Consider a Help Function**
Add a function that returns examples and common use cases:

```javascript
moneyworks_help({ topic: "accounts" })
// Returns: Common account operations with examples
```

## 7. **Test with Multiple LLMs**
Different LLMs may interpret function schemas differently. Test with Claude, GPT-4, and others to ensure compatibility.

## 8. **Progressive Disclosure**
Start with simple functions and add complexity only when needed:
- Level 1: `get_account_count()`, `list_accounts()`
- Level 2: `search_accounts({ query: "bank" })`
- Level 3: `account_operations({ complex options })`

The core issue is that the current implementation requires too much guesswork about parameter structure. Making the interface more intuitive and self-documenting would greatly improve the first-shot success rate.