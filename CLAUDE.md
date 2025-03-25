# CLAUDE.md - mw-core development guidelines

## Commands
- `bun run dev` - Start development server with hot reloading
- `bun run build` - Build project for production (outputs to ./dist)
- `bun build2` - Alternative build with additional minification options
- `bun start` - Run built application from dist folder
- `bun test` - Run tests (currently returns error - needs implementation)
- `bun run lint` - Run linter (currently needs implementation)

## API Structure
- Built on Elysia.js with TypeScript
- Routes organized by domain (name.routes.ts, transaction.routes.ts)
- Services handle business logic and API communication
- MoneyWorks API service manages REST communications

## Code Style
- **TypeScript**: Use strict type checking with explicit return types
- **Imports**: Group by type (internal/external), sort alphabetically
- **Formatting**: 2-space indentation, semicolons, max 100 chars per line
- **Naming**: camelCase for variables/functions, PascalCase for classes/types
- **Error Handling**: Use typed errors with try/catch blocks
- **Validation**: Use Elysia's type system (`t.Object()`, `t.String()`, etc.)
- **XML Parsing**: Use fast-xml-parser with appropriate configuration
- **Date Handling**: Use standardized date conversion utilities

## Elysia Best Practices
- Group related routes with `.group()` for better organization
- Define schemas with Elysia's type system for validation
- Implement detailed Swagger documentation for all endpoints
- Use consistent error handling patterns
- Create reusable services for business logic
- Manage configuration via structured config files

## MoneyWorks API Integration
- Use MoneyWorksApiService for direct API communication
- Handle authentication credentials securely
- Properly encode query parameters
- Parse XML responses consistently
- Implement proper error handling for API responses
- Convert date values from YYYYMMDD format to JavaScript Date objects