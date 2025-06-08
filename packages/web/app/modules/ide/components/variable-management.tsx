import { 
  Plus, 
  Key,
  Trash2, 
  Edit3,
  ChevronLeft,
  Copy,
  Globe,
  FileText
} from "lucide-react";
import { useState, useCallback } from "react";
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
import { Textarea } from "~/components/ui/textarea";
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

interface VariableFormData {
  key: string;
  value: string;
  description?: string;
  environmentId?: string;
}

export function VariableManagement() {
  const ide = useIde();
  const trigger = useIdeTrigger();
  const navigate = useNavigate();
  
  const [selectedEnv, setSelectedEnv] = useState<string>("__global__");
  const [isCreating, setIsCreating] = useState(false);
  const [editingVar, setEditingVar] = useState<VariableFormData | null>(null);
  const [deletingVar, setDeletingVar] = useState<{ key: string; environmentId?: string } | null>(null);
  
  // Form state
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState<"global" | "environment">("global");
  const [targetEnvId, setTargetEnvId] = useState<string>("");
  
  const config = ide.environmentConfig;
  const environments = config?.environments || {};
  const globalVariables = config?.globals.variables || {};
  
  // Get variables for selected environment
  const displayedVariables = selectedEnv === "__global__" 
    ? globalVariables
    : environments[selectedEnv]?.variables || {};
    
  const isEnvironmentView = selectedEnv !== "__global__";
  const currentEnvironment = isEnvironmentView ? environments[selectedEnv] : null;
  
  const handleCreate = useCallback(() => {
    if (!key.trim() || !isValidVariableName(key)) return;
    
    const environmentId = scope === "global" ? undefined : (targetEnvId || selectedEnv);
    
    trigger.setVariable({
      key: key.trim(),
      value,
      description: description.trim() || undefined,
      environmentId: environmentId === "__global__" ? undefined : environmentId,
    });
    
    setIsCreating(false);
    resetForm();
  }, [key, value, description, scope, targetEnvId, selectedEnv, trigger]);
  
  const handleUpdate = useCallback(() => {
    if (!editingVar || !key.trim() || !isValidVariableName(key)) return;
    
    // Delete old variable if key changed
    if (editingVar.key !== key.trim()) {
      trigger.deleteVariable({ 
        key: editingVar.key, 
        environmentId: editingVar.environmentId 
      });
    }
    
    trigger.setVariable({
      key: key.trim(),
      value,
      description: description.trim() || undefined,
      environmentId: editingVar.environmentId,
    });
    
    setEditingVar(null);
    resetForm();
  }, [editingVar, key, value, description, trigger]);
  
  const handleDelete = useCallback(() => {
    if (!deletingVar) return;
    
    trigger.deleteVariable(deletingVar);
    setDeletingVar(null);
  }, [deletingVar, trigger]);
  
  const startEdit = useCallback((varKey: string, envId?: string) => {
    const variable = envId 
      ? { key: varKey, value: environments[envId]?.variables[varKey] || "", environmentId: envId }
      : globalVariables[varKey];
      
    if (!variable) return;
    
    setEditingVar({ 
      key: varKey, 
      value: typeof variable === "string" ? variable : variable.value,
      description: typeof variable === "string" ? undefined : variable.description,
      environmentId: envId 
    });
    setKey(varKey);
    setValue(typeof variable === "string" ? variable : variable.value);
    setDescription(typeof variable === "string" ? "" : variable.description || "");
  }, [globalVariables, environments]);
  
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
  
  const copyVariable = useCallback((key: string, value: string) => {
    navigator.clipboard.writeText(`${key}=${value}`);
  }, []);

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
            Variable Management
          </h1>
          <p className="text-muted-foreground">Configure variables across environments</p>
        </div>
        <Button onClick={startCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Variable
        </Button>
      </div>

      {/* Environment Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Label>Viewing variables for:</Label>
            <Select value={selectedEnv} onValueChange={setSelectedEnv}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__global__">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Global Variables</span>
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

      {/* Variables List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {isEnvironmentView 
              ? `${currentEnvironment?.name} Variables`
              : "Global Variables"}
          </h2>
          <span className="text-sm text-muted-foreground">
            {Object.keys(displayedVariables).length} variable{Object.keys(displayedVariables).length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          {Object.keys(displayedVariables).length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <Key className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No {isEnvironmentView ? "environment" : "global"} variables
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {isEnvironmentView 
                    ? `Add environment-specific variables to override global values in ${currentEnvironment?.name}.`
                    : "Global variables provide default values that apply across all environments."}
                </p>
                <Button onClick={startCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add {isEnvironmentView ? "Environment" : "Global"} Variable
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {Object.entries(displayedVariables).map(([varKey, varValue]) => {
                const variable = isEnvironmentView 
                  ? { key: varKey, value: varValue as string }
                  : varValue as any;
                  
                return (
                  <Card key={varKey} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                              {varKey}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              {isEnvironmentView ? currentEnvironment?.name : "Global"}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground font-mono truncate">
                            {typeof variable === "string" ? variable : variable.value}
                          </p>
                          {typeof variable !== "string" && variable.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {variable.description}
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
                                  onClick={() => copyVariable(
                                    varKey, 
                                    typeof variable === "string" ? variable : variable.value
                                  )}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy as key=value</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => startEdit(varKey, isEnvironmentView ? selectedEnv : undefined)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDeletingVar({ 
                              key: varKey, 
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

      {/* Best Practices */}
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <strong>Variable Naming:</strong> Use UPPER_SNAKE_CASE for environment variables (e.g., API_HOST, DEBUG_MODE). 
          Variables can contain letters, numbers, underscores, dashes, and dots.
        </AlertDescription>
      </Alert>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || !!editingVar} onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false);
          setEditingVar(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCreating ? "Add Variable" : "Edit Variable"}
            </DialogTitle>
            <DialogDescription>
              {isCreating 
                ? "Create a new configuration variable"
                : "Update the variable details"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isCreating && (
              <div className="space-y-2">
                <Label htmlFor="var-scope">Scope</Label>
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
                <Label htmlFor="var-env">Target Environment</Label>
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
              <Label htmlFor="var-key">Key</Label>
              <Input
                id="var-key"
                placeholder="API_HOST"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                autoFocus
                disabled={!!editingVar}
              />
              {key && !isValidVariableName(key) && (
                <p className="text-xs text-destructive">
                  Must start with a letter or underscore and contain only letters, numbers, underscores, dashes, and dots
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="var-value">Value</Label>
              <Textarea
                id="var-value"
                placeholder="https://api.example.com"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={3}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="var-description">Description</Label>
              <Input
                id="var-description"
                placeholder="Base URL for API calls"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreating(false);
              setEditingVar(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={isCreating ? handleCreate : handleUpdate}
              disabled={!key.trim() || !isValidVariableName(key)}
            >
              {isCreating ? "Add" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingVar} onOpenChange={(open) => !open && setDeletingVar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Variable</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the variable "{deletingVar?.key}"? 
              This action cannot be undone.
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