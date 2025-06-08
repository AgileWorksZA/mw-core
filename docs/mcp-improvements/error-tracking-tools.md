# Error Tracking and Support Tools Improvements

## Overview

This document tracks improvements for the MoneyWorks MCP error tracking and support tools. Currently, this category contains 1 tool that handles bug reports, feature requests, and improvement tracking.

## Tools in This Category

### 1. logTicket - Bug and Feature Tracking

**Purpose**: Log tickets for bugs, feature requests, or improvements in the MoneyWorks MCP tools  
**Current Status**: 🔥 **CRITICAL ISSUE** - Tool is completely non-functional  
**Priority**: Critical (Blocking)

---

## 🔥 CRITICAL ISSUE: logTicket Database Constraint Error

### Problem Description

The `logTicket` tool fails with a database constraint error despite receiving valid parameters. This completely blocks the ability to track issues and improvements through the MCP interface.

**Error Message**:
```
"NOT NULL constraint failed: issues.type"
```

### Technical Analysis

#### Current Tool Interface
```typescript
{
  "type": "bug" | "feature_request" | "improvement",
  "title": "Brief title summarizing the issue",
  "description": "Detailed description of the problem",
  "severity": "low" | "medium" | "high" | "critical",
  "toolName": "Name of the tool that caused the issue",
  "suggestedSolution": "Any suggested solution or implementation approach",
  "tags": ["array", "of", "tags"],
  "userPrompt": "The original user prompt that led to this issue",
  "attemptedAction": "What action was attempted",
  "expectedBehavior": "What was expected to happen",
  "actualBehavior": "What actually happened",
  "errorMessage": "Any error message received",
  "context": { "key": "value", "additional": "context" }
}
```

#### Root Cause
The tool is not properly mapping the `type` parameter from the input to the database insert operation, causing the NOT NULL constraint to fail.

#### Expected Database Schema
```sql
CREATE TABLE IF NOT EXISTS issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK (type IN ('bug', 'feature_request', 'improvement')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  tool_name TEXT,
  suggested_solution TEXT,
  tags TEXT, -- JSON array as string
  user_prompt TEXT,
  attempted_action TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT,
  error_message TEXT,
  context TEXT, -- JSON object as string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed'))
);
```

### Required Fix Implementation

#### 1. Parameter Mapping Fix

**File**: `packages/mcp-server/src/tools/moneyworks/log-ticket.ts`

```typescript
// BROKEN: Missing type parameter mapping
const ticket = {
  title: args.title,
  description: args.description,
  severity: args.severity,
  // Missing: type mapping causes NOT NULL error
};

// FIXED: Include all parameter mappings
const ticket = {
  type: args.type,                    // ← CRITICAL: Add this line
  title: args.title,
  description: args.description,
  severity: args.severity || 'medium',
  tool_name: args.toolName,
  suggested_solution: args.suggestedSolution,
  tags: JSON.stringify(args.tags || []),
  user_prompt: args.userPrompt,
  attempted_action: args.attemptedAction,
  expected_behavior: args.expectedBehavior,
  actual_behavior: args.actualBehavior,
  error_message: args.errorMessage,
  context: JSON.stringify(args.context || {}),
  status: 'open',
  created_at: new Date().toISOString()
};
```

#### 2. Input Validation

```typescript
export async function logTicket(args: LogTicketArgs): Promise<LogTicketResult> {
  // Validate required parameters
  if (!args.type) {
    throw new Error('Parameter "type" is required');
  }
  
  if (!['bug', 'feature_request', 'improvement'].includes(args.type)) {
    throw new Error('Parameter "type" must be one of: bug, feature_request, improvement');
  }
  
  if (!args.title?.trim()) {
    throw new Error('Parameter "title" is required and cannot be empty');
  }
  
  if (!args.description?.trim()) {
    throw new Error('Parameter "description" is required and cannot be empty');
  }
  
  // Validate severity if provided
  if (args.severity && !['low', 'medium', 'high', 'critical'].includes(args.severity)) {
    throw new Error('Parameter "severity" must be one of: low, medium, high, critical');
  }
  
  // ... continue with database operation
}
```

#### 3. Error Handling Enhancement

```typescript
try {
  const result = await database.insert('issues', ticket);
  return {
    success: true,
    ticketId: result.id,
    message: `${args.type.replace('_', ' ')} logged successfully`,
    ticket: {
      id: result.id,
      type: args.type,
      title: args.title,
      status: 'open',
      created_at: ticket.created_at
    }
  };
} catch (error) {
  console.error('Failed to create ticket:', error);
  return {
    success: false,
    message: `Failed to create ${args.type.replace('_', ' ')}: ${error.message}`,
    error: error.message,
    troubleshooting: {
      suggestion: "Check database schema and parameter mapping",
      common_causes: [
        "Missing required parameter mapping",
        "Database schema mismatch",
        "Invalid parameter values"
      ]
    }
  };
}
```

### Testing Strategy

#### Test Cases

1. **Valid Feature Request**
```typescript
const testFeatureRequest = {
  type: "feature_request",
  title: "Improve accounts endpoint response structure",
  description: "Add hierarchical field organization and human-readable labels",
  severity: "medium",
  toolName: "mcp__moneyworks__accounts",
  suggestedSolution: "Implement enhanced response format with backward compatibility"
};
```

2. **Valid Bug Report**
```typescript
const testBugReport = {
  type: "bug",
  title: "Transaction pagination fails with large datasets",
  description: "Query times out when requesting transactions with limit > 100",
  severity: "high",
  toolName: "mcp__moneyworks__transactions",
  errorMessage: "Query timeout after 30 seconds"
};
```

3. **Invalid Parameters (Should Fail Gracefully)**
```typescript
const testInvalidType = {
  type: "invalid_type",
  title: "Should fail validation",
  description: "This should be rejected with clear error message"
};
```

#### Validation Criteria

- [ ] Tool accepts all valid ticket types
- [ ] Tool rejects invalid parameters with clear error messages
- [ ] All parameters are correctly stored in database
- [ ] Response includes ticket ID and confirmation
- [ ] Database constraints are properly enforced
- [ ] Error handling provides helpful troubleshooting information

---

## Post-Fix Improvements

Once the critical database constraint issue is resolved, the following enhancements should be considered:

### 1. Enhanced Ticket Management

**Current**: Basic ticket creation only  
**Proposed**: Full ticket lifecycle management

#### Features to Add:
- **Ticket Status Updates**: Allow updating ticket status (open → in_progress → resolved → closed)
- **Ticket Retrieval**: Get ticket details by ID or search criteria
- **Ticket Listing**: List tickets with filtering and pagination
- **Ticket Comments**: Add comments and updates to existing tickets

#### Implementation:
```typescript
// Additional operations for logTicket tool
{
  operation: "create" | "update" | "get" | "list" | "comment",
  // ... existing parameters for create
  // Additional parameters for other operations
  ticketId?: number,
  status?: "open" | "in_progress" | "resolved" | "closed",
  comment?: string,
  filters?: {
    type?: string,
    status?: string,
    toolName?: string,
    severity?: string
  }
}
```

### 2. Integration with Development Workflow

#### GitHub Integration
- **Issue Synchronization**: Create GitHub issues for high-priority tickets
- **Pull Request Linking**: Link tickets to code changes
- **Automated Status Updates**: Update ticket status based on code commits

#### Reporting and Analytics
- **Ticket Metrics**: Track resolution times, most common issues
- **Tool Quality Metrics**: Identify tools with most issues
- **Trend Analysis**: Monitor improvement over time

### 3. Enhanced Validation and Categorization

#### Smart Categorization
- **Auto-tagging**: Automatically suggest tags based on title/description
- **Duplicate Detection**: Identify similar existing tickets
- **Priority Scoring**: Suggest priority based on tool usage and impact

#### Rich Context Capture
- **Environment Information**: Capture system info when logging tickets
- **User Session Data**: Include relevant session context
- **Performance Metrics**: Capture timing and performance data

---

## Implementation Priority

### Phase 1: Critical Fix (Immediate)
- [ ] Fix database constraint error
- [ ] Implement proper parameter validation
- [ ] Add comprehensive error handling
- [ ] Create test suite for basic functionality

### Phase 2: Enhanced Functionality (Short-term)
- [ ] Add ticket status management
- [ ] Implement ticket retrieval and listing
- [ ] Add ticket commenting system
- [ ] Create reporting dashboard

### Phase 3: Advanced Integration (Long-term)
- [ ] GitHub issue synchronization
- [ ] Automated duplicate detection
- [ ] Advanced analytics and reporting
- [ ] Smart categorization and tagging

---

## Success Metrics

### Immediate (Post-Fix)
- [ ] 100% success rate for valid ticket creation
- [ ] Clear error messages for invalid inputs
- [ ] All ticket parameters properly stored
- [ ] Response time < 1 second for ticket creation

### Short-term (Enhanced Functionality)
- [ ] Complete ticket lifecycle management
- [ ] Integration with development workflow
- [ ] Automated reporting capabilities
- [ ] User satisfaction with issue tracking

### Long-term (Advanced Features)
- [ ] Reduced duplicate ticket creation
- [ ] Faster issue resolution times
- [ ] Improved tool quality metrics
- [ ] Comprehensive development analytics

This error tracking system is foundational to the entire MCP improvement process. Once the critical fix is implemented, it will enable systematic tracking and resolution of all other improvements documented in this system.