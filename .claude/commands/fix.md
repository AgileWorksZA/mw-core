---
name: fix
description: Fix compilation and linting issues
---

# Fix source code compilation and linting issues

This command fixes compilation and linting issues in a package.

## Usage

```
/fix <package-name>
```

Example:
```
/fix data
/fix cli
/fix canonical
```

## What it does

1. **Runs TypeScript compiler** to check for type errors
2. **Fixes import/export issues** including:
   - Missing imports
   - Circular dependencies
   - Incorrect import paths
   - Missing type exports
3. **Updates package.json exports** to ensure all modules are properly exported
4. **Runs any available linting tools** (if configured)
5. **Tests the package** to ensure it's working

## Common fixes

- **Import path issues**: Converts relative imports to full package imports where needed
- **Missing exports**: Adds missing exports to package.json
- **Type errors**: Fixes type mismatches and missing type definitions
- **Circular dependencies**: Restructures imports to avoid circular references

## Notes

- Always use full package imports (`@moneyworks/package-name/...`) instead of relative imports when importing from other packages
- The main index.ts file of a package can use relative imports
- Type-only exports should use `export type` syntax