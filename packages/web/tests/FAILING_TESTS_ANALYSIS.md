# Failing Integration Tests Analysis

## Root Causes

### 1. **resolveInternalTypes Behavior**
The function returns the original internal type object when there's an error, not the resolved value. This is by design for error handling.

```typescript
// Line 282 in internal-resolver.ts
return result.error ? variables : result.value; // Return original if error
```

### 2. **Missing Test Data**
Several tests fail because they reference files that don't exist in the test context:
- `endpoints-config` file is referenced but not in `testFiles`
- `baseContext.files["api-get"]` is undefined in some tests

### 3. **Circular Dependency Detection Mismatch**
The `detectCircularDependency` function expects a different file structure:
```typescript
// Expected by detectCircularDependency
files: Record<string, { mapping: { output: any } }>

// Provided by tests
files: { type: { id: { ... } } }
```

### 4. **Environment Config Structure**
The test uses nested structure but the resolver expects flat:
```typescript
// Test provides
environmentConfig.environments.production.variables

// But createMockIDEConfig creates
environments: { production: { ... } }
```

## Failing Tests Breakdown

### Test 1: "should resolve complex nested structure with all internal types"
**Issue**: `endpoints-config` file not found in test data
**Fix**: Add the missing file to `testFiles`

### Test 2: "should handle arrays with mixed internal types"
**Issue**: Path format wrong - should be `users/0/name` not `users[0].name`
**Fix**: Update path format in test

### Test 3: "should resolve pointers that reference other pointers"
**Issue**: `baseContext.files["api-get"]` is undefined
**Fix**: Restructure how files are stored in context

### Test 4: "should handle output: true (input as output)"
**Issue**: The test expects automatic resolution but the file structure is wrong
**Fix**: Ensure the passthrough file has correct output configuration

### Test 5: "should handle custom output with internal types"
**Issue**: The FromData internal type in the output is not being resolved
**Fix**: Check if currentFileData is properly set

### Test 6 & 7: Circular dependency tests
**Issue**: File structure mismatch - function expects flat structure, test provides nested
**Fix**: Restructure test data or create adapter function

### Test 8-11: Performance and Real-World tests
**Issue**: Same as above - internal types not resolving due to missing files or wrong paths
**Fix**: Ensure all referenced files exist and paths are correct

## Solutions

### Solution 1: Fix Test Data Structure
Create proper test files with all required references and correct path formats.

### Solution 2: Create Test Helpers
Add helper functions to convert between test format and expected format:
```typescript
function flattenFiles(nestedFiles) {
  const flat = {};
  for (const [type, files] of Object.entries(nestedFiles)) {
    for (const [id, file] of Object.entries(files)) {
      flat[id] = file;
    }
  }
  return flat;
}
```

### Solution 3: Mock Resolution for Testing
Since `resolveInternalTypes` returns originals on error, we need to ensure all dependencies exist in test data.

### Solution 4: Fix Path Formats
Change all paths from dot notation to slash notation:
- `features.cache` → `features/cache`
- `users[0].name` → `users/0/name`
- `settings.theme` → `settings/theme`