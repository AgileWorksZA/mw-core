# CLAUDE.md - mw-core development guidelines

## Commands
- `bun run dev` - Start development server with hot reloading
- `bun run build` - Build project for production (outputs to ./dist)
- `bun start` - Run built application from dist folder
- `bun test` - Run tests (needs implementation)
- `bun run lint` - Run linter (needs implementation)

## Elysia Plugins
- Import plugins with: `import { swagger } from '@elysiajs/swagger'`
- Register using `.use()`: `app.use(swagger())`
- Access plugin context in handlers via `c` parameter
- Create custom plugins with: `export const myPlugin = (options) => (app) => app`
- Chain multiple plugins: `app.use(plugin1()).use(plugin2())`

## Code Style
- **TypeScript**: Use strict type checking with explicit return types
- **Imports**: Group imports by type (internal/external), sort alphabetically
- **Formatting**: Use consistent indentation (2 spaces) and semicolons
- **Naming**: camelCase for variables/functions, PascalCase for classes/types/interfaces
- **Error Handling**: Use typed errors and proper async/await with try/catch blocks
- **Routing**: Follow Elysia.js conventions for route organization
- **Comments**: Document complex logic, omit obvious comments
- **Type Definitions**: Use interfaces for public APIs, types for internal use
- **XML Parsing**: Use xml2js with explicitArray: false for MoneyWorks API responses

## Project Structure
- Group related functionality in the same directory (services, routes, types)
- Organize routes by domain (e.g., name.routes.ts, account.routes.ts)
- Keep modules small and focused on a single responsibility
- Maintain separation between API services and business logic

## Elysia Best Practices
- Prefer `.group()` over file-based routing for better type checking
- Use context modifiers with `.derive()` to extend context
- Implement custom error handlers with `.onError()`
- Create reusable modules with plugins instead of plain imports
- Favor declarative validation with `.guard()` over manual checks
- Use lifecycle hooks (`.beforeHandle()`, `.afterHandle()`) for cross-cutting concerns

## Data Validation
- Define route schemas with `t` from Elysia: `{ body: t.Object({...}) }`
- Use TypeBox primitives: `t.String()`, `t.Number()`, `t.Boolean()`
- Add constraints: `t.String({ minLength: 1, maxLength: 255 })`
- Complex validations: `t.Object()`, `t.Array()`, `t.Union()`, `t.Partial()`
- Enum values: `t.Enum({ enum: ['option1', 'option2'] })`
- Custom validation: `.addHook('beforeHandle', validateCustomLogic)`

## Lifecycle Hooks
- `beforeHandle`: Pre-process requests (validation, auth, logging)
- `afterHandle`: Post-process responses (formatting, metrics)
- `onRequest`: First hook, access to raw Request object
- `onBeforeHandle`: After parsing, before handlers execute
- `onAfterHandle`: After handler execution, before sending response
- `onResponse`: Final hook, access to Response object
- `onError`: Error handling/formatting, can return custom responses
- Chain lifecycle hooks with multiple `.use()` or `.group()` calls

## End-to-End Type Safety with Eden
- Export your Elysia app type: `export type App = typeof app`
- Implement Eden Treaty: `const client = treaty<App>('localhost:3000')`
- Type-safe API calls: `const { data } = await client.users.get()`
- Dynamic paths: `client.users({ id: 1 }).get()`
- Error handling: `const { data, error } = await client.call()`
- For fetch-like syntax: `const fetch = edenFetch<App>('http://localhost:3000')`
- Less than 2KB overhead, no code generation required