import React, { useRef, useEffect } from "react";
import { Editor, type OnMount, type OnChange } from "@monaco-editor/react";
import type * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import type { JsonSchema } from "../types";
import {
  configureJsonSchema,
  registerCustomCompletionProvider,
  registerHoverProvider,
} from "../utils/monaco-utils";
import { jsonArtifactLogger } from "../utils/logger";
import { useMemo } from "react";
import { useResolvedTheme } from "~/modules/theme-preferences/hooks";

interface MonacoJsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (errors: any[]) => void;
  onSave?: () => void;
  height?: string;
  readOnly?: boolean;
  schema?: JsonSchema;
}

export function MonacoJsonEditor({
  value,
  onChange,
  onValidate,
  onSave,
  height = "400px",
  readOnly = false,
  schema,
}: MonacoJsonEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monaco | null>(null);

  // Keep track of disposables for cleanup
  const disposablesRef = useRef<monaco.IDisposable[]>([]);
  const theme = useResolvedTheme();

  // Detect theme changes
  const monacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: theme === "light" ? "vs" : "vs-dark",
    language: "json",
    formatOnPaste: true,
    formatOnType: true,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on",
    scrollBeyondLastLine: false,
    wordWrap: "on",
    folding: true,
    renderWhitespace: "selection",
    suggestOnTriggerCharacters: true,
    // Enable quick suggestions for better intellisense
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true,
    },
    // Show parameter hints
    parameterHints: {
      enabled: true,
    },
    // Show inline suggestions
    inlineSuggest: {
      enabled: true,
    },
    suggest: {
      showProperties: true,
      showValues: true,
      showClasses: false,
      showFunctions: false,
      showInlineDetails: true,
      filterGraceful: true,
    },
    // Enable hover
    hover: {
      enabled: true,
      delay: 300,
    },
    readOnly,
    overviewRulerLanes: 0,
    renderLineHighlight: "all",
    scrollbar: {
      vertical: "auto",
      horizontal: "auto",
      useShadows: false,
      verticalHasArrows: false,
      horizontalHasArrows: false,
    },
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    jsonArtifactLogger.debug("Monaco editor mounted");

    // Set up schemas for intellisense and validation
    configureJsonSchema(monaco, schema);

    // Add keyboard shortcut for save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
    });

    // Set up validation error handler
    const markersDisposable = monaco.editor.onDidChangeMarkers(() => {
      const model = editor.getModel();
      if (model) {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        onValidate?.(markers);
      }
    });

    // Add markers disposable to cleanup list
    disposablesRef.current.push(markersDisposable);

    // Register enhanced intellisense providers
    setupIntellisenseProviders(monaco, schema);
  };

  // Set up all intellisense providers for the editor
  const setupIntellisenseProviders = useMemo(
    () => (editor: typeof monaco, schema?: JsonSchema) => {
      try {
        // Clean up any existing disposables
        for (const d of disposablesRef.current) {
          d.dispose();
        }
        disposablesRef.current = [];

        // Only set up providers if we have a schema
        if (schema && Object.keys(schema).length > 0) {
          // Register custom completion provider
          const completionProvider = registerCustomCompletionProvider(
            editor,
            schema,
          );
          if (completionProvider) {
            disposablesRef.current.push(completionProvider);
          }

          // Register hover provider
          const hoverProvider = registerHoverProvider(editor, schema);
          if (hoverProvider) {
            disposablesRef.current.push(hoverProvider);
          }

          jsonArtifactLogger.debug("Monaco intellisense providers registered");
        }
      } catch (error) {
        jsonArtifactLogger.error(
          "Failed to setup intellisense providers",
          error,
        );
      }
    },
    [],
  );

  const handleChange: OnChange = (newValue) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    // Update schema if it changes
    if (monacoRef.current) {
      configureJsonSchema(monacoRef.current, schema);

      // Update intellisense providers
      setupIntellisenseProviders(monacoRef.current, schema);
    }
  }, [schema, setupIntellisenseProviders]);

  // Clean up disposables on unmount
  useEffect(() => {
    return () => {
      for (const d of disposablesRef.current) {
        d.dispose();
      }
      disposablesRef.current = [];
    };
  }, []);

  useEffect(() => {
    // Update theme when it changes
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(theme);
    }
  }, [theme]);

  return (
    <div style={{ height, width: "100%" }} className="border rounded-md">
      <Editor
        value={value}
        onChange={handleChange}
        onMount={handleEditorMount}
        options={monacoOptions}
        defaultLanguage="json"
        theme={theme === "light" ? "vs" : "vs-dark"}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Loading editor...</div>
          </div>
        }
      />
    </div>
  );
}
