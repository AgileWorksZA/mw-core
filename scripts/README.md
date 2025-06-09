# Claude Context Update Script

This script fetches and summarizes dependency updates for specific libraries in the MoneyWorks monorepo to keep Claude's context up-to-date.

## Usage

```bash
# Update context for a specific library
bun run scripts/update-claude-context.ts <library-name>

# Examples
bun run scripts/update-claude-context.ts react
bun run scripts/update-claude-context.ts typescript
bun run scripts/update-claude-context.ts @tanstack/react-query

# With GitHub token for better rate limits
GITHUB_TOKEN=your_token_here bun run scripts/update-claude-context.ts react
```

## Features

- Accepts a library name as argument
- Searches for the package across all package.json files in the monorepo
- Handles common aliases (e.g., 'react' also checks for '@types/react')
- Fetches releases from GitHub (when available) after January 2025
- Falls back to NPM registry for version history
- Generates/updates individual markdown file for the package
- Updates the main claude.md index file
- Implements caching to reduce API calls
- Reports what was updated

## Package Aliases

The script automatically checks common aliases:
- `react` → checks for `react` and `@types/react`
- `typescript` → checks for `typescript` and `@types/node`
- `node` → checks for `@types/node`
- `vite` → checks for `vite` and `@vitejs/plugin-react`
- `next`/`nextjs` → checks for `next`, `@types/react`, and `@types/node`

## Output

The script generates files in the `ai-docs/` directory:
- `claude.<package-name>.md` - Detailed information for the specific package
- `claude.md` - Main index file updated with link to the package

These files are automatically ignored by git (added to `.gitignore`).

## Generated Content

Each package markdown file includes:
- Current usage locations and versions
- Version progression since January 2025
- Breaking changes (highlighted with 🚨)
- Key features (highlighted with ✨)
- Bug fixes (highlighted with 🐛)
- Migration notes if breaking changes exist
- Links to full release notes

## Configuration

- **CUTOFF_DATE**: Set to January 1, 2025 (only fetches releases after this date)
- **CACHE_EXPIRY**: 24 hours (cached responses are reused within this period)

## Caching

The script uses a local cache (`.claude-cache/`) to store API responses. This:
- Reduces API calls when checking the same package multiple times
- Speeds up the update process
- Helps avoid rate limiting

The cache directory is also ignored by git.

## Error Handling

- Reports if package not found in any package.json
- Shows which aliases were checked
- Handles missing GitHub repositories gracefully
- Falls back to NPM versions if no GitHub releases found
- Reports network errors without stopping the script