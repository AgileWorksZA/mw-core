import type { OpenAPIV3 } from "openapi-types";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { useDesigner } from "../types";
import type { GetMethod } from "../types/openApiTypes";

interface ApiDocumentationProps {
  method?: GetMethod;
  apiDoc?: OpenAPIV3.Document;
}

export function ApiDocumentation({ method, apiDoc }: ApiDocumentationProps) {
  const documentation = useDesigner((state) => state.context.documentation);
  const apiDocument = apiDoc || documentation;
  const [activeTab, setActiveTab] = React.useState("overview");

  React.useEffect(() => {
    console.log("[ApiDocumentation] Active tab changed to:", activeTab);
  }, [activeTab]);

  // If no method is provided, show general API documentation
  if (!method) {
    if (!apiDocument) return null;

    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {apiDocument.info.title || "API Documentation"}
          </CardTitle>
          <CardDescription>
            {apiDocument.info.version && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                Version {apiDocument.info.version}
              </span>
            )}
            OpenAPI Specification Overview
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* API Description */}
            {apiDocument.info.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {apiDocument.info.description}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {apiDocument.info.contact && (
              <div>
                <h4 className="text-sm font-medium mb-1">Contact</h4>
                <div className="text-sm bg-muted/50 p-3 rounded">
                  {apiDocument.info.contact.name && (
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {apiDocument.info.contact.name}
                    </div>
                  )}
                  {apiDocument.info.contact.email && (
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {apiDocument.info.contact.email}
                    </div>
                  )}
                  {apiDocument.info.contact.url && (
                    <div>
                      <span className="font-medium">URL:</span>{" "}
                      {apiDocument.info.contact.url}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* License */}
            {apiDocument.info.license && (
              <div>
                <h4 className="text-sm font-medium mb-1">License</h4>
                <div className="text-sm bg-muted/50 p-3 rounded">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {apiDocument.info.license.name}
                  </div>
                  {apiDocument.info.license.url && (
                    <div>
                      <span className="font-medium">URL:</span>{" "}
                      {apiDocument.info.license.url}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Servers */}
            {apiDocument.servers && apiDocument.servers.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Servers</h4>
                <div className="bg-muted/50 rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-2 px-2 font-medium">URL</th>
                        <th className="text-left py-2 px-2 font-medium">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiDocument.servers.map((server, idx) => (
                        <tr
                          key={`server-${
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            idx
                          }`}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="py-2 px-2 font-mono text-xs">
                            {server.url}
                          </td>
                          <td className="py-2 px-2 text-muted-foreground">
                            {server.description || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tags */}
            {apiDocument.tags && apiDocument.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {apiDocument.tags.map((tag) => (
                    <div
                      key={tag.name}
                      className="border rounded p-2 text-sm flex-1 min-w-[200px]"
                    >
                      <div className="font-medium">{tag.name}</div>
                      {tag.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {tag.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          API Documentation
          {method.modelName && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {method.modelName}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Details from the OpenAPI specification
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {method.operationId && (
            <div>
              <h4 className="text-sm font-medium mb-1">Operation ID</h4>
              <p className="text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded inline-block">
                {method.operationId}
              </p>
            </div>
          )}

          {method.tags && method.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {method.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {method.parameters && method.parameters.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Parameters</h4>
              <div className="bg-muted/50 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-2 px-2 font-medium">Name</th>
                      <th className="text-left py-2 px-2 font-medium">In</th>
                      <th className="text-left py-2 px-2 font-medium">Type</th>
                      <th className="text-left py-2 px-2 font-medium">
                        Required
                      </th>
                      <th className="text-left py-2 px-2 font-medium">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {method.parameters.map((param, idx) => {
                      // Handle reference or parameter object
                      if ("$ref" in param) {
                        return (
                          <tr
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            key={idx}
                            className="border-b border-border"
                          >
                            <td
                              colSpan={5}
                              className="py-2 px-2 text-muted-foreground"
                            >
                              Reference: {param.$ref}
                            </td>
                          </tr>
                        );
                      }

                      const paramObj = param as OpenAPIV3.ParameterObject;
                      const schema = paramObj.schema as OpenAPIV3.SchemaObject;

                      return (
                        <tr
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          key={idx}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="py-2 px-2 font-mono text-xs">
                            {paramObj.name}
                          </td>
                          <td className="py-2 px-2">
                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                              {paramObj.in}
                            </span>
                          </td>
                          <td className="py-2 px-2">
                            {schema && "type" in schema && (
                              <span className="text-xs">
                                {schema.type}
                                {schema.format && (
                                  <span className="ml-1 opacity-70">
                                    ({schema.format})
                                  </span>
                                )}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {paramObj.required ? (
                              <span className="text-red-500">Yes</span>
                            ) : (
                              <span className="text-muted-foreground">No</span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-muted-foreground">
                            {paramObj.description || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {method.responses && Object.keys(method.responses).length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Responses</h4>
              <div className="bg-muted/50 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-2 px-2 font-medium">
                        Status
                      </th>
                      <th className="text-left py-2 px-2 font-medium">
                        Description
                      </th>
                      <th className="text-left py-2 px-2 font-medium">
                        Content Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(method.responses).map(
                      ([status, response]) => {
                        // Handle reference or response object
                        if ("$ref" in response) {
                          return (
                            <tr key={status} className="border-b border-border">
                              <td
                                colSpan={3}
                                className="py-2 px-2 text-muted-foreground"
                              >
                                Reference: {response.$ref}
                              </td>
                            </tr>
                          );
                        }

                        const respObj = response as OpenAPIV3.ResponseObject;
                        const contentTypes = respObj.content
                          ? Object.keys(respObj.content)
                          : [];

                        return (
                          <tr
                            key={status}
                            className="border-b border-border hover:bg-muted/50"
                          >
                            <td className="py-2 px-2">
                              <span
                                className={cn(
                                  "text-xs px-1.5 py-0.5 rounded",
                                  status.startsWith("2")
                                    ? "bg-green-100 text-green-800"
                                    : status.startsWith("4") ||
                                        status.startsWith("5")
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800",
                                )}
                              >
                                {status}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-muted-foreground">
                              {respObj.description || "-"}
                            </td>
                            <td className="py-2 px-2">
                              {contentTypes.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {contentTypes.map((ct) => (
                                    <span
                                      key={ct}
                                      className="text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded"
                                    >
                                      {ct}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {method.security && method.security.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Security</h4>
              <div className="bg-muted/50 p-3 rounded">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(method.security, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
