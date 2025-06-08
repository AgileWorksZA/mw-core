import { useServiceConnectionDataSelector } from "~/modules/serviceconnection.ide/hooks/use-serviceconnection-selector";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Shield, Globe, Clock, RefreshCw } from "lucide-react";

export function QuickView() {
  const data = useServiceConnectionDataSelector((s) => s.context.data);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {data.name}
          <Badge variant="outline">{data.type.toUpperCase()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">URL:</span>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {data.url || "Not configured"}
            </code>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Auth:</span>
            <Badge variant="secondary" className="text-xs">
              {data.authentication.type}
            </Badge>
          </div>

          {data.timeout && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Timeout:</span>
              <span className="text-muted-foreground">{data.timeout}ms</span>
            </div>
          )}

          {data.retryConfig && (
            <div className="flex items-center gap-2 text-sm">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Retries:</span>
              <span className="text-muted-foreground">
                {data.retryConfig.maxRetries} attempts, {data.retryConfig.retryDelay}ms delay
              </span>
            </div>
          )}
        </div>

        {data.metadata?.description && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">{data.metadata.description}</p>
          </div>
        )}

        {data.metadata?.tags && data.metadata.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {data.metadata.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {data.metadata?.lastTested && (
          <div className="text-xs text-muted-foreground border-t pt-2">
            Last tested: {new Date(data.metadata.lastTested).toLocaleString()}
            {data.metadata.lastTestStatus && (
              <Badge 
                variant={data.metadata.lastTestStatus === "success" ? "default" : "destructive"}
                className="ml-2 text-xs"
              >
                {data.metadata.lastTestStatus}
              </Badge>
            )}
          </div>
        )}

        <div className="pt-2 border-t">
          <details className="cursor-pointer">
            <summary className="text-sm font-medium">Raw Configuration</summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-48">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}