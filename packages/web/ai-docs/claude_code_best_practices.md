While coding, always:
- Prefer for-loops over forEach
- Never use else if the if block returns
- Never restart bun dev server, it's ALWAYS running in HMR
- Fix compilation and linting issues after delivering code
- Keep accessibility in mind when making UX changes
- DX is important, modularity, SoC, and reusability are key

### Type-Safe Loader Data

- Use `useLoaderData<typeof loader>()` for type-safe data retrieval
- Import loader types from other files with `import type { loader } from "../path/to/file"`
- Avoid type casting with `as` when possible

```tsx
// Good approach
import type { loader } from "../routes/project-ide";
const { data } = useLoaderData<typeof loader>();

// Avoid this approach
const { data } = useLoaderData() as { data: Context };
```

### Route Structure

- Organize routes according to dynamic segments
- Use directory-based organization for route components
- Export both the component and loader from route files

```tsx
// app/routes/project-ide.$artifact.$id.tsx
import { loader } from "~/modules/project-ide/routes/project-ide.$artifact.$id";
import ArtifactEditorRoute from "~/modules/project-ide/routes/project-ide.$artifact.$id";

export { loader };
export default ArtifactEditorRoute;
```

## XState/Store (Last Updated: 2025-05-06)

### Event Triggering

- Use shorthand syntax for triggering events with XState/Store

```tsx
// Preferred shorthand syntax
store.trigger.addArtifact({ artifact });

// Instead of
store.trigger({ type: "addArtifact", artifact });
```

