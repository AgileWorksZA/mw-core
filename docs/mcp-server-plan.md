# MoneyWorks MCP Server Implementation Plan

## Overview
This document outlines the plan to build an MCP (Model Context Protocol) server that integrates with the MoneyWorks API to create an AI assistant specifically for MoneyWorks users. The system includes error tracking via SQLite for continuous improvement.

## Architecture Components

### 1. MCP Server Structure
```
mcp-server/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── tools/                # MCP tool implementations
│   │   ├── account.ts
│   │   ├── transaction.ts
│   │   ├── name.ts
│   │   ├── product.ts
│   │   └── ...
│   ├── services/
│   │   ├── moneyworks-client.ts  # HTTP client for mw-core API
│   │   └── ticket-service.ts     # Issue tracking service
│   ├── database/
│   │   ├── schema.ts         # SQLite schema definitions
│   │   └── migrations/
│   └── types/
├── mcp.json                  # MCP server configuration
└── package.json
```

### 2. SQLite Ticketing Schema

```sql
-- Issues table for tracking failures and feature requests
CREATE TABLE issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Issue categorization
    type TEXT NOT NULL CHECK(type IN ('bug', 'feature_request', 'improvement')),
    severity TEXT NOT NULL CHECK(severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved', 'closed')),
    
    -- Context information
    user_prompt TEXT NOT NULL,
    ai_attempted_action TEXT,
    mcp_tool_used TEXT,
    api_endpoint TEXT,
    
    -- Error details
    error_message TEXT,
    error_stack TEXT,
    api_response_code INTEGER,
    api_response_body TEXT,
    
    -- Resolution tracking
    resolution_notes TEXT,
    resolved_by TEXT,
    resolved_at DATETIME,
    
    -- Metadata
    session_id TEXT,
    moneyworks_version TEXT,
    api_version TEXT
);

-- Context table for additional request/response data
CREATE TABLE issue_context (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER NOT NULL,
    context_type TEXT NOT NULL CHECK(context_type IN ('request', 'response', 'state')),
    context_data TEXT NOT NULL, -- JSON data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id)
);

-- Tags for categorizing and searching issues
CREATE TABLE issue_tags (
    issue_id INTEGER NOT NULL,
    tag TEXT NOT NULL,
    PRIMARY KEY (issue_id, tag),
    FOREIGN KEY (issue_id) REFERENCES issues(id)
);

-- Create indexes for common queries
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_type ON issues(type);
CREATE INDEX idx_issues_created_at ON issues(created_at);
CREATE INDEX idx_issue_tags_tag ON issue_tags(tag);
```

### 3. MCP Tool Definitions

Each MoneyWorks table will have corresponding MCP tools:

```typescript
// Example tool structure
export const accountTools = {
  searchAccounts: {
    description: "Search for accounts in MoneyWorks",
    parameters: {
      query: { type: "string", description: "Search query" },
      type: { type: "string", enum: ["IN", "SA", "EX", "CS", "CA", "CL", "FA", "TA", "TL", "SF"] },
      limit: { type: "number", default: 50 }
    }
  },
  
  getAccount: {
    description: "Get a specific account by code",
    parameters: {
      code: { type: "string", required: true }
    }
  },
  
  createAccount: {
    description: "Create a new account",
    parameters: {
      code: { type: "string", required: true },
      description: { type: "string", required: true },
      type: { type: "string", required: true },
      // ... other fields
    }
  }
};
```

### 4. Error Handling & Ticket Creation

```typescript
class TicketService {
  async createTicket(context: {
    userPrompt: string;
    attemptedAction: string;
    tool: string;
    error: Error;
    apiDetails?: {
      endpoint: string;
      statusCode?: number;
      responseBody?: string;
    };
  }): Promise<number> {
    // Log to SQLite database
    // Return ticket ID
  }
}
```

## MoneyWorks AI Assistant System Prompt

```markdown
You are a specialized AI assistant for MoneyWorks accounting software. Your primary role is to help users with their accounting tasks, queries, and operations within the MoneyWorks system.

## Core Responsibilities
1. **Accounting Operations**: Help users create, search, update, and manage:
   - Accounts (Chart of Accounts)
   - Transactions (invoices, bills, payments, receipts)
   - Customers and Suppliers (Names)
   - Products and Inventory
   - Jobs and Projects
   - Reports and Analysis

2. **Data Queries**: Assist with finding and analyzing financial data, generating reports, and understanding account balances.

3. **Best Practices**: Provide guidance on proper accounting procedures and MoneyWorks-specific workflows.

## Boundaries
- **Focus exclusively on MoneyWorks and accounting-related tasks**
- Politely decline requests unrelated to accounting or MoneyWorks
- If asked about non-accounting topics, respond: "I'm specialized in MoneyWorks accounting software. I can help you with accounting tasks, financial queries, and MoneyWorks operations. For other topics, please consult a general-purpose assistant."

## Tools Available
You have access to MCP tools for:
- Searching and managing accounts
- Creating and querying transactions
- Managing customers/suppliers
- Product and inventory operations
- Job tracking
- Report generation

## Error Handling
When an operation fails:
1. Explain the issue clearly to the user
2. Log the error for system improvement (this happens automatically)
3. Suggest alternative approaches if available
4. If it's a system limitation, acknowledge it and note that it's been logged for future enhancement

## Communication Style
- Be professional but approachable
- Use accounting terminology appropriately
- Provide clear explanations for complex accounting concepts
- Confirm critical operations before executing (e.g., "Shall I create this invoice for $X,XXX?")

## Example Interactions
✅ "Show me all unpaid invoices from last month"
✅ "Create a new expense account for office supplies"
✅ "What's the current balance of accounts receivable?"
✅ "Help me reconcile this bank account"

❌ "What's the weather today?" → Redirect to accounting assistance
❌ "Write me a poem" → Redirect to accounting assistance
❌ "Help me with my website" → Redirect to accounting assistance
```

## Implementation Steps

1. **Phase 1: Core MCP Server**
   - Set up basic MCP server structure
   - Implement authentication with mw-core API
   - Create basic tool definitions

2. **Phase 2: SQLite Integration**
   - Set up SQLite database and schema
   - Implement TicketService
   - Add error tracking to all tools

3. **Phase 3: Tool Implementation**
   - Implement tools for each MoneyWorks table
   - Add proper error handling and validation
   - Test with common use cases

4. **Phase 4: Enhancement**
   - Add advanced query capabilities
   - Implement batch operations
   - Add report generation tools

5. **Phase 5: Monitoring & Improvement**
   - Dashboard for viewing tickets
   - Analytics on common failures
   - Continuous improvement based on tickets

## Configuration (mcp.json)

```json
{
  "name": "moneyworks-assistant",
  "version": "1.0.0",
  "description": "MCP server for MoneyWorks accounting operations",
  "main": "dist/index.js",
  "commands": {
    "start": "bun run src/index.ts"
  },
  "config": {
    "apiUrl": "http://localhost:3000",
    "apiKey": "${MONEYWORKS_API_KEY}",
    "databasePath": "./data/tickets.db",
    "maxRetries": 3,
    "timeout": 30000
  }
}
```

## Success Metrics

1. **Functionality Coverage**: Percentage of MoneyWorks operations supported
2. **Error Rate**: Number of tickets created per 100 operations
3. **Resolution Time**: Average time to resolve logged issues
4. **User Success Rate**: Percentage of user requests completed successfully

## Security Considerations

1. **API Authentication**: Secure storage of MoneyWorks credentials
2. **Data Privacy**: Ensure sensitive financial data is properly handled
3. **Audit Trail**: Log all operations for compliance
4. **Input Validation**: Sanitize all user inputs before API calls