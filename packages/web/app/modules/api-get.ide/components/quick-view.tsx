import { Database, FileText, Link, Settings } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import type { ApiGetConfig } from "../types";
import type { FileContext } from "~/modules/ide/types";

interface QuickViewProps {
  file: FileContext<ApiGetConfig>;
}

export function QuickView({ file }: QuickViewProps) {
  const document = file.data;
  
  const hasParameters = Object.keys({
    ...document.parameters.path,
    ...document.parameters.query,
    ...document.parameters.headers,
  }).length > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {document.name}
            </CardTitle>
            {document.description && (
              <CardDescription>{document.description}</CardDescription>
            )}
          </div>
          <Badge variant="secondary">API Get</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sources */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Link className="h-4 w-4" />
            Sources
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">OpenAPI:</span>
              <span className="font-mono">{document.sources.openApiFile}</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Connection:</span>
              <span className="font-mono">{document.sources.serviceConnection}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Endpoint */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Endpoint</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">GET</Badge>
              <code className="text-sm font-mono">{document.endpoint.path || "Not selected"}</code>
            </div>
            {document.endpoint.summary && (
              <p className="text-sm text-muted-foreground">{document.endpoint.summary}</p>
            )}
          </div>
        </div>

        {/* Parameters */}
        {hasParameters && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Parameters</h3>
              <div className="space-y-2 text-sm">
                {Object.entries(document.parameters.path || {}).map(([name, config]) => (
                  <div key={`path-${name}`} className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">PATH</Badge>
                    <span className="font-mono">{name}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-muted-foreground">{config.value}</span>
                  </div>
                ))}
                {Object.entries(document.parameters.query || {}).map(([name, config]) => (
                  <div key={`query-${name}`} className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">QUERY</Badge>
                    <span className="font-mono">{name}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-muted-foreground">{config.value}</span>
                  </div>
                ))}
                {Object.entries(document.parameters.headers || {}).map(([name, config]) => (
                  <div key={`header-${name}`} className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">HEADER</Badge>
                    <span className="font-mono">{name}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-muted-foreground">{config.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Output Variables */}
        <Separator />
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Output Variables</h3>
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-muted-foreground">Data:</span>{" "}
              <span className="font-mono">{document.output.data}</span>
            </div>
            {document.output.error && (
              <div>
                <span className="text-muted-foreground">Error:</span>{" "}
                <span className="font-mono">{document.output.error}</span>
              </div>
            )}
            {document.output.loading && (
              <div>
                <span className="text-muted-foreground">Loading:</span>{" "}
                <span className="font-mono">{document.output.loading}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cache Status */}
        {document.cache?.enabled && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Cache</h3>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="text-xs">ENABLED</Badge>
                <span className="text-muted-foreground">
                  TTL: {document.cache.ttl || 300}s
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}