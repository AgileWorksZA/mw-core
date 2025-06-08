/**
 * Template for API specification adapters (like OpenAPI, GraphQL, AsyncAPI)
 */

import { AdapterCategories } from "../categories";
import type { AdapterTemplate } from "./base-template";
import { CommonVariables } from "./base-template";

export const ApiTemplate: AdapterTemplate = {
  id: "api",
  name: "API Specification Adapter",
  description: "Template for adapters that handle API specifications and documentation",
  category: AdapterCategories.API,
  
  variables: [
    CommonVariables.adapterType,
    CommonVariables.adapterName,
    CommonVariables.adapterDescription,
    CommonVariables.moduleNamespace,
    CommonVariables.contextTypeName,
    CommonVariables.dataTypeName,
    CommonVariables.acceptedFileTypes,
    CommonVariables.tags,
    CommonVariables.includeQuickView,
    CommonVariables.includeNewFileDialog,
    {
      name: "specVersion",
      prompt: "Default specification version",
      defaultValue: "3.0.0",
      required: true,
      type: "string"
    },
    {
      name: "includeUrlFetching",
      prompt: "Include URL fetching support?",
      defaultValue: "true",
      required: false,
      type: "boolean"
    },
    {
      name: "includeClientGeneration",
      prompt: "Include client code generation?",
      defaultValue: "false",
      required: false,
      type: "boolean"
    },
    {
      name: "includeMockServer",
      prompt: "Include mock server support?",
      defaultValue: "false",
      required: false,
      type: "boolean"
    }
  ],
  
  files: [
    {
      path: "adapter/adapter.ts",
      content: `import { registerAdapter } from "~/modules/ide/adapter/register";
import { config } from "~/modules/{{moduleNamespace}}.ide/adapter/config";
import { Editor } from "~/modules/{{moduleNamespace}}.ide/components/editor";
import { FileJson } from "lucide-react";
{{#if includeQuickView}}import { QuickView } from "~/modules/{{moduleNamespace}}.ide/components/quick-view";{{/if}}
{{#if includeNewFileDialog}}import { NewFile } from "~/modules/{{moduleNamespace}}.ide/components/new-file";{{/if}}
import type { {{contextTypeName}}, {{dataTypeName}} } from "~/modules/{{moduleNamespace}}.ide/types";
import { Provider } from "~/modules/{{moduleNamespace}}.ide/provider/provider";
import type { FileContext } from "~/modules/ide/types";
import { use{{dataTypeName}}Selector } from "~/modules/{{moduleNamespace}}.ide/hooks/use-{{moduleNamespace}}-selector";
import { validateSpecification } from "~/modules/{{moduleNamespace}}.ide/utils/validation";

export const adapter = registerAdapter<
  {{contextTypeName}},
  any,
  string | null
>(config, {
  Icon: FileJson,
  Editor,
  {{#if includeQuickView}}QuickView,{{/if}}
  {{#if includeNewFileDialog}}NewFile,{{/if}}
  useSelector: use{{dataTypeName}}Selector,
  calculateOutputs: ({ input, context }) => {
    return {
      variables: context.data.resourcePath ?? null,
    };
  },
  createFromFile: async ({ file }) => {
    const text = await file.text();
    try {
      let document: any;

      // Try to parse as JSON first
      try {
        document = JSON.parse(text);
      } catch {
        // If JSON parsing fails, try YAML
        throw new Error(
          "YAML parsing not implemented yet. Please use JSON format.",
        );
      }

      // Validate it's a valid specification
      const validation = validateSpecification(document);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      return {
        data: {
          source: {
            type: "file",
            fileName: file.name,
            lastFetched: new Date().toISOString(),
          },
          document,
        },
      } as FileContext;
    } catch (error) {
      console.error("Invalid {{adapterName}} file", error);
      throw new Error(
        \`Invalid {{adapterName}} file: \${error instanceof Error ? error.message : "Unknown error"}\`,
      );
    }
  },
  emptyContext: () => {
    const emptyData: {{dataTypeName}} = {
      source: {
        type: "paste",
        lastFetched: new Date().toISOString(),
      },
      document: {
        version: "{{specVersion}}",
        info: {
          title: "New API",
          version: "1.0.0",
        },
        // TODO: Add other required fields for your specification
      },
    };

    return {
      data: emptyData,
    } as FileContext;
  },
  Provider,
});`
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
    category: AdapterCategories.API,
  },
};`
    },
    
    {
      path: "types.ts",
      content: `import type { FileContext } from "~/modules/ide/types";

/**
 * Operation/endpoint definition
 */
export interface {{dataTypeName}}Operation {
  id: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  parameters?: any[];
  requestBody?: any;
  responses?: any;
  tags?: string[];
}

/**
 * The {{adapterName}} document structure
 */
export interface {{dataTypeName}}Document {
  version: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  // TODO: Add other specification fields
}

/**
 * Source type for the specification
 */
export type {{dataTypeName}}SourceType = "url" | "file" | "paste";

/**
 * Source information
 */
export interface {{dataTypeName}}SourceInfo {
  type: {{dataTypeName}}SourceType;
  url?: string;
  fileName?: string;
  lastFetched?: string; // ISO date string
}

/**
 * The data stored in the IDE
 */
export interface {{dataTypeName}} {
  // Source information
  source: {{dataTypeName}}SourceInfo;

  // Local resource path (where the spec is stored)
  resourcePath?: string;

  // The actual specification document
  document: {{dataTypeName}}Document;
}

/**
 * The full context including the data wrapper
 */
export interface {{contextTypeName}} extends FileContext {
  data: {{dataTypeName}};
}`
    },
    
    {
      path: "provider/store/types.ts",
      content: `import type { {{contextTypeName}}, {{dataTypeName}}Document } from "../../types";
import type { StoreKit } from "~/modules/store-kit/types";

export type {{dataTypeName}}EventPayloads = {
  update: { context: Partial<{{contextTypeName}}>; noEmit?: boolean };
  {{#if includeUrlFetching}}fetchFromUrl: { url: string };{{/if}}
  saveToPublic: { content: string };
};

export type {{dataTypeName}}EmitPayloads = {
  updated: undefined;
  {{#if includeUrlFetching}}fetched: { document: {{dataTypeName}}Document };{{/if}}
  saved: { resourcePath: string };
};

export type {{dataTypeName}}StoreKit = StoreKit<
  {{contextTypeName}},
  {{dataTypeName}}EventPayloads,
  {{dataTypeName}}EmitPayloads
>;`
    },
    
    {
      path: "provider/store/on.ts",
      content: `import type { {{contextTypeName}} } from "../../types";
import type { EventHandlers } from "~/modules/store-kit/types";
import { rawReturn } from "mutative";
import type {
  {{dataTypeName}}EmitPayloads,
  {{dataTypeName}}EventPayloads,
} from "~/modules/{{moduleNamespace}}.ide/provider/store/types";

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

  {{#if includeUrlFetching}}
  fetchFromUrl: async (context, event, enqueue) => {
    try {
      const response = await fetch("/api/{{adapterType}}/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: event.url }),
      });

      const result = await response.json();

      if (response.ok) {
        enqueue.emit.fetched({ document: result.data });
        return rawReturn({
          ...context,
          data: {
            ...context.data,
            document: result.data,
            source: {
              ...context.data.source,
              url: event.url,
              lastFetched: new Date().toISOString(),
            },
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch {{adapterName}} spec:", error);
    }
    return context;
  },
  {{/if}}

  saveToPublic: async (context, event, enqueue) => {
    const manifestId = context.data?.source?.fileName || "{{adapterType}}";
    const resourcePath = \`/resources/{{adapterType}}/\${manifestId}.json\`;

    enqueue.emit.saved({ resourcePath });

    return rawReturn({
      ...context,
      data: {
        ...context.data,
        resourcePath,
      },
    });
  },
};`
    },
    
    {
      path: "utils/validation.ts",
      content: `import type { {{dataTypeName}}Document } from "../types";

/**
 * Validate a {{adapterName}} specification
 */
export function validateSpecification(document: any): {
  valid: boolean;
  message?: string;
} {
  // Check for required fields
  if (!document.version) {
    return {
      valid: false,
      message: "Missing 'version' field",
    };
  }

  if (!document.info || !document.info.title || !document.info.version) {
    return {
      valid: false,
      message: "Missing required 'info' fields",
    };
  }

  // TODO: Add more validation logic for your specification

  return {
    valid: true,
  };
}

/**
 * Extract operations from the specification
 */
export function extractOperations(document: {{dataTypeName}}Document): any[] {
  // TODO: Implement operation extraction logic
  return [];
}`
    },
    
    {
      path: "components/editor.tsx",
      content: `import { use{{dataTypeName}}Selector } from "~/modules/{{moduleNamespace}}.ide/hooks/use-{{moduleNamespace}}-selector";
import { use{{dataTypeName}}Trigger } from "~/modules/{{moduleNamespace}}.ide/hooks/use-{{moduleNamespace}}-trigger";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
{{#if includeUrlFetching}}import { Input } from "~/components/ui/input";
import { useState } from "react";{{/if}}

export function Editor() {
  const data = use{{dataTypeName}}Selector((s) => s.context.data);
  const trigger = use{{dataTypeName}}Trigger();
  {{#if includeUrlFetching}}const [url, setUrl] = useState("");{{/if}}

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="overview" className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="p-4">
          <Card className="p-4">
            <h2 className="text-2xl font-bold mb-4">
              {data.document.info.title}
            </h2>
            <p className="text-muted-foreground mb-2">
              Version: {data.document.info.version}
            </p>
            {data.document.info.description && (
              <p className="text-sm">{data.document.info.description}</p>
            )}
            
            {{#if includeUrlFetching}}
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Fetch from URL</h3>
              <div className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter {{adapterName}} specification URL"
                />
                <Button
                  onClick={() => {
                    if (url) {
                      trigger({ type: "fetchFromUrl", url });
                    }
                  }}
                >
                  Fetch
                </Button>
              </div>
            </div>
            {{/if}}
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold">API Operations</h3>
            <p className="text-muted-foreground">
              Operations will be listed here
            </p>
          </div>
        </TabsContent>

        <TabsContent value="raw" className="p-4">
          <pre className="bg-muted p-4 rounded overflow-auto">
            {JSON.stringify(data.document, null, 2)}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}`
    },
    
    {
      path: "components/quick-view.tsx",
      optional: true,
      content: `import type { {{contextTypeName}} } from "~/modules/{{moduleNamespace}}.ide/types";

export function QuickView({ file }: { file: {{contextTypeName}} }) {
  const { data } = file;
  const operationCount = 0; // TODO: Calculate actual operation count

  return (
    <div className="p-4 space-y-2">
      <h3 className="font-semibold">{data.document.info.title}</h3>
      <p className="text-xs text-muted-foreground">
        Version: {data.document.info.version}
      </p>
      <p className="text-xs">
        Operations: {operationCount}
      </p>
      {data.source.type === "url" && (
        <p className="text-xs text-muted-foreground truncate">
          Source: {data.source.url}
        </p>
      )}
    </div>
  );
}`
    },
    
    {
      path: "components/new-file.tsx",
      optional: true,
      content: `import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { use{{dataTypeName}}Trigger } from "~/modules/{{moduleNamespace}}.ide/hooks/use-{{moduleNamespace}}-trigger";

export default function NewFile() {
  const trigger = use{{dataTypeName}}Trigger();
  const [title, setTitle] = useState("New API");
  const [version, setVersion] = useState("1.0.0");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    trigger({
      type: "update",
      context: {
        data: {
          source: {
            type: "paste",
            lastFetched: new Date().toISOString(),
          },
          document: {
            version: "{{specVersion}}",
            info: {
              title,
              version,
              description: description || undefined,
            },
          },
        },
      },
    });
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Create New {{adapterName}}</h2>
      
      <div className="space-y-2">
        <Label htmlFor="title">API Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My API"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="version">Version</Label>
        <Input
          id="version"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          placeholder="1.0.0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your API..."
        />
      </div>

      <Button onClick={handleCreate} className="w-full">
        Create {{adapterName}} Specification
      </Button>
    </div>
  );
}`
    }
  ],
  
  dependencies: [
    // Conditionally added based on template variables
  ],
  
  postGenerateInstructions: [
    "1. Update the types.ts file with your specification's structure",
    "2. Implement the validation logic in utils/validation.ts",
    "3. Add operation extraction logic",
    "4. Implement the operations list in the editor",
    "5. Create API route handlers if URL fetching is enabled",
    "6. Add any necessary dependencies to package.json"
  ]
};