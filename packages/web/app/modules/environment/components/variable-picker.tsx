/**
 * Variable picker component for selecting project variables
 */

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { 
  Variable, 
  Lock, 
  Globe, 
  Layers, 
  Search,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useEnvironmentStore } from "../store";
import { getAllVariables } from "../resolver";
import type { ResolvedVariable } from "../types";
import { cn } from "~/lib/utils";

interface VariablePickerProps {
  value?: string;
  onSelect: (variableKey: string) => void;
  className?: string;
  placeholder?: string;
  environmentId?: string;
}

export function VariablePicker({
  value,
  onSelect,
  className,
  placeholder = "Select variable...",
  environmentId
}: VariablePickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [variables, setVariables] = useState<ResolvedVariable[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { config } = useEnvironmentStore();
  
  // Load variables when opened
  useEffect(() => {
    if (open) {
      setLoading(true);
      getAllVariables(config, environmentId)
        .then(setVariables)
        .finally(() => setLoading(false));
    }
  }, [open, config, environmentId]);
  
  const filteredVariables = variables.filter(v => 
    v.key.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleSelect = (variable: ResolvedVariable) => {
    onSelect(variable.key);
    setOpen(false);
    setSearch("");
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-between", className)}
        >
          {value ? (
            <span className="flex items-center gap-2">
              <Variable className="h-4 w-4" />
              <code className="text-sm">{`{{${value}}}`}</code>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search variables..."
              className="h-8 border-0 p-0 focus-visible:ring-0"
              autoFocus
            />
          </div>
        </div>
        
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading variables...
            </div>
          ) : filteredVariables.length === 0 ? (
            <div className="p-4 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {search ? "No variables found" : "No variables defined"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Create variables in Environment Manager
              </p>
            </div>
          ) : (
            <div className="p-1">
              {filteredVariables.map((variable) => (
                <button
                  key={`${variable.source}-${variable.environment || 'global'}-${variable.key}`}
                  className="w-full flex items-center gap-2 p-2 hover:bg-accent rounded-md text-left transition-colors"
                  onClick={() => handleSelect(variable)}
                >
                  <div className="flex-shrink-0">
                    {variable.type === "secret" ? (
                      <Lock className="h-4 w-4 text-orange-500" />
                    ) : (
                      <Variable className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-medium">{variable.key}</code>
                      {variable.source === "global" ? (
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="h-3 w-3 mr-1" />
                          Global
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs">
                          <Layers className="h-3 w-3 mr-1" />
                          {variable.environment}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {variable.type === "secret" ? "••••••••" : variable.value}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {filteredVariables.length > 0 && (
          <div className="p-2 border-t">
            <p className="text-xs text-muted-foreground">
              Use <code className="bg-muted px-1 py-0.5 rounded">{`{{variable}}`}</code> syntax
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}