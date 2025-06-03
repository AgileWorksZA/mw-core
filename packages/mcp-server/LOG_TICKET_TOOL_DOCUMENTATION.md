# Log Ticket Tool Documentation

## Overview

The `logTicket` tool allows AI agents to directly log tickets when they encounter problems, bugs, or identify missing features in the MoneyWorks MCP tools. This provides a structured way for AI assistants to report issues without requiring manual intervention.

## Tool Details

- **Tool Name**: `logTicket`
- **Description**: Log a ticket for bugs, feature requests, or improvements in the MoneyWorks MCP tools

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | enum | Yes | Type of ticket: `bug`, `feature_request`, or `improvement` |
| `severity` | enum | No | Severity level: `low`, `medium`, `high`, or `critical` (default: `medium`) |
| `toolName` | string | No | Name of the tool that caused the issue or needs the feature |
| `title` | string | Yes | Brief title summarizing the issue or feature request |
| `description` | string | Yes | Detailed description of the problem, steps to reproduce, or feature requirements |
| `userPrompt` | string | No | The original user prompt that led to this issue |
| `attemptedAction` | string | No | What action was attempted when the issue occurred |
| `errorMessage` | string | No | Any error message received |
| `expectedBehavior` | string | No | What was expected to happen |
| `actualBehavior` | string | No | What actually happened |
| `suggestedSolution` | string | No | Any suggested solution or implementation approach |
| `context` | object | No | Additional context data as key-value pairs |
| `tags` | array | No | Tags to categorize this ticket (e.g., 'api', 'schema', 'validation') |

## Usage Examples

### Example 1: Reporting a Bug

```json
{
  "type": "bug",
  "severity": "high",
  "toolName": "accounts",
  "title": "Account search fails with type filter",
  "description": "When searching for accounts with type='IN' (Income), the API returns an error saying the type code is invalid.",
  "userPrompt": "Find all income accounts",
  "attemptedAction": "Called accounts tool with operation='search' and type='IN'",
  "errorMessage": "Invalid type code: IN",
  "expectedBehavior": "Should return all income accounts",
  "actualBehavior": "Returns error about invalid type code",
  "context": {
    "apiVersion": "1.0.0",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "tags": ["accounts", "validation", "type-mapping"]
}
```

### Example 2: Feature Request

```json
{
  "type": "feature_request",
  "severity": "medium",
  "title": "Add bulk operations support",
  "description": "It would be helpful to have a bulk operations tool that can process multiple records at once, such as updating multiple transactions or creating multiple accounts in a single operation.",
  "userPrompt": "Update 50 transactions to change their category",
  "suggestedSolution": "Create a new tool called 'bulkOperations' with support for batch create, update, and delete operations across different entity types",
  "tags": ["enhancement", "performance", "bulk-operations"]
}
```

### Example 3: Improvement Suggestion

```json
{
  "type": "improvement",
  "severity": "low",
  "toolName": "transactions",
  "title": "Add date range presets to transaction search",
  "description": "The transaction search currently requires explicit date ranges. It would be more convenient to have preset options like 'today', 'this_week', 'this_month', 'last_month', etc.",
  "expectedBehavior": "Support preset date ranges in addition to explicit dates",
  "suggestedSolution": "Add a 'datePreset' parameter that accepts values like 'today', 'this_week', etc., and converts them to appropriate date ranges",
  "tags": ["usability", "transactions", "date-filtering"]
}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "ticketId": 123,
  "message": "Ticket #123 created successfully",
  "ticket": {
    "id": 123,
    "type": "bug",
    "severity": "high",
    "status": "open",
    "title": "Account search fails with type filter",
    "description": "...",
    "createdAt": "2024-01-15T10:30:00Z",
    "tags": ["accounts", "validation", "type-mapping"]
  },
  "nextSteps": [
    "The development team will review this ticket",
    "We'll investigate and fix the issue"
  ]
}
```

### Error Response

```json
{
  "success": false,
  "message": "Failed to create ticket, but your feedback has been noted",
  "error": "Database connection error",
  "alternativeAction": "Please report this issue manually to the development team",
  "reportedIssue": {
    "type": "bug",
    "title": "Account search fails with type filter",
    "description": "..."
  }
}
```

## Best Practices

1. **Be Specific**: Provide clear, detailed descriptions of the issue or feature request
2. **Include Context**: Add relevant context like user prompts, error messages, and attempted actions
3. **Suggest Solutions**: When possible, include suggested solutions or implementation approaches
4. **Use Appropriate Severity**: 
   - `critical`: System is unusable or data integrity issues
   - `high`: Major functionality broken
   - `medium`: Important feature not working as expected
   - `low`: Minor issues or nice-to-have improvements
5. **Tag Appropriately**: Use tags to help categorize and route tickets effectively

## Automatic Features

The tool automatically:
- Assigns a unique ticket ID
- Sets the creation timestamp
- Adds default tags based on ticket type
- Stores all provided context for debugging
- Returns helpful next steps based on ticket type

## When to Use This Tool

Use the `logTicket` tool when:
- A tool returns an unexpected error
- A required feature or operation is not available
- You identify a bug or inconsistency in behavior
- Users request functionality that doesn't exist
- You have suggestions for improvements

This tool ensures that all issues and feature requests are properly tracked and can be addressed by the development team.