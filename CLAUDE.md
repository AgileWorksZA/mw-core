# CLAUDE.md - mw-core development guidelines

## Commands
- `bun run dev` - Start development server with hot reloading
- `bun test` - Run tests (once implemented)
- `bun run lint` - Run linter (once implemented)
- `bun run build` - Build project (once implemented)

## Code Style
- **TypeScript**: Use strict type checking with explicit return types
- **Imports**: Group imports by type (internal/external), sort alphabetically
- **Formatting**: Use consistent indentation (2 spaces) and semicolons
- **Naming**: camelCase for variables/functions, PascalCase for classes/types
- **Error Handling**: Use typed errors and proper async/await error handling
- **Routing**: Follow Elysia.js conventions for route organization
- **Comments**: Only for complex logic, not for obvious code
- **Type Definitions**: Prefer interfaces for public APIs, types for internal use

## Project Structure
- Keep modules small and focused on a single responsibility
- Group related functionality in the same directory
- Organize routes by domain rather than HTTP method