# Test Suite

This directory contains the test suite for the OpenAPI Client application.

## Structure

- `unit/` - Unit tests for individual modules
  - `environment/` - Environment variable resolution tests
  - `storage/` - Storage adapter tests
  - `ide/` - IDE module registry tests
- `helpers/` - Test utilities and helper functions
- `fixtures/` - Test data and fixtures

## Import Path Convention

All test files should use the `~/` import alias for application modules:

```typescript
// Correct
import { someFunction } from "~/modules/some-module";

// Incorrect
import { someFunction } from "@app/modules/some-module";
```

## Running Tests

Run all tests:
```bash
bun test
```

Run tests in a specific directory:
```bash
bun test tests/unit/
```

Run a specific test file:
```bash
bun test tests/unit/environment/variable-resolution.test.ts
```

## Test Status

All unit tests are currently passing:
- ✅ Environment variable resolution (18 tests)
- ✅ Storage JSON adapter (15 tests)
- ✅ IDE module registry (17 tests)

Total: 50 tests passing