import { Plus, Settings, Eye, EyeOff, Trash2, Save, X } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { Separator } from "~/components/ui/separator";
import { Alert, AlertDescription } from "~/components/ui/alert";
import type {
  Environment,
  Variable,
  SecretReference,
  ProjectEnvironmentConfig,
} from "../types";
import { useIde } from "../hooks/use-ide";
import { useIdeTrigger } from "../hooks/use-ide-trigger";
import { getVault, getSecretVaultKey } from "../utils/vault";
import { isValidVariableName } from "../utils/variable-resolver";

interface EnvironmentManagerProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EnvironmentManager({ trigger, open, onOpenChange }: EnvironmentManagerProps) {
  const ide = useIde();
  const ideTrigger = useIdeTrigger();
  const [isOpen, setIsOpen] = useState(false);

  // Use external control if provided
  const isDialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;
  const [activeTab, setActiveTab] = useState("environments");
  const [selectedEnv, setSelectedEnv] = useState<string>("__global__");
  const [showSecrets, setShowSecrets] = useState<Set<string>>(new Set());

  // Form states
  const [isCreatingEnv, setIsCreatingEnv] = useState(false);
  const [newEnvName, setNewEnvName] = useState("");
  const [newEnvDescription, setNewEnvDescription] = useState("");
  const [newEnvColor, setNewEnvColor] = useState("#3b82f6");

  const [isAddingVariable, setIsAddingVariable] = useState(false);
  const [newVarKey, setNewVarKey] = useState("");
  const [newVarValue, setNewVarValue] = useState("");
  const [newVarDescription, setNewVarDescription] = useState("");
  const [newVarScope, setNewVarScope] = useState<"global" | "environment">("global");

  const [isAddingSecret, setIsAddingSecret] = useState(false);
  const [newSecretKey, setNewSecretKey] = useState("");
  const [newSecretValue, setNewSecretValue] = useState("");
  const [newSecretDescription, setNewSecretDescription] = useState("");
  const [newSecretScope, setNewSecretScope] = useState<"global" | "environment">("global");

  const config = ide.environmentConfig;
  const environments = config?.environments || {};
  const globalVariables = config?.globals.variables || {};
  const globalSecrets = config?.globals.secrets || {};

  const initializeEnvironmentConfig = useCallback(() => {
    if (!config) {
      const newConfig: ProjectEnvironmentConfig = {
        activeEnvironment: undefined,
        globals: {
          variables: {},
          secrets: {},
        },
        environments: {},
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: "1.0.0",
        },
      };

      ideTrigger.update({
        context: {
          environmentConfig: newConfig,
        },
      });
    }
  }, [config, ideTrigger]);

  const createEnvironment = useCallback(async () => {
    if (!newEnvName.trim()) return;

    initializeEnvironmentConfig();

    const newEnv: Environment = {
      id: `env_${Date.now()}`,
      name: newEnvName.trim(),
      description: newEnvDescription.trim() || undefined,
      color: newEnvColor,
      variables: {},
      secrets: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedConfig: ProjectEnvironmentConfig = {
      ...(ide.environmentConfig || {
        activeEnvironment: undefined,
        globals: { variables: {}, secrets: {} },
        environments: {},
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: "1.0.0",
        },
      }),
      environments: {
        ...environments,
        [newEnv.id]: newEnv,
      },
      metadata: {
        createdAt: ide.environmentConfig?.metadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: ide.environmentConfig?.metadata?.version || "1.0.0",
      },
    };

    ideTrigger.update({
      context: {
        environmentConfig: updatedConfig,
      },
    });

    setNewEnvName("");
    setNewEnvDescription("");
    setNewEnvColor("#3b82f6");
    setIsCreatingEnv(false);
  }, [newEnvName, newEnvDescription, newEnvColor, environments, ide.environmentConfig, ideTrigger, initializeEnvironmentConfig]);

  const deleteEnvironment = useCallback(async (envId: string) => {
    if (!config) return;

    // Delete environment secrets from vault
    const env = environments[envId];
    if (env) {
      const vault = getVault();
      const secretKeys = Object.keys(env.secrets);
      for (const key of secretKeys) {
        const vaultKey = getSecretVaultKey(key, "environment", envId);
        await vault.deleteSecret(vaultKey);
      }
    }

    const updatedEnvironments = { ...environments };
    delete updatedEnvironments[envId];

    const updatedConfig: ProjectEnvironmentConfig = {
      ...config,
      environments: updatedEnvironments,
      activeEnvironment: config.activeEnvironment === envId ? undefined : config.activeEnvironment,
      metadata: {
        ...config.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    ideTrigger.update({
      context: {
        environmentConfig: updatedConfig,
      },
    });

    if (selectedEnv === envId) {
      setSelectedEnv("");
    }
  }, [config, environments, selectedEnv, ideTrigger]);

  const addVariable = useCallback(async () => {
    if (!newVarKey.trim() || !isValidVariableName(newVarKey)) return;

    initializeEnvironmentConfig();

    const variable: Variable = {
      key: newVarKey.trim(),
      value: newVarValue,
      description: newVarDescription.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedConfig = { ...ide.environmentConfig } as ProjectEnvironmentConfig;

    if (newVarScope === "global") {
      updatedConfig.globals.variables[variable.key] = variable;
    } else if (selectedEnv && environments[selectedEnv]) {
      updatedConfig.environments[selectedEnv].variables[variable.key] = variable.value;
      updatedConfig.environments[selectedEnv].updatedAt = new Date().toISOString();
    }

    updatedConfig.metadata.updatedAt = new Date().toISOString();

    ideTrigger.update({
      context: {
        environmentConfig: updatedConfig,
      },
    });

    setNewVarKey("");
    setNewVarValue("");
    setNewVarDescription("");
    setIsAddingVariable(false);
  }, [newVarKey, newVarValue, newVarDescription, newVarScope, selectedEnv, environments, ide.environmentConfig, ideTrigger, initializeEnvironmentConfig]);

  const addSecret = useCallback(async () => {
    if (!newSecretKey.trim() || !isValidVariableName(newSecretKey)) return;

    initializeEnvironmentConfig();

    const vault = getVault();
    const secretRef: SecretReference = {
      key: newSecretKey.trim(),
      description: newSecretDescription.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedConfig = { ...ide.environmentConfig } as ProjectEnvironmentConfig;
    let vaultKey: string;

    if (newSecretScope === "global") {
      updatedConfig.globals.secrets[secretRef.key] = secretRef;
      vaultKey = getSecretVaultKey(secretRef.key, "global");
    } else if (selectedEnv && environments[selectedEnv]) {
      updatedConfig.environments[selectedEnv].secrets[secretRef.key] = secretRef;
      updatedConfig.environments[selectedEnv].updatedAt = new Date().toISOString();
      vaultKey = getSecretVaultKey(secretRef.key, "environment", selectedEnv);
    } else {
      return;
    }

    // Store the secret value in the vault
    await vault.setSecret(vaultKey, newSecretValue);

    updatedConfig.metadata.updatedAt = new Date().toISOString();

    ideTrigger.update({
      context: {
        environmentConfig: updatedConfig,
      },
    });

    setNewSecretKey("");
    setNewSecretValue("");
    setNewSecretDescription("");
    setIsAddingSecret(false);
  }, [newSecretKey, newSecretValue, newSecretDescription, newSecretScope, selectedEnv, environments, ide.environmentConfig, ideTrigger, initializeEnvironmentConfig]);

  const deleteVariable = useCallback((key: string, scope: "global" | "environment", envId?: string) => {
    if (!config) return;

    let updatedConfig = { ...config };

    if (scope === "global") {
      delete updatedConfig.globals.variables[key];
    } else if (envId && updatedConfig.environments[envId]) {
      delete updatedConfig.environments[envId].variables[key];
      updatedConfig.environments[envId].updatedAt = new Date().toISOString();
    }

    updatedConfig.metadata.updatedAt = new Date().toISOString();

    ideTrigger.update({
      context: {
        environmentConfig: updatedConfig,
      },
    });
  }, [config, ideTrigger]);

  const deleteSecret = useCallback(async (key: string, scope: "global" | "environment", envId?: string) => {
    if (!config) return;

    const vault = getVault();
    let vaultKey: string;

    if (scope === "global") {
      vaultKey = getSecretVaultKey(key, "global");
    } else if (envId) {
      vaultKey = getSecretVaultKey(key, "environment", envId);
    } else {
      return;
    }

    // Delete from vault
    await vault.deleteSecret(vaultKey);

    let updatedConfig = { ...config };

    if (scope === "global") {
      delete updatedConfig.globals.secrets[key];
    } else if (envId && updatedConfig.environments[envId]) {
      delete updatedConfig.environments[envId].secrets[key];
      updatedConfig.environments[envId].updatedAt = new Date().toISOString();
    }

    updatedConfig.metadata.updatedAt = new Date().toISOString();

    ideTrigger.update({
      context: {
        environmentConfig: updatedConfig,
      },
    });
  }, [config, ideTrigger]);

  const setActiveEnvironment = useCallback((envId: string | undefined) => {
    if (!config) return;

    // Convert special value back to undefined
    const actualEnvId = envId === "__none__" ? undefined : envId;

    const updatedConfig: ProjectEnvironmentConfig = {
      ...config,
      activeEnvironment: actualEnvId,
      metadata: {
        ...config.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    ideTrigger.update({
      context: {
        environmentConfig: updatedConfig,
      },
    });
  }, [config, ideTrigger]);

  const toggleSecretVisibility = useCallback((key: string) => {
    const newShowSecrets = new Set(showSecrets);
    if (newShowSecrets.has(key)) {
      newShowSecrets.delete(key);
    } else {
      newShowSecrets.add(key);
    }
    setShowSecrets(newShowSecrets);
  }, [showSecrets]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Environment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Environment Manager</DialogTitle>
          <DialogDescription>
            Manage global variables, environment-specific variables, and secrets for your project.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="environments">Environments</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="secrets">Secrets</TabsTrigger>
          </TabsList>

          <TabsContent value="environments" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Environments</h3>
                <p className="text-sm text-muted-foreground">
                  Create and manage different environments for your project.
                </p>
              </div>
              <Button onClick={() => setIsCreatingEnv(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Environment
              </Button>
            </div>

            {/* Active Environment Selector */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label>Active Environment</Label>
                  <Select
                    value={config?.activeEnvironment || "__none__"}
                    onValueChange={(value) => setActiveEnvironment(value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select active environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None (Global only)</SelectItem>
                      {Object.values(environments).map((env) => (
                        <SelectItem key={env.id} value={env.id}>
                          {env.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Environment List */}
            <div className="space-y-3">
              {Object.values(environments).map((env) => (
                <Card key={env.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: env.color }}
                        />
                        <div>
                          <h4 className="font-medium">{env.name}</h4>
                          {env.description && (
                            <p className="text-sm text-muted-foreground">
                              {env.description}
                            </p>
                          )}
                        </div>
                        {config?.activeEnvironment === env.id && (
                          <Badge variant="secondary">Active</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEnvironment(env.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Create Environment Dialog */}
            {isCreatingEnv && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Environment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="env-name">Name *</Label>
                      <Input
                        id="env-name"
                        placeholder="Development"
                        value={newEnvName}
                        onChange={(e) => setNewEnvName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="env-color">Color</Label>
                      <Input
                        id="env-color"
                        type="color"
                        value={newEnvColor}
                        onChange={(e) => setNewEnvColor(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="env-description">Description</Label>
                    <Textarea
                      id="env-description"
                      placeholder="Development environment for testing..."
                      value={newEnvDescription}
                      onChange={(e) => setNewEnvDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={createEnvironment} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Create
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatingEnv(false)}
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="variables" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Variables</h3>
                <p className="text-sm text-muted-foreground">
                  Manage global and environment-specific variables.
                </p>
              </div>
              <Button onClick={() => setIsAddingVariable(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Variable
              </Button>
            </div>

            {/* Environment Selector for Variables */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label>View Variables For</Label>
                  <Select value={selectedEnv} onValueChange={setSelectedEnv}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment or global" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__global__">Global Variables</SelectItem>
                      {Object.values(environments).map((env) => (
                        <SelectItem key={env.id} value={env.id}>
                          {env.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Variables List */}
            <div className="space-y-3">
              {selectedEnv === "__global__" || selectedEnv === "" ? (
                // Global Variables
                <>
                  <h4 className="font-medium text-sm text-muted-foreground">Global Variables</h4>
                  {Object.values(globalVariables).map((variable) => (
                    <Card key={variable.key}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium font-mono">{variable.key}</h4>
                            <p className="text-sm text-muted-foreground">{variable.value}</p>
                            {variable.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {variable.description}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteVariable(variable.key, "global")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                // Environment Variables
                <>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    {environments[selectedEnv]?.name} Variables
                  </h4>
                  {Object.entries(environments[selectedEnv]?.variables || {}).map(([key, value]) => (
                    <Card key={key}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium font-mono">{key}</h4>
                            <p className="text-sm text-muted-foreground">{value}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteVariable(key, "environment", selectedEnv)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>

            {/* Add Variable Form */}
            {isAddingVariable && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Variable</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="var-scope">Scope</Label>
                    <Select value={newVarScope} onValueChange={(value: "global" | "environment") => setNewVarScope(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        {Object.values(environments).map((env) => (
                          <SelectItem key={env.id} value="environment" disabled={selectedEnv !== env.id}>
                            {env.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="var-key">Key *</Label>
                      <Input
                        id="var-key"
                        placeholder="API_HOST"
                        value={newVarKey}
                        onChange={(e) => setNewVarKey(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="var-value">Value *</Label>
                      <Input
                        id="var-value"
                        placeholder="https://api.example.com"
                        value={newVarValue}
                        onChange={(e) => setNewVarValue(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="var-description">Description</Label>
                    <Input
                      id="var-description"
                      placeholder="Base URL for API calls"
                      value={newVarDescription}
                      onChange={(e) => setNewVarDescription(e.target.value)}
                    />
                  </div>
                  {!isValidVariableName(newVarKey) && newVarKey && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Variable name must start with a letter or underscore and contain only letters, numbers, underscores, dashes, and dots.
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="flex space-x-2">
                    <Button onClick={addVariable} size="sm" disabled={!newVarKey || !isValidVariableName(newVarKey)}>
                      <Save className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingVariable(false)}
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="secrets" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Secrets</h3>
                <p className="text-sm text-muted-foreground">
                  Manage encrypted secrets and API keys.
                </p>
              </div>
              <Button onClick={() => setIsAddingSecret(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Secret
              </Button>
            </div>

            {/* Environment Selector for Secrets */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label>View Secrets For</Label>
                  <Select value={selectedEnv} onValueChange={setSelectedEnv}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment or global" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__global__">Global Secrets</SelectItem>
                      {Object.values(environments).map((env) => (
                        <SelectItem key={env.id} value={env.id}>
                          {env.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Secrets List */}
            <div className="space-y-3">
              {selectedEnv === "__global__" || selectedEnv === "" ? (
                // Global Secrets
                <>
                  <h4 className="font-medium text-sm text-muted-foreground">Global Secrets</h4>
                  {Object.values(globalSecrets).map((secret) => (
                    <Card key={secret.key}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium font-mono">{secret.key}</h4>
                            <p className="text-sm text-muted-foreground">
                              {showSecrets.has(secret.key) ? "***** (hidden for security)" : "***** (click to reveal)"}
                            </p>
                            {secret.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {secret.description}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSecretVisibility(secret.key)}
                            >
                              {showSecrets.has(secret.key) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSecret(secret.key, "global")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                // Environment Secrets
                <>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    {environments[selectedEnv]?.name} Secrets
                  </h4>
                  {Object.values(environments[selectedEnv]?.secrets || {}).map((secret) => (
                    <Card key={secret.key}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium font-mono">{secret.key}</h4>
                            <p className="text-sm text-muted-foreground">
                              {showSecrets.has(secret.key) ? "***** (hidden for security)" : "***** (click to reveal)"}
                            </p>
                            {secret.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {secret.description}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSecretVisibility(secret.key)}
                            >
                              {showSecrets.has(secret.key) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSecret(secret.key, "environment", selectedEnv)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>

            {/* Add Secret Form */}
            {isAddingSecret && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Secret</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="secret-scope">Scope</Label>
                    <Select value={newSecretScope} onValueChange={(value: "global" | "environment") => setNewSecretScope(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        {Object.values(environments).map((env) => (
                          <SelectItem key={env.id} value="environment" disabled={selectedEnv !== env.id}>
                            {env.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="secret-key">Key *</Label>
                      <Input
                        id="secret-key"
                        placeholder="API_TOKEN"
                        value={newSecretKey}
                        onChange={(e) => setNewSecretKey(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secret-value">Value *</Label>
                      <Input
                        id="secret-value"
                        type="password"
                        placeholder="sk-1234567890abcdef"
                        value={newSecretValue}
                        onChange={(e) => setNewSecretValue(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secret-description">Description</Label>
                    <Input
                      id="secret-description"
                      placeholder="API token for external service"
                      value={newSecretDescription}
                      onChange={(e) => setNewSecretDescription(e.target.value)}
                    />
                  </div>
                  {!isValidVariableName(newSecretKey) && newSecretKey && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Secret name must start with a letter or underscore and contain only letters, numbers, underscores, dashes, and dots.
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="flex space-x-2">
                    <Button onClick={addSecret} size="sm" disabled={!newSecretKey || !newSecretValue || !isValidVariableName(newSecretKey)}>
                      <Save className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingSecret(false)}
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}