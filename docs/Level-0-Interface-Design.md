# MoneyWorks Level 0 Interface Design Document

## Overview

The **Level 0 Interface** represents a pure, zero-abstraction layer that exposes MoneyWorks REST API capabilities directly through both API and MCP interfaces. This interface maintains complete fidelity to MoneyWorks paradigms, query language, and parameter conventions without introducing custom abstractions.

## Design Philosophy

**Core Principle**: Zero translation layer between user intent and MoneyWorks REST API

- **Pure MoneyWorks Paradigms**: Use MoneyWorks terminology, conventions, and syntax exactly
- **No Custom Abstractions**: Avoid inventing our own query languages or parameter mappings
- **Direct Pass-Through**: Query expressions flow directly to MoneyWorks without parsing/reconstruction
- **Complete Exposure**: All MoneyWorks REST capabilities available through the interface
- **Future-Proof**: New MoneyWorks features work automatically without interface changes

## Level 0 Interface Specification

### Unified Table Operation Schema

All MoneyWorks table operations (account, transaction, name, etc.) expose identical parameter sets:

```typescript
interface Level0TableOperation {
  operation: "export" | "get" | "listFields";
  
  // Core MoneyWorks REST parameters (direct pass-through)
  search?: string;           // Raw MoneyWorks query expression
  limit?: number;            // MoneyWorks limit parameter
  start?: number;            // MoneyWorks start parameter (not "offset")
  sort?: string;             // MoneyWorks sort field name
  direction?: "ascending" | "descending";  // MoneyWorks direction values
  format?: string;           // MoneyWorks format specification
  
  // Get operation specific
  key?: string | number;     // Primary key for single record retrieval
}
```

### API Layer Interface

```typescript
// Level 0 API Service
class Level0MoneyWorksService {
  async export(table: string, params: Level0TableOperation): Promise<Level0Response>;
  async evaluate(expression: string): Promise<string>;
  async getDatabaseTables(): Promise<string[]>;
  async getDatabaseFields(table: string): Promise<string[]>;
}

// Direct MoneyWorks parameter structure
interface Level0MoneyWorksParams {
  search?: string;           // Raw query expression - no parsing
  limit?: number;
  start?: number;
  sort?: string;
  direction?: "ascending" | "descending";
  format?: string;
}
```

### MCP Tool Interface

All 44+ MCP tools follow identical pattern:

```typescript
// Unified schema for all table tools
const level0TableSchema = z.object({
  operation: z.enum(["export", "get", "listFields"]),
  search: z.string().optional().describe("MoneyWorks query expression using MoneyWorks syntax"),
  limit: z.number().min(1).max(1000).optional(),
  start: z.number().min(0).optional(),
  sort: z.string().optional().describe("Field name to sort by"),
  direction: z.enum(["ascending", "descending"]).optional(),
  format: z.string().optional().describe("MoneyWorks format specification"),
  key: z.union([z.string(), z.number()]).optional().describe("Primary key for get operation")
});
```

## MoneyWorks Query Language Specification

### Data Type Delimiters

- **Dates**: Single quotes ONLY `'2024-01-01'` or `'1/1/2024'`
- **Text Strings**: Can use either:
  - Double quotes: `"text string"`
  - Backticks: `` `text string` ``
  - NOT single quotes (reserved for dates only)
- **Numbers**: No delimiters `1000`, `1000.50`

### Text Matching Operators

- **Exact Match**: `Description=`"Exact Text"`
- **Partial Match**: `Description=`"@Partial String@"`
- **Wildcard Character**: `@` (replaces any characters)

### Boolean Operators

MoneyWorks accepts multiple forms of boolean operators:
- **AND**: `and` OR `&` OR `&&`
- **OR**: `or` OR `|` OR `||`
- **NOT**: `not` OR `!`

### Basic Query Syntax Examples

```
-- Exact field matching (use double quotes or backticks for text)
System="BK"
System=`BK`
Code="5100"
Code=`5100`
Type="A"

-- Date filtering (dates use single quotes ONLY)
Date >= '2024-01-01'
LastModifiedTime < '2024-12-31'
TransDate > '1/1/2024'

-- Text partial matching [TO BE VERIFIED - @ wildcard usage]
Description=`@Cash@`
Comments="@Credit Card@"

-- Numeric comparisons
Amount > 1000
Gross <= 5000.50

-- Boolean combinations (can use and/or/not OR &/|/! OR &&/||)
Type="A" and System="BK"
Type=`A` & System=`BK`
Code="51" or Code="52"
not Status=`CL`
!Hold
```

### Advanced Query Syntax Examples

```
-- Complex boolean logic
(Type="A" or Type="L") and Category<>""
Type=`A` and System=`BK` and not Code=`99`

-- String functions [TO BE VERIFIED]
left(Code,2)="51"
right(Description,4)=`Cash`

-- Date range filtering
Date >= '2024-01-01' and Date <= '2024-12-31'
TransDate > '1/1/2024' and TransDate < '31/12/2024'

-- Relational search expressions
-- MoneyWorks uses bracket notation to navigate between related tables
-- Format: [TableName:SearchExpression][RelatedTable:SearchExpression]

-- Examples:
-- Find detail lines for a specific transaction
[transaction:sequencenumber=12345][detail]

-- Find transactions for customers in a specific state  
[name:state="NSW"][transaction]

-- Find products sold in posted sales invoices
[transaction:status="P" and type="SI"][detail][product]

-- Alternative to relational search (direct foreign key)
parentseq=12345  -- For detail lines of a transaction
```

**Note**: Advanced syntax examples require verification against MoneyWorks documentation and testing.

## Implementation Architecture

### Level 0 API Layer

```typescript
// Remove abstraction layers
class Level0TableService {
  async export(params: Level0MoneyWorksParams) {
    // Direct pass-through to MoneyWorks REST
    const url = `${baseUrl}/export?table=${table}&${buildRawQueryString(params)}`;
    return await this.httpClient.get(url);
  }
  
  private buildRawQueryString(params: Level0MoneyWorksParams): string {
    const parts = [];
    
    // Direct parameter pass-through - no parsing
    if (params.search) parts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.limit) parts.push(`limit=${params.limit}`);
    if (params.start) parts.push(`start=${params.start}`);
    // ... other parameters
    
    return parts.join('&');
  }
}
```

### Level 0 MCP Tools

```typescript
// Unified implementation for all table tools
export const createLevel0TableTool = (tableName: string) => ({
  description: `Level 0 MoneyWorks ${tableName} operations with native query language`,
  inputSchema: level0TableSchema,
  
  async execute(args: Level0TableOperation) {
    switch (args.operation) {
      case "export":
        return await level0Service.export(tableName, {
          search: args.search,      // Direct pass-through
          limit: args.limit,
          start: args.start,
          sort: args.sort,
          direction: args.direction,
          format: args.format
        });
        
      case "get":
        return await level0Service.get(tableName, args.key);
        
      case "listFields":
        return await level0Service.getFields(tableName);
    }
  }
});

// Generate all table tools
export const accountTool = createLevel0TableTool("account");
export const transactionTool = createLevel0TableTool("transaction");
export const nameTool = createLevel0TableTool("name");
// ... 44+ tools with identical interface
```

## Interface Benefits

### For AI/Claude
- **Single Query Language**: Learn MoneyWorks syntax once, use everywhere
- **Predictable Interface**: All 44+ tools work identically
- **Full Power Access**: Complete MoneyWorks capabilities exposed
- **Direct Testing**: Queries can be validated directly in MoneyWorks

### For Developers
- **Zero Translation Overhead**: No parsing/reconstruction performance cost
- **Future-Proof**: New MoneyWorks features work automatically
- **Debuggable**: Raw queries visible and testable
- **Consistent**: Same patterns across all table operations

### For System Architecture
- **Simplified Codebase**: Remove abstraction layers and custom parsing
- **Maintainable**: Fewer moving parts and translation logic
- **Extensible**: Easy to add new table tools using unified pattern
- **Performance**: Direct pass-through eliminates processing overhead

## Current API Audit & Analysis

### Audit Objectives

1. **Call Type Analysis**: Catalog all MoneyWorks REST API call patterns used
2. **Authentication Patterns**: Document current authentication strategies and dual-auth implementation
3. **Response Format Usage**: Map when XML, XML-verbose, TSV, and custom expressions are used
4. **Data Transformation**: Identify current parsing and type conversion logic
5. **Reusable Components**: Mine existing API for Level 0 integration opportunities

### Key Areas for Deep Dive

#### 1. MoneyWorks API Call Types
- **Export Operations**: Table data retrieval patterns
- **Evaluate Operations**: Expression evaluation and system functions
- **Field Discovery**: Database schema and field metadata calls
- **Authentication**: Folder vs document authentication flows

#### 2. Response Format Analysis
- **XML vs XML-Verbose**: When each format is preferred and why
- **TSV Custom Expressions**: Field selection and formatting patterns
- **Raw Response Handling**: Text vs parsed response processing
- **Error Response Patterns**: How MoneyWorks errors are handled and propagated

#### 3. Current Abstraction Layers
- **TableService Pattern**: Existing base class functionality
- **Type Conversion Logic**: Date, number, and string processing
- **Field Validation**: Schema validation and field existence checking
- **Caching Mechanisms**: Response caching and cache invalidation

#### 4. Reusable Infrastructure
- **Authentication Service**: Dual-auth header generation
- **URL Building**: Base URL construction and encoding
- **HTTP Client Configuration**: Axios setup and error handling
- **Response Parsing**: XML and TSV parsing utilities

#### 5. Enumeration and Metadata Systems
- **Field Type Discovery**: How field types and constraints are determined
- **Color Value Handling**: Color field parsing and validation
- **Label Systems**: Multi-language label support and caching
- **Validation Rules**: Field validation and business rule enforcement

### Sprint Planning

## Sprint 1: Current API Deep Dive (5 days)

### Day 1-2: API Call Pattern Analysis
**Deliverables:**
- [ ] Comprehensive inventory of all MoneyWorks REST calls in codebase
- [ ] Document authentication patterns (folder vs document auth)
- [ ] Map URL construction patterns and parameter encoding

**Tasks:**
- [ ] Analyze `MoneyWorksApiService` method signatures and usage patterns
- [ ] Document `export`, `evaluate`, and metadata call types
- [ ] Catalog authentication header generation logic
- [ ] Map base URL construction for folder vs top-level documents

### Day 3: Response Format Deep Dive
**Deliverables:**
- [ ] Response format usage matrix (XML vs TSV vs custom)
- [ ] Document current parsing and transformation logic
- [ ] Identify format selection criteria and use cases

**Tasks:**
- [ ] Analyze `export` method format parameter usage
- [ ] Document XML parser configuration and transformation
- [ ] Map TSV/custom field expression patterns
- [ ] Identify raw response vs parsed response decision points

### Day 4: Current Abstraction Layer Audit
**Deliverables:**
- [ ] Current TableService functionality map
- [ ] Type conversion and validation logic documentation
- [ ] Caching mechanism analysis

**Tasks:**
- [ ] Deep dive into `TableService` base class implementation
- [ ] Document `dataCenterJsonToTable` transformation logic
- [ ] Analyze schema validation and type enforcement
- [ ] Map current caching strategies and cache keys

### Day 5: Reusable Component Identification
**Deliverables:**
- [ ] Component reusability assessment for Level 0
- [ ] Migration strategy for preserving valuable infrastructure
- [ ] Integration points between current API and Level 0

**Tasks:**
- [ ] Identify authentication logic for Level 0 reuse
- [ ] Assess HTTP client configuration portability
- [ ] Document error handling patterns worth preserving
- [ ] Map enumeration and metadata systems for Level 0 integration

## Sprint 2: MoneyWorks Query Language Verification (3 days)

### Day 1: Syntax Verification Session
**Deliverables:**
- [ ] Corrected MoneyWorks query language specification
- [ ] Validated basic and advanced syntax examples
- [ ] Function reference documentation

**Tasks:**
- [ ] Review MoneyWorks documentation for query syntax
- [ ] Test query examples against live MoneyWorks instance
- [ ] Document string functions, date functions, and operators
- [ ] Create comprehensive syntax reference

### Day 2-3: Query Language Testing Framework
**Deliverables:**
- [ ] Query validation test suite
- [ ] Error handling patterns for malformed queries
- [ ] Performance benchmarks for query complexity

**Tasks:**
- [ ] Build automated query syntax validation
- [ ] Test edge cases and complex expressions
- [ ] Document query performance characteristics
- [ ] Create query building utilities and helpers

## Sprint 3: Level 0 Infrastructure Implementation (5 days)

### Day 1-2: Core Level 0 Service
**Deliverables:**
- [ ] `Level0MoneyWorksService` implementation
- [ ] Raw query pass-through functionality
- [ ] Authentication integration

**Tasks:**
- [ ] Implement direct parameter pass-through
- [ ] Integrate existing authentication logic
- [ ] Build raw query string construction
- [ ] Add error handling and response processing

### Day 3-4: Unified MCP Tool Factory
**Deliverables:**
- [ ] `createLevel0TableTool` factory function
- [ ] Unified schema implementation
- [ ] Tool generation automation

**Tasks:**
- [ ] Build table tool factory with unified interface
- [ ] Implement operation routing (export, get, listFields)
- [ ] Create schema validation for Level 0 parameters
- [ ] Generate all 44+ table tools programmatically

### Day 5: Integration and Testing
**Deliverables:**
- [ ] Level 0 integration with existing API infrastructure
- [ ] End-to-end testing suite
- [ ] Performance comparison vs current implementation

**Tasks:**
- [ ] Integrate Level 0 with authentication and HTTP client
- [ ] Build comprehensive test suite for all table operations
- [ ] Performance benchmarking vs current abstraction layers
- [ ] Documentation and usage examples

## Sprint 4: Level 1 Enhancement Planning (3 days)

### Day 1-2: Level 1 Feature Analysis
**Deliverables:**
- [ ] Level 1 enhancement specification
- [ ] Advanced feature requirements
- [ ] Integration strategy with Level 0

**Tasks:**
- [ ] Define Level 1 enhancement scope
- [ ] Plan advanced query builders and helpers
- [ ] Design caching and optimization strategies
- [ ] Map business logic and validation layers

### Day 3: Architecture Documentation
**Deliverables:**
- [ ] Complete Level 0/Level 1 architecture document
- [ ] Migration and deployment strategy
- [ ] Performance and scalability analysis

**Tasks:**
- [ ] Document complete architecture vision
- [ ] Plan phased rollout strategy
- [ ] Create performance optimization roadmap
- [ ] Build monitoring and observability framework

## Backlog Items

### Critical Priority (Pre-Implementation)
- [ ] Research and document MoneyWorks type/status field semantics
- [ ] Create accounting ontology mapping for all entity types
- [ ] Design domain-driven interfaces for Level 1/2
- [ ] Plan type discrimination patterns for TypeScript

### High Priority
- [ ] MoneyWorks field type enumeration system integration
- [ ] Color value parsing and validation utilities
- [ ] Multi-language label system for Level 0 tools
- [ ] Advanced error handling and user-friendly error messages
- [ ] Query result caching strategy for Level 0

### Medium Priority
- [ ] Query builder utilities for common patterns
- [ ] Field validation against table schemas
- [ ] Response transformation utilities (optional)
- [ ] Performance monitoring and query optimization
- [ ] Bulk operation support for Level 0

### Low Priority
- [ ] Query visual builder for complex expressions
- [ ] Historical query performance analytics
- [ ] Advanced caching with dependency invalidation
- [ ] Query optimization recommendations
- [ ] Integration with MoneyWorks scripting language

## Risk Assessment

### Technical Risks
- **MoneyWorks Query Syntax**: Incomplete understanding may lead to invalid query generation
- **Authentication Complexity**: Dual-auth scenarios may not be fully covered
- **Performance Impact**: Raw query pass-through may have unexpected performance characteristics
- **Error Handling**: MoneyWorks error responses may not translate well to Level 0 interface

### Mitigation Strategies
- **Comprehensive Testing**: Build extensive test suite against live MoneyWorks instance
- **Incremental Implementation**: Phased rollout with fallback to current implementation
- **Documentation**: Thorough documentation of MoneyWorks behavior and edge cases
- **Performance Monitoring**: Continuous monitoring of query performance and response times

## Success Metrics

### Performance Metrics
- **Query Response Time**: < 500ms for simple queries, < 2s for complex queries
- **Memory Usage**: Reduce memory footprint by eliminating parsing overhead
- **CPU Usage**: Minimize CPU usage through direct pass-through architecture

### Functional Metrics
- **Query Coverage**: Support 100% of MoneyWorks query language features
- **Error Rate**: < 1% error rate for valid MoneyWorks queries
- **API Compatibility**: Maintain 100% compatibility with existing table operations

### Developer Experience Metrics
- **Learning Curve**: Developers can build complex queries within 1 day of training
- **Code Reduction**: 50% reduction in query-related code complexity
- **Maintainability**: 75% reduction in query-related bug reports

---

**Design Status**: Initial specification complete, pending MoneyWorks syntax verification and current API exploration.

**Last Updated**: January 2025
**Next Review**: After Sprint 1 completion