# Bun Release Notes - January 2025 Update

Generated: 2025-01-27
Since: 2025-01-01

## Executive Summary

- **Major Release**: Bun 1.2 launched on January 27, 2025 with game-changing features
- **Key Features**: Built-in PostgreSQL client, S3 support, new text-based lockfile
- **Performance**: Express runs 3x faster, `bun install` is 30% faster
- **Action Required**: Review breaking changes in module detection and consider migrating to built-in database clients
- **Risk Assessment**: Low - mostly additive features with minimal breaking changes

## Version Progression

### Bun 1.2.0 (January 27, 2025) - Major Release 🚀

#### 🎯 Headline Features

1. **Built-in PostgreSQL Client (`Bun.sql`)**
   ```javascript
   // Before (using postgres.js)
   import { postgres } from "postgres";
   const sql = postgres('postgresql://...');
   
   // After (using Bun.sql)
   import { postgres } from "bun";
   const sql = postgres('postgresql://...');
   ```

2. **Built-in S3 Support (`Bun.s3`)**
   - Native S3 integration for cloud storage operations
   - No external dependencies required

3. **New Text-Based Lockfile (`bun.lock`)**
   - Replaces binary `bun.lockb` format
   - Git-friendly and human-readable
   - Easier migration from npm/yarn/pnpm

4. **CSS Parser and Bundler**
   - Based on LightningCSS, rewritten in Zig
   - Integrated with Bun's JavaScript/TypeScript parser

#### 🚨 Breaking Changes

1. **Module Detection Heuristic**
   - Files with `"use strict"` at the top now default to CommonJS (previously ESM)
   - Rationale: ESM is always strict mode, so explicit `"use strict"` indicates CommonJS
   - **Impact**: May affect ambiguous modules without explicit type declarations

2. **Dead Code Elimination**
   - New DCE annotations may break some bundles
   - **Workaround**: Use `--ignore-dce-annotations` flag if issues occur

#### ⚡ Performance Improvements

- Express.js runs **3x faster** in Bun 1.2
- `bun install` is **30% faster** for cached installations
- **10-30% reduction** in JavaScript idle memory usage (v1.2.2)

### Bun 1.1.45 (January 22, 2025)

- Fixed 13 bugs
- 82% of Node.js 'streams' module tests now passing

### Bun 1.1.44 (January 17, 2025)

- Fixed 43 bugs
- 90% of Node.js 'dns' module tests passing
- Added `xxHash` support in `Bun.hash()`
- Support for reading `bun.lock` using import
- `--no-install` flag for `bunx`

### Bun 1.1.43 (January 16, 2025)

- First-class S3 support (preview of 1.2 feature)
- HTML bundling support
- `bun install --filter` for workspace filtering
- V8 heap snapshots support
- `Bun.file(path).stat()` and `Bun.file(path).delete()` APIs

### Bun 1.1.42 (January 8, 2025)

- **Compile and run C from JavaScript** 🎯
- 30x faster `path.resolve`
- Named pipes support on Windows
- Fixed 40 bugs

## Migration Guide

### 1. Update Lockfile Format

```bash
# Delete old binary lockfile
rm bun.lockb

# Generate new text-based lockfile
bun install

# Commit the new bun.lock file
git add bun.lock
git commit -m "Migrate to Bun 1.2 text-based lockfile"
```

### 2. PostgreSQL Migration

If using `postgres.js`:
```javascript
// Update imports only - API remains compatible
- import postgres from "postgres";
+ import { postgres } from "bun";
```

### 3. Module Detection Issues

If experiencing module loading issues:
```javascript
// Add explicit type to package.json
{
  "type": "module", // or "commonjs"
  // ... rest of config
}
```

### 4. Bundle Issues

If dead code elimination breaks your bundle:
```bash
bun build --ignore-dce-annotations ./src/index.ts
```

## Current Project Status

Based on your `package.json`:
- **bun-types**: `latest` (root & api)
- **@types/bun**: `^1.1.13` (mcp-server), `^1.2.15` (web)
- **bun**: `^1.2.14` (web)

### Recommended Actions

1. **Update bun-types**: The `latest` tag should pull 1.2.x types
2. **Align @types/bun versions**: Consider updating mcp-server to `^1.2.15`
3. **Test with Bun 1.2**: Ensure compatibility with new module detection

## Security Considerations

- No critical security vulnerabilities reported in January 2025 releases
- New `bun audit` command available for dependency scanning (v1.2.15)

## Additional Resources

- [Bun 1.2 Blog Post](https://bun.sh/blog/bun-v1.2)
- [GitHub Releases](https://github.com/oven-sh/bun/releases)
- [Migration Examples](https://bun.sh/docs/migration)

## Next Steps

1. Run `bun upgrade` to get latest version
2. Test application with new module detection logic
3. Consider migrating to built-in PostgreSQL client if applicable
4. Update CI/CD to use text-based lockfile