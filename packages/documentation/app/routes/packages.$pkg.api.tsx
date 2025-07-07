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
  const highlightedApi = {
    functions: await highlightApiSection(content.api.functions, theme),
    types: await highlightApiSection(content.api.types, theme),
    constants: await highlightApiSection(content.api.constants, theme),
  };
  
  return data({
    packageName,
    api: content.api,
    highlightedApi,
    theme,
  });
}

async function highlightApiSection(section: any, theme: 'light' | 'dark'): Promise<any> {
  if (!section) return section;
  
  // Deep clone to avoid mutating original
  const highlighted = JSON.parse(JSON.stringify(section));
  
  // Highlight examples in functions
  if (highlighted.functions) {
    for (const fn of highlighted.functions) {
      if (fn.examples) {
        for (const example of fn.examples) {
          example.highlightedCode = await highlightCode(example.code, 'typescript', theme);
        }
      }
    }
  }
  
  // Highlight examples in types
  if (highlighted.types) {
    for (const type of highlighted.types) {
      if (type.examples) {
        for (const example of type.examples) {
          example.highlightedCode = await highlightCode(example.code, 'typescript', theme);
        }
      }
    }
  }
  
  // Highlight examples in constants
  if (highlighted.constants) {
    for (const constant of highlighted.constants) {
      if (constant.examples) {
        for (const example of constant.examples) {
          example.highlightedCode = await highlightCode(example.code, 'typescript', theme);
        }
      }
    }
  }
  
  // Highlight examples in namespaces
  if (highlighted.namespaces) {
    for (const ns of highlighted.namespaces) {
      if (ns.examples) {
        for (const example of ns.examples) {
          example.highlightedCode = await highlightCode(example.code, 'typescript', theme);
        }
      }
    }
  }
  
  return highlighted;
}

function extractApiTableOfContents(api: any) {
  const items: Array<{ id: string; text: string; level: number }> = [];
  
  // Add main sections
  if (api.functions?.functions?.length > 0) {
    items.push({ id: "functions", text: "Functions", level: 2 });
    
    // Group functions by category
    const grouped = api.functions.functions.reduce((acc: any, fn: any) => {
      const category = fn.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(fn);
      return acc;
    }, {} as Record<string, any[]>);
    
    Object.keys(grouped).sort().forEach(category => {
      items.push({ id: `functions-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, text: category, level: 3 });
    });
  }
  
  if (api.types?.types?.length > 0) {
    items.push({ id: "types", text: "Types", level: 2 });
    
    // Group types by category
    const grouped = api.types.types.reduce((acc: any, type: any) => {
      const category = type.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(type);
      return acc;
    }, {} as Record<string, any[]>);
    
    Object.keys(grouped).sort().forEach(category => {
      items.push({ id: `types-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, text: category, level: 3 });
    });
  }
  
  if (api.constants?.constants?.length > 0) {
    items.push({ id: "constants", text: "Constants", level: 2 });
  }
  
  if ((api.functions?.namespaces?.length || 0) + (api.types?.namespaces?.length || 0) > 0) {
    items.push({ id: "namespaces", text: "Namespaces", level: 2 });
  }
  
  return items;
}

export default function PackageAPIReference() {
  const { packageName, api, highlightedApi } = useLoaderData<typeof loader>();
  
  // Count totals
  const totalFunctions = api.functions?.functions?.length || 0;
  const totalTypes = api.types?.types?.length || 0;
  const totalConstants = api.constants?.constants?.length || 0;
  const totalNamespaces = (api.functions?.namespaces?.length || 0) + (api.types?.namespaces?.length || 0);
  
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
          @moneyworks/{packageName} API Reference
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Complete API documentation for all exports
        </p>
        
        {/* Stats */}
        <div className="flex gap-4 mt-4">
          {totalFunctions > 0 && (
            <Badge variant="secondary">{totalFunctions} Functions</Badge>
          )}
          {totalTypes > 0 && (
            <Badge variant="secondary">{totalTypes} Types</Badge>
          )}
          {totalConstants > 0 && (
            <Badge variant="secondary">{totalConstants} Constants</Badge>
          )}
          {totalNamespaces > 0 && (
            <Badge variant="secondary">{totalNamespaces} Namespaces</Badge>
          )}
        </div>
      </div>
      
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-12">
          {/* Functions Section */}
          {highlightedApi.functions?.functions?.length > 0 && (
            <section id="functions">
              <h2 className="text-3xl font-bold mb-6 scroll-mt-20">Functions</h2>
              <FunctionsSection functions={highlightedApi.functions.functions} />
            </section>
          )}
          
          {/* Types Section */}
          {highlightedApi.types?.types?.length > 0 && (
            <section id="types">
              <h2 className="text-3xl font-bold mb-6 scroll-mt-20">Types</h2>
              <TypesSection types={highlightedApi.types.types} />
            </section>
          )}
          
          {/* Constants Section */}
          {highlightedApi.constants?.constants?.length > 0 && (
            <section id="constants">
              <h2 className="text-3xl font-bold mb-6 scroll-mt-20">Constants</h2>
              <ConstantsSection constants={highlightedApi.constants.constants} />
            </section>
          )}
          
          {/* Namespaces Section */}
          {((highlightedApi.functions?.namespaces?.length || 0) + (highlightedApi.types?.namespaces?.length || 0)) > 0 && (
            <section id="namespaces">
              <h2 className="text-3xl font-bold mb-6 scroll-mt-20">Namespaces</h2>
              <NamespacesSection 
                namespaces={[
                  ...(highlightedApi.functions?.namespaces || []),
                  ...(highlightedApi.types?.namespaces || [])
                ]} 
              />
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

function FunctionsSection({ functions }: { functions: any[] }) {
  // Group functions by category
  const grouped = functions.reduce((acc, fn) => {
    const category = fn.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(fn);
    return acc;
  }, {} as Record<string, any[]>);
  
  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, fns]) => (
        <div key={category} id={`functions-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
          <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">{category}</h2>
          <div className="space-y-6">
            {(fns as any[]).map((fn) => (
              <FunctionCard key={fn.name} function={fn} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FunctionCard({ function: fn }: { function: any }) {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div>
        <h3 className="text-xl font-mono font-semibold">{fn.name}</h3>
        <pre className="text-sm text-muted-foreground mt-1 overflow-x-auto">
          {fn.signature}
        </pre>
      </div>
      
      <p className="text-sm">{fn.description}</p>
      
      {fn.parameters?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Parameters</h4>
          <div className="space-y-2">
            {fn.parameters.map((param: any, i: number) => (
              <div key={i} className="flex gap-2 text-sm">
                <code className="font-mono font-semibold">{param.name}</code>
                <span className="text-muted-foreground">
                  {param.type}
                  {param.optional && " (optional)"}
                </span>
                <span>- {param.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {fn.returns && (
        <div>
          <h4 className="font-semibold mb-1">Returns</h4>
          <p className="text-sm">
            <code className="font-mono">{fn.returns.type}</code> - {fn.returns.description}
          </p>
        </div>
      )}
      
      {fn.throws && (
        <div>
          <h4 className="font-semibold mb-1">Throws</h4>
          <p className="text-sm text-destructive">{fn.throws}</p>
        </div>
      )}
      
      {fn.examples?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Examples</h4>
          {fn.examples.length > 2 ? (
            // Use collapsible for multiple examples
            <div className="space-y-2">
              {fn.examples.slice(0, 1).map((ex: any, i: number) => (
                <div key={i}>
                  <p className="text-sm text-muted-foreground mb-1">{ex.title}</p>
                  {ex.highlightedCode ? (
                    <div 
                      className="[&>pre]:my-0"
                      dangerouslySetInnerHTML={{ __html: ex.highlightedCode }} 
                    />
                  ) : (
                    <pre className="overflow-x-auto rounded-lg bg-gray-900 p-6 text-sm">
                      <code className="text-gray-100">{ex.code}</code>
                    </pre>
                  )}
                </div>
              ))}
              <CollapsibleSection title={`Show ${fn.examples.length - 1} more examples`}>
                <div className="space-y-4">
                  {fn.examples.slice(1).map((ex: any, i: number) => (
                    <div key={i + 1}>
                      <p className="text-sm text-muted-foreground mb-1">{ex.title}</p>
                      {ex.highlightedCode ? (
                        <div 
                          className="[&>pre]:my-0"
                          dangerouslySetInnerHTML={{ __html: ex.highlightedCode }} 
                        />
                      ) : (
                        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-6 text-sm">
                          <code className="text-gray-100">{ex.code}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            </div>
          ) : (
            // Show all examples if 2 or fewer
            fn.examples.map((ex: any, i: number) => (
              <div key={i} className="mt-2">
                <p className="text-sm text-muted-foreground mb-1">{ex.title}</p>
                {ex.highlightedCode ? (
                  <div 
                    className="[&>pre]:my-0"
                    dangerouslySetInnerHTML={{ __html: ex.highlightedCode }} 
                  />
                ) : (
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-6 text-sm">
                    <code className="text-gray-100">{ex.code}</code>
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      )}
      
      {fn.see?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-1">See Also</h4>
          <div className="flex gap-2 flex-wrap">
            {fn.see.map((ref: string) => (
              <Badge key={ref} variant="outline">{ref}</Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-2 text-xs text-muted-foreground">
        <span>Since: v{fn.since}</span>
      </div>
    </div>
  );
}

function TypesSection({ types }: { types: any[] }) {
  // Group types by category
  const grouped = types.reduce((acc, type) => {
    const category = type.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(type);
    return acc;
  }, {} as Record<string, any[]>);
  
  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, types]) => (
        <div key={category} id={`types-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
          <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">{category}</h2>
          <div className="space-y-6">
            {(types as any[]).map((type) => (
              <TypeCard key={type.name} type={type} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TypeCard({ type }: { type: any }) {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div>
        <h3 className="text-xl font-mono font-semibold">{type.name}</h3>
        <Badge variant="outline" className="mt-1">{type.kind}</Badge>
      </div>
      
      <pre className="text-sm text-muted-foreground overflow-x-auto">
        {type.definition}
      </pre>
      
      <p className="text-sm">{type.description}</p>
      
      {type.usage && (
        <div>
          <h4 className="font-semibold mb-1">Usage</h4>
          <p className="text-sm">{type.usage}</p>
        </div>
      )}
      
      {type.properties?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Properties</h4>
          <div className="space-y-2">
            {type.properties.map((prop: any, i: number) => (
              <div key={i} className="border-l-2 pl-4">
                <div className="flex gap-2 items-baseline">
                  <code className="font-mono font-semibold">{prop.name}</code>
                  <span className="text-sm text-muted-foreground">{prop.type}</span>
                </div>
                <p className="text-sm mt-1">{prop.description}</p>
                {prop.optional && (
                  <span className="text-xs text-muted-foreground">Optional</span>
                )}
                {prop.default && (
                  <span className="text-xs text-muted-foreground ml-2">
                    Default: <code>{prop.default}</code>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {type.examples?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Examples</h4>
          {type.examples.map((ex: any, i: number) => (
            <div key={i} className="mt-2">
              <p className="text-sm text-muted-foreground mb-1">{ex.title}</p>
              {ex.highlightedCode ? (
                <div 
                  className="[&>pre]:my-0"
                  dangerouslySetInnerHTML={{ __html: ex.highlightedCode }} 
                />
              ) : (
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-6 text-sm">
                  <code className="text-gray-100">{ex.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
      
      {type.see?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-1">See Also</h4>
          <div className="flex gap-2 flex-wrap">
            {type.see.map((ref: string) => (
              <Badge key={ref} variant="outline">{ref}</Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-2 text-xs text-muted-foreground">
        <span>Since: v{type.since}</span>
      </div>
    </div>
  );
}

function ConstantsSection({ constants }: { constants: any[] }) {
  return (
    <div className="space-y-6">
      {constants.map((constant) => (
        <div key={constant.name} className="border rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-xl font-mono font-semibold">{constant.name}</h3>
            <span className="text-sm text-muted-foreground">{constant.type}</span>
          </div>
          
          <pre className="text-sm bg-muted p-2 rounded overflow-x-auto">
            {constant.value}
          </pre>
          
          <p className="text-sm">{constant.description}</p>
          
          {constant.usage && (
            <div>
              <h4 className="font-semibold mb-1">Usage</h4>
              <p className="text-sm">{constant.usage}</p>
            </div>
          )}
          
          {constant.examples?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Examples</h4>
              {constant.examples.map((ex: any, i: number) => (
                <div key={i} className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">{ex.title}</p>
                  {ex.highlightedCode ? (
                    <div 
                      className="[&>pre]:my-0"
                      dangerouslySetInnerHTML={{ __html: ex.highlightedCode }} 
                    />
                  ) : (
                    <pre className="overflow-x-auto rounded-lg bg-gray-900 p-6 text-sm">
                      <code className="text-gray-100">{ex.code}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>Since: v{constant.since}</span>
            <span>•</span>
            <span>{constant.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function NamespacesSection({ namespaces }: { namespaces: any[] }) {
  return (
    <div className="space-y-6">
      {namespaces.map((ns) => (
        <div key={ns.name} className="border rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-xl font-mono font-semibold">{ns.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{ns.description}</p>
          </div>
          
          {ns.methods && (
            <div>
              <h4 className="font-semibold mb-2">Methods</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ns.methods.map((method: string) => (
                  <code key={method} className="text-sm font-mono">
                    {ns.name}.{method}
                  </code>
                ))}
              </div>
            </div>
          )}
          
          {ns.functions && (
            <div>
              <h4 className="font-semibold mb-2">Functions</h4>
              <div className="space-y-2">
                {ns.functions.map((fn: any) => (
                  <div key={fn.name} className="border-l-2 pl-4">
                    <code className="font-mono font-semibold">{fn.name}</code>
                    <pre className="text-xs text-muted-foreground">{fn.signature}</pre>
                    <p className="text-sm mt-1">{fn.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {ns.examples?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Examples</h4>
              {ns.examples.map((ex: any, i: number) => (
                <div key={i} className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">{ex.title}</p>
                  {ex.highlightedCode ? (
                    <div 
                      className="[&>pre]:my-0"
                      dangerouslySetInnerHTML={{ __html: ex.highlightedCode }} 
                    />
                  ) : (
                    <pre className="overflow-x-auto rounded-lg bg-gray-900 p-6 text-sm">
                      <code className="text-gray-100">{ex.code}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>Since: v{ns.since}</span>
            <span>•</span>
            <span>{ns.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
}