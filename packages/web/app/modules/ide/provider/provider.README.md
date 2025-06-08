# Provider Rationale

A provider first fetched the context and cursor from the server via a loader.

```typescript
export function Provider(props: { children?: ReactNode }) {
  const context = useLoaderData<typeof loader>().data;
  const { cursor } = useLoaderData<typeof loader>();
  //...
```

A storeKit is then created
```typescript
  const store: ProjectStoreKit = useCreateStoreKit<
    Project,
    ProjectEventPayloads,
    ProjectEmitPayloads
  >({
    context,
    on: {
      update: (context, event, enqueue) => {
        if (event.context.fileOrder) {
          if (
            event.context.fileOrder.length !==
            event.context.fileOrder?.filter(Boolean)?.length
          ) {
            throw "Invalid item";
          }
        }
        if (!event.noEmit) {
          enqueue.emit.updated();
        }
        return {
          ...context,
          ...event.context,
        };
      },
      rename: (context, event) => {
        const { id, path } = event;
        const file = context.files[id];
        if (file) {
          context.files[id] = { ...file, path };
        }
      },
    },
    emits: {
      updated: () => {
        console.log("Project updated");
      },
    },
  });
```

We then need a function that will send the changes to the server,
which is the client function that matches the server storage adapter.
This function is passed to the `useServerSync` hook which is responsible
for saving or syncing the document to the server.

```typescript
  const syncDocument = useSyncDocument(adapter.type, adapter.type);
  useServerSync<Project, ProjectEventPayloads, ProjectEmitPayloads>({
    type: adapter.type,
    id: context.id,
    cursor,
    maxWait: 500,
    storageFn: async ({ context, delta, cursor }) => {
      return await syncDocument({
        context,
        delta,
        cursor,
      });
    },
    store,
  });
```

Finally we wrap the children in a context provider

```typescript
  return (
    <ProjectStoreContext.Provider value={{ store, cursor }}>
      {props.children ? props.children : <Outlet />}
    </ProjectStoreContext.Provider>
  );
}
```