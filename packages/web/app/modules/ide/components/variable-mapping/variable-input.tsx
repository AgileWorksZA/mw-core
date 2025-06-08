import { ChevronDown, Info, Link as LinkIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { JsonValue } from "type-fest";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { VariableInput as IntelligentVariableInput } from "~/components/ui/variable-input";
import {
  useActiveEnvironment,
  useVariables,
} from "~/modules/environment/hooks";
import { useIde } from "~/modules/ide/hooks/use-ide";
import { useProjectVariables } from "~/modules/ide/hooks/use-variable-resolver";
import type {
  FileManifest,
  FromData,
  InternalTypes,
  Parameter,
  Pointer,
  ProjectSecret,
  ProjectVariable,
} from "~/modules/ide/types";
import { JsonPathAutocomplete } from "./json-path-autocomplete";

const DATA_TYPES = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "null", label: "Null" },
  { value: "object", label: "Object" },
  { value: "array", label: "Array" },
  { value: "pointer", label: "Pointer" },
  { value: "parameter", label: "Parameter" },
  { value: "from-data", label: "FromData" },
  { value: "project-variable", label: "Project Variable" },
  { value: "project-secret", label: "Project Secret" },
];

interface VariableInputProps {
  name: string; // This is the path of the variable in the variables object
  value: any;
  onChange: (value: any) => void;
  label?: string;
}

export function VariableInput({
  name,
  value,
  onChange,
  label,
}: VariableInputProps) {
  // Ref to track if the component is mounted
  const isMounted = useRef(false);

  // Create a ref for current value to prevent unnecessary updates
  const currentValueRef = useRef(value);

  // For detecting actual value type
  const [type, setType] = useState<string>(() => {
    if (value === null) return "null";
    if (typeof value === "object" && value !== null && "internal" in value) {
      return value.internal;
    }
    return typeof value;
  });

  // For pointer type
  const [pointerId, setPointerId] = useState<string>("");
  const [pointerPath, setPointerPath] = useState<string>("");

  // For parameter type
  const [parameterId, setParameterId] = useState<string>("");
  const [parameterName, setParameterName] = useState<string>("");

  // For from-data type
  const [fromDataPath, setFromDataPath] = useState<string>("");

  // For project variable type
  const [projectVariableKey, setProjectVariableKey] = useState<string>("");

  // For project secret type
  const [projectSecretKey, setProjectSecretKey] = useState<string>("");

  // For primitive types
  const [stringValue, setStringValue] = useState<string>("");
  const [numberValue, setNumberValue] = useState<number>(0);
  const [booleanValue, setBooleanValue] = useState<boolean>(false);

  const ide = useIde();
  const projectVariables = useProjectVariables();
  const { environmentId } = useActiveEnvironment();
  const { variables: envVariables } = useVariables(environmentId);
  

  // Available files for pointers
  const availableFiles = Object.entries(ide.files || {}).map(([id, file]) => ({
    id,
    path: (file as FileManifest).path,
    hasOutput: Boolean((file as FileManifest).mapping.output),
  }));

  // Filter project variables by type for autocomplete
  const availableVariables = projectVariables.filter(
    (v) => v.type === "variable",
  );
  const availableSecrets = projectVariables.filter((v) => v.type === "secret");

  // Prepare a value based on the current state
  const prepareValue = useCallback(() => {
    let newValue: any;

    switch (type) {
      case "string":
        newValue = stringValue;
        break;
      case "number":
        newValue = numberValue;
        break;
      case "boolean":
        newValue = booleanValue;
        break;
      case "null":
        newValue = null;
        break;
      case "object":
        newValue = {};
        break;
      case "array":
        newValue = [];
        break;
      case "pointer":
        newValue = {
          internal: "pointer",
          type: "json",
          id: pointerId,
          path: pointerPath,
        } as Pointer;
        break;
      case "parameter":
        newValue = {
          internal: "parameter",
          id: parameterId,
          name: parameterName,
          schema: { type: "string" },
        } as Parameter<string>;
        break;
      case "from-data":
        newValue = {
          internal: "from-data",
          path: fromDataPath,
          schema: { type: "string" },
        } as FromData<string>;
        break;
      case "project-variable":
        newValue = {
          internal: "project-variable",
          key: projectVariableKey,
          // Always use current environment
          environmentId: environmentId,
        } as ProjectVariable;
        break;
      case "project-secret":
        newValue = {
          internal: "project-secret",
          key: projectSecretKey,
          // Always use current environment
          environmentId: environmentId,
        } as ProjectSecret;
        break;
      default:
        newValue = null;
    }

    return newValue;
  }, [
    type,
    stringValue,
    numberValue,
    booleanValue,
    pointerId,
    pointerPath,
    parameterId,
    parameterName,
    fromDataPath,
    projectVariableKey,
    projectSecretKey,
    environmentId,
  ]);

  // Update the parent component when form values change
  const updateValue = useCallback(() => {
    const newValue = prepareValue();

    // Only call onChange if the value has actually changed
    if (JSON.stringify(currentValueRef.current) !== JSON.stringify(newValue)) {
      currentValueRef.current = newValue;
      onChange(newValue);
    }
  }, [onChange, prepareValue]);
  

  // Initialize the form values from the input value
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    // Update the current value ref to avoid unnecessary updates
    currentValueRef.current = value;

    if (value === null) {
      setType("null");
    } else if (typeof value === "string") {
      setType("string");
      setStringValue(value);
    } else if (typeof value === "number") {
      setType("number");
      setNumberValue(value);
    } else if (typeof value === "boolean") {
      setType("boolean");
      setBooleanValue(value);
    } else if (typeof value === "object" && value !== null) {
      if ("internal" in value) {
        const internalValue = value as InternalTypes<any>;
        setType(internalValue.internal);

        if (internalValue.internal === "pointer") {
          const pointerValue = internalValue as Pointer;
          setPointerId(pointerValue.id);
          setPointerPath(pointerValue.path);
        } else if (internalValue.internal === "parameter") {
          const parameterValue = internalValue as Parameter<any>;
          setParameterId(parameterValue.id);
          setParameterName(parameterValue.name);
        } else if (internalValue.internal === "from-data") {
          const fromDataValue = internalValue as FromData<any>;
          setFromDataPath(fromDataValue.path);
        } else if (internalValue.internal === "project-variable") {
          const projectVarValue = internalValue as ProjectVariable;
          setProjectVariableKey(projectVarValue.key);
        } else if (internalValue.internal === "project-secret") {
          const projectSecretValue = internalValue as ProjectSecret;
          setProjectSecretKey(projectSecretValue.key);
        }
      } else if (Array.isArray(value)) {
        setType("array");
      } else {
        setType("object");
      }
    }
  }, [value]);

  const handleTypeChange = useCallback(
    (newType: string) => {
      setType(newType);

      // Immediately create and provide a default value based on the new type
      let defaultValue: any;

      switch (newType) {
        case "string":
          setStringValue("");
          defaultValue = "";
          break;
        case "number":
          setNumberValue(0);
          defaultValue = 0;
          break;
        case "boolean":
          setBooleanValue(false);
          defaultValue = false;
          break;
        case "null":
          defaultValue = null;
          break;
        case "object":
          defaultValue = {};
          break;
        case "array":
          defaultValue = [];
          break;
        case "pointer":
          setPointerId("");
          setPointerPath("");
          defaultValue = {
            internal: "pointer",
            type: "json",
            id: "",
            path: "",
          };
          break;
        case "parameter":
          setParameterId("");
          setParameterName("");
          defaultValue = {
            internal: "parameter",
            id: "",
            name: "",
            schema: { type: "string" },
          };
          break;
        case "from-data":
          setFromDataPath("");
          defaultValue = {
            internal: "from-data",
            path: "",
            schema: { type: "string" },
          };
          break;
        case "project-variable":
          setProjectVariableKey("");
          defaultValue = {
            internal: "project-variable",
            key: "",
            environmentId: environmentId,
          };
          break;
        case "project-secret":
          setProjectSecretKey("");
          defaultValue = {
            internal: "project-secret",
            key: "",
            environmentId: environmentId,
          };
          break;
      }

      // Update the current value reference and trigger change
      currentValueRef.current = defaultValue;
      onChange(defaultValue);
    },
    [onChange, environmentId],
  );

  // Handler for string input changes
  const handleStringChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStringValue(e.target.value);
      // Immediately update the parent with the new value
      onChange(e.target.value);
    },
    [onChange],
  );

  // Handler for number input changes
  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number.parseFloat(e.target.value) || 0;
      setNumberValue(newValue);
      onChange(newValue);
    },
    [onChange],
  );

  // Handler for boolean switch changes
  const handleBooleanChange = useCallback(
    (checked: boolean) => {
      setBooleanValue(checked);
      onChange(checked);
    },
    [onChange],
  );

  // Handler for pointer ID selection
  const handlePointerIdChange = useCallback(
    (value: string) => {
      setPointerId(value);

      // Update the value immediately
      const newPointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: value,
        path: pointerPath,
      };

      currentValueRef.current = newPointer;
      onChange(newPointer);
    },
    [onChange, pointerPath],
  );

  // Handler for pointer path changes
  const handlePointerPathChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPath = e.target.value;
      setPointerPath(newPath);

      // Update the value immediately
      const newPointer: Pointer = {
        internal: "pointer",
        type: "json",
        id: pointerId,
        path: newPath,
      };

      currentValueRef.current = newPointer;
      onChange(newPointer);
    },
    [onChange, pointerId],
  );

  // Handler for parameter ID changes
  const handleParameterIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newId = e.target.value;
      setParameterId(newId);

      const newParameter: Parameter<string> = {
        internal: "parameter",
        id: newId,
        name: parameterName,
        schema: { type: "string" },
      };

      currentValueRef.current = newParameter;
      onChange(newParameter);
    },
    [onChange, parameterName],
  );

  // Handler for parameter name changes
  const handleParameterNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      setParameterName(newName);

      const newParameter: Parameter<string> = {
        internal: "parameter",
        id: parameterId,
        name: newName,
        schema: { type: "string" },
      };

      currentValueRef.current = newParameter;
      onChange(newParameter);
    },
    [onChange, parameterId],
  );

  // Handler for from-data path changes
  const handleFromDataPathChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPath = e.target.value;
      setFromDataPath(newPath);

      const newFromData: FromData<string> = {
        internal: "from-data",
        path: newPath,
        schema: { type: "string" },
      };

      currentValueRef.current = newFromData;
      onChange(newFromData);
    },
    [onChange],
  );

  // Handler for project variable key changes
  const handleProjectVariableKeyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newKey = e.target.value;
      setProjectVariableKey(newKey);

      const newProjectVariable: ProjectVariable = {
        internal: "project-variable",
        key: newKey,
        environmentId: environmentId,
      };

      currentValueRef.current = newProjectVariable;
      onChange(newProjectVariable);
    },
    [onChange, environmentId],
  );

  // Handler for project secret key changes
  const handleProjectSecretKeyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newKey = e.target.value;
      setProjectSecretKey(newKey);

      const newProjectSecret: ProjectSecret = {
        internal: "project-secret",
        key: newKey,
        environmentId: environmentId,
      };

      currentValueRef.current = newProjectSecret;
      onChange(newProjectSecret);
    },
    [onChange, environmentId],
  );

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <div className="flex items-center justify-between">
        <div className="text-sm font-medium flex items-center">
          <span className="mr-1">Path:</span>
          <code className="bg-muted px-1 rounded text-xs">{name}</code>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-1 cursor-help">
                  <Info className="h-3 w-3 text-muted-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[220px] text-xs">
                  This path will be accessible in the manifest at
                  mapping.input/output.variables.{name}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-[120px] justify-between"
            >
              {DATA_TYPES.find((t) => t.value === type)?.label || "Type"}
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {DATA_TYPES.map((dataType) => (
              <DropdownMenuItem
                key={dataType.value}
                onClick={() => handleTypeChange(dataType.value)}
              >
                {dataType.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dynamic form based on the selected type */}
      <div className="pl-4 border-l-2 border-muted mt-2">
        {type === "string" && (
          <IntelligentVariableInput
            placeholder="String value (use {{variable}} for variables)"
            value={stringValue}
            onChange={(value) => {
              setStringValue(value);
              onChange(value);
            }}
            variables={(() => {
              // Use environment variables from the current environment
              const vars: Record<string, any> = {};

              // Add environment variables if available
              if (envVariables && Array.isArray(envVariables)) {
                for (const v of envVariables) {
                  if (v.type === "variable") {
                    vars[v.key] = v.value;
                  } else if (v.type === "secret") {
                    // Always show *** for secrets
                    vars[v.key] = "***";
                  }
                }
              }

              return vars;
            })()}
            onVariableClick={(varName) => {
              // Optional: Show variable info when clicked
              console.log("Variable clicked:", varName);
            }}
          />
        )}

        {type === "number" && (
          <Input
            type="number"
            placeholder="Number value"
            value={numberValue}
            onChange={handleNumberChange}
          />
        )}

        {type === "boolean" && (
          <div className="flex items-center space-x-2">
            <Switch
              id={`boolean-${name}`}
              checked={booleanValue}
              onCheckedChange={handleBooleanChange}
            />
            <Label htmlFor={`boolean-${name}`}>
              {booleanValue ? "True" : "False"}
            </Label>
          </div>
        )}

        {type === "pointer" && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <Label>Link to file output:</Label>
            </div>
            <Select value={pointerId} onValueChange={handlePointerIdChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a file" />
              </SelectTrigger>
              <SelectContent>
                {availableFiles
                  .filter((file) => file.hasOutput)
                  .map((file) => (
                    <SelectItem key={file.id} value={file.id}>
                      {file.path}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {pointerId ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-muted-foreground">
                    Output Variable Path:
                  </div>
                </div>
                <JsonPathAutocomplete
                  fileId={pointerId}
                  value={pointerPath}
                  onChange={(path) =>
                    handlePointerPathChange({
                      target: { value: path },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                  placeholder="Select or type a path (e.g., 'variables/data')"
                />
              </>
            ) : (
              <IntelligentVariableInput
                placeholder="JSON Path (e.g., 'variables/data' or '{{env}}/data')"
                value={pointerPath}
                onChange={(value) => {
                  setPointerPath(value);
                  const newPointer: Pointer = {
                    internal: "pointer",
                    type: "json",
                    id: pointerId,
                    path: value,
                  };
                  currentValueRef.current = newPointer;
                  onChange(newPointer);
                }}
                disabled={!pointerId}
                variables={(() => {
                  const vars: Record<string, any> = {};
                  if (envVariables && Array.isArray(envVariables)) {
                    for (const v of envVariables) {
                      if (v.type === "variable") {
                        vars[v.key] = v.value;
                      } else if (v.type === "secret") {
                        vars[v.key] = "***";
                      }
                    }
                  }
                  return vars;
                })()}
              />
            )}
          </div>
        )}

        {type === "parameter" && (
          <div className="space-y-2">
            <Input
              placeholder="Parameter ID"
              value={parameterId}
              onChange={handleParameterIdChange}
            />
            <Input
              placeholder="Parameter Name"
              value={parameterName}
              onChange={handleParameterNameChange}
            />
          </div>
        )}

        {type === "from-data" && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-1">
              <div className="text-xs text-muted-foreground">
                References internal data from the current file
              </div>
            </div>
            <IntelligentVariableInput
              placeholder="FromData Path (e.g., 'data/items' or '{{variable}}/items')"
              value={fromDataPath}
              onChange={(value) => {
                setFromDataPath(value);
                const newFromData: FromData<string> = {
                  internal: "from-data",
                  path: value,
                  schema: { type: "string" },
                };
                currentValueRef.current = newFromData;
                onChange(newFromData);
              }}
              variables={(() => {
                const vars: Record<string, any> = {};
                if (envVariables && Array.isArray(envVariables)) {
                  for (const v of envVariables) {
                    if (v.type === "variable") {
                      vars[v.key] = v.value;
                    } else if (v.type === "secret") {
                      vars[v.key] = "***";
                    }
                  }
                }
                return vars;
              })()}
            />
          </div>
        )}

        {type === "project-variable" && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-1">
              <div className="text-xs text-muted-foreground">
                References a project-level variable from the current environment
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Variable Key (e.g., 'API_HOST')"
                value={projectVariableKey}
                onChange={handleProjectVariableKeyChange}
                className="flex-1"
              />
              {envVariables &&
                Array.isArray(envVariables) &&
                envVariables.filter((v) => v.type === "variable").length >
                  0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {envVariables
                        .filter((v) => v.type === "variable")
                        .map((variable) => (
                          <DropdownMenuItem
                            key={variable.key}
                            onClick={() => {
                              setProjectVariableKey(variable.key);
                              handleProjectVariableKeyChange({
                                target: { value: variable.key },
                              } as React.ChangeEvent<HTMLInputElement>);
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {variable.key}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {variable.source}
                              </span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </div>
          </div>
        )}

        {type === "project-secret" && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-1">
              <div className="text-xs text-muted-foreground">
                References a project-level secret from the current environment
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Secret Key (e.g., 'API_TOKEN')"
                value={projectSecretKey}
                onChange={handleProjectSecretKeyChange}
                className="flex-1"
              />
              {envVariables &&
                Array.isArray(envVariables) &&
                envVariables.filter((v) => v.type === "secret").length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {envVariables
                        .filter((v) => v.type === "secret")
                        .map((secret) => (
                          <DropdownMenuItem
                            key={secret.key}
                            onClick={() => {
                              setProjectSecretKey(secret.key);
                              handleProjectSecretKeyChange({
                                target: { value: secret.key },
                              } as React.ChangeEvent<HTMLInputElement>);
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{secret.key}</span>
                              <span className="text-xs text-muted-foreground">
                                {secret.source}
                              </span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
