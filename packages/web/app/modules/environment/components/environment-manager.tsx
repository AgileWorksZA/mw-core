/**
 * Main environment manager component
 */

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Textarea } from "~/components/ui/textarea";
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
  Plus,
  Trash2,
  Edit,
  Copy,
  Download,
  Upload,
  Globe,
  Layers,
  Variable,
  Lock,
  MoreHorizontal,
  Settings2,
  AlertCircle,
  Check,
  X,
  Search,
  Sparkles
} from "lucide-react";
import { useEnvironmentStore } from "../store";
import { SecretInput } from "./secret-input";
import { isValidVariableName } from "../resolver";
import { cn } from "~/lib/utils";
import type { Environment as EnvironmentType } from "../types";

export function EnvironmentManager() {
  const store = useEnvironmentStore();
  const [activeTab, setActiveTab] = useState("global");
  const [search, setSearch] = useState("");
  const [editingVar, setEditingVar] = useState<{
    key: string;
    type: "variable" | "secret";
    tab: string;
  } | null>(null);
  
  const environments = Object.values(store.config.environments);
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="px-4 pt-4 pb-2 border-b">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Environment Variables</h2>
                <p className="text-sm text-muted-foreground">
                  Manage global variables and environment-specific overrides
                </p>
              </div>
              <div className="flex items-center gap-2">
                <EnvironmentActions />
                <CreateEnvironmentDialog />
              </div>
            </div>
            
            <TabsList className="grid grid-cols-auto gap-1 w-full justify-start">
              <TabsTrigger value="global" className="gap-2">
                <Globe className="h-4 w-4" />
                Global
              </TabsTrigger>
              {environments.map((env) => (
                <TabsTrigger key={env.id} value={env.id} className="gap-2">
                  <Layers className="h-4 w-4" />
                  {env.name}
                  {env.color && (
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: env.color }}
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="global" className="h-full m-0">
              <GlobalVariablesTab search={search} setSearch={setSearch} />
            </TabsContent>
            {environments.map((env) => (
              <TabsContent key={env.id} value={env.id} className="h-full m-0">
                <EnvironmentVariablesTab 
                  environment={env} 
                  search={search} 
                  setSearch={setSearch} 
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function GlobalVariablesTab({ 
  search, 
  setSearch 
}: { 
  search: string; 
  setSearch: (s: string) => void;
}) {
  const store = useEnvironmentStore();
  const variables = Object.values(store.config.globals.variables);
  const secrets = Object.values(store.config.globals.secrets);
  
  const filteredVariables = variables.filter(v => 
    v.key.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSecrets = secrets.filter(s => 
    s.key.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="h-full flex flex-col p-4 gap-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search variables..."
            className="pl-9"
          />
        </div>
        <AddVariableDialog source="global" />
      </div>
      
      <div className="flex-1 overflow-auto">
        {filteredVariables.length === 0 && filteredSecrets.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No variables yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Global variables are available in all environments
              </p>
              <AddVariableDialog source="global" showIcon />
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVariables.map((variable) => (
                <VariableRow
                  key={variable.key}
                  variable={variable}
                  type="variable"
                  source="global"
                  onDelete={() => store.deleteGlobalVariable(variable.key)}
                />
              ))}
              {filteredSecrets.map((secret) => (
                <SecretRow
                  key={secret.key}
                  secret={secret}
                  source="global"
                  onDelete={() => store.deleteGlobalSecret(secret.key)}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function EnvironmentVariablesTab({ 
  environment,
  search, 
  setSearch 
}: { 
  environment: EnvironmentType;
  search: string; 
  setSearch: (s: string) => void;
}) {
  const store = useEnvironmentStore();
  const variables = Object.entries(environment.variables);
  const secrets = Object.values(environment.secrets);
  
  const filteredVariables = variables.filter(([key]) => 
    key.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSecrets = secrets.filter(s => 
    s.key.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="h-full flex flex-col p-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Environment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={environment.name}
                onChange={(e) => store.updateEnvironment(environment.id, { name: e.target.value })}
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={environment.color || "#000000"}
                  onChange={(e) => store.updateEnvironment(environment.id, { color: e.target.value })}
                  className="w-16 h-9"
                />
                <span className="text-sm text-muted-foreground">
                  {environment.color || "No color"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={environment.description || ""}
              onChange={(e) => store.updateEnvironment(environment.id, { description: e.target.value })}
              placeholder="Describe this environment..."
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search variables..."
            className="pl-9"
          />
        </div>
        <AddVariableDialog source="environment" environmentId={environment.id} />
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Environment variables override global variables with the same name
        </AlertDescription>
      </Alert>
      
      <div className="flex-1 overflow-auto">
        {filteredVariables.length === 0 && filteredSecrets.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No environment variables</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Override global variables for this environment
              </p>
              <AddVariableDialog source="environment" environmentId={environment.id} showIcon />
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVariables.map(([key, value]) => (
                <tr key={key}>
                  <TableCell>
                    <Variable className="h-4 w-4 text-blue-500" />
                  </TableCell>
                  <TableCell className="font-mono">{key}</TableCell>
                  <TableCell className="font-mono">{value}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => store.deleteEnvironmentVariable(environment.id, key)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </tr>
              ))}
              {filteredSecrets.map((secret) => (
                <SecretRow
                  key={secret.key}
                  secret={secret}
                  source="environment"
                  environmentId={environment.id}
                  onDelete={() => store.deleteEnvironmentSecret(environment.id, secret.key)}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function VariableRow({ 
  variable, 
  type, 
  source,
  onDelete 
}: { 
  variable: any; 
  type: "variable" | "secret";
  source: string;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(variable.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <TableRow>
      <TableCell>
        <Variable className="h-4 w-4 text-blue-500" />
      </TableCell>
      <TableCell className="font-mono">{variable.key}</TableCell>
      <TableCell className="font-mono">{variable.value}</TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {variable.description}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopy}>
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              Copy value
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function SecretRow({ 
  secret, 
  source,
  environmentId,
  onDelete 
}: { 
  secret: any;
  source: string;
  environmentId?: string;
  onDelete: () => void;
}) {
  return (
    <TableRow>
      <TableCell>
        <Lock className="h-4 w-4 text-orange-500" />
      </TableCell>
      <TableCell className="font-mono">{secret.key}</TableCell>
      <TableCell>
        <Badge variant="secondary">Secret</Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {secret.description}
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function AddVariableDialog({ 
  source, 
  environmentId,
  showIcon = false
}: { 
  source: "global" | "environment";
  environmentId?: string;
  showIcon?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"variable" | "secret">("variable");
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  
  const store = useEnvironmentStore();
  
  const handleSubmit = async () => {
    if (!key || !value) {
      setError("Key and value are required");
      return;
    }
    
    if (!isValidVariableName(key)) {
      setError("Invalid variable name. Use letters, numbers, underscore, dash, and dot.");
      return;
    }
    
    try {
      if (source === "global") {
        if (type === "variable") {
          store.setGlobalVariable(key, value, description);
        } else {
          await store.setGlobalSecret(key, value, description);
        }
      } else if (environmentId) {
        if (type === "variable") {
          store.setEnvironmentVariable(environmentId, key, value);
        } else {
          await store.setEnvironmentSecret(environmentId, key, value);
        }
      }
      
      setOpen(false);
      setKey("");
      setValue("");
      setDescription("");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={showIcon ? "default" : "outline"}>
          <Plus className="h-4 w-4 mr-2" />
          Add Variable
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {source === "global" ? "Global" : "Environment"} Variable</DialogTitle>
          <DialogDescription>
            Create a new variable or secret
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={type === "variable" ? "default" : "outline"}
              size="sm"
              onClick={() => setType("variable")}
            >
              <Variable className="h-4 w-4 mr-2" />
              Variable
            </Button>
            <Button
              variant={type === "secret" ? "default" : "outline"}
              size="sm"
              onClick={() => setType("secret")}
            >
              <Lock className="h-4 w-4 mr-2" />
              Secret
            </Button>
          </div>
          
          <div>
            <Label>Name</Label>
            <Input
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError("");
              }}
              placeholder="API_KEY"
            />
          </div>
          
          <div>
            <Label>Value</Label>
            {type === "secret" ? (
              <SecretInput
                value={value}
                onValueChange={setValue}
                placeholder="Enter secret value..."
                showCopyButton={false}
              />
            ) : (
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value..."
              />
            )}
          </div>
          
          {source === "global" && (
            <div>
              <Label>Description (optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this variable for?"
              />
            </div>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add {type === "secret" ? "Secret" : "Variable"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateEnvironmentDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  
  const store = useEnvironmentStore();
  
  const handleCreate = () => {
    if (!name) return;
    
    store.createEnvironment({
      name,
      description,
      color,
      variables: {},
      secrets: {}
    });
    
    setOpen(false);
    setName("");
    setDescription("");
    setColor("#3b82f6");
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Environment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Environment</DialogTitle>
          <DialogDescription>
            Create a new environment for your variables
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Production"
            />
          </div>
          
          <div>
            <Label>Color</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-9"
              />
              <span className="text-sm text-muted-foreground">{color}</span>
            </div>
          </div>
          
          <div>
            <Label>Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Production environment for live services"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name}>
            Create Environment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EnvironmentActions() {
  const store = useEnvironmentStore();
  
  const handleExport = () => {
    const data = store.exportEnvironment();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "environment-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const text = await file.text();
      try {
        store.importEnvironment(text);
      } catch (err) {
        console.error("Failed to import:", err);
        // TODO: Show error toast
      }
    };
    input.click();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Configuration
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleImport}>
          <Upload className="mr-2 h-4 w-4" />
          Import Configuration
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}