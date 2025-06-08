import { 
  Plus, 
  Settings, 
  Trash2, 
  Edit3,
  ChevronLeft,
  Palette,
  CheckCircle
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
import type { Environment } from "../types";
import { useIde } from "../hooks/use-ide";
import { useIdeTrigger } from "../hooks/use-ide-trigger";

export function EnvironmentManagement() {
  const ide = useIde();
  const trigger = useIdeTrigger();
  const navigate = useNavigate();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingEnv, setEditingEnv] = useState<Environment | null>(null);
  const [deletingEnv, setDeletingEnv] = useState<Environment | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  
  const config = ide.environmentConfig;
  const environments = config?.environments || {};
  const activeEnvironment = config?.activeEnvironment;
  
  const handleCreate = useCallback(() => {
    if (!name.trim()) return;
    
    trigger.createEnvironment({
      name: name.trim(),
      description: description.trim() || undefined,
      color,
    });
    
    setIsCreating(false);
    setName("");
    setDescription("");
    setColor("#3b82f6");
  }, [name, description, color, trigger]);
  
  const handleUpdate = useCallback(() => {
    if (!editingEnv || !name.trim()) return;
    
    trigger.updateEnvironment({
      id: editingEnv.id,
      updates: {
        name: name.trim(),
        description: description.trim() || undefined,
        color,
      },
    });
    
    setEditingEnv(null);
    setName("");
    setDescription("");
    setColor("#3b82f6");
  }, [editingEnv, name, description, color, trigger]);
  
  const handleDelete = useCallback(() => {
    if (!deletingEnv) return;
    
    trigger.deleteEnvironment({ id: deletingEnv.id });
    setDeletingEnv(null);
  }, [deletingEnv, trigger]);
  
  const handleSetActive = useCallback((envId: string | undefined) => {
    trigger.setActiveEnvironment({ id: envId });
  }, [trigger]);
  
  const startEdit = useCallback((env: Environment) => {
    setEditingEnv(env);
    setName(env.name);
    setDescription(env.description || "");
    setColor(env.color || "#3b82f6");
  }, []);
  
  const startCreate = useCallback(() => {
    setIsCreating(true);
    setName("");
    setDescription("");
    setColor("#3b82f6");
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
            Environment Management
          </h1>
          <p className="text-muted-foreground">Configure deployment environments for your project</p>
        </div>
        <Button onClick={startCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Environment
        </Button>
      </div>

      {/* Active Environment Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Active Environment</CardTitle>
          <CardDescription>
            The environment that will be used as the default context for variable resolution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select 
            value={activeEnvironment || "__none__"} 
            onValueChange={(value) => handleSetActive(value === "__none__" ? undefined : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select active environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">
                <span className="text-muted-foreground">None (Global only)</span>
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
        </CardContent>
      </Card>

      {/* Environments List */}
      <div className="space-y-3">
        <h2 className="text-lg font-medium">Environments</h2>
        
        {Object.values(environments).length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No environments yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create environments to organize your configuration for different deployment contexts like development, staging, and production.
              </p>
              <Button onClick={startCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Environment
              </Button>
            </CardContent>
          </Card>
        ) : (
          Object.values(environments).map((env) => (
            <Card key={env.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-5 h-5 rounded-full ring-2 ring-offset-2 ring-gray-200 dark:ring-gray-700" 
                      style={{ backgroundColor: env.color }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium">{env.name}</h3>
                        {activeEnvironment === env.id && (
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Active</span>
                          </Badge>
                        )}
                      </div>
                      {env.description && (
                        <p className="text-sm text-muted-foreground mt-1">{env.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground space-x-4">
                      <span>{Object.keys(env.variables).length} variables</span>
                      <span>{Object.keys(env.secrets).length} secrets</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(env)}>
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setDeletingEnv(env)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Best Practices */}
      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          <strong>Best Practice:</strong> Create separate environments for development, staging, and production. 
          Use environment-specific variables to manage different API endpoints, feature flags, and configurations.
        </AlertDescription>
      </Alert>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || !!editingEnv} onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false);
          setEditingEnv(null);
          setName("");
          setDescription("");
          setColor("#3b82f6");
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCreating ? "Create New Environment" : "Edit Environment"}
            </DialogTitle>
            <DialogDescription>
              {isCreating 
                ? "Create a new environment for your project configuration"
                : "Update the environment details"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="env-name">Name</Label>
              <Input
                id="env-name"
                placeholder="Development"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="env-description">Description</Label>
              <Textarea
                id="env-description"
                placeholder="Development environment for testing new features"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="env-color">Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="env-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-20 h-10"
                />
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded-full ring-2 ring-offset-2 ring-gray-200" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-muted-foreground">{color}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Choose a color to identify this environment
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreating(false);
              setEditingEnv(null);
              setName("");
              setDescription("");
              setColor("#3b82f6");
            }}>
              Cancel
            </Button>
            <Button 
              onClick={isCreating ? handleCreate : handleUpdate}
              disabled={!name.trim()}
            >
              {isCreating ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingEnv} onOpenChange={(open) => !open && setDeletingEnv(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Environment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{deletingEnv?.name}" environment? 
              This will remove all variables and secrets associated with this environment.
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