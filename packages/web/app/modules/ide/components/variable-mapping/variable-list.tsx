import { ChevronDown, ChevronUp, FileJson, Plus, X } from "lucide-react";
import {
  useCallback,
  useMemo,
  useState,
  type MouseEvent,
  type KeyboardEvent,
} from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Badge } from "~/components/ui/badge";
import { VariableInput } from "./variable-input";
import { useManifestOutputVariable } from "~/modules/ide/hooks/use-manifest-output-variable";

interface VariableListProps {
  variables: Record<string, any>;
  onChange: (variables: Record<string, any>) => void;
  title: string;
}

// Separate component for each variable row to prevent the entire list from rerendering
function VariableRow({
  path,
  value,
  isExpanded,
  onToggle,
  onRemove,
  onChange,
}: {
  path: string;
  value: any;
  isExpanded: boolean;
  onToggle: (path: string) => void;
  onRemove: (path: string) => void;
  onChange: (path: string, value: any) => void;
}) {
  // Check if this is an internal type (pointer, from-data, parameter)
  const isInternalType = useMemo(() => {
    return (
      value &&
      typeof value === "object" &&
      true &&
      "internal" in value &&
      typeof value.internal === "string" &&
      ["pointer", "from-data", "parameter"].includes(value.internal)
    );
  }, [value]);

  // Extract necessary values for resolving pointers
  const fileId = useMemo(() => {
    if (isInternalType && value.internal === "pointer") {
      return value.id || "";
    }
    return "";
  }, [isInternalType, value]);

  const pathValue = useMemo(() => {
    if (isInternalType && value.internal === "pointer") {
      return value.path || "";
    }
    return "";
  }, [isInternalType, value]);

  // Fetch the resolved value using the hook (must be called unconditionally)
  const resolvedValue = useManifestOutputVariable(fileId, pathValue);

  // Get resolved value preview for internal types
  const resolvedPreview = useMemo(() => {
    const preview = "";

    if (!isInternalType) return preview;

    try {
      // Handle pointers
      if (value.internal === "pointer") {
        if (!fileId) return "Missing file ID";

        if (resolvedValue === undefined || resolvedValue === null) {
          return "Not found";
        }
        if (typeof resolvedValue === "object") {
          return Array.isArray(resolvedValue)
            ? `Array[${resolvedValue.length}]`
            : "Object";
        }
        return String(resolvedValue);
      }

      // Handle FromData
      if (value.internal === "from-data") {
        const name = value.name || "";
        const pathValue = value.path || "";
        return name ? `${name}${pathValue ? `/${pathValue}` : ""}` : "";
      }

      // Handle parameters
      if (value.internal === "parameter") {
        const name = value.name || "";
        return name ? `param:${name}` : "";
      }
    } catch (error) {
      console.error("Error in resolvedPreview:", error);
      return "Error";
    }

    return preview;
  }, [isInternalType, value, fileId, resolvedValue]);

  // Get value preview for non-internal types
  const valuePreview = useMemo(() => {
    if (isInternalType) return "";

    try {
      if (value === null) return "null";
      if (value === undefined) return "undefined";

      if (typeof value === "string") {
        return value.length > 30
          ? `"${value.substring(0, 27)}..."`
          : `"${value}"`;
      }

      if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
      }

      if (typeof value === "object") {
        if (Array.isArray(value)) {
          return `Array[${value.length}]`;
        }
        return "Object";
      }

      return String(value);
    } catch (error) {
      console.error("Error in valuePreview:", error);
      return "";
    }
  }, [isInternalType, value]);

  // Handle toggle button click
  const handleToggle = useCallback(() => {
    onToggle(path);
  }, [onToggle, path]);

  // Handle remove button click
  const handleRemove = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onRemove(path);
    },
    [onRemove, path],
  );

  // Handle value change from VariableInput
  const handleChange = useCallback(
    (newValue: any) => {
      onChange(path, newValue);
    },
    [onChange, path],
  );

  return (
    <div
      className={`border rounded-md transition-colors ${isExpanded ? "border-primary" : "hover:border-primary/50"}`}
    >
      {/* Variable header */}
      <button
        type="button"
        className={`flex items-center justify-between p-3 w-full text-left ${isExpanded ? "bg-muted/30" : "hover:bg-muted/50"}`}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleToggle();
          }
        }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 mr-2 text-primary shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 mr-2 shrink-0" />
          )}
          <span className="font-medium text-sm shrink-0">/{path}</span>

          {/* Display resolved value for internal types */}
          {isInternalType && resolvedPreview && (
            <Badge
              variant="outline"
              className="ml-2 text-xs bg-muted/50 shrink-0"
            >
              = {resolvedPreview}
            </Badge>
          )}

          {/* Display preview for normal values */}
          {!isInternalType && valuePreview && (
            <Badge variant="secondary" className="ml-2 text-xs truncate">
              {valuePreview}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </button>

      {/* Variable editor (expanded) */}
      {isExpanded && (
        <div className="p-3 border-t">
          <VariableInput name={path} value={value} onChange={handleChange} />
        </div>
      )}
    </div>
  );
}

export function VariableList({
  variables,
  onChange,
  title,
}: VariableListProps) {
  const [newVariablePath, setNewVariablePath] = useState("");
  const [expandedVariable, setExpandedVariable] = useState<string | null>(null);

  // Clean up the variable path to ensure it's valid
  const normalizeVariablePath = useCallback((path: string): string => {
    // Remove the leading slash if present
    let normalized = path.startsWith("/") ? path.substring(1) : path;

    // Replace any characters that might cause issues
    normalized = normalized.replace(/\s+/g, "_");

    return normalized;
  }, []);

  // Add a new variable
  const handleAddVariable = useCallback(() => {
    if (!newVariablePath) return;

    const normalizedPath = normalizeVariablePath(newVariablePath);

    // Check if the path already exists
    if (variables[normalizedPath] !== undefined) return;

    // Create new variable with default empty string
    const newVariables = {
      ...variables,
      [normalizedPath]: "",
    };

    // Update the variables
    onChange(newVariables);

    // Expand the newly added variable
    setExpandedVariable(normalizedPath);
    setNewVariablePath("");
  }, [newVariablePath, normalizeVariablePath, variables, onChange]);

  // Handle the enter key in the new variable input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleAddVariable();
      }
    },
    [handleAddVariable],
  );

  // Update an existing variable
  const handleUpdateVariable = useCallback(
    (path: string, value: any) => {
      onChange({
        ...variables,
        [path]: value,
      });
    },
    [variables, onChange],
  );

  // Remove a variable
  const handleRemoveVariable = useCallback(
    (path: string) => {
      const newVariables = { ...variables };
      delete newVariables[path];
      onChange(newVariables);

      // If the removed variable was expanded, clear the expanded state
      if (expandedVariable === path) {
        setExpandedVariable(null);
      }
    },
    [variables, expandedVariable, onChange],
  );

  // Toggle variable expansion
  const toggleVariableExpansion = useCallback(
    (path: string) => {
      setExpandedVariable(expandedVariable === path ? null : path);
    },
    [expandedVariable],
  );

  const variableEntries = useMemo(() => {
    return Object.entries(variables || {});
  }, [variables]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileJson className="h-5 w-5 mr-2 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add a new variable form */}
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative flex-grow">
                    <Input
                      placeholder="Variable path (e.g., 'data/items' or 'adapter')"
                      value={newVariablePath}
                      onChange={(e) => setNewVariablePath(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-7"
                    />
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      {newVariablePath.startsWith("/") ? "" : "/"}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[220px] text-xs">
                    Create a path for your variable - this will be accessible in
                    the manifest at mapping.input/output.variables.
                    {newVariablePath
                      ? normalizeVariablePath(newVariablePath)
                      : "path"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={handleAddVariable}
              disabled={
                !newVariablePath ||
                variables[normalizeVariablePath(newVariablePath)] !== undefined
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* List of variables */}
          <div className="space-y-2">
            {!variableEntries.length ? (
              <div className="text-center text-muted-foreground p-4 border border-dashed rounded-md">
                No variables defined
              </div>
            ) : (
              variableEntries.map(([path, value]) => (
                <VariableRow
                  key={path}
                  path={path}
                  value={value}
                  isExpanded={expandedVariable === path}
                  onToggle={toggleVariableExpansion}
                  onRemove={handleRemoveVariable}
                  onChange={handleUpdateVariable}
                />
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
