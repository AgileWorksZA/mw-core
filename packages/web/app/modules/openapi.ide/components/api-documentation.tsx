import { useState } from "react";
import type { OpenAPIDocument, OpenAPIOperation } from "../types";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { extractOperations, extractSchemas } from "../utils/extract-operations";

interface ApiDocumentationProps {
  document: OpenAPIDocument;
}

const methodColors: Record<string, string> = {
  GET: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  POST: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  PUT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  PATCH:
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  HEAD: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  OPTIONS: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function ApiDocumentation({ document }: ApiDocumentationProps) {
  const operations = extractOperations(document);
  const schemas = extractSchemas(document);

  // Group operations by tag
  const operationsByTag = operations.reduce(
    (acc, op) => {
      const tags = op.tags || ["default"];
      for (const tag of tags) {
        if (!acc[tag]) acc[tag] = [];
        acc[tag].push(op);
      }
      return acc;
    },
    {} as Record<string, OpenAPIOperation[]>,
  );

  const [selectedTag, setSelectedTag] = useState(
    Object.keys(operationsByTag)[0] || "default",
  );

  return (
    <>
      <div className="space-y-6">
        {/* API Info */}
        <Card>
          <CardHeader>
            <CardTitle>{document.info.title}</CardTitle>
            <CardDescription>
              Version {document.info.version}
              {document.info.description && ` • ${document.info.description}`}
            </CardDescription>
          </CardHeader>
          {document.servers && document.servers.length > 0 && (
            <CardContent>
              <h4 className="text-sm font-semibold mb-2">Servers</h4>
              <div className="space-y-1">
                {document.servers.map((server) => (
                  <div key={server.url} className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {server.url}
                    </Badge>
                    {server.description && (
                      <span className="text-xs text-muted-foreground">
                        {server.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Operations */}
        <Card>
          <CardHeader>
            <CardTitle>Operations</CardTitle>
            <CardDescription>
              {operations.length} endpoints available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 h-[600px]">
              {/* Tag list sidebar */}
              {Object.keys(operationsByTag).length > 1 && (
                <div className="w-48 border-r pr-4">
                  <ScrollArea className="h-full">
                    <div className="space-y-1">
                      {Object.keys(operationsByTag).map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                            "hover:bg-accent hover:text-accent-foreground",
                            selectedTag === tag &&
                              "bg-accent text-accent-foreground font-medium",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{tag}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {operationsByTag[tag].length}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Operations content */}
              <div className="flex-1">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4">
                    {operationsByTag[selectedTag]?.map((op, idx) => (
                      <Card key={`${op.method}-${op.path}-${idx}`}>
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <Badge
                              className={`${methodColors[op.method] || methodColors.GET} font-mono`}
                            >
                              {op.method}
                            </Badge>
                            <div className="flex-1">
                              <h4 className="font-mono text-sm font-semibold">
                                {op.path}
                              </h4>
                              {op.summary && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {op.summary}
                                </p>
                              )}
                              {op.description &&
                                op.description !== op.summary && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {op.description}
                                  </p>
                                )}
                              {op.operationId && (
                                <Badge
                                  variant="outline"
                                  className="mt-2 text-xs"
                                >
                                  {op.operationId}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Parameters */}
                          {op.parameters && op.parameters.length > 0 && (
                            <div>
                              <h5 className="text-sm font-semibold mb-2">
                                Parameters
                              </h5>
                              <div className="space-y-2">
                                {op.parameters.map((param) => (
                                  <div
                                    key={param.name}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {param.in}
                                    </Badge>
                                    <div className="flex-1">
                                      <span className="font-mono font-medium">
                                        {param.name}
                                      </span>
                                      {param.required && (
                                        <Badge
                                          variant="destructive"
                                          className="ml-2 text-xs"
                                        >
                                          required
                                        </Badge>
                                      )}
                                      {param.description && (
                                        <p className="text-muted-foreground mt-1">
                                          {param.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Request Body */}
                          {op.requestBody && (
                            <div>
                              <h5 className="text-sm font-semibold mb-2">
                                Request Body
                              </h5>
                              {op.requestBody.required && (
                                <Badge
                                  variant="destructive"
                                  className="mb-2 text-xs"
                                >
                                  required
                                </Badge>
                              )}
                              {op.requestBody.description && (
                                <p className="text-sm text-muted-foreground">
                                  {op.requestBody.description}
                                </p>
                              )}
                              {op.requestBody.content && (
                                <div className="mt-2">
                                  {Object.keys(op.requestBody.content).map(
                                    (contentType) => (
                                      <Badge
                                        key={contentType}
                                        variant="outline"
                                        className="text-xs mr-2"
                                      >
                                        {contentType}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Responses */}
                          {op.responses && (
                            <div>
                              <h5 className="text-sm font-semibold mb-2">
                                Responses
                              </h5>
                              <div className="space-y-2">
                                {Object.entries(op.responses).map(
                                  ([code, response]) => (
                                    <div
                                      key={code}
                                      className="flex items-start gap-2"
                                    >
                                      <Badge
                                        variant={
                                          code.startsWith("2")
                                            ? "default"
                                            : code.startsWith("4")
                                              ? "destructive"
                                              : "secondary"
                                        }
                                        className="text-xs"
                                      >
                                        {code}
                                      </Badge>
                                      <p className="text-sm text-muted-foreground">
                                        {(response as any).description ||
                                          "No description"}
                                      </p>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schemas */}
        {Object.keys(schemas).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Schemas</CardTitle>
              <CardDescription>
                {Object.keys(schemas).length} schemas defined
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {Object.entries(schemas).map(([name, schema]) => (
                    <Card key={name}>
                      <CardHeader>
                        <CardTitle className="text-base font-mono">
                          {name}
                        </CardTitle>
                        {schema.description && (
                          <CardDescription>
                            {schema.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                          {JSON.stringify(schema, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
