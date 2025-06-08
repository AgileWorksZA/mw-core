/**
 * Demo component showing how the variable resolution system works with ProjectVariable and ProjectSecret
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useResolvedVariables, useVariableResolver } from "~/modules/ide/hooks/use-variable-resolver";
import { useManifest } from "~/modules/ide/hooks/use-manifest";
import type { InternalTypes } from "~/modules/ide/types";

interface ResolutionDemoProps {
  fileId?: string;
}

export function ResolutionDemo({ fileId: propFileId }: ResolutionDemoProps) {
  const manifest = useManifest();
  const fileId = propFileId || manifest?.id;
  
  const [resolvedData, setResolvedData] = useState<any>(null);
  const [isResolving, setIsResolving] = useState(false);
  
  // Get raw variables (with internal types)
  const rawInputVariables = useVariableResolver(fileId || "", "", "input");
  const rawOutputVariables = useVariableResolver(fileId || "", "", "output");
  
  // Get resolved variables hook (returns a promise)
  const resolvedInputPromise = useResolvedVariables(fileId || "", "input");
  const resolvedOutputPromise = useResolvedVariables(fileId || "", "output");

  // Function to manually resolve variables
  const handleResolve = async () => {
    if (!fileId) return;
    
    setIsResolving(true);
    try {
      const [resolvedInput, resolvedOutput] = await Promise.all([
        resolvedInputPromise,
        resolvedOutputPromise
      ]);
      
      setResolvedData({
        input: resolvedInput,
        output: resolvedOutput
      });
    } catch (error) {
      console.error("Resolution error:", error);
      setResolvedData({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsResolving(false);
    }
  };

  // Function to identify internal types in variables
  const findInternalTypes = (variables: any, path = ""): Array<{ path: string; type: string; details: any }> => {
    const results: Array<{ path: string; type: string; details: any }> = [];
    
    if (!variables || typeof variables !== "object") return results;
    
    if ("internal" in variables) {
      const internal = variables as InternalTypes<any>;
      results.push({
        path: path || "root",
        type: internal.internal,
        details: internal
      });
      return results;
    }
    
    if (Array.isArray(variables)) {
      for (let i = 0; i < variables.length; i++) {
        results.push(...findInternalTypes(variables[i], `${path}[${i}]`));
      }
    } else {
      for (const [key, value] of Object.entries(variables)) {
        results.push(...findInternalTypes(value, path ? `${path}.${key}` : key));
      }
    }
    
    return results;
  };

  const inputInternals = rawInputVariables ? findInternalTypes(rawInputVariables) : [];
  const outputInternals = rawOutputVariables ? findInternalTypes(rawOutputVariables) : [];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pointer": return "bg-blue-100 text-blue-800";
      case "parameter": return "bg-green-100 text-green-800";  
      case "from-data": return "bg-yellow-100 text-yellow-800";
      case "project-variable": return "bg-purple-100 text-purple-800";
      case "project-secret": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!fileId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No file selected for resolution demo</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Variable Resolution Demo</CardTitle>
          <CardDescription>
            Shows how ProjectVariable and ProjectSecret internal types are resolved to actual values
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Input Variables Analysis */}
            <div>
              <h4 className="font-medium mb-2">Input Variables</h4>
              {inputInternals.length > 0 ? (
                <div className="space-y-2">
                  {inputInternals.map((internal, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-muted px-1 rounded">{internal.path}</code>
                        <Badge className={getTypeColor(internal.type)}>
                          {internal.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {internal.type === "project-variable" && (
                          <span>Variable: {internal.details.key}</span>
                        )}
                        {internal.type === "project-secret" && (
                          <span>Secret: {internal.details.key}</span>
                        )}
                        {internal.type === "pointer" && (
                          <span>→ {internal.details.id}:{internal.details.path}</span>
                        )}
                        {internal.type === "parameter" && (
                          <span>Param: {internal.details.name}</span>
                        )}
                        {internal.type === "from-data" && (
                          <span>Data: {internal.details.path}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No internal types found in input variables</p>
              )}
            </div>

            <Separator />

            {/* Output Variables Analysis */}
            <div>
              <h4 className="font-medium mb-2">Output Variables</h4>
              {outputInternals.length > 0 ? (
                <div className="space-y-2">
                  {outputInternals.map((internal, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-muted px-1 rounded">{internal.path}</code>
                        <Badge className={getTypeColor(internal.type)}>
                          {internal.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {internal.type === "project-variable" && (
                          <span>Variable: {internal.details.key}</span>
                        )}
                        {internal.type === "project-secret" && (
                          <span>Secret: {internal.details.key}</span>
                        )}
                        {internal.type === "pointer" && (
                          <span>→ {internal.details.id}:{internal.details.path}</span>
                        )}
                        {internal.type === "parameter" && (
                          <span>Param: {internal.details.name}</span>
                        )}
                        {internal.type === "from-data" && (
                          <span>Data: {internal.details.path}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No internal types found in output variables</p>
              )}
            </div>

            <Separator />

            {/* Resolution Controls */}
            <div className="flex items-center justify-between">
              <Button onClick={handleResolve} disabled={isResolving}>
                {isResolving ? "Resolving..." : "Resolve Variables"}
              </Button>
              <span className="text-xs text-muted-foreground">
                {inputInternals.length + outputInternals.length} internal types found
              </span>
            </div>

            {/* Resolution Results */}
            {resolvedData && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Resolution Results</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(resolvedData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}