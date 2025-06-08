import {
  Plus,
  Settings,
  Globe,
  Lock,
  Key,
  Info,
  Copy,
  ChevronRight,
  Layers,
  FileText,
  FolderOpen,
  Activity,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Alert, AlertDescription } from "~/components/ui/alert";
import type { ProjectEnvironmentConfig } from "../types";
import { useIde } from "../hooks/use-ide";
import { useIdeTrigger } from "~/modules/ide/hooks";

export function IDEDashboard() {
  const ide = useIde();
  const ideTrigger = useIdeTrigger();
  const navigate = useNavigate();

  const config = ide.environmentConfig;
  const environments = config?.environments || {};
  const globalVariables = config?.globals.variables || {};
  const globalSecrets = config?.globals.secrets || {};
  const files = ide.files || {};

  const activeEnvironment = config?.activeEnvironment;
  const hasEnvironments = Object.keys(environments).length > 0;
  const hasVariables =
    Object.keys(globalVariables).length > 0 ||
    Object.values(environments).some(
      (env) => Object.keys(env.variables).length > 0,
    );
  const hasSecrets =
    Object.keys(globalSecrets).length > 0 ||
    Object.values(environments).some(
      (env) => Object.keys(env.secrets).length > 0,
    );
  const fileCount = Object.keys(files).length;

  const setActiveEnvironment = useCallback(
    (envId: string | undefined) => {
      if (!config) return;

      // Convert special value back to undefined
      const actualEnvId = envId === "__none__" ? undefined : envId;

      const updatedConfig: ProjectEnvironmentConfig = {
        ...config,
        activeEnvironment: actualEnvId,
        metadata: {
          createdAt: config.metadata?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: config.metadata?.version || "1.0.0",
        },
      };

      ideTrigger.update({
        context: {
          environmentConfig: updatedConfig,
        },
      });
    },
    [config, ideTrigger],
  );

  // Get recent files
  const recentFiles = Object.entries(files)
    .slice(0, 5)
    .map(([id, file]) => ({ ...file, id }));

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="space-y-8">
        {/* Project Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {ide.name || "Project"} Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your project configuration, environments, and files
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Quick Environment Switcher */}
              <Select
                value={activeEnvironment || "__none__"}
                onValueChange={(value) =>
                  setActiveEnvironment(value === "__none__" ? undefined : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select environment">
                    {activeEnvironment ? (
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor:
                              environments[activeEnvironment]?.color ||
                              "#3b82f6",
                          }}
                        />
                        <span>{environments[activeEnvironment]?.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Global Only</span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">
                    <span className="text-muted-foreground">Global Only</span>
                  </SelectItem>
                  {Object.values(environments).map((env) => (
                    <SelectItem key={env.id} value={env.id}>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: env.color }}
                        />
                        <span>{env.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/ide/environments")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Files */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Project Files
                </CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fileCount}</div>
              <p className="text-xs text-muted-foreground">
                {fileCount === 1 ? "file" : "files"} in project
              </p>
            </CardContent>
          </Card>

          {/* Active Environment */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Active Environment
                </CardTitle>
                <Globe className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {activeEnvironment ? (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          environments[activeEnvironment]?.color || "#3b82f6",
                      }}
                    />
                    <span className="font-medium text-lg">
                      {environments[activeEnvironment]?.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {environments[activeEnvironment]?.description ||
                      "No description"}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium">Global Only</p>
                  <p className="text-xs text-muted-foreground">
                    No environment selected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variables Count */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Variables</CardTitle>
                <Key className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {Object.keys(globalVariables).length +
                    Object.values(environments).reduce(
                      (sum, env) => sum + Object.keys(env.variables).length,
                      0,
                    )}
                </div>
                <div className="text-xs text-muted-foreground space-x-2">
                  <span>Global: {Object.keys(globalVariables).length}</span>
                  <span>•</span>
                  <span>
                    Env:{" "}
                    {Object.values(environments).reduce(
                      (sum, env) => sum + Object.keys(env.variables).length,
                      0,
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secrets Count */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Secrets</CardTitle>
                <Lock className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {Object.keys(globalSecrets).length +
                    Object.values(environments).reduce(
                      (sum, env) => sum + Object.keys(env.secrets).length,
                      0,
                    )}
                </div>
                <div className="text-xs text-muted-foreground space-x-2">
                  <span>Global: {Object.keys(globalSecrets).length}</span>
                  <span>•</span>
                  <span>
                    Env:{" "}
                    {Object.values(environments).reduce(
                      (sum, env) => sum + Object.keys(env.secrets).length,
                      0,
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Environment Configuration Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Environment Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Manage Environments */}
                <Card
                  className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                  onClick={() => navigate("/ide/environments")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <Layers className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Manage Environments</h3>
                        <p className="text-sm text-muted-foreground">
                          {hasEnvironments
                            ? `${Object.keys(environments).length} environments`
                            : "Create your first"}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                {/* Configure Variables */}
                <Card
                  className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                  onClick={() => navigate("/ide/variables")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Configure Variables</h3>
                        <p className="text-sm text-muted-foreground">
                          {hasVariables
                            ? "Manage values"
                            : "Add your first variable"}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                {/* Manage Secrets */}
                <Card
                  className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                  onClick={() => navigate("/ide/secrets")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                        <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Manage Secrets</h3>
                        <p className="text-sm text-muted-foreground">
                          {hasSecrets
                            ? "Secure storage"
                            : "Add API keys & tokens"}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                {/* Import/Export */}
                <Card className="cursor-pointer hover:shadow-md transition-all opacity-60">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <Copy className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Import/Export</h3>
                        <p className="text-sm text-muted-foreground">
                          Coming soon
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Quick Actions
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate("/ide/new/json")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New File
                </Button>
                <Button variant="outline" className="justify-start">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
                <Button variant="outline" className="justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  View Activity
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Files Sidebar */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Recent Files
            </h2>

            {recentFiles.length > 0 ? (
              <div className="space-y-2">
                {recentFiles.map((file) => (
                  <Card
                    key={file.id}
                    className="cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={() => navigate(`/ide/${file.type}/${file.id}`)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium truncate">
                              {file.path}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {file.type}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {fileCount > 5 && (
                  <Button
                    variant="ghost"
                    className="w-full justify-center"
                    size="sm"
                  >
                    View all {fileCount} files
                  </Button>
                )}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <FileText className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No files yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate("/ide/new/json")}
                  >
                    Create First File
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Getting Started */}
        {!hasEnvironments &&
          !hasVariables &&
          !hasSecrets &&
          fileCount === 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Welcome to your new project!</strong> Start by creating
                your first environment or adding some files to get started.
              </AlertDescription>
            </Alert>
          )}
      </div>
    </div>
  );
}
