# MoneyWorks MCP Critical Fixes

## Active Issues Requiring Immediate Implementation

---

## 🔥 CRITICAL: Fix #001 - logTicket Database Constraint Error

### Tool: `mcp__moneyworks__logTicket`

**Status**: 🚫 **BLOCKING** - Tool completely non-functional  
**Priority**: Critical  
**Component**: Database parameter mapping  
**Discovered**: 2025-01-06  

### Current Behavior

The `logTicket` tool fails with error:
```
"NOT NULL constraint failed: issues.type"
```

Even when the `type` parameter is explicitly provided as `"feature_request"`, the tool cannot create tickets.

### Expected Behavior

The tool should successfully create tickets when all required parameters are provided:

```typescript
mcp__moneyworks__logTicket({
  type: "feature_request",
  title: "Improve accounts endpoint response structure",
  description: "...",
  toolName: "mcp__moneyworks__accounts",
  severity: "medium"
})
```

Should return:
```json
{
  "success": true,
  "ticketId": 123,
  "message": "Feature request logged successfully"
}
```

### Root Cause Analysis

The database schema expects the `type` field to be non-null, but the tool is not properly passing or mapping the provided `type` parameter to the database insert operation.

### Proposed Solution

**File to Fix**: `packages/mcp-server/src/tools/moneyworks/log-ticket.ts`

#### 1. Parameter Mapping Fix

```typescript
// Current problematic code (likely):
const ticket = {
  title: args.title,
  description: args.description,
  // Missing: type mapping
  severity: args.severity,
  // ... other fields
};

// Fixed code should be:
const ticket = {
  type: args.type,           // ← ADD THIS LINE
  title: args.title,
  description: args.description,
  severity: args.severity,
  tool_name: args.toolName,
  suggested_solution: args.suggestedSolution,
  tags: args.tags,
  user_prompt: args.userPrompt,
  attempted_action: args.attemptedAction,
  expected_behavior: args.expectedBehavior,
  actual_behavior: args.actualBehavior,
  error_message: args.errorMessage,
  context: args.context
};
```

#### 2. Database Schema Validation

Ensure the database table has the correct schema:

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

#### 3. Parameter Validation

Add validation in the tool handler:

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
  
  // ... rest of implementation
}
```

### Implementation Steps

1. [ ] **Locate the logTicket tool implementation**
   - Find `packages/mcp-server/src/tools/moneyworks/log-ticket.ts`
   - Or equivalent file containing the logTicket function

2. [ ] **Add missing type parameter mapping**
   - Ensure `args.type` is included in the database insert object
   - Verify all other parameters are properly mapped

3. [ ] **Add parameter validation**
   - Validate required parameters before database operations
   - Provide clear error messages for invalid inputs

4. [ ] **Test the database schema**
   - Verify the issues table exists with correct constraints
   - Ensure all field types match the expected parameters

5. [ ] **Test the fix**
   - Create a test ticket with valid parameters
   - Verify the ticket is stored correctly in the database
   - Confirm all parameters are preserved

### Testing Validation

After implementation, test with:

```typescript
// Test 1: Valid feature request
mcp__moneyworks__logTicket({
  type: "feature_request",
  title: "Test Feature Request",
  description: "This is a test feature request to validate the fix",
  severity: "low"
})

// Test 2: Valid bug report  
mcp__moneyworks__logTicket({
  type: "bug",
  title: "Test Bug Report",
  description: "This is a test bug report to validate the fix",
  severity: "medium",
  toolName: "mcp__moneyworks__accounts"
})

// Test 3: Invalid type (should fail gracefully)
mcp__moneyworks__logTicket({
  type: "invalid_type",
  title: "Should Fail",
  description: "This should fail with a clear error message"
})
```

### Success Criteria

- [ ] logTicket tool creates tickets without database errors
- [ ] All required parameters are properly validated
- [ ] Error messages are clear and helpful
- [ ] All ticket types (bug, feature_request, improvement) work correctly
- [ ] Database constraints are properly enforced
- [ ] Tool returns success/failure status clearly

### Impact Assessment

**Before Fix**: Complete inability to log issues, feature requests, or bug reports through MCP  
**After Fix**: Full issue tracking capability, enabling systematic improvement tracking

**Blocking**: This fix enables the entire MCP improvement workflow documented in this system.

---

## 📋 Planned Fixes

### Fix #002 - accounts Tool Response Structure

**Status**: 📋 **Planned**  
**Priority**: High  
**Component**: Response formatting  

Improve the accounts tool response structure with hierarchical organization, human-readable labels, and balance information integration.

*Detailed specification available in the accounts tool improvement request logged after Fix #001 is resolved.*

### Fix #003 - Transaction Pagination Performance

**Status**: 📋 **Planned**  
**Priority**: Medium  
**Component**: Query optimization  

Optimize transaction searches for large datasets with improved pagination and filtering mechanisms.

### Fix #004 - Date Format Consistency

**Status**: 📋 **Planned**  
**Priority**: Medium  
**Component**: Date handling  

Standardize date formats across all tools to use ISO 8601 format instead of MoneyWorks internal format.

---

## Fix Implementation Guidelines

1. **Critical Path**: Fix #001 (logTicket) must be completed before other fixes can be properly tracked
2. **Testing**: Each fix must include comprehensive test cases
3. **Documentation**: Update tool documentation after implementing fixes
4. **Backward Compatibility**: Ensure existing functionality is preserved
5. **Performance**: Monitor performance impact of all changes

## Fix Progress Tracking

- 🔥 **Critical**: Breaks essential functionality - immediate fix required
- 📋 **Planned**: Scheduled for implementation
- 🔄 **In Progress**: Currently being implemented
- ✅ **Completed**: Fix implemented and tested
- 🚫 **Blocked**: Cannot proceed due to dependencies