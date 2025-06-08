# Core Data Table Tools Improvements

## Overview

This document tracks improvements for the 4 core MoneyWorks MCP data table tools that provide access to primary business data. These are the most frequently used tools and have the highest impact on user experience.

## Tools in This Category

1. **accounts** - Chart of accounts management (4 operations)
2. **transactions** - Financial transaction management (5 operations)  
3. **names** - Customer/supplier contact management (3 operations)
4. **builds** - Manufacturing/build record management (3 operations)

---

## 1. accounts Tool Improvements

**Current Operations**: `search`, `get`, `listFields`  
**Status**: 📋 **High Priority** - Major usability improvements needed  
**Impact**: High (Fundamental financial data access)

### Issue #001: Response Structure Hierarchy

**Type**: Feature Request  
**Severity**: Medium  
**Component**: Response formatting

#### Current Behavior

The accounts tool returns a flat structure with technical field names that are difficult to work with:

```json
{
  "operation": "search",
  "accounts": [
    {
      "SequenceNumber": 179,
      "LastModifiedTime": "20220317133801",
      "Code": "7510",
      "Type": "FA",
      "Group": null,
      "Category": "FADEPN",
      "Description": "Provn Depn: Computers",
      "PandL": null,
      "TaxCode": "E",
      // ... 20+ more fields
    }
  ],
  "total": 174,
  "limit": 1,
  "offset": 0
}
```

#### Expected Behavior

The tool should provide a hierarchical response structure with enhanced metadata:

```json
{
  "operation": "search",
  "summary": {
    "total": 174,
    "returned": 50,
    "offset": 0,
    "limit": 50
  },
  "filters_applied": {
    "type": "CA",
    "category": "BANK",
    "query": "cash"
  },
  "accounts": [
    {
      "code": "1100",
      "description": "Cash at Bank - Main Account",
      "type": "CA",
      "type_label": "Current Asset",
      "category": "BANK",
      "balance": {
        "current": 15432.50,
        "currency": "USD",
        "last_updated": "2024-01-15T10:30:00Z"
      },
      "status": "active",
      "essential_fields": {
        "sequence_number": 1,
        "tax_code": "E",
        "last_modified": "2024-01-15T10:30:00Z"
      },
      "extended_fields": {
        "accountant_code": "BANK1",
        "comments": "Primary operating account",
        "flags": 0,
        "security_level": 0
      }
    }
  ],
  "grouped_by_type": {
    "CA": 45,
    "CL": 23,
    "FA": 15,
    "IN": 12,
    "EX": 79
  }
}
```

#### Proposed Solution

1. **Add Response Format Option**: Implement `format=enhanced` parameter
2. **Maintain Backward Compatibility**: Keep current format as default
3. **Hierarchical Field Organization**: Separate essential vs extended fields
4. **Human-Readable Labels**: Add descriptive labels for codes
5. **Smart Grouping**: Include summary statistics

#### Implementation Notes

- Use existing field mappings from MoneyWorks schema
- Cache type labels to avoid repeated lookups
- Consider performance impact of additional processing
- Ensure balance information is optional (not all accounts have balances)

### Issue #002: Balance Information Integration

**Type**: Feature Request  
**Severity**: Medium  
**Component**: Data enrichment

#### Current Behavior

Account records contain no balance information, requiring separate queries to get current account balances.

#### Expected Behavior

Include current balance information when available, with proper handling for accounts that don't maintain balances.

#### Proposed Solution

```json
{
  "balance": {
    "current": 15432.50,
    "currency": "USD",
    "last_updated": "2024-01-15T10:30:00Z",
    "available": true
  }
  // OR for accounts without balances:
  "balance": {
    "available": false,
    "reason": "Control account - balance calculated from sub-accounts"
  }
}
```

### Issue #003: Enhanced Account Type Filtering

**Type**: Improvement  
**Severity**: Low  
**Component**: Search functionality

#### Current Behavior

Account type filtering uses technical codes (CA, CL, FA, etc.) which are not intuitive.

#### Expected Behavior

Support both technical codes and human-readable names for filtering:

```javascript
// Current
{ type: "CA" }

// Enhanced
{ type: "CA" }                    // Still supported
{ type: "Current Asset" }         // Human-readable
{ accountClass: "Asset" }         // Higher-level grouping
```

---

## 2. transactions Tool Improvements

**Current Operations**: `search`, `get`, `getByRef`, `listFields`, `summary`  
**Status**: 📋 **Medium Priority** - Performance optimization needed  
**Impact**: High (Core transaction processing)

### Issue #004: Large Dataset Pagination Performance

**Type**: Performance Issue  
**Severity**: High  
**Component**: Query optimization

#### Current Behavior

Transaction searches with large datasets (>1000 records) can be slow and may hit the 25,000 token response limit.

#### Expected Behavior

Efficient pagination with optimized queries and smart field selection.

#### Proposed Solution

1. **Implement Query Optimization**: Use database indexes for common filters
2. **Smart Field Selection**: Return only essential fields by default
3. **Streaming Results**: For very large datasets, implement streaming responses
4. **Caching Strategy**: Cache frequently accessed transaction summaries

### Issue #005: Enhanced Date Range Filtering

**Type**: Feature Request  
**Severity**: Medium  
**Component**: Search functionality

#### Current Behavior

Date filtering uses string dates without timezone handling or relative date support.

#### Expected Behavior

Support relative dates and improved date handling:

```javascript
{
  dateRange: {
    type: "relative",
    period: "last_30_days"
  }
  // OR
  dateRange: {
    type: "absolute", 
    from: "2024-01-01",
    to: "2024-01-31",
    timezone: "UTC"
  }
}
```

---

## 3. names Tool Improvements

**Current Operations**: `search`, `get`, `listFields`  
**Status**: 📋 **Medium Priority** - Search interface improvements  
**Impact**: Medium (Contact management)

### Issue #006: Contact Search Interface Streamlining

**Type**: Usability Improvement  
**Severity**: Medium  
**Component**: Search interface

#### Current Behavior

Contact search requires knowledge of MoneyWorks-specific field names and categories.

#### Expected Behavior

Intuitive search with unified text search across multiple fields and smart categorization.

#### Proposed Solution

```javascript
{
  // Unified search across name, contact, email, phone
  searchTerm: "john smith",
  
  // Smart filtering
  contactType: "customer" | "supplier" | "both",
  status: "active" | "on_hold" | "inactive",
  
  // Geographic filtering
  location: {
    state: "CA",
    country: "US"
  }
}
```

---

## 4. builds Tool Improvements

**Current Operations**: `search`, `get`, `listFields`  
**Status**: 📋 **Low Priority** - Manufacturing workflow enhancement  
**Impact**: Low-Medium (Specialized functionality)

### Issue #007: Build Component Dependency Mapping

**Type**: Feature Request  
**Severity**: Low  
**Component**: Data relationships

#### Current Behavior

Build records show basic information without component relationships or dependency tracking.

#### Expected Behavior

Include component relationships and build dependency information for production planning.

---

## Cross-Tool Improvements

### Issue #008: Consistent Date Format Standardization

**Type**: Improvement  
**Severity**: Medium  
**Component**: Data formatting  
**Affects**: All core data tools

#### Current Behavior

Tools return dates in MoneyWorks internal format: `"20220317133801"`

#### Expected Behavior

Standardize on ISO 8601 format with timezone information:
- `"2022-03-17T13:38:01Z"` (UTC)
- `"2022-03-17T13:38:01-08:00"` (with timezone)

#### Implementation Strategy

1. Add `dateFormat` parameter to all tools (`internal` | `iso8601`)
2. Default to `internal` for backward compatibility
3. Gradually migrate to `iso8601` as default in future versions

### Issue #009: Unified Error Handling

**Type**: Improvement  
**Severity**: Medium  
**Component**: Error responses  
**Affects**: All core data tools

#### Current Behavior

Different tools may return different error formats and levels of detail.

#### Expected Behavior

Consistent error response format across all tools:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ACCOUNT_TYPE",
    "message": "Account type 'XX' is not valid",
    "details": {
      "field": "type",
      "validValues": ["IN", "SA", "EX", "CS", "CA", "CL", "FA", "TA", "TL", "SF"]
    },
    "troubleshooting": {
      "suggestion": "Use one of the valid account types",
      "documentation": "/docs/accounts#type-codes"
    }
  }
}
```

---

## Implementation Priority

### Phase 1: High Impact, Low Effort
- [ ] Issue #008: Date format standardization
- [ ] Issue #009: Unified error handling
- [ ] Issue #001: Basic response structure hierarchy

### Phase 2: Performance and Usability
- [ ] Issue #004: Transaction pagination optimization
- [ ] Issue #006: Contact search streamlining
- [ ] Issue #002: Balance information integration

### Phase 3: Advanced Features
- [ ] Issue #003: Enhanced account type filtering
- [ ] Issue #005: Enhanced date range filtering
- [ ] Issue #007: Build component dependency mapping

---

## Testing Strategy

### Automated Testing
1. **Performance Tests**: Verify pagination performance with large datasets
2. **Compatibility Tests**: Ensure backward compatibility with existing integrations
3. **Integration Tests**: Test cross-tool functionality and consistency

### User Acceptance Testing
1. **Developer Experience**: Ease of use improvements
2. **Response Time**: Performance impact measurement
3. **Error Handling**: Clear error messages and troubleshooting

---

## Success Metrics

### Quantitative
- **Response Time**: < 2 seconds for typical queries
- **Token Usage**: < 80% of token limit for standard responses
- **Error Rate**: < 1% for valid requests

### Qualitative  
- **Developer Satisfaction**: Improved ease of use scores
- **Documentation Quality**: Reduced support requests
- **Integration Success**: Faster time-to-integration for new users

This foundational improvement to core data tools will significantly enhance the overall MoneyWorks MCP experience and enable more sophisticated financial data integration scenarios.