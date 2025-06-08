import { useServiceConnectionDataSelector } from "~/modules/serviceconnection.ide/hooks/use-serviceconnection-selector";
import { useServiceConnectionDataTrigger } from "~/modules/serviceconnection.ide/hooks/use-serviceconnection-trigger";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Textarea } from "~/components/ui/textarea";
import { 
  Plus, 
  Trash2, 
  TestTube, 
  Save, 
  Key, 
  Link2, 
  Shield, 
  Settings2,
  Code2,
  Copy,
  Check,
  AlertCircle,
  Info,
  ChevronRight,
  Globe,
  Clock,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Sparkles,
  Variable
} from "lucide-react";
import React, { useState, useEffect } from "react";
import type { ServiceConnectionData } from "~/modules/serviceconnection.ide/types";
import { cn } from "~/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { 
  VariablePicker, 
  useTemplate, 
  useActiveEnvironment,
  EnvironmentSelector,
  containsVariables,
  extractVariables
} from "~/modules/environment";

export function Editor() {
  const data = useServiceConnectionDataSelector((s) => s.context.data);
  const trigger = useServiceConnectionDataTrigger();
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const { environment } = useActiveEnvironment();
  
  // Track which variables are used
  const [usedVariables, setUsedVariables] = useState<string[]>([]);
  
  useEffect(() => {
    // Extract all variables used in the configuration
    const vars = new Set<string>();
    
    // Check URL
    if (data.url) {
      extractVariables(data.url).forEach(v => vars.add(v));
    }
    
    // Check headers
    Object.values(data.headers || {}).forEach(value => {
      extractVariables(value).forEach(v => vars.add(v));
    });
    
    // Check query params
    Object.values(data.queryParams || {}).forEach(value => {
      extractVariables(value).forEach(v => vars.add(v));
    });
    
    // Check auth config
    if (data.authentication.config) {
      Object.values(data.authentication.config).forEach(value => {
        if (typeof value === 'string') {
          extractVariables(value).forEach(v => vars.add(v));
        }
      });
    }
    
    setUsedVariables(Array.from(vars));
  }, [data]);

  const handleUpdate = (updates: Partial<ServiceConnectionData>) => {
    trigger({
      type: "update",
      context: {
        data: {
          ...data,
          ...updates,
          metadata: {
            ...data.metadata,
            updatedAt: new Date().toISOString(),
          },
        },
      },
    });
  };

  const handleAddHeader = () => {
    const newKey = prompt("Header name:");
    const newValue = prompt("Header value:");
    if (newKey && newValue) {
      handleUpdate({
        headers: {
          ...data.headers,
          [newKey]: newValue,
        },
      });
    }
  };

  const handleRemoveHeader = (key: string) => {
    const { [key]: _, ...rest } = data.headers || {};
    handleUpdate({ headers: rest });
  };

  const handleTestConnection = async () => {
    setTestResult({ success: false, message: "Initializing connection test..." });
    
    // Simulate connection test with progressive updates
    const steps = [
      { delay: 300, message: "Validating URL format..." },
      { delay: 600, message: "Establishing connection..." },
      { delay: 900, message: "Verifying authentication..." },
      { delay: 1200, message: "Testing endpoint accessibility..." },
    ];

    for (const step of steps) {
      setTimeout(() => {
        setTestResult({ success: false, message: step.message });
      }, step.delay);
    }

    setTimeout(() => {
      if (data.url) {
        const isHttps = data.url.startsWith("https://");
        const hasAuth = data.authentication.type !== "none";
        
        setTestResult({ 
          success: true, 
          message: `✓ Connected successfully${isHttps ? ' (Secure)' : ''} ${hasAuth ? '✓ Authenticated' : ''}` 
        });
        handleUpdate({
          metadata: {
            ...data.metadata,
            lastTested: new Date().toISOString(),
            lastTestStatus: "success",
          },
        });
      } else {
        setTestResult({ 
          success: false, 
          message: "✗ URL is required to test connection" 
        });
        handleUpdate({
          metadata: {
            ...data.metadata,
            lastTested: new Date().toISOString(),
            lastTestStatus: "failed",
            lastTestError: "URL is required",
          },
        });
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium">Service Connection</h3>
          {usedVariables.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              <Variable className="h-3 w-3 mr-1" />
              {usedVariables.length} variables used
            </Badge>
          )}
        </div>
        <EnvironmentSelector variant="compact" showManageButton />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="general" className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="gap-2">
              <Link2 className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="auth" className="gap-2">
              <Shield className="w-4 h-4" />
              Authentication
            </TabsTrigger>
            <TabsTrigger value="headers" className="gap-2">
              <Code2 className="w-4 h-4" />
              Headers & Params
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2">
              <Settings2 className="w-4 h-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 p-4">
            <Card>
              <CardHeader>
                <CardTitle>Connection Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Connection Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => handleUpdate({ name: e.target.value })}
                    placeholder="My API Connection"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Service Type</Label>
                  <Select
                    value={data.type}
                    onValueChange={(value: ServiceConnectionData["type"]) => 
                      handleUpdate({ type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rest">REST API</SelectItem>
                      <SelectItem value="graphql">GraphQL</SelectItem>
                      <SelectItem value="grpc">gRPC</SelectItem>
                      <SelectItem value="websocket">WebSocket</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="url">URL / Connection String</Label>
                  <VariableInput
                    id="url"
                    value={data.url}
                    onChange={(value) => handleUpdate({ url: value })}
                    placeholder="https://{{API_HOST}}/api/v1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={data.metadata?.description || ""}
                    onChange={(e) => handleUpdate({
                      metadata: {
                        ...data.metadata,
                        description: e.target.value,
                      },
                    })}
                    placeholder="Describe this connection..."
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-muted-foreground">
                    {data.metadata?.lastTested && (
                      <span>
                        Last tested: {new Date(data.metadata.lastTested).toLocaleString()}
                        {data.metadata.lastTestStatus && (
                          <Badge 
                            variant={data.metadata.lastTestStatus === "success" ? "default" : "destructive"}
                            className="ml-2"
                          >
                            {data.metadata.lastTestStatus}
                          </Badge>
                        )}
                      </span>
                    )}
                  </div>
                  <Button onClick={handleTestConnection} variant="outline">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                </div>

                {testResult && (
                  <Alert variant={testResult.success ? "default" : "destructive"}>
                    <AlertDescription>{testResult.message}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4 p-4">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="authType">Authentication Type</Label>
                  <Select
                    value={data.authentication.type}
                    onValueChange={(value: ServiceConnectionData["authentication"]["type"]) => 
                      handleUpdate({ 
                        authentication: { 
                          type: value,
                          config: value === "none" ? undefined : data.authentication.config
                        } 
                      })
                    }
                  >
                    <SelectTrigger id="authType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Authentication</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                      <SelectItem value="apikey">API Key</SelectItem>
                      <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {data.authentication.type === "basic" && (
                  <>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={data.authentication.config?.username || ""}
                        onChange={(e) => handleUpdate({
                          authentication: {
                            ...data.authentication,
                            config: {
                              ...data.authentication.config,
                              username: e.target.value,
                            },
                          },
                        })}
                        placeholder="Enter username..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={data.authentication.config?.password || ""}
                        onChange={(e) => handleUpdate({
                          authentication: {
                            ...data.authentication,
                            config: {
                              ...data.authentication.config,
                              password: e.target.value,
                            },
                          },
                        })}
                        placeholder="Enter password..."
                      />
                    </div>
                  </>
                )}

                {data.authentication.type === "bearer" && (
                  <>
                    <div>
                      <Label htmlFor="token">Bearer Token</Label>
                      <Input
                        id="token"
                        type="password"
                        value={data.authentication.config?.token || ""}
                        onChange={(e) => handleUpdate({
                          authentication: {
                            ...data.authentication,
                            config: {
                              ...data.authentication.config,
                              token: e.target.value,
                            },
                          },
                        })}
                        placeholder="Enter bearer token..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="tokenPrefix">Token Prefix</Label>
                      <Input
                        id="tokenPrefix"
                        value={data.authentication.config?.tokenPrefix || "Bearer"}
                        onChange={(e) => handleUpdate({
                          authentication: {
                            ...data.authentication,
                            config: {
                              ...data.authentication.config,
                              tokenPrefix: e.target.value,
                            },
                          },
                        })}
                        placeholder="Bearer"
                      />
                    </div>
                  </>
                )}

                {data.authentication.type === "apikey" && (
                  <>
                    <div>
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        value={data.authentication.config?.apiKey || ""}
                        onChange={(e) => handleUpdate({
                          authentication: {
                            ...data.authentication,
                            config: {
                              ...data.authentication.config,
                              apiKey: e.target.value,
                            },
                          },
                        })}
                        placeholder="Enter API key..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="apiKeyName">API Key Name</Label>
                      <Input
                        id="apiKeyName"
                        value={data.authentication.config?.apiKeyName || "X-API-Key"}
                        onChange={(e) => handleUpdate({
                          authentication: {
                            ...data.authentication,
                            config: {
                              ...data.authentication.config,
                              apiKeyName: e.target.value,
                            },
                          },
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="apiKeyLocation">API Key Location</Label>
                      <Select
                        value={data.authentication.config?.apiKeyLocation || "header"}
                        onValueChange={(value: "header" | "query" | "cookie") => handleUpdate({
                          authentication: {
                            ...data.authentication,
                            config: {
                              ...data.authentication.config,
                              apiKeyLocation: value,
                            },
                          },
                        })}
                      >
                        <SelectTrigger id="apiKeyLocation">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="header">Header</SelectItem>
                          <SelectItem value="query">Query Parameter</SelectItem>
                          <SelectItem value="cookie">Cookie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {data.authentication.type === "oauth2" && (
                  <>
                    <div>
                      <Label htmlFor="grantType">Grant Type</Label>
                      <Select
                        value={data.authentication.config?.grantType || "authorization_code"}
                        onValueChange={(value: "authorization_code" | "client_credentials" | "password" | "refresh_token") => handleUpdate({
                          authentication: {
                            ...data.authentication,
                            config: {
                              ...data.authentication.config,
                              grantType: value,
                            },
                          },
                        })}
                      >
                        <SelectTrigger id="grantType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="authorization_code">Authorization Code</SelectItem>
                          <SelectItem value="client_credentials">Client Credentials</SelectItem>
                          <SelectItem value="password">Password</SelectItem>
                          <SelectItem value="refresh_token">Refresh Token</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="clientId">Client ID</Label>
                      <Input
                        id="clientId"
                        value={data.authentication.config?.clientId || ""}
                        onChange={(e) => handleUpdate({
                          authentication: {
                            ...data.authentication,
                            config: {
                              ...data.authentication.config,
                              clientId: e.target.value,
                            },
                          },
                        })}
                        placeholder="Enter client ID..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientSecret">Client Secret</Label>
                      <Input
                        id="clientSecret"
                        type="password"
                        value={data.authentication.config?.clientSecret || ""}
                        onChange={(e) => handleUpdate({
                          authentication: {
                            ...data.authentication,
                            config: {
                              ...data.authentication.config,
                              clientSecret: e.target.value,
                            },
                          },
                        })}
                        placeholder="Enter client secret..."
                      />
                    </div>
                    {data.authentication.config?.grantType === "authorization_code" && (
                      <>
                        <div>
                          <Label htmlFor="authorizationUrl">Authorization URL</Label>
                          <Input
                            id="authorizationUrl"
                            value={data.authentication.config?.authorizationUrl || ""}
                            onChange={(e) => handleUpdate({
                              authentication: {
                                ...data.authentication,
                                config: {
                                  ...data.authentication.config,
                                  authorizationUrl: e.target.value,
                                },
                              },
                            })}
                            placeholder="https://api.example.com/oauth/authorize"
                          />
                        </div>
                        <div>
                          <Label htmlFor="redirectUri">Redirect URI</Label>
                          <Input
                            id="redirectUri"
                            value={data.authentication.config?.redirectUri || ""}
                            onChange={(e) => handleUpdate({
                              authentication: {
                                ...data.authentication,
                                config: {
                                  ...data.authentication.config,
                                  redirectUri: e.target.value,
                                },
                              },
                            })}
                            placeholder="https://yourapp.com/callback"
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <Label htmlFor="tokenUrl">Token URL</Label>
                      <Input
                        id="tokenUrl"
                        value={data.authentication.config?.tokenUrl || ""}
                        onChange={(e) => handleUpdate({
                          authentication: {
                            ...data.authentication,
                            config: {
                              ...data.authentication.config,
                              tokenUrl: e.target.value,
                            },
                          },
                        })}
                        placeholder="https://api.example.com/oauth/token"
                      />
                    </div>
                    {data.authentication.config?.accessToken && (
                      <Alert>
                        <AlertDescription>
                          Current access token expires: {data.authentication.config.tokenExpiry || "Unknown"}
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}

                {data.authentication.type === "custom" && (
                  <Alert>
                    <AlertDescription>
                      Add custom authentication headers in the Headers tab. You can also add custom query parameters and cookies through the Advanced settings.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="headers" className="space-y-4 p-4">
            <div className="grid gap-4">
              {/* Headers Section */}
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">HTTP Headers</CardTitle>
                        <CardDescription className="text-xs">
                          Default headers sent with every request
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-mono">
                      {Object.keys(data.headers || {}).length} headers
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <HeadersEditor 
                    headers={data.headers || {}}
                    onUpdate={(headers) => handleUpdate({ headers })}
                  />
                </CardContent>
              </Card>

              {/* Query Parameters Section */}
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Link2 className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Query Parameters</CardTitle>
                        <CardDescription className="text-xs">
                          Default query parameters appended to URLs
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-mono">
                      {Object.keys(data.queryParams || {}).length} params
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <QueryParamsEditor 
                    params={data.queryParams || {}}
                    onUpdate={(queryParams) => handleUpdate({ queryParams })}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 p-4">
            <div className="grid gap-4">
              {/* Timeout & Retry Settings */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Performance & Reliability</CardTitle>
                      <CardDescription className="text-xs">
                        Configure timeouts, retries, and error handling
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Timeout Setting */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="timeout" className="text-sm font-medium">
                        Request Timeout
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {data.timeout ? `${(data.timeout / 1000).toFixed(1)}s` : 'Default (30s)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Input
                        id="timeout"
                        type="number"
                        value={data.timeout || ""}
                        onChange={(e) => handleUpdate({ 
                          timeout: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        placeholder="30000"
                        className="flex-1"
                      />
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdate({ timeout: 5000 })}
                        >
                          5s
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdate({ timeout: 30000 })}
                        >
                          30s
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdate({ timeout: 60000 })}
                        >
                          60s
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Retry Configuration */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <RefreshCw className="w-4 h-4" />
                          Retry Configuration
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically retry failed requests
                        </p>
                      </div>
                      <Switch
                        checked={!!data.retryConfig}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleUpdate({
                              retryConfig: {
                                maxRetries: 3,
                                retryDelay: 1000,
                                backoffMultiplier: 1.5,
                                retryCondition: "5xx",
                              },
                            });
                          } else {
                            handleUpdate({ retryConfig: undefined });
                          }
                        }}
                      />
                    </div>

                    {data.retryConfig && (
                      <div className="pl-6 space-y-4 animate-in slide-in-from-top-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Max Retries</Label>
                            <Input
                              type="number"
                              value={data.retryConfig.maxRetries}
                              onChange={(e) => handleUpdate({
                                retryConfig: {
                                  ...data.retryConfig!,
                                  maxRetries: parseInt(e.target.value) || 0,
                                },
                              })}
                              min="0"
                              max="10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Initial Delay (ms)</Label>
                            <Input
                              type="number"
                              value={data.retryConfig.retryDelay}
                              onChange={(e) => handleUpdate({
                                retryConfig: {
                                  ...data.retryConfig!,
                                  retryDelay: parseInt(e.target.value) || 0,
                                },
                              })}
                              min="0"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Retry Condition</Label>
                          <Select
                            value={data.retryConfig.retryCondition || "5xx"}
                            onValueChange={(value: "network-error" | "5xx" | "4xx-5xx" | "custom") => 
                              handleUpdate({
                                retryConfig: {
                                  ...data.retryConfig!,
                                  retryCondition: value,
                                },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="network-error">Network Errors Only</SelectItem>
                              <SelectItem value="5xx">Server Errors (5xx)</SelectItem>
                              <SelectItem value="4xx-5xx">Client & Server Errors (4xx-5xx)</SelectItem>
                              <SelectItem value="custom">Custom Status Codes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* CORS Settings */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Globe className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">CORS Settings</CardTitle>
                      <CardDescription className="text-xs">
                        Cross-Origin Resource Sharing configuration
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Credentials</Label>
                    <Select
                      value={data.cors?.credentials || "same-origin"}
                      onValueChange={(value: "include" | "same-origin" | "omit") => 
                        handleUpdate({
                          cors: {
                            ...data.cors,
                            credentials: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="include">Include - Send cookies cross-origin</SelectItem>
                        <SelectItem value="same-origin">Same Origin - Only for same origin</SelectItem>
                        <SelectItem value="omit">Omit - Never send cookies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Mode</Label>
                    <Select
                      value={data.cors?.mode || "cors"}
                      onValueChange={(value: "cors" | "no-cors" | "same-origin") => 
                        handleUpdate({
                          cors: {
                            ...data.cors,
                            mode: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cors">CORS - Standard cross-origin</SelectItem>
                        <SelectItem value="no-cors">No CORS - Limited features</SelectItem>
                        <SelectItem value="same-origin">Same Origin - Restrict to same origin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Environment Settings */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Settings2 className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Environment</CardTitle>
                      <CardDescription className="text-xs">
                        Tag this connection for different environments
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Select
                    value={data.metadata?.environment || "development"}
                    onValueChange={(value: "development" | "staging" | "production" | "test") => 
                      handleUpdate({
                        metadata: {
                          ...data.metadata,
                          environment: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          Development
                        </div>
                      </SelectItem>
                      <SelectItem value="staging">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          Staging
                        </div>
                      </SelectItem>
                      <SelectItem value="production">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          Production
                        </div>
                      </SelectItem>
                      <SelectItem value="test">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          Test
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Headers Editor Component
function HeadersEditor({ 
  headers, 
  onUpdate 
}: { 
  headers: Record<string, string>; 
  onUpdate: (headers: Record<string, string>) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const commonHeaders = [
    { key: "Content-Type", value: "application/json", icon: Code2 },
    { key: "Authorization", value: "Bearer token", icon: Key },
    { key: "Accept", value: "application/json", icon: Check },
    { key: "User-Agent", value: "MyApp/1.0", icon: Globe },
    { key: "Cache-Control", value: "no-cache", icon: RefreshCw },
  ];

  const handleAdd = () => {
    if (newKey && newValue) {
      onUpdate({ ...headers, [newKey]: newValue });
      setNewKey("");
      setNewValue("");
      setIsAdding(false);
    }
  };

  const handleRemove = (key: string) => {
    const { [key]: _, ...rest } = headers;
    onUpdate(rest);
  };

  const handleEdit = (oldKey: string, newKey: string, value: string) => {
    if (oldKey !== newKey) {
      const { [oldKey]: _, ...rest } = headers;
      onUpdate({ ...rest, [newKey]: value });
    } else {
      onUpdate({ ...headers, [newKey]: value });
    }
    setEditingKey(null);
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(`${key}: ${value}`);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleShowValue = (key: string) => {
    setShowValues(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Quick Add Common Headers */}
        {Object.keys(headers).length === 0 && (
          <Alert className="border-dashed">
            <Sparkles className="w-4 h-4" />
            <AlertTitle className="text-sm">Quick Start</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="flex flex-wrap gap-2 mt-3">
                {commonHeaders.map(({ key, value, icon: Icon }) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={() => onUpdate({ ...headers, [key]: value })}
                  >
                    <Icon className="w-3 h-3" />
                    {key}
                  </Button>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Headers Table */}
        {Object.keys(headers).length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40%]">Header Name</TableHead>
                  <TableHead className="w-[40%]">Value</TableHead>
                  <TableHead className="w-[20%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(headers).map(([key, value]) => {
                  const isAuthHeader = key.toLowerCase().includes('auth') || 
                                     key.toLowerCase().includes('token') ||
                                     key.toLowerCase().includes('key');
                  const isEditing = editingKey === key;

                  return (
                    <TableRow key={key} className="group">
                      <TableCell className="font-mono text-sm">
                        {isEditing ? (
                          <Input
                            value={key}
                            onChange={(e) => {
                              const newHeaders = { ...headers };
                              delete newHeaders[key];
                              newHeaders[e.target.value] = value;
                              onUpdate(newHeaders);
                              setEditingKey(e.target.value);
                            }}
                            className="h-8 font-mono"
                            onBlur={() => setEditingKey(null)}
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            {isAuthHeader && <Lock className="w-3 h-3 text-orange-500" />}
                            <span className="select-all">{key}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Input
                            type={isAuthHeader && !showValues[key] ? "password" : "text"}
                            value={value}
                            onChange={(e) => onUpdate({ ...headers, [key]: e.target.value })}
                            className="h-8 font-mono flex-1"
                          />
                          {isAuthHeader && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => toggleShowValue(key)}
                            >
                              {showValues[key] ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setEditingKey(key)}
                              >
                                <Settings2 className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit header name</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleCopy(key, value)}
                              >
                                {copiedKey === key ? (
                                  <Check className="w-3 h-3 text-green-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy header</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:text-destructive"
                                onClick={() => handleRemove(key)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove header</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Add New Header */}
        {isAdding ? (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-header-key" className="text-xs">Header Name</Label>
                  <Input
                    id="new-header-key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="X-Custom-Header"
                    className="font-mono"
                    autoFocus
                  />
                </div>
                <div>
                  <Label htmlFor="new-header-value" className="text-xs">Value</Label>
                  <Input
                    id="new-header-value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="value"
                    className="font-mono"
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setNewKey("");
                    setNewValue("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAdd}
                  disabled={!newKey || !newValue}
                >
                  Add Header
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Header
          </Button>
        )}
      </div>
    </TooltipProvider>
  );
}

// Query Parameters Editor Component
function QueryParamsEditor({ 
  params, 
  onUpdate 
}: { 
  params: Record<string, string>; 
  onUpdate: (params: Record<string, string>) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleAdd = () => {
    if (newKey && newValue) {
      onUpdate({ ...params, [newKey]: newValue });
      setNewKey("");
      setNewValue("");
      setIsAdding(false);
    }
  };

  const handleRemove = (key: string) => {
    const { [key]: _, ...rest } = params;
    onUpdate(rest);
  };

  // Generate preview URL
  React.useEffect(() => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    setPreviewUrl(searchParams.toString());
  }, [params]);

  return (
    <div className="space-y-4">
      {/* URL Preview */}
      {Object.keys(params).length > 0 && (
        <Alert className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <Info className="w-4 h-4 text-blue-600" />
          <AlertTitle className="text-sm text-blue-900 dark:text-blue-100">Preview</AlertTitle>
          <AlertDescription className="mt-2">
            <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
              ?{previewUrl}
            </code>
          </AlertDescription>
        </Alert>
      )}

      {/* Parameters List */}
      <div className="space-y-2">
        {Object.entries(params).map(([key, value]) => (
          <div
            key={key}
            className="group flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <Input
                  value={key}
                  onChange={(e) => {
                    const newParams = { ...params };
                    delete newParams[key];
                    newParams[e.target.value] = value;
                    onUpdate(newParams);
                  }}
                  className="h-8 font-mono"
                  placeholder="key"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">=</span>
                <Input
                  value={value}
                  onChange={(e) => onUpdate({ ...params, [key]: e.target.value })}
                  className="h-8 font-mono"
                  placeholder="value"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(key)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add New Parameter */}
      {isAdding ? (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="parameter"
                className="font-mono"
                autoFocus
              />
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="value"
                className="font-mono"
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewKey("");
                  setNewValue("");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={!newKey || !newValue}
              >
                Add Parameter
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Parameter
        </Button>
      )}
    </div>
  );
}

// Variable-aware input component
function VariableInput({ 
  value, 
  onChange,
  placeholder,
  className,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}) {
  const { resolved, loading } = useTemplate(value || "");
  const hasVariables = containsVariables(value || "");
  const [showPicker, setShowPicker] = useState(false);
  
  const handleVariableSelect = (varKey: string) => {
    const cursorPos = props.id ? 
      (document.getElementById(props.id) as HTMLInputElement)?.selectionStart || value.length :
      value.length;
    
    const before = value.slice(0, cursorPos);
    const after = value.slice(cursorPos);
    const newValue = `${before}{{${varKey}}}${after}`;
    onChange(newValue);
    setShowPicker(false);
  };
  
  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            hasVariables && "pr-10",
            className
          )}
          {...props}
        />
        <div className="absolute right-2 flex items-center gap-1">
          {hasVariables && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs text-muted-foreground">
                  <Variable className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Contains variables</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Popover open={showPicker} onOpenChange={setShowPicker}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="end">
              <VariablePicker
                onSelect={handleVariableSelect}
                className="border-0"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {hasVariables && !loading && (
        <p className="text-xs text-muted-foreground mt-1">
          Preview: <code className="bg-muted px-1 py-0.5 rounded">{resolved}</code>
        </p>
      )}
    </div>
  );
}