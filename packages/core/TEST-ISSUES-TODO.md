# Test Issues and TODOs

## Overview
This document tracks issues found while setting up the test suite for @moneyworks/core and converting from Jest to Bun's test runner.

## Completed
- ✅ Converted from Jest to Bun test configuration
- ✅ Updated test files to use `bun:test` imports
- ✅ Fixed `buildXML` method access in client tests
- ✅ Updated assert helpers to work without Jest's expect

## Issues to Fix

### 1. Factory Default Values
**Issue**: The factory functions in `test-utils/factories.ts` create objects with many required fields. Need to verify all required fields are included.

**TODO**:
- [ ] Check each table interface for required fields
- [ ] Update factories to include all required fields with sensible defaults
- [ ] Consider using Partial types and spreading to handle optional fields better

### 2. Mock Server HTTP Implementation
**Issue**: The mock server uses Node's `http` module which might have compatibility issues with Bun.

**TODO**:
- [ ] Test if Node's http module works correctly in Bun
- [ ] Consider using Bun's built-in server if needed
- [ ] Ensure async operations in mock server work correctly

### 3. Test Helpers Compatibility
**Issue**: Some test helpers were written for Jest and might not work with Bun's test runner.

**TODO**:
- [ ] Verify all assertion helpers work correctly
- [ ] Update spy/mock implementations to use Bun's mocking if available
- [ ] Test that beforeEach/afterEach hooks work properly

### 4. Import/Export Test Coverage
**Issue**: Need comprehensive tests for XML building and parsing.

**TODO**:
- [ ] Add tests for XML builder with various table types
- [ ] Add tests for TSV parser
- [ ] Add tests for field converters (camelCase <-> PascalCase)
- [ ] Test special characters and edge cases

### 5. Authentication Edge Cases
**Issue**: Need to test more authentication scenarios.

**TODO**:
- [ ] Test session timeout and renewal
- [ ] Test concurrent requests with authentication
- [ ] Test auth header caching
- [ ] Test invalid credentials recovery

### 6. Error Handling Tests
**Issue**: Need comprehensive error scenario tests.

**TODO**:
- [ ] Test all MoneyWorksErrorCode scenarios
- [ ] Test network timeouts
- [ ] Test malformed responses
- [ ] Test partial data scenarios

### 7. Schema Validation Tests
**Issue**: The Zod schemas need comprehensive testing.

**TODO**:
- [ ] Test schema validation for all operations
- [ ] Test schema error messages
- [ ] Test discriminated unions
- [ ] Test default value application

### 8. Integration Test Setup
**Issue**: Integration tests need proper setup/teardown.

**TODO**:
- [ ] Create test data setup scripts
- [ ] Add cleanup after integration tests
- [ ] Document how to run with real MoneyWorks
- [ ] Add environment variable documentation

### 9. Performance Tests
**Issue**: Need to implement performance benchmarks.

**TODO**:
- [ ] Add memory usage tests
- [ ] Add concurrent request tests
- [ ] Add large dataset tests
- [ ] Create performance baselines

### 10. CLI Wrapper Tests
**Issue**: MoneyWorksCLI wrapper needs tests.

**TODO**:
- [ ] Mock CLI execution
- [ ] Test error handling
- [ ] Test output parsing
- [ ] Test timeout handling

## Running Tests

```bash
# Run all tests
cd packages/core
bun test

# Run specific test file
bun test src/rest/__tests__/auth.test.ts

# Run with coverage
bun test --coverage

# Run integration tests
USE_REAL_MW=true bun test src/**/*.integration.test.ts
```

## Test Data Requirements

Before running integration tests with real MoneyWorks:
1. Ensure MoneyWorks is running
2. Check TEST-DATA-REQUIREMENTS.md for required test data
3. Set up mw-config.json with correct credentials
4. Set USE_REAL_MW=true environment variable

## Next Steps

1. Fix factory default values (highest priority)
2. Verify mock server works with Bun
3. Run tests and fix failures one by one
4. Add missing test coverage
5. Document any platform-specific issues