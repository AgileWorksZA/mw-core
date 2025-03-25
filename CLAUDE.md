# CLAUDE.md - mw-core Development Guidelines

## Commands
- `bun run dev` - Start development server with hot reloading
- `bun run build` - Build project for production (outputs to ./dist)
- `bun build2` - Alternative build with additional minification options
- `bun start` - Run built application from dist folder
- `bun test` - Run tests (implementation pending)

## Code Style
- **TypeScript**: Use strict typing with explicit return types and interfaces
- **Imports**: External packages first, then internal; sort alphabetically
- **Formatting**: 2-space indentation, semicolons, max 100 chars per line
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces
- **Error Handling**: Try/catch blocks with specific messages, log via console.error
- **Comments**: JSDoc for public methods and complex logic
- **Validation**: Use Elysia's type system (`t.Object()`, `t.String()`)

## Elysia Best Practices
- Group related routes with `.group()` for better organization
- Document endpoints with descriptive tags and examples
- Use service classes for business logic and API interactions
- Validate request/response with schema definitions
- Use consistent error handling patterns across routes

## MoneyWorks API
- Use `MoneyWorksApiService` for direct API communication
- Encode query parameters and parse XML responses consistently
- Handle authentication securely via configuration
- Convert date values from YYYYMMDD format to JavaScript Date objects
- Implement proper error handling for all API responses