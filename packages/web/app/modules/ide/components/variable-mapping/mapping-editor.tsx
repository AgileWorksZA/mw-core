import { useEffect, useState } from "react";
import { ArrowRightLeft, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type {
  InputVariables,
  OutputVariables,
  PublicMapping,
} from "~/modules/ide/types";
import { validatePointers } from "~/modules/ide/utils/detect-circular-dependencies";
import { VariableList } from "./variable-list";
import { useManifest } from "~/modules/ide/hooks/use-manifest";
import { useIdeTrigger } from "~/modules/ide/hooks/use-ide-trigger";
import { useIde } from "~/modules/ide/hooks/use-ide";

interface MappingEditorProps {
  onUpdate?: () => void;
}

export function MappingEditor({ onUpdate }: MappingEditorProps) {
  const manifest = useManifest();
  const trigger = useIdeTrigger();
  const ide = useIde();

  const [activeTab, setActiveTab] = useState("input");
  const [useInputAsOutput, setUseInputAsOutput] = useState<boolean>(
    manifest.mapping.output.variables === true,
  );

  const [inputVariables, setInputVariables] = useState<Record<string, any>>(
    (manifest.mapping.input?.variables as Record<string, any>) || {},
  );

  const [outputVariables, setOutputVariables] = useState<Record<string, any>>(
    manifest.mapping.output.variables === true ||
      manifest.mapping.output.variables === false
      ? {}
      : ((manifest.mapping.output as OutputVariables<any>)?.variables as Record<
          string,
          any
        >) || {},
  );

  const [validationErrors, setValidationErrors] = useState<
    Array<{ error: string }>
  >([]);

  // Update manifest when variables change
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const input: InputVariables<any> = {
      variables: inputVariables,
    };

    let output: boolean | OutputVariables<any>;

    if (useInputAsOutput) {
      output = {
        variables: true,
      };
    } else {
      output = {
        variables: outputVariables,
      };
    }

    const newMapping: PublicMapping<any, any> = {
      input,
      output,
    };

    // Check for circular dependencies and other validation errors
    const errors = validatePointers(
      input.variables,
      manifest.id,
      ide.files || {},
    );

    setValidationErrors(errors);

    // Only update if there's an actual difference in mapping
    const currentMapping = manifest.mapping;
    const isInputDifferent =
      JSON.stringify(currentMapping.input) !== JSON.stringify(input);
    const isOutputDifferent =
      JSON.stringify(currentMapping.output) !== JSON.stringify(output);

    if (errors.length === 0 && (isInputDifferent || isOutputDifferent)) {
      // Update the manifest with the new mapping
      trigger.update({
        context: {
          files: {
            ...ide.files,
            [manifest.id]: {
              ...manifest,
              mapping: newMapping,
            },
          },
        },
      });

      if (onUpdate) {
        onUpdate();
      }
    }
  }, [
    inputVariables,
    outputVariables,
    useInputAsOutput,
    trigger,
    ide,
    onUpdate,
    manifest.id,
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Variable Mapping</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-sm">
                  Define input variables that this file requires and output
                  variables that it exposes to other files. Variables can be
                  simple values, pointers to other files, or special types.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Configure input and output variables for this file
        </CardDescription>
      </CardHeader>
      <CardContent>
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              <ul className="list-disc list-inside">
                {validationErrors.map((error, i) => (
                  <li
                    key={`error-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      i
                    }`}
                  >
                    {error.error}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="input">Input Variables</TabsTrigger>
            <TabsTrigger value="output">Output Variables</TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <VariableList
              variables={inputVariables}
              onChange={setInputVariables}
              title="Input Variables"
            />
          </TabsContent>

          <TabsContent value="output">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-input-as-output"
                  checked={useInputAsOutput}
                  onCheckedChange={setUseInputAsOutput}
                />
                <Label
                  htmlFor="use-input-as-output"
                  className="flex items-center"
                >
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Use input variables as output
                </Label>
              </div>

              {!useInputAsOutput && (
                <VariableList
                  variables={outputVariables}
                  onChange={setOutputVariables}
                  title="Output Variables"
                />
              )}

              {useInputAsOutput && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">
                      All input variables will be exposed as output variables
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
