import { 
  Plus, 
  Lock,
  Trash2, 
  Edit3,
  ChevronLeft,
  Eye,
  EyeOff,
  Copy,
  Globe,
  Shield,
  AlertTriangle
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
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
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useIde } from "../hooks/use-ide";
import { useIdeTrigger } from "../hooks/use-ide-trigger";
import { isValidVariableName } from "../utils/variable-resolver";
import { getVault, getSecretVaultKey } from "../utils/vault";

interface SecretFormData {
  key: string;
  value: string;
  description?: string;
  environmentId?: string;
}

export function SecretManagement() {
  const ide = useIde();
  const trigger = useIdeTrigger();
  const navigate = useNavigate();
  
  const [selectedEnv, setSelectedEnv] = useState<string>("__global__");
  const [isCreating, setIsCreating] = useState(false);
  const [editingSecret, setEditingSecret] = useState<SecretFormData | null>(null);
  const [deletingSecret, setDeletingSecret] = useState<{ key: string; environmentId?: string } | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());
  const [secretValues, setSecretValues] = useState<Record<string, string>>({});
  
  // Form state
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState<"global" | "environment">("global");
  const [targetEnvId, setTargetEnvId] = useState<string>("");
  
  const config = ide.environmentConfig;
  const environments = config?.environments || {};
  const globalSecrets = config?.globals.secrets || {};
  
  // Get secrets for selected environment
  const displayedSecrets = selectedEnv === "__global__" 
    ? globalSecrets
    : environments[selectedEnv]?.secrets || {};
    
  const isEnvironmentView = selectedEnv !== "__global__";
  const currentEnvironment = isEnvironmentView ? environments[selectedEnv] : null;
  
  // Load revealed secret values
  useEffect(() => {
    const loadSecretValues = async () => {
      const vault = getVault();
      const newValues: Record<string, string> = {};
      
      for (const secretKey of revealedSecrets) {
        const [actualKey, envId] = secretKey.split(":");
        const vaultKey = envId 
          ? getSecretVaultKey(actualKey, "environment", envId)
          : getSecretVaultKey(actualKey, "global");
          
        const value = await vault.getSecret(vaultKey);
        if (value) {
          newValues[secretKey] = value;
        }
      }
      
      setSecretValues(newValues);
    };
    
    if (revealedSecrets.size > 0) {
      loadSecretValues();
    }
  }, [revealedSecrets]);
  
  const handleCreate = useCallback(() => {
    if (!key.trim() || !value.trim() || !isValidVariableName(key)) return;
    
    const environmentId = scope === "global" ? undefined : (targetEnvId || selectedEnv);
    
    trigger.setSecret({
      key: key.trim(),
      value,
      description: description.trim() || undefined,
      environmentId: environmentId === "__global__" ? undefined : environmentId,
    });
    
    setIsCreating(false);
    resetForm();
  }, [key, value, description, scope, targetEnvId, selectedEnv, trigger]);
  
  const handleUpdate = useCallback(() => {
    if (!editingSecret || !key.trim() || !value.trim() || !isValidVariableName(key)) return;
    
    // Delete old secret if key changed
    if (editingSecret.key !== key.trim()) {
      trigger.deleteSecret({ 
        key: editingSecret.key, 
        environmentId: editingSecret.environmentId 
      });
    }
    
    trigger.setSecret({
      key: key.trim(),
      value,
      description: description.trim() || undefined,
      environmentId: editingSecret.environmentId,
    });
    
    setEditingSecret(null);
    resetForm();
  }, [editingSecret, key, value, description, trigger]);
  
  const handleDelete = useCallback(() => {
    if (!deletingSecret) return;
    
    trigger.deleteSecret(deletingSecret);
    setDeletingSecret(null);
  }, [deletingSecret, trigger]);
  
  const startEdit = useCallback(async (secretKey: string, envId?: string) => {
    const secretRef = envId 
      ? environments[envId]?.secrets[secretKey]
      : globalSecrets[secretKey];
      
    if (!secretRef) return;
    
    // Load the actual secret value from vault
    const vault = getVault();
    const vaultKey = envId 
      ? getSecretVaultKey(secretKey, "environment", envId)
      : getSecretVaultKey(secretKey, "global");
    
    const secretValue = await vault.getSecret(vaultKey) || "";
    
    setEditingSecret({ 
      key: secretKey, 
      value: secretValue,
      description: secretRef.description,
      environmentId: envId 
    });
    setKey(secretKey);
    setValue(secretValue);
    setDescription(secretRef.description || "");
  }, [globalSecrets, environments]);
  
  const startCreate = useCallback(() => {
    setIsCreating(true);
    resetForm();
    setScope(selectedEnv === "__global__" ? "global" : "environment");
    setTargetEnvId(selectedEnv === "__global__" ? "" : selectedEnv);
  }, [selectedEnv]);
  
  const resetForm = useCallback(() => {
    setKey("");
    setValue("");
    setDescription("");
    setScope("global");
    setTargetEnvId("");
  }, []);
  
  const toggleRevealSecret = useCallback((secretKey: string, envId?: string) => {
    const fullKey = envId ? `${secretKey}:${envId}` : secretKey;
    const newRevealed = new Set(revealedSecrets);
    
    if (newRevealed.has(fullKey)) {
      newRevealed.delete(fullKey);
      const newValues = { ...secretValues };
      delete newValues[fullKey];
      setSecretValues(newValues);
    } else {
      newRevealed.add(fullKey);
    }
    
    setRevealedSecrets(newRevealed);
  }, [revealedSecrets, secretValues]);
  
  const copySecret = useCallback((secretKey: string, envId?: string) => {
    const fullKey = envId ? `${secretKey}:${envId}` : secretKey;
    const value = secretValues[fullKey];
    if (value) {
      navigator.clipboard.writeText(value);
    }
  }, [secretValues]);

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/ide")}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            Secret Management
          </h1>
          <p className="text-muted-foreground">Securely store API keys and tokens</p>
        </div>
        <Button onClick={startCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Secret
        </Button>
      </div>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security:</strong> All secrets are encrypted and stored securely in the vault. 
          They are never visible in plain text in your project files or version control.
        </AlertDescription>
      </Alert>

      {/* Environment Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Label>Viewing secrets for:</Label>
            <Select value={selectedEnv} onValueChange={setSelectedEnv}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__global__">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Global Secrets</span>
                  </div>
                </SelectItem>
                {Object.values(environments).map((env) => (
                  <SelectItem key={env.id} value={env.id}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: env.color }}
                      />
                      <span>{env.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Secrets List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {isEnvironmentView 
              ? `${currentEnvironment?.name} Secrets`
              : "Global Secrets"}
          </h2>
          <span className="text-sm text-muted-foreground">
            {Object.keys(displayedSecrets).length} secret{Object.keys(displayedSecrets).length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          {Object.keys(displayedSecrets).length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <Lock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No {isEnvironmentView ? "environment" : "global"} secrets
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {isEnvironmentView 
                    ? `Add environment-specific secrets for ${currentEnvironment?.name}.`
                    : "Store API keys, tokens, and other sensitive data securely."}
                </p>
                <Button onClick={startCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add {isEnvironmentView ? "Environment" : "Global"} Secret
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {Object.entries(displayedSecrets).map(([secretKey, secretRef]) => {
                const fullKey = isEnvironmentView ? `${secretKey}:${selectedEnv}` : secretKey;
                const isRevealed = revealedSecrets.has(fullKey);
                const secretValue = secretValues[fullKey];
                
                return (
                  <Card key={secretKey} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                              {secretKey}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              {isEnvironmentView ? currentEnvironment?.name : "Global"}
                            </Badge>
                            <Lock className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-mono">
                            {isRevealed && secretValue 
                              ? <span className="text-yellow-600 dark:text-yellow-400">{secretValue}</span>
                              : "••••••••••••••••"}
                          </p>
                          {secretRef.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {secretRef.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 ml-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => toggleRevealSecret(secretKey, isEnvironmentView ? selectedEnv : undefined)}
                                >
                                  {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{isRevealed ? "Hide" : "Reveal"} secret</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {isRevealed && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => copySecret(secretKey, isEnvironmentView ? selectedEnv : undefined)}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy secret value</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => startEdit(secretKey, isEnvironmentView ? selectedEnv : undefined)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDeletingSecret({ 
                              key: secretKey, 
                              environmentId: isEnvironmentView ? selectedEnv : undefined 
                            })}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Security Warning */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Warning:</strong> Never commit secrets to version control. 
          Always use environment-specific secrets for sensitive data that varies between deployments.
        </AlertDescription>
      </Alert>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || !!editingSecret} onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false);
          setEditingSecret(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCreating ? "Add Secret" : "Edit Secret"}
            </DialogTitle>
            <DialogDescription>
              {isCreating 
                ? "Store a new secret securely"
                : "Update the secret details"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isCreating && (
              <div className="space-y-2">
                <Label htmlFor="secret-scope">Scope</Label>
                <Select value={scope} onValueChange={(value: "global" | "environment") => setScope(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="environment">Environment-specific</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {isCreating && scope === "environment" && (
              <div className="space-y-2">
                <Label htmlFor="secret-env">Target Environment</Label>
                <Select value={targetEnvId} onValueChange={setTargetEnvId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(environments).map((env) => (
                      <SelectItem key={env.id} value={env.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: env.color }}
                          />
                          <span>{env.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="secret-key">Key</Label>
              <Input
                id="secret-key"
                placeholder="API_TOKEN"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                autoFocus
                disabled={!!editingSecret}
              />
              {key && !isValidVariableName(key) && (
                <p className="text-xs text-destructive">
                  Must start with a letter or underscore and contain only letters, numbers, underscores, dashes, and dots
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secret-value">Value</Label>
              <Input
                id="secret-value"
                type="password"
                placeholder="sk-1234567890abcdef"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This value will be encrypted and stored securely
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secret-description">Description</Label>
              <Input
                id="secret-description"
                placeholder="API token for external service"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreating(false);
              setEditingSecret(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={isCreating ? handleCreate : handleUpdate}
              disabled={!key.trim() || !value.trim() || !isValidVariableName(key)}
            >
              {isCreating ? "Add" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingSecret} onOpenChange={(open) => !open && setDeletingSecret(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Secret</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the secret "{deletingSecret?.key}"? 
              This will permanently remove the encrypted value from the vault.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}