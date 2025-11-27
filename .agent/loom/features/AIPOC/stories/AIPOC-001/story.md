# AIPOC-001: Build AI Package POC with Anthropic Agent SDK

## Why (Root Motivation)

Enable intelligent, action-capable AI assistance within MoneyWorks that can understand context and take actions, moving beyond passive chat to active collaboration.

**5 Whys Analysis:**
1. Why? We need a dedicated interface for interacting with Claude and AI agents in MoneyWorks
2. Why? To leverage Anthropic Agent SDK's tool use capabilities for intelligent assistance beyond simple chat
3. Why? To enable Claude to perform actions like querying MoneyWorks data, analyzing transactions, and assisting with accounting tasks
4. Why? This is a POC to validate architecture and integration patterns before building production features
5. Root: **Enable intelligent, action-capable AI assistance that improves developer and user productivity through active collaboration**

## Description

Create a new package at `packages/ai` that provides a React Router 7 web application with Tailwind CSS styling and Anthropic Agent SDK integration. This POC will demonstrate AI agent capabilities with tool use in a chat interface, following the established monorepo conventions.

The package will:
- Set up React Router 7 with explicit routing (following packages/web pattern)
- Configure Tailwind CSS v4 with the @tailwindcss/vite plugin
- Integrate Anthropic Agent SDK for AI chat functionality
- Create a basic but functional chat interface
- Support streaming responses for better UX
- Use environment variables for API key configuration

## Acceptance Criteria

- [ ] **AC-001**: packages/ai directory exists with valid package.json naming @moneyworks/ai
- [ ] **AC-002**: React Router 7 configured with explicit route configuration in app/routes.ts
- [ ] **AC-003**: Tailwind CSS v4 integrated with @tailwindcss/vite plugin
- [ ] **AC-004**: Anthropic Agent SDK (@anthropic-ai/sdk) installed and configured
- [ ] **AC-005**: Chat interface component renders with message input and send button
- [ ] **AC-006**: Messages display in scrollable conversation view with user/assistant distinction
- [ ] **AC-007**: Server action handles chat requests via Anthropic SDK with streaming support
- [ ] **AC-008**: TypeScript compilation passes with zero errors (bun run typecheck)
- [ ] **AC-009**: Dev server starts successfully on unique port (bun run dev)
- [ ] **AC-010**: Environment variable ANTHROPIC_API_KEY used for authentication (documented in .env.example)
- [ ] **AC-011**: Package follows monorepo workspace conventions (workspace:* dependencies where applicable)
- [ ] **AC-012**: Root package.json updated with 'ai' script to start the dev server

## Weave Knowledge

**Patterns Applied:**
- `E:full-stack-story-pattern` - Include all layers in single story for complete feature delivery
- `E:canonical-dsl-pattern` - Preserve naming conventions and terminology consistency

**Pain Points to Avoid:**
- `Q:dev-server-memory-pressure` - Use unique port, avoid running too many dev servers simultaneously

**Reference Implementation:**
- `packages/web` - React Router 7 + Tailwind CSS structure, routing patterns, component organization
- `packages/web/app/routes/chat.tsx` - Existing chat UI patterns (though different backend approach)

## Technical Notes

### Key Dependencies
- `react-router` ^7.x - Routing framework
- `@react-router/dev` ^7.x - Dev tooling
- `@react-router/node` ^7.x - Node adapter
- `@react-router/serve` ^7.x - Production server
- `@anthropic-ai/sdk` - Anthropic's official SDK
- `tailwindcss` ^4.x - Styling
- `@tailwindcss/vite` - Vite integration

### File Structure
```
packages/ai/
  app/
    routes.ts              # Explicit route configuration
    root.tsx               # Root layout with Tailwind
    app.css                # Tailwind imports
    routes/
      _index.tsx           # Home/chat route
    components/
      chat/
        chat-interface.tsx # Main chat component
        message.tsx        # Message display
  package.json
  tsconfig.json
  vite.config.ts
  react-router.config.ts
  .env.example
```

### Port Allocation
- Use port 5175 (5174 already used by packages/web)

## Complexity: Moderate (4-8h)

Moderate complexity due to:
- New package scaffolding from scratch
- Anthropic SDK integration with streaming
- React Router 7 setup (following established patterns)
- Chat UI implementation

## Priority: High

This POC enables future AI-powered features and validates the integration approach.

## Related Stories

None - this is the first AI-related feature in the codebase.

## Implementation Notes

1. Start by scaffolding the React Router 7 project structure (copy from packages/web)
2. Configure Tailwind CSS v4 with Vite plugin
3. Install and configure Anthropic SDK
4. Build chat interface components
5. Implement server action for chat processing
6. Add streaming support for responses
7. Update root package.json scripts
