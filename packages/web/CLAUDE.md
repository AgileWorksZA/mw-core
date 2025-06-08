# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

- If an if statement returns something, don't use an else clause. Similar with an else.
- Prefer for...of instead of forEach.
- Change to an optional chain. eg: (prop.description && prop.description.toLowerCase().includes(filter)) -> (prop.description?.toLowerCase().includes(filter))
- Use Bun over npm. Most projects will be in typescript and bunjs.
- When creating new files, don't forget to git add them
- To inspect the browser during development, the server is started at http://localhost:5173/. So to test/inspect or try out something, use browser to debug
- When working on DX-related stuff inside the app/modules folder, update any Readme.md for onboarding devs on that module as we develop
- Don't use zustand... use @app/modules/document-context/ 
- When implementing operations that modify data and require navigation afterward (like delete, create, move), always use the useOnVersionSynced hook to ensure sync completes before navigation
- Keep accessibility in mind while building UX, this is not just for users, but for you when you test the UX via MCPs like playwright
- Always check for runtime errors via playwright and check for compilation and linting issues
- When importing json from react-router, instead do import { data as json } from "react-router";

## Commands
- Build: `bun run build`
- Development server: `bun run dev`
- Start production server: `bun run start`
- Type checking: `bun run typecheck`

## Recent Fixes (June 2025)

### Environment Variables Dashboard
1. **Environment Selector Fix**: Fixed disconnected state by migrating from separate `environmentStore` to use centralized IDE store via `useIde()` and `useIdeTrigger()` hooks
2. **expandedPaths Error**: Fixed "expandedPaths is not iterable" by adding default values and null checks in file-tree.tsx
3. **IndexedDB Promise Cloning**: Fixed by ensuring store handlers follow mutative patterns - async handlers should not return values, and added `cleanContext()` to remove non-serializable values before persistence

[... rest of the file remains unchanged ...]