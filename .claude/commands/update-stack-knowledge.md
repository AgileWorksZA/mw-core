claude-code "Create a Bun script `scripts/update-claude-context.ts` that:

1. Reads all dependencies from package.json (including workspaces)
2. For each dependency:
    - Fetch releases after January 2025 from GitHub API (if repo URL exists in package.json)
    - Fall back to npm registry API for version history
    - Parse release notes/changelogs
    - Generate claude.[package-name].md with detailed changes
3. Update claude.md with a summary index linking to each detail file
4. Use AI to summarize long release notes into concise bullet points
5. Add a 'Last Updated' timestamp

The script should be idempotent and handle rate limits. Output files should be .gitignore'd or in an ai-docs/ folder."