# Semantic MoneyWorks Interface - Technical Design Document

**Version**: 1.0  
**Date**: January 2025  
**Authors**: Development Team  
**Status**: Design Phase  

---

## 📋 Executive Summary

This document defines the design and implementation plan for a **Semantic MoneyWorks Interface** that transforms the current generic API into an intelligent, type-safe, entity-aware system with universal query capabilities.

### Key Innovations
- **Universal Query Language**: Same syntax works MoneyWorks-direct, TypeScript in-memory, and server-side
- **Autonomous Entity Generation**: LLM-powered creation of 33 semantic entities
- **Intelligent MCP Tools**: Entity-aware tools replacing generic interfaces
- **Progressive Enhancement**: Start simple, add advanced features incrementally

### Expected Impact
- **10x Developer Productivity**: Semantic queries vs manual MoneyWorks syntax
- **Zero Learning Curve**: TypeScript developers work with familiar patterns
- **Performance Optimization**: Server-side filtering vs client-side processing
- **100% Type Safety**: Compile-time validation for all MoneyWorks operations

---

## 🎯 Problem Statement

### Current State Limitations

#### 1. Generic API Layer
```typescript
// Current: Generic and limited
search?: Partial<T>  // Forces simple object-based queries
// Only generates: Field="Value" patterns
```

#### 2. Magic Numbers and Strings
```typescript
// Current: Meaningless to developers
{ Kind: 0, CreditLimit: 1000 }

// Desired: Semantic and clear
{ type: CustomerType.Customer, creditLimit: { min: 1000 } }
```

#### 3. Client-Side Filtering
```typescript
// Current: Fetch all, filter locally (inefficient)
const allTransactions = await getTransactions()
const filtered = allTransactions.filter(t => t.amount > 1000)

// Desired: Server-side filtering (efficient)
const transactions = await Transaction.query()
  .where({ amount: { min: 1000 } })
  .execute()
```

#### 4. Manual MoneyWorks Query Construction
```typescript
// Current: Developers must learn MoneyWorks syntax
"Kind=0 AND CreditLimit>=1000 AND Category1=\"North\""

// Desired: Type-safe semantic queries
.where({ 
  type: CustomerType.Customer,
  creditLimit: { min: 1000 },
  region: "North"
})
```

---

## 🏗️ Proposed Architecture

### 1. Universal Query Language

#### Core Concept
A single query syntax that executes in multiple environments:

```typescript
// One query definition
const customerQuery = Name.query()
  .where({
    type: [CustomerType.Customer, CustomerType.Both],
    creditLimit: { min: 1000, max: 5000 },
    region: "North"
  })
  .orderBy('code')
  .limit(50)

// Multiple execution targets
const fromMoneyWorks = await customerQuery.executeMoneyWorks()  // MW server-side
const fromMemory = customerQuery.executeInMemory(cachedData)    // TS in-memory
const fromServer = await customerQuery.executeServer()         // API endpoint
```

#### Translation Engines

**MoneyWorks Engine**: Converts semantic queries to MoneyWorks syntax
```typescript
// Input: { type: CustomerType.Customer, creditLimit: { min: 1000 } }
// Output: "Kind=0 AND CreditLimit>=1000"
```

**TypeScript Engine**: Executes queries on in-memory data
```typescript
data.filter(item => 
  item.type === CustomerType.Customer && 
  item.creditLimit >= 1000
)
```

### 2. Entity-Centric Architecture

#### Semantic Entities (33 Total)
Each MoneyWorks table becomes a rich TypeScript entity:

```typescript
// Generated entity structure
export class Name {
  // 1. Semantic enums
  static CustomerType = { Customer: 0, Supplier: 1, Both: 2 }
  
  // 2. Type-safe interface  
  interface Name { 
    type: CustomerType
    creditLimit: number
    // ... 40+ other fields
  }
  
  // 3. Validation functions
  static validate(data: Partial<Name>): ValidationResult
  
  // 4. Query builder
  static query(): NameQueryBuilder
  
  // 5. Utility functions
  static formatCreditLimit(amount: number): string
}
```

#### Field Metadata System
```typescript
interface FieldMetadata<T> {
  [K in keyof T]: {
    // MoneyWorks translation
    moneyWorksField: string           // 'type' → 'Kind' 
    moneyWorksType: 'string' | 'number' | 'date' | 'enum'
    enumMapping?: Record<string, number>  // CustomerType.Customer → 0
    formatter?: (value: T[K]) => string  // Date → "20250101000000"
    
    // TypeScript execution
    typeScriptType: 'string' | 'number' | 'date' | 'boolean'
    accessor?: (item: T) => T[K]
    comparator?: (a: T[K], b: T[K]) => number
  }
}
```

### 3. Autonomous Generation Framework

#### Proven Workspace Pattern
```
workspaces/claude-{entity}/
├── MASTER-INSTRUCTIONS.md     # Complete autonomous instructions
├── name-reference.ts          # Gold standard pattern (543 lines)
├── {entity}-source.ts         # Raw interface to transform
├── package.json               # Testing framework
└── launch-autonomous.sh       # Autonomous launcher
```

#### Success Metrics
- ✅ **Name Entity**: Complete reference implementation
- ✅ **Transaction Research**: Autonomous research phase completed
- 🔄 **Transaction Generation**: Ready for completion
- ⏳ **31 Remaining Entities**: Framework proven and ready

---

## 📊 Technical Specifications

### 1. Query Condition Types

```typescript
interface QueryConditions<T> {
  [K in keyof T]?: 
    | T[K]                          // Exact match
    | T[K][]                        // In array  
    | RangeCondition<T[K]>          // Ranges
    | StringCondition               // Text matching
    | DateCondition                 // Date ranges
}

interface RangeCondition<T> {
  min?: T
  max?: T
  exact?: T
}

interface StringCondition {
  contains?: string
  startsWith?: string  
  endsWith?: string
  exact?: string
  regex?: RegExp        // TypeScript only
}

interface DateCondition {
  after?: Date
  before?: Date
  between?: [Date, Date]
  on?: Date
}
```

### 2. Universal Query Builder

```typescript
class UniversalQueryBuilder<T> {
  where(conditions: QueryConditions<T>): this
  orderBy(field: keyof T, direction?: 'asc' | 'desc'): this
  limit(count: number): this
  offset(skip: number): this
  
  // Execution targets
  executeMoneyWorks(): Promise<T[]>      // Direct MW query
  executeInMemory(data: T[]): T[]        // TS filtering  
  executeServer(): Promise<T[]>          // API endpoint
}
```

### 3. MoneyWorks API Enhancement

#### Current Limitation
```typescript
// Current: Object-based only
export interface MoneyWorksQueryParams<T> {
  search?: Partial<T>;  // 🚨 PROBLEM: Forces object matching
}
```

#### Proposed Enhancement  
```typescript
// Enhanced: Support both raw and semantic
export interface MoneyWorksQueryParams<T> {
  search?: string | Partial<T>;  // ✅ Raw MoneyWorks + semantic
}
```

#### Updated Query Building
```typescript
private buildQueryParams(params: MoneyWorksQueryParams): string {
  if (typeof params.search === 'string') {
    // Pass through raw MoneyWorks expressions
    queryParts.push(`search=${encodeURIComponent(params.search)}`)
  } else {
    // Legacy object-based (backward compatibility)
    // ... existing logic
  }
}
```

---

## 🚀 Implementation Plan

### Phase 1: Foundation (Week 1-2)
- [ ] **1.1** Complete Transaction entity generation
- [ ] **1.2** Enhance MoneyWorks API service (raw query support)
- [ ] **1.3** Build MoneyWorks query translation engine
- [ ] **1.4** Create TypeScript execution engine
- [ ] **1.5** Integrate with existing Name entity

### Phase 2: Core Framework (Week 3-4)  
- [ ] **2.1** Build universal query builder base class
- [ ] **2.2** Create field metadata system
- [ ] **2.3** Implement Name and Transaction query builders
- [ ] **2.4** Add comprehensive test suite
- [ ] **2.5** Update autonomous generation templates

### Phase 3: Scale & Enhance (Week 5-8)
- [ ] **3.1** Generate 5 priority entities (Product, Account, Detail, Job, Category)
- [ ] **3.2** Build intelligent MCP tools using semantic entities
- [ ] **3.3** Add server-side query endpoint
- [ ] **3.4** Implement advanced query features (joins, aggregations)
- [ ] **3.5** Performance optimization and caching

### Phase 4: Complete & Polish (Week 9-12)
- [ ] **4.1** Generate remaining 26 entities
- [ ] **4.2** Build entity relationship mapping
- [ ] **4.3** Add advanced TypeScript-only features
- [ ] **4.4** Comprehensive documentation and examples
- [ ] **4.5** Migration tools and backward compatibility

---

## 🧪 Testing Strategy

### 1. Unit Tests
```typescript
describe('Name Query Builder', () => {
  it('generates correct MoneyWorks syntax', () => {
    const query = Name.query()
      .where({ type: CustomerType.Customer, creditLimit: { min: 1000 } })
    
    expect(query.toMoneyWorksQuery()).toBe('Kind=0 AND CreditLimit>=1000')
  })
  
  it('executes TypeScript filtering correctly', () => {
    const data = [/* test data */]
    const result = query.executeInMemory(data)
    
    expect(result).toHaveLength(2)
    expect(result[0].type).toBe(CustomerType.Customer)
  })
})
```

### 2. Integration Tests
```typescript
describe('End-to-End Query Execution', () => {
  it('produces same results from MoneyWorks and TypeScript engines', async () => {
    const query = Name.query().where({ region: "North" })
    
    const mwResults = await query.executeMoneyWorks()
    const tsResults = query.executeInMemory(await Name.getAll())
    
    expect(mwResults).toEqual(tsResults)
  })
})
```

### 3. Performance Tests
```typescript
describe('Query Performance', () => {
  it('MoneyWorks queries are faster than client filtering for large datasets', () => {
    // Test server-side vs client-side performance
  })
})
```

### 4. Autonomous Generation Tests
```typescript
describe('Entity Generation', () => {
  it('generates valid TypeScript for all entities', () => {
    // Validate generated entity syntax and completeness
  })
})
```

---

## 📈 Success Metrics

### Developer Experience
- [ ] **Query Syntax**: 90% reduction in MoneyWorks syntax knowledge required
- [ ] **Type Safety**: 100% compile-time validation for all queries
- [ ] **Performance**: 80% reduction in network traffic via server-side filtering
- [ ] **Productivity**: 10x faster query development vs current manual approach

### Technical Metrics
- [ ] **Entity Coverage**: 33/33 MoneyWorks tables semantically enhanced
- [ ] **Query Compatibility**: 100% backward compatibility with existing API
- [ ] **Test Coverage**: 95% code coverage for all query builders
- [ ] **Performance**: Sub-100ms query translation for complex queries

### Business Impact
- [ ] **Development Velocity**: 50% faster MoneyWorks feature development
- [ ] **Code Quality**: 90% reduction in runtime query errors
- [ ] **Maintainability**: 80% reduction in MoneyWorks-specific code complexity
- [ ] **Scalability**: Support 10x more concurrent queries with same infrastructure

---

## ⚠️ Risk Analysis

### Technical Risks

#### High Risk
- **MoneyWorks Query Compatibility**: Some advanced queries might not translate perfectly
  - *Mitigation*: Extensive testing with MoneyWorks documentation validation
  - *Fallback*: Raw query pass-through for edge cases

#### Medium Risk  
- **Performance Overhead**: Query translation might add latency
  - *Mitigation*: Caching and optimization of translation engine
  - *Benchmark*: Target <10ms translation overhead

#### Low Risk
- **TypeScript Engine Complexity**: In-memory execution might become complex
  - *Mitigation*: Start simple, add features incrementally
  - *Alternative*: Use proven libraries like Lodash for complex operations

### Business Risks

#### Medium Risk
- **Migration Complexity**: Existing code might be hard to migrate
  - *Mitigation*: 100% backward compatibility in Phase 1
  - *Strategy*: Gradual migration path with side-by-side operation

#### Low Risk
- **Learning Curve**: Team might need time to adopt new patterns
  - *Mitigation*: Comprehensive documentation and examples
  - *Training*: Workshops and pair programming sessions

---

## 📊 Progress Tracker

### Entity Generation Status
```
✅ Name (Complete)        - 40+ fields, query builder, validation
🔄 Transaction (90%)      - Research done, generation in progress  
⏳ Product (Queued)       - Autonomous workspace ready
⏳ Account (Queued)       - Autonomous workspace ready
⏳ Detail (Queued)        - Autonomous workspace ready
⏳ Job (Queued)           - Autonomous workspace ready
⏳ Category (Queued)      - Autonomous workspace ready
⏳ 26 Others (Planned)    - Framework proven, ready for scale

Total: 2/33 entities (6% complete)
```

### Core Framework Status
```
🔄 MoneyWorks Query Engine    - In design phase
🔄 TypeScript Execution       - In design phase  
⏳ Universal Query Builder    - Waiting for engines
⏳ Field Metadata System      - Design complete
⏳ API Service Enhancement    - Specification ready

Framework: 0/5 components (0% complete)
```

### Integration Status
```
⏳ MCP Tool Enhancement       - Waiting for semantic entities
⏳ Server-Side Endpoints      - Waiting for query framework
⏳ Advanced Query Features    - Phase 3 planned
⏳ Performance Optimization   - Phase 3 planned

Integration: 0/4 components (0% complete)
```

---

## 📚 Appendices

### A. Current System Analysis
- [Level-0-API-Audit.md](../Level-0-API-Audit.md) - Complete audit of existing API
- [MoneyWorks-Query-Language-Reference.md](../MoneyWorks-Query-Language-Reference.md) - MW syntax guide

### B. Reference Implementations
- [generated/name.ts](../../generated/name.ts) - Complete Name entity (543 lines)
- [workspaces/claude-transaction/](../../workspaces/claude-transaction/) - Transaction workspace

### C. Autonomous Framework
- [ENTITY-GENERATION-PLAN.md](../ENTITY-GENERATION-PLAN.md) - Master plan for 33 entities
- [entity-mappings.yaml](../../entity-mappings.yaml) - Documentation source mapping

### D. Examples and Demos
- See [examples/](../../examples/) directory for query builder demonstrations
- Performance benchmarks in [benchmarks/](../../benchmarks/) directory

---

**Document Status**: 🔄 Active Development  
**Next Review**: Weekly team review  
**Contact**: Development Team  
**Last Updated**: January 2025 