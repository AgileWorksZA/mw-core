# Variable Resolution System - Test Coverage

This directory contains comprehensive unit tests for the variable resolution system in the OpenAPI Client application.

## Test Files

### 1. `resolver.test.ts`
Tests the main variable resolution functionality for the environment module.

**Coverage includes:**
- **Variable Resolution**
  - Environment-specific variables override global variables
  - Global variable fallback when not defined in environment
  - Secret resolution from vault
  - Active environment defaults
  - Non-existent variable handling
  
- **Template Resolution** (`{{variable}}` syntax)
  - Single variable substitution
  - Multiple variables in one template
  - Variables with spaces (`{{ VAR }}`)
  - Mixed variables and secrets
  - Unresolved variables remain as placeholders
  - Edge cases (empty templates, no variables, nested brackets)
  
- **Variable Listing**
  - Getting all variables for an environment
  - Environment variables override globals (no duplication)
  - Empty environment handling
  - Active environment defaults
  
- **Validation**
  - Valid variable names (alphanumeric, underscore, dash, dot)
  - Invalid variable names (starting with numbers, special chars, spaces)
  
- **Complex Scenarios**
  - Circular reference prevention
  - Special characters in values
  - JSON strings as variable values

### 2. `vault.test.ts`
Tests the secure storage implementation for secrets.

**Coverage includes:**
- **MemoryVault** (for testing)
  - Basic CRUD operations
  - Special characters in keys/values
  - Empty vault handling
  
- **LocalVault** (browser localStorage)
  - Encryption/decryption of secrets
  - Error handling (storage errors, decryption failures)
  - Full lifecycle (create, update, delete)
  
- **Factory & Singleton**
  - Vault creation patterns
  - Global instance management
  - Custom vault injection

### 3. `../ide/utils/__tests__/variable-resolver.test.ts`
Tests the IDE-specific variable resolution for project files.

**Coverage includes:**
- **Project Variable Resolution**
  - Environment-specific project variables
  - Global fallback mechanism
  - Specific environment targeting
  - Missing configuration handling
  
- **Project Secret Resolution**
  - Vault integration
  - Environment hierarchy
  - Missing secrets handling
  
- **Bulk Operations**
  - Getting all variables for a project
  - Proper override behavior
  - Environment switching
  
- **Edge Cases**
  - Empty values
  - Very long values
  - Special characters and JSON

### 4. `../ide/utils/__tests__/internal-resolver.test.ts`
Tests the internal type resolution system that handles complex variable references.

**Coverage includes:**
- **Internal Type Resolution**
  - ProjectVariable and ProjectSecret types
  - Pointer resolution (cross-file references)
  - Parameter placeholders
  - FromData references
  - Circular reference detection
  - Nested structures with multiple internal types

## Running Tests

```bash
# Run all environment tests
bun test app/modules/environment/__tests__

# Run specific test file
bun test app/modules/environment/__tests__/resolver.test.ts
bun test app/modules/environment/__tests__/vault.test.ts

# Run all variable resolution tests
bun test --preload ./test-setup.ts $(find app -name "*resolver*.test.ts" -o -name "*vault*.test.ts")
```

## Test Architecture

The tests follow these patterns:

1. **Isolation**: Each test suite uses fresh mocks and data
2. **Mocking**: Uses Bun's built-in mocking for external dependencies
3. **Async Testing**: Properly handles Promise-based vault operations
4. **Edge Cases**: Comprehensive coverage of error conditions
5. **Type Safety**: Full TypeScript coverage with proper type imports

## Key Test Scenarios

### Variable Resolution Flow
```
Environment Variable → Global Variable → null
```

### Secret Resolution Flow
```
Environment Secret → Global Secret → null
```

### Template Resolution
```
"{{VAR1}} and {{VAR2}}" → "value1 and value2"
"{{UNKNOWN}}" → "{{UNKNOWN}}" (unchanged)
```

### Vault Key Format
```
Global: "global:SECRET_NAME"
Environment: "env:environment_id:SECRET_NAME"
```

## Future Test Additions

Consider adding tests for:
- Performance with large numbers of variables
- Concurrent vault access
- Variable usage tracking
- Import/export functionality
- Real vault integrations (AWS Secrets Manager, etc.)