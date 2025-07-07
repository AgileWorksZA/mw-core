import * as React from "react";
import { useLoaderData, Link, type LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { loadPackageContent } from "~/lib/content-loader";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { getPreferences } from "~/lib/theme.server";
import { highlightCode } from "~/lib/syntax-highlighter";
import { TableOfContents } from "~/components/table-of-contents";
import { Breadcrumb } from "~/components/breadcrumb";
import { CollapsibleSection } from "~/components/collapsible-section";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const packageName = params.pkg;
  
  if (!packageName) {
    throw new Response("Package not found", { status: 404 });
  }
  
  const content = await loadPackageContent(packageName);
  
  if (!content.api) {
    throw new Response("API documentation not found", { status: 404 });
  }
  
  // Get current theme preference
  const preferences = await getPreferences(request);
  const theme = preferences.theme === 'light' ? 'light' : 'dark';
  
  // Pre-highlight all code examples
  const highlightedApi = await highlightApiData(content.api, theme);
  
  return data({
    packageName,
    api: content.api,
    highlightedApi,
    theme,
  });
}

async function highlightApiData(api: any, theme: 'light' | 'dark'): Promise<any> {
  if (!api) return api;
  
  // Deep clone to avoid mutating original
  const highlighted = JSON.parse(JSON.stringify(api));
  
  // Highlight code in exports
  if (highlighted.exports) {
    for (const exportGroup of highlighted.exports) {
      if (exportGroup.items) {
        for (const item of exportGroup.items) {
          if (item.example) {
            item.highlightedExample = await highlightCode(item.example, 'typescript', theme);
          }
        }
      }
    }
  }
  
  // Highlight code in usage examples
  if (highlighted.usage?.examples) {
    for (const example of highlighted.usage.examples) {
      if (example.code) {
        example.highlightedCode = await highlightCode(example.code, 'typescript', theme);
      }
    }
  }
  
  return highlighted;
}

function extractApiTableOfContents(api: any) {
  const items: Array<{ id: string; text: string; level: number }> = [];
  
  // Add exports sections
  if (api.exports) {
    api.exports.forEach((exportGroup: any, index: number) => {
      const id = `export-${exportGroup.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      items.push({ id, text: exportGroup.name, level: 2 });
    });
  }
  
  // Add usage section if it has examples
  if (api.usage?.examples?.length > 0) {
    items.push({ id: "usage-examples", text: "Usage Examples", level: 2 });
  }
  
  // Add design principles if present
  if (api.designPrinciples?.length > 0) {
    items.push({ id: "design-principles", text: "Design Principles", level: 2 });
  }
  
  return items;
}

export default function PackageAPIReference() {
  const { packageName, api, highlightedApi } = useLoaderData<typeof loader>();
  
  // Extract table of contents
  const tableOfContents = extractApiTableOfContents(api);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: "Packages", href: "/packages" },
          { label: packageName, href: `/packages/${packageName}` },
          { label: "API Reference" }
        ]} 
        className="mb-4"
      />
      <div className="mb-8">
        <h1 className="text-4xl font-bold mt-2">
          {api.name} API Reference
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          {api.description}
        </p>
        {api.version && (
          <Badge variant="secondary" className="mt-2">v{api.version}</Badge>
        )}
      </div>
      
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-12">
          {/* Overview if present */}
          {api.overview && (
            <section className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg">{api.overview}</p>
            </section>
          )}

          {/* Exports Sections */}
          {highlightedApi.exports?.map((exportGroup: any) => (
            <section 
              key={exportGroup.name} 
              id={`export-${exportGroup.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            >
              <h2 className="text-3xl font-bold mb-2 scroll-mt-20">{exportGroup.name}</h2>
              <p className="text-muted-foreground mb-6">{exportGroup.description}</p>
              <ExportGroup group={exportGroup} />
            </section>
          ))}
          
          {/* Usage Examples */}
          {highlightedApi.usage?.examples?.length > 0 && (
            <section id="usage-examples">
              <h2 className="text-3xl font-bold mb-6 scroll-mt-20">Usage Examples</h2>
              <div className="space-y-6">
                {highlightedApi.usage.examples.map((example: any, index: number) => (
                  <UsageExample key={index} example={example} />
                ))}
              </div>
            </section>
          )}
          
          {/* Import Patterns */}
          {api.usage?.importPatterns?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Import Patterns</h2>
              <div className="space-y-4">
                {api.usage.importPatterns.map((pattern: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <pre className="text-sm bg-muted p-2 rounded overflow-x-auto mb-2">
                      <code>{pattern.pattern}</code>
                    </pre>
                    <p className="text-sm text-muted-foreground">{pattern.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Design Principles */}
          {api.designPrinciples?.length > 0 && (
            <section id="design-principles">
              <h2 className="text-3xl font-bold mb-6 scroll-mt-20">Design Principles</h2>
              <div className="grid gap-4">
                {api.designPrinciples.map((principle: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{principle.principle}</h3>
                    <p className="text-sm text-muted-foreground">{principle.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Future Plans */}
          {api.futurePlans?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Future Plans</h2>
              <div className="space-y-2">
                {api.futurePlans.map((plan: any, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant={plan.status === 'Planned' ? 'secondary' : 'default'}>
                      {plan.status}
                    </Badge>
                    <div>
                      <strong>{plan.entity}</strong>
                      <span className="text-muted-foreground ml-2">{plan.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Table of Contents - Sticky Sidebar */}
        {tableOfContents.length > 0 && (
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <TableOfContents items={tableOfContents} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function ExportGroup({ group }: { group: any }) {
  return (
    <div className="space-y-6">
      {group.items.map((item: any) => (
        <ExportItem key={item.name} item={item} />
      ))}
    </div>
  );
}

function ExportItem({ item }: { item: any }) {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div>
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-mono font-semibold">{item.name}</h3>
          <Badge variant="outline">{item.type}</Badge>
        </div>
        {item.signature && (
          <pre className="text-sm text-muted-foreground mt-2 overflow-x-auto">
            {item.signature}
          </pre>
        )}
      </div>
      
      <p className="text-sm">{item.description}</p>
      
      {item.highlightedExample ? (
        <div>
          <h4 className="font-semibold mb-2">Example</h4>
          <div 
            className="[&>pre]:my-0"
            dangerouslySetInnerHTML={{ __html: item.highlightedExample }} 
          />
        </div>
      ) : item.example && (
        <div>
          <h4 className="font-semibold mb-2">Example</h4>
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm">
            <code className="text-gray-100">{item.example}</code>
          </pre>
        </div>
      )}
      
      {item.since && (
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>Since: v{item.since}</span>
        </div>
      )}
    </div>
  );
}

function UsageExample({ example }: { example: any }) {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{example.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{example.description}</p>
      </div>
      
      {example.highlightedCode ? (
        <div 
          className="[&>pre]:my-0"
          dangerouslySetInnerHTML={{ __html: example.highlightedCode }} 
        />
      ) : (
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm">
          <code className="text-gray-100">{example.code}</code>
        </pre>
      )}
    </div>
  );
}