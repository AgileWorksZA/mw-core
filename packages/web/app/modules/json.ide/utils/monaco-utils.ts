import type * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import type { JsonSchema } from "../types";
import { jsonArtifactLogger } from "./logger";

/**
 * Configures JSON language features with schema support
 *
 * @param editor Monaco editor instance
 * @param schema JSON Schema object
 */
export function configureJsonSchema(
  editor: typeof monaco,
  schema?: JsonSchema,
) {
  try {
    const diagnosticsOptions: monaco.languages.json.DiagnosticsOptions = {
      validate: true,
      allowComments: false,
      schemas: [],
      enableSchemaRequest: true,
      // Enable format options
      format: {
        enable: true,
        tabSize: 2,
        insertSpaces: true,
      },
    };

    // Only add schema if we have a valid one
    if (schema && Object.keys(schema).length > 0) {
      // Add the schema for validation and intellisense
      diagnosticsOptions.schemas = [
        {
          uri: "http://artifact-schema.json",
          fileMatch: ["*"],
          schema,
        },
      ];

      jsonArtifactLogger.debug("Configured JSON schema for Monaco editor", {
        schemaId: schema.$id || "unknown",
      });
    } else {
      jsonArtifactLogger.debug("No JSON schema provided for Monaco editor");
    }

    // Apply the configuration
    editor.languages.json.jsonDefaults.setDiagnosticsOptions(
      diagnosticsOptions,
    );
  } catch (error) {
    jsonArtifactLogger.error(
      "Failed to configure JSON schema for Monaco editor",
      error,
    );
  }
}

/**
 * Register custom JSON completion providers for enhanced intellisense
 *
 * @param monaco Monaco editor instance
 * @param schema JSON Schema object
 */
export function registerCustomCompletionProvider(
  monaco: typeof window.monaco,
  schema?: JsonSchema,
) {
  try {
    if (!schema) return;

    // Register a completion item provider for JSON
    const disposable = monaco.languages.registerCompletionItemProvider("json", {
      provideCompletionItems: (model, position) => {
        // Get text before cursor
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        // Detect if we're in a property name or value context
        const isPropertyName = /[{,]\s*"([^"]*)?$/.test(textUntilPosition);
        const isPropertyValue = /[{,]\s*"[^"]*"\s*:\s*([^,}]*)$/.test(
          textUntilPosition,
        );

        // Create suggestions based on context
        const suggestions: monaco.languages.CompletionItem[] = [];

        // If typing a property name, suggest from schema properties
        if (isPropertyName && schema.properties) {
          for (const propName in schema.properties) {
            const property = schema.properties[propName];
            const propertyDescription =
              property.description || `Type: ${property.type || "any"}`;

            suggestions.push({
              label: propName,
              kind: monaco.languages.CompletionItemKind.Property,
              documentation: propertyDescription,
              insertText: `"${propName}": `,
              detail: (property.type as string) || "Property",
            });
          }
        }

        // If typing a property value, suggest based on property type
        if (isPropertyValue && schema.properties) {
          // Extract property name from text before cursor
          const propertyMatch = textUntilPosition.match(
            /[{,]\s*"([^"]*)"\s*:\s*([^,}]*)$/,
          );
          if (propertyMatch && propertyMatch[1]) {
            const propertyName = propertyMatch[1];
            const property = schema.properties[propertyName];

            if (property) {
              if (property.enum) {
                // For enum properties, suggest enum values
                for (const enumValue of property.enum) {
                  const value =
                    typeof enumValue === "string"
                      ? `"${enumValue}"`
                      : String(enumValue);
                  suggestions.push({
                    label: String(enumValue),
                    kind: monaco.languages.CompletionItemKind.Value,
                    documentation: `Enum value for ${propertyName}`,
                    insertText: value,
                    detail: "Enum Value",
                  });
                }
              } else if (property.type === "boolean") {
                // For boolean properties, suggest true/false
                suggestions.push(
                  {
                    label: "true",
                    kind: monaco.languages.CompletionItemKind.Value,
                    insertText: "true",
                    detail: "Boolean",
                  },
                  {
                    label: "false",
                    kind: monaco.languages.CompletionItemKind.Value,
                    insertText: "false",
                    detail: "Boolean",
                  },
                );
              } else if (property.type === "object" && property.properties) {
                // For object properties, suggest template
                const objectTemplate = JSON.stringify(
                  {
                    ...Object.fromEntries(
                      Object.entries(property.properties).map(([k, v]) => [
                        k,
                        getDefaultValueForType((v as any).type),
                      ]),
                    ),
                  },
                  null,
                  2,
                );

                suggestions.push({
                  label: "object",
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  documentation: "Object template",
                  insertText: objectTemplate,
                  detail: "Object Template",
                });
              } else if (property.type === "array" && property.items) {
                // For array properties, suggest empty array or template
                const itemType = (property.items as any).type;
                const emptyArray = "[]";

                suggestions.push({
                  label: "array",
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  documentation: "Empty array",
                  insertText: emptyArray,
                  detail: "Array",
                });

                if (itemType) {
                  const arrayTemplate = JSON.stringify(
                    [getDefaultValueForType(itemType)],
                    null,
                    2,
                  );
                  suggestions.push({
                    label: "array with item",
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    documentation: `Array with ${itemType} item`,
                    insertText: arrayTemplate,
                    detail: "Array Template",
                  });
                }
              }
            }
          }
        }

        return { suggestions };
      },
    });

    // Return disposable to allow for cleanup
    return disposable;
  } catch (error) {
    jsonArtifactLogger.error(
      "Failed to register JSON completion provider",
      error,
    );
    return null;
  }
}

/**
 * Register JSON hover provider for showing schema information on hover
 *
 * @param monaco Monaco editor instance
 * @param schema JSON Schema object
 */
export function registerHoverProvider(
  monaco: typeof window.monaco,
  schema?: JsonSchema,
) {
  try {
    if (!schema) return;

    const disposable = monaco.languages.registerHoverProvider("json", {
      provideHover: (model, position) => {
        try {
          // Get current line text
          const lineContent = model.getLineContent(position.lineNumber);

          // Check if hovering over a property name
          const propertyMatch = lineContent.match(/"([^"]+)"\s*:/);
          if (propertyMatch) {
            const propertyName = propertyMatch[1];

            // Find property in schema
            if (schema.properties && schema.properties[propertyName]) {
              const property = schema.properties[propertyName];

              // Build hover content
              const contents = [
                { value: `**${propertyName}**` },
                { value: property.description || "No description available" },
                { value: `Type: \`${property.type || "any"}\`` },
              ];

              // Add enum values if present
              if (property.enum) {
                contents.push({
                  value: `Allowed values: ${property.enum.map((v) => `\`${v}\``).join(", ")}`,
                });
              }

              // Add format if present
              if (property.format) {
                contents.push({ value: `Format: \`${property.format}\`` });
              }

              return {
                contents,
                range: {
                  startLineNumber: position.lineNumber,
                  startColumn: lineContent.indexOf(propertyMatch[0]) + 1,
                  endLineNumber: position.lineNumber,
                  endColumn:
                    lineContent.indexOf(propertyMatch[0]) +
                    propertyMatch[0].length +
                    1,
                },
              };
            }
          }
        } catch (error) {
          jsonArtifactLogger.error("Error in hover provider", error);
        }

        return null;
      },
    });

    return disposable;
  } catch (error) {
    jsonArtifactLogger.error("Failed to register JSON hover provider", error);
    return null;
  }
}

/**
 * Get default value for a JSON Schema type
 *
 * @param type Schema type
 * @returns Default value for the type
 */
function getDefaultValueForType(type: string): any {
  switch (type) {
    case "string":
      return "";
    case "number":
      return 0;
    case "integer":
      return 0;
    case "boolean":
      return false;
    case "object":
      return {};
    case "array":
      return [];
    case "null":
      return null;
    default:
      return "";
  }
}
