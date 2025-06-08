import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  FileJson2,
  Download,
  RefreshCw,
  Link,
  FileText,
  Copy,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useOpenAPISelector } from "../hooks/use-openapi-selector";
import { useOpenAPITrigger } from "../hooks/use-openapi-trigger";
import { useManifest } from "~/modules/ide/hooks/use-manifest";
import { ImportDialog } from "./import-dialog";
import type { OpenAPIDocument, OpenAPIData } from "../types";
import {
  extractOperations,
  extractSchemas,
  extractServers,
} from "../utils/extract-operations";
import MonacoEditor from "@monaco-editor/react";
import { ApiDocumentation } from "./api-documentation";
import Moment from "~/components/moment";

export function OpenAPIManager() {
  const manifest = useManifest();
  const contextData = useOpenAPISelector((state) => state.context?.data);
  const openApiData = contextData as OpenAPIData | undefined;
  const trigger = useOpenAPITrigger();

  const [showImport, setShowImport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [jsonString, setJsonString] = useState("");

  // Update JSON string when data changes
  useEffect(() => {
    if (openApiData?.document) {
      setJsonString(JSON.stringify(openApiData.document, null, 2));
    }
  }, [openApiData?.document]);

  const handleImport = useCallback(
    async (
      document: OpenAPIDocument,
      source: {
        type: "url" | "file" | "paste";
        url?: string;
        fileName?: string;
      },
    ) => {
      try {
        // Save to public resources via server
        const response = await fetch("/api/openapi/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: manifest.id,
            content: JSON.stringify(document, null, 2),
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to save OpenAPI spec");
        }

        // Update the context with the new data
        trigger.update({
          context: {
            data: {
              source: {
                type: source.type,
                url: source.url,
                fileName: source.fileName,
                lastFetched: new Date().toISOString(),
              },
              resourcePath: result.resourcePath,
              document,
            },
          },
        });

        setShowImport(false);
      } catch (error) {
        console.error("Failed to import OpenAPI spec:", error);
        // Still update the context even if saving to public fails
        trigger.update({
          context: {
            data: {
              source: {
                type: source.type,
                url: source.url,
                fileName: source.fileName,
                lastFetched: new Date().toISOString(),
              },
              document,
            },
          },
        });
        setShowImport(false);
      }
    },
    [manifest.id, trigger],
  );

  const handleRefresh = useCallback(async () => {
    if (!openApiData?.source?.url) return;

    setRefreshing(true);
    try {
      const response = await fetch("/api/openapi/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: openApiData.source.url }),
      });

      const result = await response.json();

      if (response.ok) {
        handleImport(result.data, {
          type: "url",
          url: openApiData.source.url,
        });
      }
    } finally {
      setRefreshing(false);
    }
  }, [openApiData?.source?.url, handleImport]);

  const copyResourcePath = useCallback(() => {
    if (openApiData?.resourcePath) {
      navigator.clipboard.writeText(openApiData.resourcePath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [openApiData?.resourcePath]);

  const handleCodeChange = useCallback(
    async (newContent: string | undefined) => {
      if (!newContent) return;

      try {
        const document = JSON.parse(newContent);

        // Save to public resources
        const response = await fetch("/api/openapi/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: manifest.id,
            content: newContent,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          trigger.update({
            context: {
              data: {
                ...openApiData,
                document,
                resourcePath: result.resourcePath,
              } as any,
            },
          });
        }
      } catch {
        // Invalid JSON, don't update
      }
    },
    [openApiData, trigger, manifest.id],
  );

  // Handle case where there's no document yet (import needed)
  const needsImport = !openApiData || !openApiData.document;

  if (needsImport) {
    return (
      <>
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <FileJson2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-semibold">No OpenAPI Specification</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Import an OpenAPI specification to get started
                </p>
              </div>
              <Button onClick={() => setShowImport(true)}>
                <Download className="mr-2 h-4 w-4" />
                Import OpenAPI
              </Button>
            </div>
          </CardContent>
        </Card>
        <ImportDialog
          open={showImport}
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      </>
    );
  }

  const doc = openApiData.document;
  const operations = extractOperations(doc);
  const schemas = extractSchemas(doc);
  const servers = extractServers(doc);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>{doc.info.title}</CardTitle>
              <CardDescription>
                Version {doc.info.version}
                {doc.info.description && ` • ${doc.info.description}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {openApiData.source?.type === "url" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImport(true)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Badge variant="outline" className="flex items-center gap-1">
              {openApiData.source?.type === "url" && (
                <Link className="h-3 w-3" />
              )}
              {openApiData.source?.type === "file" && (
                <FileText className="h-3 w-3" />
              )}
              {openApiData.source?.type === "paste" && (
                <FileText className="h-3 w-3" />
              )}
              {openApiData.source?.type}
            </Badge>

            {openApiData.source?.url && (
              <span className="text-xs text-muted-foreground truncate">
                {openApiData.source?.url}
              </span>
            )}

            {openApiData.source?.fileName && (
              <span className="text-xs text-muted-foreground">
                {openApiData.source?.fileName}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {openApiData.resourcePath && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Resource Path</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="flex items-center justify-between">
                  <code className="text-sm">{openApiData.resourcePath}</code>
                  <Button variant="ghost" size="sm" onClick={copyResourcePath}>
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="documentation" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="editor">Editor</TabsTrigger>
            </TabsList>

            <TabsContent value="documentation">
              <ApiDocumentation document={doc} />
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <h3 className="font-semibold mb-2">
                    Servers ({servers.length})
                  </h3>
                  <div className="text-sm space-y-1">
                    {servers.map((server) => (
                      <div
                        key={server}
                        className="font-mono text-xs bg-muted p-2 rounded"
                      >
                        {server}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">
                    Operations ({operations.length})
                  </h3>
                  <div className="text-sm space-y-1 max-h-48 overflow-y-auto">
                    {operations.map((op) => (
                      <div
                        key={op.path}
                        className="flex items-center gap-2 py-1"
                      >
                        <span
                          className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                            op.method === "GET"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : op.method === "POST"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : op.method === "PUT"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                  : op.method === "DELETE"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {op.method}
                        </span>
                        <span className="font-mono text-xs">{op.path}</span>
                        {op.summary && (
                          <span className="text-xs text-muted-foreground">
                            - {op.summary}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">
                    Schemas ({Object.keys(schemas).length})
                  </h3>
                  <div className="text-sm space-y-1 max-h-48 overflow-y-auto">
                    {Object.keys(schemas).map((schemaName) => (
                      <div
                        key={schemaName}
                        className="font-mono text-xs bg-muted p-2 rounded"
                      >
                        {schemaName}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="editor">
              <div className="border rounded-lg overflow-hidden">
                <MonacoEditor
                  height="400px"
                  language="json"
                  theme="vs-dark"
                  value={jsonString}
                  onChange={handleCodeChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    automaticLayout: true,
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="bg-muted/50 text-xs text-muted-foreground">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <span>Path: {manifest.path}</span>
              <span>Type: openapi</span>
            </div>
            <div className="mt-1">ID: {manifest.id}</div>
            {openApiData.source?.lastFetched && (
              <div className="mt-1">
                Last fetched: <Moment date={openApiData.source?.lastFetched} />
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      <ImportDialog
        open={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImport}
      />
    </>
  );
}

export { OpenAPIManager as Editor };
