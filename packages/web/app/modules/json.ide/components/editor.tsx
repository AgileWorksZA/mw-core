import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useJsonFileTrigger } from "~/modules/json.ide/hooks/use-json-file-trigger";
import { useJsonFileSelector } from "~/modules/json.ide/hooks/use-json-file-selector";
import { MonacoJsonEditor } from "./monaco-json-editor";
import { SchemaValidator, useSchemaValidation } from "./schema-validator";
import { Button } from "~/components/ui/button";
import { Info, FileJson } from "lucide-react";
import type { JsonEditEvent, JsonObject, ValidationResult } from "../types";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { KeyboardShortcutsButton } from "./keyboard-shortcuts";
import { JsonPathQuery } from "./json-path-query";
import { JsonDiffViewer } from "./json-diff";
import { EditHistoryViewer } from "./edit-history";
import { applyJsonEdit } from "../utils/edit-events";
import { useManifest } from "~/modules/ide/hooks/use-manifest";

export function Editor() {
  const manifest = useManifest();
  const json = useJsonFileSelector((state) => state.context.data);
  const schema = useJsonFileSelector((state) => state.context.schema);
  const trigger = useJsonFileTrigger();
  const [error, setError] = useState<string | null>(null);
  const [showSchemaValidation, setShowSchemaValidation] =
    useState<boolean>(false);

  // Store original JSON for diff comparison
  const [originalJson, setOriginalJson] = useState<JsonObject>({});

  // State for the JSON string representation
  const [jsonString, setJsonString] = useState<string>(
    JSON.stringify(json, null, 2),
  );

  // Update JSON string when manifest ID changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setJsonString(JSON.stringify(json, null, 2));

    // Set original JSON when loading a new manifest
    if (Object.keys(originalJson).length === 0) {
      setOriginalJson(JSON.parse(JSON.stringify(json)));
    }
  }, [manifest.id]);

  const [parseErrors, setParseErrors] = useState<any[]>([]);

  // Get the full context to see all available fields
  const fullContext = useJsonFileSelector((state) => state.context);

  // Get schema validation result
  const validationResult = useSchemaValidation(json, schema);

  // Track if schema is available
  const hasSchema = !!schema && Object.keys(schema).length > 0;

  // Update JSON data in the state
  //
  // ⚠️ CRITICAL: This function must preserve store-kit integration
  // - Never modify newData before passing to trigger.update()
  // - Edit events are for logging only, not data transformation
  // - All persistence is handled by store-kit automatically
  const updateJsonData = useCallback(
    (newData: JsonObject, editEvent?: JsonEditEvent) => {
      // If an edit event is provided, log it (but don't modify the data)
      if (editEvent) {
        // Just log the edit event for tracking/history purposes
        applyJsonEdit(json, editEvent);
      }

      // Update the store directly through trigger with the entire context
      // This triggers store-kit's automatic persistence
      const completeContext = {
        ...fullContext, // Start with the full context structure
        data: newData, // Use the newData directly as provided - NO MODIFICATIONS
      };

      trigger.update({
        context: completeContext,
      });
    },
    [trigger, fullContext, json],
  );

  // Handle JSON editor changes (code view)
  const handleCodeChange = useCallback(
    (newContent: string) => {
      setJsonString(newContent);

      try {
        // Parse the JSON
        const parsedData = JSON.parse(newContent);
        setParseErrors([]);

        // Update store state
        updateJsonData(parsedData);
      } catch (err) {
        // Only update errors, don't update state on parse error
        const parseError = {
          message: err instanceof Error ? err.message : "Invalid JSON",
          severity: 8, // Error severity in Monaco
        };
        setParseErrors([parseError]);
      }
    },
    [updateJsonData],
  );

  // Handle validation errors from Monaco
  const handleValidate = useCallback(
    (errors: any[]) => {
      if (errors.length > 0) {
        const firstError = errors[0];
        setError(`Line ${firstError.startLineNumber}: ${firstError.message}`);
      } else if (parseErrors.length > 0) {
        setError(parseErrors[0].message);
      } else {
        setError(null);
      }
    },
    [parseErrors],
  );

  // Handle validation result
  const handleValidationResult = useCallback((result: ValidationResult) => {
    // We could use this to show error indicators in the editor
    // This is intentionally left empty as we don't need to log validation results
  }, []);

  // Toggle schema validation panel
  const toggleSchemaValidation = useCallback(() => {
    setShowSchemaValidation((prev) => !prev);
  }, []);

  // Handle JSON path selection
  const handleJsonPathSelect = useCallback((path: string) => {
    // This could be used to highlight the selected path in the editor
    // or to select/focus the corresponding field in the visual editor
    // For now we just show the selection
    alert(`Path selected: ${path}`);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>JSON Artifact Editor</CardTitle>
          <CardDescription>Edit your JSON content</CardDescription>
        </div>
        {hasSchema && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSchemaValidation}
            className={
              validationResult.valid ? "text-green-600" : "text-red-600"
            }
          >
            <FileJson className="mr-2 h-4 w-4" />
            Schema {validationResult.valid ? "Valid" : "Invalid"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {hasSchema && showSchemaValidation && (
          <SchemaValidator
            data={json}
            schema={schema}
            onValidationResult={handleValidationResult}
            className="mb-4"
          />
        )}

        {!hasSchema && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              No JSON Schema defined. Schema validation is disabled.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-4">
          <JsonPathQuery data={json} onPathSelect={handleJsonPathSelect} />
        </div>

        <div className="flex justify-end mb-2 gap-2">
          <JsonDiffViewer currentJson={json} originalJson={originalJson} />
          <EditHistoryViewer />
          <KeyboardShortcutsButton />
        </div>

        <div className="relative">
          <MonacoJsonEditor
            value={jsonString}
            onChange={handleCodeChange}
            onValidate={handleValidate}
            height="500px"
            schema={schema}
          />
          {error && (
            <div className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 text-xs text-muted-foreground rounded-b-lg">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <span>Path: {manifest.path}</span>
            <span>Type: {manifest.type}</span>
          </div>
          <div className="mt-1">ID: {manifest.id}</div>
        </div>
      </CardFooter>
    </Card>
  );
}
