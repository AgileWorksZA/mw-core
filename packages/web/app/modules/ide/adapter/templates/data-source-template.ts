/**
 * Template for Data Source adapters (like JSON, CSV, XML)
 */

import { AdapterCategories } from "../categories";
import type { AdapterTemplate } from "./base-template";
import { CommonVariables } from "./base-template";

export const DataSourceTemplate: AdapterTemplate = {
  id: "data-source",
  name: "Data Source Adapter",
  description: "Template for adapters that handle data file formats",
  category: AdapterCategories.DATA_SOURCE,
  
  variables: [
    CommonVariables.adapterType,
    CommonVariables.adapterName,
    CommonVariables.adapterDescription,
    CommonVariables.moduleNamespace,
    CommonVariables.contextTypeName,
    CommonVariables.dataTypeName,
    CommonVariables.acceptedFileTypes,
    CommonVariables.tags,
    CommonVariables.includeSchema,
    CommonVariables.includeQuickView,
    {
      name: "parseFunction",
      prompt: "Parse function name (e.g., 'JSON.parse', 'parseCSV')",
      required: true,
      type: "string"
    },
    {
      name: "stringifyFunction",
      prompt: "Stringify function name (e.g., 'JSON.stringify', 'toCSV')",
      required: true,
      type: "string"
    },
    {
      name: "emptyDataValue",
      prompt: "Empty data value (e.g., '{}', '[]', '\"\"')",
      defaultValue: "{}",
      required: true,
      type: "string"
    }
  ],
  
  files: [
    {
      path: "adapter/adapter.ts",
      content: `import { registerAdapter } from "~/modules/ide/adapter/register";
import { config } from "~/modules/{{moduleNamespace}}.ide/adapter/config";
import { Editor } from "~/modules/{{moduleNamespace}}.ide/components/editor";
import { FileJsonIcon } from "lucide-react";
{{#if includeQuickView}}import { QuickView } from "~/modules/{{moduleNamespace}}.ide/components/quick-view";{{/if}}
import type { {{contextTypeName}} } from "~/modules/{{moduleNamespace}}.ide/types";
import { Provider } from "~/modules/{{moduleNamespace}}.ide/provider/provider";
import type { FileContext } from "~/modules/ide/types";
import { use{{dataTypeName}}Selector } from "~/modules/{{moduleNamespace}}.ide/hooks/use-{{moduleNamespace}}-selector";
import { {{moduleNamespace}}Logger } from "~/modules/{{moduleNamespace}}.ide/utils/logger";

export const adapter = registerAdapter<{{contextTypeName}}, any, any>(
  config,
  {
    Icon: FileJsonIcon,
    Editor,
    {{#if includeQuickView}}QuickView,{{/if}}
    useSelector: use{{dataTypeName}}Selector,
    calculateOutputs: ({ input }) => {
      return {
        variables: input.variables,
      };
    },
    createFromFile: async ({ file }) => {
      const text = await file.text();
      try {
        const data = {{parseFunction}}(text);
        return {
          data,
        } as FileContext;
      } catch (error) {
        {{moduleNamespace}}Logger.error("Invalid {{adapterName}} file", error);
        throw new Error("Invalid {{adapterName}} file");
      }
    },
    emptyContext: () => {
      return {
        data: {{emptyDataValue}},
      } as FileContext;
    },
    Provider,
  },
);`
    },
    
    {
      path: "adapter/config.ts",
      content: `import type { AdapterConfig } from "~/modules/ide/adapter/type";
import { AdapterCategories } from "~/modules/ide/adapter/categories";

export const config: AdapterConfig = {
  type: "{{adapterType}}",
  metadata: {
    name: "{{adapterName}}",
    description: "{{adapterDescription}}",
    accept: [{{acceptedFileTypes}}],
    tags: [{{tags}}],
    category: AdapterCategories.DATA_SOURCE,
  },
};`
    },
    
    {
      path: "types.ts",
      content: `import type { FileContext } from "~/modules/ide/types";
{{#if includeSchema}}import type { JSONSchemaType } from "ajv";{{/if}}

/**
 * The main data structure for {{adapterName}} files
 */
export interface {{dataTypeName}} {
  // TODO: Define your data structure here
  [key: string]: any;
}

/**
 * The context for the {{adapterName}} artifact
 */
export interface {{contextTypeName}} extends FileContext {
  /**
   * The {{moduleNamespace}} data
   */
  data: {{dataTypeName}};
  
  {{#if includeSchema}}/**
   * Optional schema for validation
   */
  schema?: JSONSchemaType<{{dataTypeName}}>;{{/if}}
}

/**
 * Empty context for initializing a new {{adapterName}} artifact
 */
export const blankContext: {{contextTypeName}} = {
  data: {{emptyDataValue}},
};`
    },
    
    {
      path: "provider/provider.tsx",
      content: `import { Outlet, useLoaderData } from "react-router";
import type { ReactNode } from "react";
import type { loader } from "~/modules/ide/routes/ide.$type.$id";
import { useCreateStoreKit } from "~/modules/store-kit/types";
import type {
  {{dataTypeName}}EventPayloads,
  {{dataTypeName}}EmitPayloads,
  {{dataTypeName}}StoreKit,
} from "~/modules/{{moduleNamespace}}.ide/provider/store/types";
import { {{dataTypeName}}StoreContext } from "~/modules/{{moduleNamespace}}.ide/provider/types";
import { useSyncDocument } from "~/modules/storage/json-adapter/client";
import { useServerSync } from "~/modules/store-kit/hooks/use-server-sync";
import { on } from "~/modules/{{moduleNamespace}}.ide/provider/store/on";
import { emits } from "~/modules/{{moduleNamespace}}.ide/provider/store/emits";
import { useParams } from "react-router";
import type { {{contextTypeName}} } from "~/modules/{{moduleNamespace}}.ide/types";

export function Provider(props: {
  children?: ReactNode;
}) {
  const context: {{contextTypeName}} = useLoaderData<typeof loader>().data;
  const { cursor } = useLoaderData<typeof loader>();
  const params = useParams();

  const { id, type } = params;
  if (!id || !type) {
    throw new Error("ID and type are required");
  }

  const store: {{dataTypeName}}StoreKit = useCreateStoreKit<
    {{contextTypeName}},
    {{dataTypeName}}EventPayloads,
    {{dataTypeName}}EmitPayloads
  >({ context, on, emits });

  const storageFn = useSyncDocument(type || "{{adapterType}}", id || "temp");

  useServerSync<{{contextTypeName}}, {{dataTypeName}}EventPayloads, {{dataTypeName}}EmitPayloads>({
    type,
    id,
    cursor,
    maxWait: 1_000,
    storageFn,
    store,
  });

  return (
    <{{dataTypeName}}StoreContext.Provider value={{ store, cursor }}>
      {props.children ? props.children : <Outlet />}
    </{{dataTypeName}}StoreContext.Provider>
  );
}`
    },
    
    {
      path: "provider/store/types.ts",
      content: `import type { StoreKit } from "~/modules/store-kit/types";
import type { {{contextTypeName}} } from "~/modules/{{moduleNamespace}}.ide/types";

export type {{dataTypeName}}EventPayloads = {
  update: { context: Partial<{{contextTypeName}}>; noEmit?: boolean };
};

export type {{dataTypeName}}EmitPayloads = {
  updated: undefined;
};

export type {{dataTypeName}}StoreKit = StoreKit<
  {{contextTypeName}},
  {{dataTypeName}}EventPayloads,
  {{dataTypeName}}EmitPayloads
>;`
    },
    
    {
      path: "provider/store/on.ts",
      content: `import type {
  {{dataTypeName}}EventPayloads,
  {{dataTypeName}}EmitPayloads,
} from "~/modules/{{moduleNamespace}}.ide/provider/store/types";
import type { EventHandlers } from "~/modules/store-kit/types";
import type { {{contextTypeName}} } from "~/modules/{{moduleNamespace}}.ide/types";
import { rawReturn } from "mutative";

export const on: EventHandlers<
  {{contextTypeName}},
  {{dataTypeName}}EventPayloads,
  {{dataTypeName}}EmitPayloads
> = {
  update: (context, event, enqueue) => {
    if (!event.noEmit) {
      enqueue.emit.updated();
    }
    return rawReturn({
      ...context,
      ...event.context,
    });
  },
};`
    },
    
    {
      path: "provider/store/emits.ts",
      content: `import type { EventEmitters } from "~/modules/store-kit/types";
import type { {{contextTypeName}} } from "~/modules/{{moduleNamespace}}.ide/types";
import type {
  {{dataTypeName}}EventPayloads,
  {{dataTypeName}}EmitPayloads,
} from "~/modules/{{moduleNamespace}}.ide/provider/store/types";

export const emits: EventEmitters<
  {{contextTypeName}},
  {{dataTypeName}}EventPayloads,
  {{dataTypeName}}EmitPayloads
> = {
  updated: (context) => {
    // Optional: Add any side effects when data is updated
  },
};`
    },
    
    {
      path: "provider/types.tsx",
      content: `import { createContext } from "react";
import type { {{dataTypeName}}StoreKit } from "~/modules/{{moduleNamespace}}.ide/provider/store/types";

export const {{dataTypeName}}StoreContext = createContext<{
  store: {{dataTypeName}}StoreKit;
  cursor: number;
} | null>(null);`
    },
    
    {
      path: "hooks/use-{{moduleNamespace}}-context.ts",
      content: `import { useContext } from "react";
import { {{dataTypeName}}StoreContext } from "~/modules/{{moduleNamespace}}.ide/provider/types";

export function use{{dataTypeName}}Context() {
  const context = useContext({{dataTypeName}}StoreContext);
  if (!context) {
    throw new Error(
      "use{{dataTypeName}}Context must be used within a {{dataTypeName}}StoreContext",
    );
  }
  return context;
}`
    },
    
    {
      path: "hooks/use-{{moduleNamespace}}-selector.ts",
      content: `import type { SnapshotFromStore } from "@xstate/store";
import { useSelector as useBaseSelector } from "@xstate/react";
import { use{{dataTypeName}}Context } from "~/modules/{{moduleNamespace}}.ide/hooks/use-{{moduleNamespace}}-context";
import type { {{dataTypeName}}StoreKit } from "../provider/store/types";

export function use{{dataTypeName}}Selector<TState>(
  selector: (snapshot: SnapshotFromStore<{{dataTypeName}}StoreKit>) => TState,
) {
  const { store } = use{{dataTypeName}}Context();
  if (!store) {
    throw new Error(
      "use{{dataTypeName}}Selector must be used within a {{dataTypeName}}StoreContext",
    );
  }
  return useBaseSelector(store, selector);
}`
    },
    
    {
      path: "hooks/use-{{moduleNamespace}}-trigger.ts",
      content: `import { use{{dataTypeName}}Context } from "~/modules/{{moduleNamespace}}.ide/hooks/use-{{moduleNamespace}}-context";

export function use{{dataTypeName}}Trigger() {
  const { store } = use{{dataTypeName}}Context();
  return store.send;
}`
    },
    
    {
      path: "components/editor.tsx",
      content: `import { use{{dataTypeName}}Selector } from "~/modules/{{moduleNamespace}}.ide/hooks/use-{{moduleNamespace}}-selector";
import { use{{dataTypeName}}Trigger } from "~/modules/{{moduleNamespace}}.ide/hooks/use-{{moduleNamespace}}-trigger";

export function Editor() {
  const data = use{{dataTypeName}}Selector((s) => s.context.data);
  const trigger = use{{dataTypeName}}Trigger();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold mb-4">{{adapterName}} Editor</h2>
        <pre className="bg-muted p-4 rounded overflow-auto">
          {{{stringifyFunction}}(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}`
    },
    
    {
      path: "components/quick-view.tsx",
      optional: true,
      content: `import type { {{contextTypeName}} } from "~/modules/{{moduleNamespace}}.ide/types";

export function QuickView({ file }: { file: {{contextTypeName}} }) {
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-2">{{adapterName}} Preview</h3>
      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
        {{{stringifyFunction}}(file.data, null, 2)}
      </pre>
    </div>
  );
}`
    },
    
    {
      path: "utils/logger.ts",
      content: `export const {{moduleNamespace}}Logger = {
  log: (...args: any[]) => console.log("[{{adapterName}}]", ...args),
  error: (...args: any[]) => console.error("[{{adapterName}}]", ...args),
  warn: (...args: any[]) => console.warn("[{{adapterName}}]", ...args),
  info: (...args: any[]) => console.info("[{{adapterName}}]", ...args),
};`
    }
  ],
  
  postGenerateInstructions: [
    "1. Update the types.ts file with your specific data structure",
    "2. Implement the editor component with appropriate UI",
    "3. Add any custom event handlers in the store/on.ts file",
    "4. Register the adapter in your app's initialization code",
    "5. Add any necessary dependencies to package.json"
  ]
};