# MoneyWorks Core Testing Plan

## Overview

This document outlines a comprehensive testing strategy for the `@moneyworks/core` package to ensure a solid foundation for the MoneyWorks ecosystem.

## Current State Analysis

### Existing Tests
- Basic REST client tests exist but lack comprehensive coverage
- Some table interface tests for specific tables
- Limited integration testing
- No performance or stress testing

### Coverage Gaps
1. **REST Client**: Error scenarios, authentication edge cases, streaming
2. **Table Interfaces**: Type conversions, validation, helper functions
3. **Schemas**: Zod validation, error messages, refinements
4. **Data Conversion**: XML/JSON edge cases, malformed data
5. **Integration**: Full export/import workflows

## Testing Strategy

### 1. Unit Tests (Target: 90% coverage)

#### REST Client (`src/rest/`)
- **client.ts**: All methods, error handling, authentication
- **auth.ts**: Basic auth, two-level auth, session management
- **xml-builder.ts**: XML generation, special characters, nested structures
- **parsers.ts**: TSV parsing, XML parsing, type coercion

#### Table Interfaces (`src/tables/`)
- Each table interface (accounts, transactions, names, etc.)
- Field converters (PascalCase ↔ camelCase)
- Enum validation
- Helper functions
- Type guards

#### Schemas (`src/schemas/`)
- Schema parsing and validation
- Default values
- Custom refinements
- Error messages
- Discriminated unions

### 2. Integration Tests

#### Export Functionality
- Export with various filters
- Pagination (limit/offset)
- Format conversions (XML → JSON)
- Large dataset handling
- Error scenarios

#### Import Functionality
- Single record import
- Batch import
- Validation errors
- Transaction rollback

#### Authentication Flow
- Login → Session → API calls → Logout
- Token refresh
- Permission errors

### 3. Mock Server Tests

Create a mock MoneyWorks server for:
- Consistent test data
- Error simulation
- Performance testing
- Offline development

### 4. Performance Tests

- Large dataset exports (10k+ records)
- Concurrent requests
- Memory usage monitoring
- Response time benchmarks

## Test Data Requirements

### Essential Test Data Needed

#### 1. Accounts
- [ ] Bank accounts (at least 3)
- [ ] Income accounts (at least 5)
- [ ] Expense accounts (at least 5)
- [ ] Asset accounts (at least 3)
- [ ] Liability accounts (at least 3)
- [ ] Accounts with parent-child relationships

#### 2. Transactions
- [ ] Posted transactions (at least 50)
- [ ] Unposted transactions (at least 10)
- [ ] Various types: DI, CI, JO, BR, BP
- [ ] Transactions across multiple periods
- [ ] Transactions with line items

#### 3. Names (Customers/Suppliers)
- [ ] Active customers (at least 10)
- [ ] Active suppliers (at least 10)
- [ ] Inactive records
- [ ] Names with special characters
- [ ] Names with custom fields

#### 4. Products
- [ ] Inventory items (at least 20)
- [ ] Service items (at least 10)
- [ ] Items with different tax rates
- [ ] Items with custom pricing

#### 5. Edge Cases
- [ ] Records with maximum field lengths
- [ ] Unicode characters in descriptions
- [ ] Null/empty fields
- [ ] Invalid references

## Implementation Plan

### Phase 1: Foundation (Week 1-2)
1. Set up Jest configuration with TypeScript
2. Create test utilities and helpers
3. Implement mock MoneyWorks server
4. Create test data factories

### Phase 2: Unit Tests (Week 3-4)
1. REST client comprehensive tests
2. Authentication tests
3. Parser and converter tests
4. Basic table interface tests

### Phase 3: Integration Tests (Week 5)
1. Export workflow tests
2. Import workflow tests
3. Authentication flow tests
4. Error scenario tests

### Phase 4: Advanced Testing (Week 6-7)
1. Performance test suite
2. Stress testing
3. Schema validation tests
4. Documentation of test patterns

## Test Infrastructure

### Configuration Files
```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 90,
      statements: 90
    }
  }
};
```

### Test Utilities
```typescript
// test-utils/mock-server.ts
export class MockMoneyWorksServer {
  // Simulates MoneyWorks REST API
}

// test-utils/factories.ts
export const factories = {
  account: () => ({ /* ... */ }),
  transaction: () => ({ /* ... */ }),
  // ... other factories
};

// test-utils/fixtures.ts
export const fixtures = {
  xml: {
    validExport: '<table>...</table>',
    malformed: '<table>...',
    // ... other fixtures
  }
};
```

## Success Metrics

1. **Code Coverage**: > 90% overall, 100% for critical paths
2. **Test Execution Time**: Unit tests < 10s, Integration < 60s
3. **Test Reliability**: Zero flaky tests
4. **Documentation**: All test utilities documented
5. **CI/CD Integration**: All tests run on every commit

## Continuous Improvement

- Monthly test coverage reviews
- Performance benchmark tracking
- Test failure analysis
- New edge case documentation
- Regular test refactoring

## Next Steps

1. Review and approve testing plan
2. Identify missing test data in MoneyWorks
3. Set up test infrastructure
4. Begin Phase 1 implementation