# MCP Server Test Suite

This comprehensive test suite validates all MCP tools for the MoneyWorks MCP server. It includes unit tests, integration tests, validation tests, performance tests, and manual testing utilities.

## Test Structure

```
tests/
├── setup.ts                     # Common test setup and utilities
├── test-config.json            # Test configuration and sample data
├── unit/                       # Unit tests for individual tools
│   └── tools/
│       ├── account.test.ts     # Account tool tests
│       ├── transaction.test.ts # Transaction tool tests
│       └── contact.test.ts     # Contact tool tests
├── integration/                # Integration tests for MCP server
│   └── mcp-server.test.ts     # Full server integration tests
├── validation/                 # Schema and error handling tests
│   ├── schema-validation.test.ts
│   └── error-handling.test.ts
├── performance/                # Performance and load tests
│   ├── load-tests.test.ts
│   └── benchmark-runner.ts
└── samples/                    # Manual testing utilities
    ├── sample-queries.json     # Comprehensive query examples
    └── manual-test-runner.ts   # Interactive test runner
```

## Running Tests

### Prerequisites

```bash
# Install dependencies
bun install

# Ensure test database directory exists
mkdir -p tests/data
```

### Unit Tests

Run individual tool unit tests:

```bash
# Run all unit tests
bun test tests/unit/

# Run specific tool tests
bun test tests/unit/tools/account.test.ts
bun test tests/unit/tools/transaction.test.ts
bun test tests/unit/tools/contact.test.ts
```

### Integration Tests

Test the full MCP server integration:

```bash
# Run integration tests
bun test tests/integration/

# Run with verbose output
bun test tests/integration/ --verbose
```

### Validation Tests

Test schema validation and error handling:

```bash
# Run validation tests
bun test tests/validation/

# Run schema validation only
bun test tests/validation/schema-validation.test.ts

# Run error handling tests
bun test tests/validation/error-handling.test.ts
```

### Performance Tests

Run performance and load tests:

```bash
# Run performance tests
bun test tests/performance/

# Run load tests only
bun test tests/performance/load-tests.test.ts

# Run comprehensive benchmark
bun run tests/performance/benchmark-runner.ts
```

### Manual Testing

Interactive testing with sample queries:

```bash
# Run all manual tests
bun run tests/samples/manual-test-runner.ts

# Run specific categories
bun run tests/samples/manual-test-runner.ts accounts transactions

# Run workflow tests
bun run tests/samples/manual-test-runner.ts customer_analysis account_reconciliation
```

### All Tests

Run the complete test suite:

```bash
# Run all tests
bun test

# Run with coverage
bun test --coverage

# Run in watch mode
bun test --watch
```

## Test Categories

### 1. Unit Tests

**Purpose**: Test individual tool functions in isolation
**Coverage**: 
- Account tools (search, get, list fields)
- Transaction tools (search, get by ID/ref, summary, list fields)
- Contact tools (search, get, list fields)
- Schema validation
- Error handling
- Edge cases

**Example**:
```typescript
describe("searchAccountsTool", () => {
  it("should search accounts with basic query", async () => {
    const result = await searchAccountsTool.execute({
      query: "cash",
      limit: 10
    });
    
    expect(result.accounts).toBeDefined();
    expect(result.total).toBeGreaterThanOrEqual(0);
  });
});
```

### 2. Integration Tests

**Purpose**: Test the complete MCP server functionality
**Coverage**:
- Tool registration
- Tool execution through MCP protocol
- Error handling and ticket creation
- Schema validation at server level
- Concurrent tool execution
- Complex workflows

**Example**:
```typescript
describe("MCP Server Integration", () => {
  it("should execute search tool successfully", async () => {
    const result = await server.toolHandlers.get("searchAccounts")
      ?.handler({ query: "cash", limit: 10 }, {});
    
    expect(result.content[0].type).toBe("text");
    const data = JSON.parse(result.content[0].text);
    expect(data.accounts).toBeDefined();
  });
});
```

### 3. Validation Tests

**Purpose**: Comprehensive schema validation and error scenarios
**Coverage**:
- Input parameter validation
- Type safety enforcement
- Constraint validation (min/max limits)
- Enum value validation
- Error message quality
- Cross-tool consistency

**Example**:
```typescript
describe("Schema Validation", () => {
  it("should reject invalid account type", () => {
    expect(() => 
      searchAccountsTool.inputSchema.parse({ type: "INVALID" })
    ).toThrow();
  });
});
```

### 4. Performance Tests

**Purpose**: Validate response times and resource usage
**Coverage**:
- Response time benchmarks
- Concurrent user simulation
- Memory usage monitoring
- Throughput testing
- Stress testing
- Resource leak detection

**Example**:
```typescript
describe("Performance Tests", () => {
  it("should meet target response times", async () => {
    const start = Date.now();
    await searchAccountsTool.execute({ query: "test", limit: 50 });
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(500); // 500ms target
  });
});
```

### 5. Manual Testing

**Purpose**: Interactive testing and validation
**Features**:
- Pre-defined sample queries
- Workflow testing
- Error scenario testing
- Performance monitoring
- Result validation

## Sample Queries

The test suite includes comprehensive sample queries for each tool:

### Account Queries
```json
{
  "name": "Search for cash accounts",
  "tool": "searchAccounts",
  "args": { "query": "cash", "limit": 10 },
  "description": "Find all accounts containing 'cash'"
}
```

### Transaction Queries
```json
{
  "name": "Recent sales invoices",
  "tool": "searchTransactions",
  "args": { "type": "SI", "status": "OP", "limit": 15 },
  "description": "Find recent open sales invoices"
}
```

### Contact Queries
```json
{
  "name": "Find all customers",
  "tool": "searchContacts",
  "args": { "type": "C", "limit": 25 },
  "description": "List all customer contacts"
}
```

## Error Testing

The suite tests various error scenarios:

### Network Errors
- Connection timeouts
- Server errors (5xx)
- Authentication failures (401)
- Permission errors (403)
- Rate limiting (429)

### Data Errors
- Resource not found (404)
- Invalid response format
- Missing required fields
- Date parsing errors

### Validation Errors
- Invalid input parameters
- Schema constraint violations
- Type mismatches
- Enum value errors

## Performance Benchmarks

### Target Metrics
- **Response Time**: < 500ms average
- **Throughput**: > 100 requests/second
- **Memory Usage**: < 100MB peak
- **Success Rate**: > 99%

### Test Scenarios
- Single user operations
- Concurrent user simulation (10+ users)
- Sustained load testing (30+ seconds)
- Stress testing (resource limits)
- Memory leak detection

## Continuous Integration

Add to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: |
    bun test
    bun run tests/performance/benchmark-runner.ts
    bun run tests/samples/manual-test-runner.ts --all
```

## Test Configuration

Customize test behavior via `tests/test-config.json`:

```json
{
  "testSuites": {
    "unit": { "timeout": 5000, "retries": 3 },
    "integration": { "timeout": 15000, "retries": 2 },
    "performance": { "timeout": 30000, "retries": 1 }
  },
  "performance": {
    "benchmarks": {
      "target_response_time_ms": 500,
      "concurrent_requests": 10,
      "test_duration_seconds": 30
    }
  }
}
```

## Debugging Tests

### Enable Debug Logging
```bash
TEST_LOG_LEVEL=debug bun test
```

### Test Specific Tools
```bash
# Test only account tools
bun test tests/unit/tools/account.test.ts

# Test specific scenario
bun test tests/integration/mcp-server.test.ts -t "Tool Registration"
```

### Performance Analysis
```bash
# Generate detailed benchmark report
bun run tests/performance/benchmark-runner.ts

# Check for memory leaks
bun test tests/performance/load-tests.test.ts -t "memory"
```

## Best Practices

### Writing Tests
1. Use descriptive test names
2. Test both success and failure scenarios
3. Include edge cases and boundary conditions
4. Mock external dependencies
5. Keep tests independent and isolated

### Performance Testing
1. Always run warmup iterations
2. Test with realistic data sizes
3. Monitor memory usage
4. Test concurrent scenarios
5. Set appropriate timeouts

### Error Testing
1. Test all error conditions
2. Verify error messages are helpful
3. Ensure proper error codes
4. Test error recovery
5. Validate ticket creation

## Troubleshooting

### Common Issues

**Tests timing out**:
- Increase timeout in test configuration
- Check for infinite loops or deadlocks
- Verify mock services are responding

**Memory issues**:
- Check for memory leaks in long-running tests
- Verify proper cleanup in test teardown
- Monitor memory usage during tests

**Mock service errors**:
- Verify mock data matches expected format
- Check mock service setup in test configuration
- Ensure proper error simulation

**Schema validation failures**:
- Verify test data matches tool schemas
- Check for breaking changes in tool definitions
- Update test data to match current schemas

## Contributing

When adding new tools or modifying existing ones:

1. **Add unit tests** for all new functionality
2. **Update integration tests** if tool registration changes
3. **Add sample queries** for manual testing
4. **Update performance benchmarks** if needed
5. **Document any new test scenarios** in this README

### Test Checklist
- [ ] Unit tests cover all code paths
- [ ] Integration tests verify MCP protocol compliance
- [ ] Validation tests cover all input scenarios
- [ ] Performance tests meet target benchmarks
- [ ] Sample queries demonstrate tool usage
- [ ] Error scenarios are properly tested
- [ ] Documentation is updated

## Support

For questions about the test suite:
1. Check this README for guidance
2. Review existing test examples
3. Check test configuration files
4. Run manual tests to understand expected behavior
5. Consult the main MCP server documentation