import { useLoaderData, useNavigate, useParams } from "react-router";
import type React from "react";
import { useState } from "react";
import { getAdapter } from "~/modules/ide/adapter/register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AlertCircle, Code, ExternalLink, FileText, Link } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import type { loader } from "~/modules/ide/routes/ide.$type.$id";
import { useManifest } from "~/modules/ide/hooks/use-manifest";

export function FileDetails() {
  const { resolved, data } = useLoaderData<typeof loader>();
  const { type } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("editor");

  // Get the adapter for this file type
  const adapter = getAdapter(type as string);
  const manifest = useManifest();

  return (
    <div className="container py-4 max-w-7xl mx-auto">
      {/* Main content area */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="editor">
              <FileText className="h-4 w-4 mr-1" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="dependencies">
              <Link className="h-4 w-4 mr-1" />
              Dependencies ({(resolved || []).length})
            </TabsTrigger>
            <TabsTrigger value="metadata">
              <Code className="h-4 w-4 mr-1" />
              Metadata
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="editor" className="space-y-4">
          {adapter?.Editor ? (
            <adapter.Editor />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Editor Available</CardTitle>
                <CardDescription>
                  There is no editor available for this file type.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md text-sm">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dependencies</CardTitle>
              <CardDescription>
                External files referenced by this file
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resolved && resolved.length > 0 ? (
                <div className="space-y-4">
                  {resolved.map((dep: any, index: number) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">
                          Path:{" "}
                          <code className="bg-muted px-1 rounded">
                            {dep.path}
                          </code>
                        </h3>
                        {dep.error ? (
                          <span className="text-red-500 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Error
                          </span>
                        ) : (
                          <span className="text-green-500">Resolved</span>
                        )}
                      </div>

                      <div className="text-sm mb-2">
                        <span className="font-medium">Reference: </span>
                        <code className="bg-muted px-1 rounded">
                          {dep.pointer.type}/{dep.pointer.id}
                          {dep.pointer.path ? `/${dep.pointer.path}` : ""}
                        </code>
                        {!dep.error && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                            onClick={() =>
                              navigate(
                                `/ide/${dep.pointer.type}/${dep.pointer.id}`,
                              )
                            }
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Open
                          </Button>
                        )}
                      </div>

                      {dep.error ? (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{dep.error}</AlertDescription>
                        </Alert>
                      ) : (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">
                            Resolved Value:
                          </p>
                          <pre className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-40">
                            {JSON.stringify(dep.resolved, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No dependencies found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>File Metadata</CardTitle>
              <CardDescription>Information about this file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">ID</h3>
                  <p className="bg-muted p-2 rounded-md text-sm">
                    {manifest.id}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Type</h3>
                  <p className="bg-muted p-2 rounded-md text-sm">
                    {manifest.type}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Path</h3>
                  <p className="bg-muted p-2 rounded-md text-sm">
                    {manifest.path}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Input Schema</h3>
                {manifest.mapping.input.schema ? (
                  <pre className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-60">
                    {JSON.stringify(manifest.mapping.input.schema, null, 2)}
                  </pre>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No input schema defined
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Output Schema</h3>
                {manifest.mapping.output.variables === true ? (
                  <p className="text-muted-foreground text-sm">
                    Using input as output
                  </p>
                ) : manifest.mapping.output.variables === false ? (
                  <p className="text-muted-foreground text-sm">
                    No output defined
                  </p>
                ) : manifest.mapping.output.schema ? (
                  <pre className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-60">
                    {JSON.stringify(manifest.mapping.output.schema, null, 2)}
                  </pre>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No output schema defined
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
