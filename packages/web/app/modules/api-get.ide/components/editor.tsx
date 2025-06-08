import * as React from "react";
import { useNavigate } from "react-router";
import { Save, Search, Database, FileText, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { SelectFileByType } from "~/modules/ide/components/select-file-by-type";
import { useIdeSelector } from "~/modules/ide/hooks/use-ide-selector";
import { useApiGetDataSelector } from "../hooks/use-api-get-selector";
import { useApiGetTrigger } from "../hooks/use-api-get-trigger";
import type { ApiGetConfig, EndpointOption, ParameterConfig } from "../types";
import type { OpenAPIFileContext } from "~/modules/openapi.ide/types";

export function Editor() {
  const navigate = useNavigate();
  const document = useApiGetDataSelector();
  const { updateDocument } = useApiGetTrigger();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedEndpoint, setSelectedEndpoint] = React.useState(document.endpoint.path);
  const [isSaving, setIsSaving] = React.useState(false);

  const onChange = React.useCallback((updates: Partial<ApiGetConfig>) => {
    updateDocument(updates);
  }, [updateDocument]);

  const onSave = React.useCallback(async () => {
    setIsSaving(true);
    // Changes are automatically saved through the store-kit sync
    // Simulate save delay for UX feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
  }, []);
  
  // Get the OpenAPI document
  const openApiDoc = useIdeSelector((state) => {
    if (!document.sources.openApiFile) return null;
    return state.files?.find(f => f.id === document.sources.openApiFile);
  });

  const openApiData = React.useMemo(() => {
    if (!openApiDoc?.path) return null;
    // For now, return null - we'd need to load the actual OpenAPI document
    // This would typically be done through a separate API call or context
    return null;
  }, [openApiDoc]);

  // Extract GET endpoints from OpenAPI spec
  const getEndpoints = React.useMemo(() => {
    if (!openApiData?.paths) return [];
    
    const endpoints: EndpointOption[] = [];
    
    for (const [path, pathItem] of Object.entries(openApiData.paths)) {
      if (pathItem && typeof pathItem === 'object' && 'get' in pathItem && pathItem.get) {
        endpoints.push({
          path,
          method: "get",
          operation: pathItem.get as any,
        });
      }
    }
    
    return endpoints;
  }, [openApiData]);

  // Filter endpoints based on search
  const filteredEndpoints = React.useMemo(() => {
    if (!searchQuery) return getEndpoints;
    
    const query = searchQuery.toLowerCase();
    return getEndpoints.filter((endpoint) => {
      const searchableText = [
        endpoint.path,
        endpoint.operation.operationId,
        endpoint.operation.summary,
        endpoint.operation.description,
        ...(endpoint.operation.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      
      return searchableText.includes(query);
    });
  }, [getEndpoints, searchQuery]);

  // Get selected endpoint details
  const selectedEndpointDetails = getEndpoints.find((e) => e.path === selectedEndpoint);

  // Extract parameters for the selected endpoint
  const endpointParameters = React.useMemo(() => {
    if (!selectedEndpointDetails) return { path: [], query: [], header: [] };
    
    const params = {
      path: [] as any[],
      query: [] as any[],
      header: [] as any[],
    };
    
    // Extract path parameters from the path itself
    const pathParams = selectedEndpoint.match(/\{([^}]+)\}/g) || [];
    for (const param of pathParams) {
      const name = param.slice(1, -1);
      params.path.push({
        name,
        in: "path",
        required: true,
        description: `Path parameter: ${name}`,
      });
    }
    
    // Add parameters from OpenAPI spec
    if (selectedEndpointDetails.operation.parameters) {
      for (const param of selectedEndpointDetails.operation.parameters) {
        if (param.in === "path" && !params.path.find((p) => p.name === param.name)) {
          params.path.push(param);
        } else if (param.in === "query") {
          params.query.push(param);
        } else if (param.in === "header") {
          params.header.push(param);
        }
      }
    }
    
    return params;
  }, [selectedEndpointDetails, selectedEndpoint]);

  const handleEndpointChange = (path: string) => {
    setSelectedEndpoint(path);
    const endpoint = getEndpoints.find((e) => e.path === path);
    
    if (endpoint) {
      onChange({
        endpoint: {
          ...document.endpoint,
          path,
          operationId: endpoint.operation.operationId,
          summary: endpoint.operation.summary,
          description: endpoint.operation.description,
        },
        // Reset parameters when endpoint changes
        parameters: {
          path: {},
          query: {},
          headers: {},
        },
      });
    }
  };

  const handleParameterChange = (
    type: "path" | "query" | "headers",
    name: string,
    config: ParameterConfig
  ) => {
    onChange({
      parameters: {
        ...document.parameters,
        [type]: {
          ...document.parameters[type],
          [name]: config,
        },
      },
    });
  };

  const handleSourceChange = (field: "openApiFile" | "serviceConnection", value: string) => {
    onChange({
      sources: {
        ...document.sources,
        [field]: value,
      },
    });
  };

  if (!openApiDoc && document.sources.openApiFile) {
    return (
      <div className="container max-w-4xl py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Loading OpenAPI specification...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{document.name}</h1>
          {document.description && (
            <p className="text-muted-foreground">{document.description}</p>
          )}
        </div>
        <Button onClick={onSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      <Tabs defaultValue="endpoint" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="endpoint">Endpoint</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                Configure the OpenAPI specification and service connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SelectFileByType
                fileType="openapi"
                value={document.sources.openApiFile}
                onValueChange={(value) => handleSourceChange("openApiFile", value)}
                label="OpenAPI Specification"
                required
              />
              
              <SelectFileByType
                fileType="serviceconnection"
                value={document.sources.serviceConnection}
                onValueChange={(value) => handleSourceChange("serviceConnection", value)}
                label="Service Connection"
                required
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoint" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Endpoint</CardTitle>
              <CardDescription>
                Choose a GET endpoint from the OpenAPI specification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!document.sources.openApiFile ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please select an OpenAPI specification first
                  </AlertDescription>
                </Alert>
              ) : !openApiData ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Loading OpenAPI specification...
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search endpoints..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <ScrollArea className="h-[400px] border rounded-md">
                    <div className="p-4 space-y-2">
                      {filteredEndpoints.map((endpoint) => (
                        <div
                          key={endpoint.path}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedEndpoint === endpoint.path
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => handleEndpointChange(endpoint.path)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">GET</Badge>
                                <code className="text-sm font-mono">{endpoint.path}</code>
                              </div>
                              {endpoint.operation.summary && (
                                <p className="text-sm font-medium">{endpoint.operation.summary}</p>
                              )}
                              {endpoint.operation.description && (
                                <p className="text-sm text-muted-foreground">
                                  {endpoint.operation.description}
                                </p>
                              )}
                              {endpoint.operation.tags && endpoint.operation.tags.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                  {endpoint.operation.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            {selectedEndpoint === endpoint.path && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configure Parameters</CardTitle>
              <CardDescription>
                Set values for path, query, and header parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedEndpoint ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please select an endpoint first
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  {/* Path Parameters */}
                  {endpointParameters.path.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Path Parameters</h3>
                      {endpointParameters.path.map((param) => (
                        <ParameterInput
                          key={param.name}
                          parameter={param}
                          value={document.parameters.path?.[param.name]}
                          onChange={(config) => handleParameterChange("path", param.name, config)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Query Parameters */}
                  {endpointParameters.query.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Query Parameters</h3>
                      {endpointParameters.query.map((param) => (
                        <ParameterInput
                          key={param.name}
                          parameter={param}
                          value={document.parameters.query?.[param.name]}
                          onChange={(config) => handleParameterChange("query", param.name, config)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Header Parameters */}
                  {endpointParameters.header.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Header Parameters</h3>
                      {endpointParameters.header.map((param) => (
                        <ParameterInput
                          key={param.name}
                          parameter={param}
                          value={document.parameters.headers?.[param.name]}
                          onChange={(config) => handleParameterChange("headers", param.name, config)}
                        />
                      ))}
                    </div>
                  )}

                  {endpointParameters.path.length === 0 &&
                    endpointParameters.query.length === 0 &&
                    endpointParameters.header.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        This endpoint has no parameters
                      </p>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Configuration</CardTitle>
              <CardDescription>
                Configure how to extract and transform response data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataPath">Data Path (JSONPath)</Label>
                <Input
                  id="dataPath"
                  value={document.response.dataPath || ""}
                  onChange={(e) =>
                    onChange({
                      response: { ...document.response, dataPath: e.target.value },
                    })
                  }
                  placeholder="$.data or $.results"
                />
                <p className="text-xs text-muted-foreground">
                  JSONPath expression to extract data from the response
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="errorPath">Error Path (JSONPath)</Label>
                <Input
                  id="errorPath"
                  value={document.response.errorPath || ""}
                  onChange={(e) =>
                    onChange({
                      response: { ...document.response, errorPath: e.target.value },
                    })
                  }
                  placeholder="$.error or $.message"
                />
                <p className="text-xs text-muted-foreground">
                  JSONPath expression to extract error messages
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cacheEnabled">Enable Caching</Label>
                  <Switch
                    id="cacheEnabled"
                    checked={document.cache?.enabled || false}
                    onCheckedChange={(checked) =>
                      onChange({
                        cache: { ...document.cache, enabled: checked },
                      })
                    }
                  />
                </div>
                {document.cache?.enabled && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="cacheTtl">Cache TTL (seconds)</Label>
                    <Input
                      id="cacheTtl"
                      type="number"
                      value={document.cache.ttl || 300}
                      onChange={(e) =>
                        onChange({
                          cache: { 
                            enabled: document.cache?.enabled || false,
                            ...document.cache, 
                            ttl: parseInt(e.target.value) 
                          },
                        })
                      }
                      placeholder="300"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="output" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Output Variables</CardTitle>
              <CardDescription>
                Configure variable names for the response data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="outputData">Data Variable</Label>
                <Input
                  id="outputData"
                  value={document.output.data}
                  onChange={(e) =>
                    onChange({
                      output: { ...document.output, data: e.target.value },
                    })
                  }
                  placeholder="e.g., usersList"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outputError">Error Variable</Label>
                <Input
                  id="outputError"
                  value={document.output.error || ""}
                  onChange={(e) =>
                    onChange({
                      output: { ...document.output, error: e.target.value },
                    })
                  }
                  placeholder="e.g., usersError"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outputLoading">Loading Variable</Label>
                <Input
                  id="outputLoading"
                  value={document.output.loading || ""}
                  onChange={(e) =>
                    onChange({
                      output: { ...document.output, loading: e.target.value },
                    })
                  }
                  placeholder="e.g., usersLoading"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outputMetadata">Metadata Variable</Label>
                <Input
                  id="outputMetadata"
                  value={document.output.metadata || ""}
                  onChange={(e) =>
                    onChange({
                      output: { ...document.output, metadata: e.target.value },
                    })
                  }
                  placeholder="e.g., usersMetadata"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Parameter Input Component
interface ParameterInputProps {
  parameter: any;
  value?: ParameterConfig;
  onChange: (config: ParameterConfig) => void;
}

function ParameterInput({ parameter, value, onChange }: ParameterInputProps) {
  const currentValue = value || {
    value: "",
    source: "static" as const,
    required: parameter.required,
    description: parameter.description,
    schema: parameter.schema,
  };

  return (
    <div className="space-y-2 p-4 border rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <Label className="text-base">
            {parameter.name}
            {parameter.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {parameter.description && (
            <p className="text-sm text-muted-foreground">{parameter.description}</p>
          )}
        </div>
        <Select
          value={currentValue.source}
          onValueChange={(source: "static" | "variable" | "context") =>
            onChange({ ...currentValue, source })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="static">Static</SelectItem>
            <SelectItem value="variable">Variable</SelectItem>
            <SelectItem value="context">Context</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        {currentValue.source === "static" ? (
          <Input
            value={currentValue.value as string}
            onChange={(e) => onChange({ ...currentValue, value: e.target.value })}
            placeholder={`Enter ${parameter.name}...`}
          />
        ) : currentValue.source === "variable" ? (
          <div className="space-y-2">
            <Input
              value={currentValue.variableName || ""}
              onChange={(e) => onChange({ ...currentValue, variableName: e.target.value })}
              placeholder="Variable name (e.g., user.id)"
            />
            <p className="text-xs text-muted-foreground">
              Reference a variable from the IDE context
            </p>
          </div>
        ) : (
          <Input
            value={currentValue.value as string}
            onChange={(e) => onChange({ ...currentValue, value: e.target.value })}
            placeholder="Context key"
          />
        )}
      </div>
    </div>
  );
}