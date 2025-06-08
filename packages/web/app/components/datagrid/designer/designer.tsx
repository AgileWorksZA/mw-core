import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { ConsoleLogDrawer } from "~/components/datagrid/data-grid/console-log-drawer";
import { DataGrid } from "~/components/datagrid/data-grid/data-grid";
import { logger } from "~/components/datagrid/data-grid/logger";
import { Button } from "~/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DesignerContext } from "./types";

// Import components
import {
  ApiDocumentation,
  ColumnEditor,
  ColumnGroups,
  EmptyState,
  ExportButton,
  IdeHeader,
  SchemaProperties,
} from "./components";

import type { OpenAPIV3 } from "openapi-types";
import { ColumnCreator } from "~/components/datagrid/designer/components/column-creator";
import { SourceInput } from "~/components/datagrid/designer/components/source-input";
import {
  useDesignerLogs,
  useOpenApiLoader,
  useSchemaProcessing,
} from "./hooks";
import { useDesigner } from "./types";

export function Designer() {
  // Use custom hooks
  const { log, clearLogs } = useDesignerLogs();
  const { url, setUrl, getMethods, loading, error, loadSpec, resetLoader } =
    useOpenApiLoader(useDesigner((state) => state.context.url));

  const { updateSchemaProperties } = useSchemaProcessing();

  // Get state from context
  const paths = useDesigner((state) => state.context.paths);
  const properties = useDesigner((state) => state.context.properties);
  const apiData = useDesigner((state) => state.context.apiData);
  const apiUrl = useDesigner((state) => state.context.apiUrl);

  // Local state
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [loaded, setLoaded] = useState(false);
  const [mockCount, setMockCount] = useState(10);
  const [showColumnCreator, setShowColumnCreator] = useState(true); // Default to Column Creator view

  // Get all the data grid related state
  const columns = useDesigner((state) => state.context.columns);
  console.log({ columns });
  const idField = useDesigner((state) => state.context.idField);
  const designerPagination = useDesigner((state) => state.context.pagination);
  const designerSorting = useDesigner((state) => state.context.sorting);

  // Auto-generate mock data when columns change and no data exists
  // but don't trigger on initial mount
  const firstRenderRef = React.useRef(true);
  const prevColumnsCountRef = React.useRef(columns.length);

  React.useEffect(() => {
    // Skip first render or if selectedMethod is not set
    if (firstRenderRef.current || !selectedMethod) {
      firstRenderRef.current = false;
      prevColumnsCountRef.current = columns.length;
      return;
    }

    // Only trigger if columns increased (user added columns) and no data exists
    if (columns.length > prevColumnsCountRef.current && !apiData) {
      logger.info(
        `Columns increased from ${prevColumnsCountRef.current} to ${columns.length}, generating mock data`,
      );
      const selectedMethodData = getMethods.find(
        (m) => m.fullPath === selectedMethod,
      );
      if (selectedMethodData) {
        // When auto-generating via the useEffect, we should always skip column generation
        // to prevent overriding user-added columns
        handleMockData(selectedMethodData.responseSchema, true);
      }
    }

    // Update previous count
    prevColumnsCountRef.current = columns.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.length, selectedMethod, apiData, getMethods]);

  // We'll move the refs down after the function definitions to avoid initialization order issues

  // Handle loading the API spec
  const handleLoad = useCallback(async () => {
    const result = await loadSpec(log, url);
    if (result && result.methods.length > 0 && methodSelectRef.current) {
      // Auto-select the first method when spec is loaded
      methodSelectRef.current(result.methods[0].fullPath);

      // After a small delay to ensure the method selection is processed
      setTimeout(() => {
        if (result.methods[0] && methodsMockDataRef.current) {
          // Generate mock data for the selected method
          log("Auto-generating mock data for selected method", "info");
          methodsMockDataRef.current(result.methods[0].responseSchema);
        }
      }, 200);
    }
  }, [loadSpec, log, url]);

  // Handle reset
  const handleReset = useCallback(() => {
    // Fully reset the designer context to default state
    DesignerContext.trigger.reset();
    resetLoader();
    clearLogs();
    setSelectedMethod("");
    setLoaded(false);
    logger.clearLogs(); // Clear our logs instead of console

    // Log the reset action
    logger.info("Designer has been reset to initial state");
  }, [resetLoader, clearLogs]);

  // Handle URL change
  const handleUrlChange = useCallback(
    (newUrl: string) => {
      DesignerContext.trigger.update({ update: { url: newUrl } });
      setUrl(newUrl);
    },
    [setUrl],
  );

  // Handle method selection
  const handleMethodSelect = useCallback(
    (fullPath: string) => {
      setSelectedMethod(fullPath);

      const selectedMethodData = getMethods.find(
        (m) => m.fullPath === fullPath,
      );
      if (selectedMethodData) {
        // Set default paths
        const defaultDataPath = "data";
        const defaultPaginationPath = "pagination";

        // Process schema properties with the default data path
        const schemaProperties = updateSchemaProperties(
          selectedMethodData.responseSchema,
          defaultDataPath,
          (errorMsg) => log(errorMsg, "error"),
        );

        // Reset column configuration and data when selecting a new method
        logger.info("Resetting column configuration for new method");

        // Update context with method and schema, reset columns and data
        DesignerContext.trigger.update({
          update: {
            method: fullPath,
            schema: selectedMethodData.responseSchema,
            columns: [], // Reset columns
            apiData: null, // Clear any loaded data
            apiUrl: undefined, // Clear API URL
            idField: undefined, // Reset ID field
            paths: {
              data: defaultDataPath, // Set default data path
              pagination: defaultPaginationPath, // Set default pagination path
            },
            properties: schemaProperties, // Use the processed schema properties
          },
        });

        setLoaded(true);
        log(`Selected method: ${fullPath}`, "info");
      }
    },
    [getMethods, updateSchemaProperties, log],
  );

  // Get documentation from context
  const dataError = useDesigner((state) => state.context.error);

  // Import navigate function from React Router
  const navigate = useNavigate();

  // Handle load data button click
  const handleLoadData = useCallback(() => {
    if (selectedMethod) {
      // Get the base URL for the API
      // Extract base URL from the OpenAPI URL
      // If the URL is http://localhost:3131/swagger/json,
      // we need http://localhost:3131 as the base URL

      // Get the OpenAPI spec URL
      const specUrl = url;
      logger.info("OpenAPI spec URL:", specUrl);

      // Extract the base URL by removing everything after the third slash
      // This gives us the host part of the URL
      let serverUrl = specUrl.split("/").slice(0, 3).join("/");

      logger.info("Extracted base URL from OpenAPI spec URL:", serverUrl);

      // Remove trailing slash if present for clean concatenation
      if (serverUrl.endsWith("/")) {
        serverUrl = serverUrl.slice(0, -1);
      }

      // Combine server URL with the path
      const fullApiUrl = selectedMethod.startsWith("/")
        ? `${serverUrl}${selectedMethod}`
        : `${serverUrl}/${selectedMethod}`;

      logger.info(`Final URL construction:
        - Server URL: ${serverUrl}
        - Selected method: ${selectedMethod}
        - Full API URL: ${fullApiUrl}
      `);

      log(`Navigating to load data from API: ${fullApiUrl}`, "info");

      // Navigate using the URI parameter, which will trigger the loader function
      navigate({
        search: `?uri=${encodeURIComponent(fullApiUrl)}`,
      });
    }
  }, [selectedMethod, navigate, log, url]);

  // Generate mock data based on schema
  // Handle sorting changes
  const handleSortingChange = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (updater: any) => {
      const newSorting =
        typeof updater === "function" ? updater(designerSorting) : updater;
      DesignerContext.trigger.update({
        update: { sorting: newSorting },
      });
    },
    [designerSorting],
  );

  // Handle pagination changes
  const handlePaginationChange = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (updater: any) => {
      const newPagination =
        typeof updater === "function" ? updater(designerPagination) : updater;
      DesignerContext.trigger.update({
        update: { pagination: newPagination },
      });
    },
    [designerPagination],
  );

  // Get the actual data based on the data path
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const getActualData = useCallback((rawData: any, dataPath: string) => {
    if (!rawData) return null;
    if (!dataPath) return rawData;

    const parts = dataPath.split(".");
    let current = rawData;

    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        logger.warn(`Data path "${dataPath}" not found in:`, rawData);
        return null; // Path not found
      }
    }

    return current;
  }, []);

  // Get row ID based on the selected ID field
  const getRowId = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (row: any) => {
      // Use idField if available
      if (idField && row[idField] !== undefined) {
        return String(row[idField]);
      }
      // Fallback to JSON stringified row
      return JSON.stringify(row);
    },
    [idField],
  );

  const handleMockData = useCallback(
    (
      schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
      skipColumnGeneration = false,
    ) => {
      if (!schema) {
        log("No schema available for mock data generation", "error");
        return;
      }

      try {
        log("Generating mock data based on schema...", "info");
        logger.info(`Current data path: "${paths.data}"`);
        logger.info(`Current pagination path: "${paths.pagination}"`);

        // Process schema to get properties based on current data path
        const schemaProperties = updateSchemaProperties(
          schema,
          paths.data,
          (errorMsg) => log(errorMsg, "error"),
        );

        logger.info(
          `Found ${Object.keys(schemaProperties).length} properties for mock data generation`,
        );

        // Generate mock data based on properties
        const mockItems = [];
        for (let i = 0; i < mockCount; i++) {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          const item: Record<string, any> = {};

          // Create mock data for each property
          for (const [key, prop] of Object.entries(schemaProperties)) {
            // Handle union types (e.g. "string | null")
            const types = prop.type.split(" | ");

            // Sometimes union types include "null" which is handled by the nullable property
            const primaryType = types.find((t) => t !== "null") || types[0];

            // Generate appropriate mock value based on property type
            if (prop.nullable && Math.random() < 0.2) {
              // 20% chance of null for nullable fields
              item[key] = null;
              continue;
            }

            switch (primaryType) {
              case "string":
                if (prop.format === "date-time" || prop.format === "date") {
                  item[key] = new Date().toISOString();
                } else if (prop.format === "email") {
                  item[key] = `user${i}@example.com`;
                } else if (prop.format === "uuid") {
                  item[key] =
                    `uuid-${i}-${Math.random().toString(36).substring(2, 10)}`;
                } else if (prop.enum && prop.enum.length > 0) {
                  // Pick a random enum value
                  const randomIndex = Math.floor(
                    Math.random() * prop.enum.length,
                  );
                  item[key] = prop.enum[randomIndex];
                } else {
                  item[key] = `${key}-${i}`;
                }
                break;
              case "number":
              case "integer":
                item[key] = Math.floor(Math.random() * 1000) + i;
                break;
              case "boolean":
                item[key] = Math.random() > 0.5;
                break;
              case "array":
                item[key] = [];
                break;
              case "object":
                item[key] = { id: i };
                break;
              default:
                item[key] = `${key}-${i}`;
            }
          }

          mockItems.push(item);
        }

        // Auto-generate columns only if no columns exist and mock data is available
        // We don't want to override user-created columns

        // Get the current column count directly from context
        logger.info(
          `Current columns count when deciding to auto-generate: ${columns.length}, skipColumnGeneration: ${skipColumnGeneration}`,
        );

        // IMPORTANT: We only auto-generate columns if there are none yet AND we're not explicitly told to skip generation
        let shouldGenerateColumns =
          columns.length === 0 && mockItems.length > 0 && !skipColumnGeneration;

        // If we're explicitly told to skip column generation, respect that
        if (skipColumnGeneration) {
          logger.info(
            "Force skipping auto-generation due to skipColumnGeneration flag",
          );
          shouldGenerateColumns = false;
        }
        // Also skip if we have columns already
        else if (columns.length > 0) {
          logger.info(
            `Skipping auto-generation because ${columns.length} columns already exist`,
          );
          shouldGenerateColumns = false;
        }

        if (shouldGenerateColumns) {
          logger.info(
            "Auto-generating columns based on mock data structure and schema properties",
          );
          const firstItem = mockItems[0];

          // Create intelligent auto columns with sensible defaults by data type
          const autoColumns = Object.keys(firstItem).map((key) => {
            const propMeta = schemaProperties[key];
            const dataType = propMeta?.type || typeof firstItem[key];
            const isRequired = propMeta?.required || false;

            // Set sensible defaults based on type
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            const columnDef: any = {
              id: key,
              header: key
                .split(/(?=[A-Z])/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              accessorKey: key,
              enableSorting: true,
              enableColumnFilter: true,
              meta: propMeta || {
                type: dataType,
                required: isRequired,
                nullable: firstItem[key] === null,
                description: `Auto-generated column for ${key}`,
              },
            };

            // Apply type-specific settings
            if (
              dataType === "date" ||
              dataType === "date-time" ||
              dataType.includes("date")
            ) {
              // Add date sorting
              columnDef.sortingFn = "datetime";
            }

            // For numeric types, set appropriate filtering and sorting
            if (dataType === "number" || dataType === "integer") {
              columnDef.sortingFn = "alphanumeric";
            }

            return columnDef;
          });

          // Group related columns together by naming patterns
          const columnGroups = [];
          const patterns = [
            {
              pattern: /^(user|customer|person|employee)/i,
              name: "User Information",
            },
            { pattern: /^(address|location|place)/i, name: "Location" },
            {
              pattern: /(date|time|created|updated|timestamp)/i,
              name: "Dates & Times",
            },
            {
              pattern: /(price|cost|amount|payment|total)/i,
              name: "Financial",
            },
            { pattern: /(status|state|condition)/i, name: "Status" },
          ];

          for (const pattern of patterns) {
            const matchingColumns = autoColumns.filter((col) =>
              pattern.pattern.test(col.accessorKey as string),
            );

            if (matchingColumns.length > 0) {
              const groupId = pattern.name.toLowerCase().replace(/\s+/g, "-");
              const group = {
                id: groupId,
                name: pattern.name,
                description: `Columns related to ${pattern.name.toLowerCase()}`,
              };

              columnGroups.push(group);

              // Assign the group to columns
              for (const col of matchingColumns) {
                if (col.meta) {
                  col.meta.groupId = groupId;
                }
              }
            }
          }

          // Update columns and set ID field if needed
          if (!idField && autoColumns.length > 0) {
            const possibleIdFields = [
              "id",
              "ID",
              "Id",
              "_id",
              "uuid",
              "key",
              "identifier",
              "primary",
            ];
            const bestIdField =
              autoColumns.find((col) =>
                possibleIdFields.includes(col.accessorKey as string),
              ) || autoColumns[0];

            logger.info(
              `Auto-generated ${autoColumns.length} columns with ID field: ${bestIdField.accessorKey}`,
            );
            DesignerContext.trigger.update({
              update: {
                columns: autoColumns,
                columnGroups: columnGroups,
                idField: bestIdField.accessorKey as string,
              },
            });
          } else {
            logger.info(
              `Auto-generated ${autoColumns.length} columns without ID field`,
            );
            DesignerContext.trigger.update({
              update: {
                columns: autoColumns,
                columnGroups: columnGroups,
              },
            });
          }
        }

        // Create the mock data structure according to configuration
        logger.info("Structuring mock data according to configured paths");

        // Start with raw items
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        let mockData: any = mockItems;

        // Structure the data according to the data path
        if (paths.data && paths.data.trim() !== "") {
          logger.info(
            `Creating nested structure for data path: "${paths.data}"`,
          );
          mockData = createNestedObject(paths.data, mockItems);
        } else {
          logger.info("No data path specified, using flat data structure");
        }

        // Add pagination data if path is specified
        if (paths.pagination && paths.pagination.trim() !== "") {
          logger.info(`Adding pagination data at path: "${paths.pagination}"`);
          const paginationData = {
            totalCount: mockCount * 3, // Simulate more data available
            pageSize: mockCount,
            currentPage: 1,
            totalPages: 3,
          };

          // Add pagination at specified path
          mockData = addNestedObject(
            mockData,
            paths.pagination,
            paginationData,
          );
        } else {
          logger.info("No pagination path specified, skipping pagination data");
        }

        // Debug log the structure before adding to context
        logger.info(
          "Generated mock data structure:",
          `${JSON.stringify(mockData).substring(0, 200)}...`,
        );

        // Update the designer context with the mock data
        DesignerContext.trigger.update({
          update: {
            apiData: mockData,
            apiUrl: "mock://data-generator",
            error: null,
          },
        });

        log(`Generated ${mockCount} mock data records`, "info");
      } catch (error) {
        logger.error("Error generating mock data:", error);
        log(
          `Error generating mock data: ${error instanceof Error ? error.message : String(error)}`,
          "error",
        );
      }
    },
    [log, mockCount, paths, updateSchemaProperties, idField, columns.length],
  );

  // Define refs to store function references for use in handleLoad
  const methodSelectRef = React.useRef<null | ((fullPath: string) => void)>(
    null,
  );
  const methodsMockDataRef = React.useRef<
    | null
    | ((
        schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
        skipColumnGeneration?: boolean,
      ) => void)
  >(null);

  // Update the refs whenever dependencies change
  React.useEffect(() => {
    methodSelectRef.current = handleMethodSelect;
  }, [handleMethodSelect]);

  React.useEffect(() => {
    methodsMockDataRef.current = handleMockData;
  }, [handleMockData]);

  // Helper function to create nested objects from a path
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const createNestedObject = (path: string, value: any): any => {
    if (!path || path.trim() === "") {
      logger.info("No data path provided, returning raw value");
      return value;
    }

    logger.info(`Creating nested object with path: "${path}"`);
    const parts = path.split(".");
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const result: Record<string, any> = {};
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = {};
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
    logger.info(`Created nested structure with ${parts.length} levels`);
    return result;
  };

  // Helper function to add a nested object at a specific path
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const addNestedObject = (obj: any, path: string, value: any): any => {
    if (!path || path.trim() === "") {
      logger.info("No pagination path provided, adding directly to root");
      return { ...obj, ...value };
    }

    logger.info(`Adding nested object at path: "${path}"`);
    const result = { ...obj };
    const parts = path.split(".");
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
    logger.info(`Added value at nested path with ${parts.length} levels`);
    return result;
  };

  // Get the selected method object
  const selectedMethodData = selectedMethod
    ? getMethods.find((m) => m.fullPath === selectedMethod)
    : undefined;

  return (
    <div className="h-full w-full flex flex-col">
      <IdeHeader
        url={url}
        onReset={handleReset}
        selectedMethodSchema={selectedMethodData}
      />

      <div className="w-full h-full flex flex-col overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="w-full">
          <ResizablePanel defaultSize={50} className="w-full h-full">
            <SourceInput
              className="px-4 pt-4"
              url={url}
              onUrlChange={handleUrlChange}
              onLoad={handleLoad}
              onMethodSelect={handleMethodSelect}
              methods={getMethods}
              selectedMethod={selectedMethod}
              onLoadData={selectedMethod ? handleLoadData : undefined}
              onGenerateMockData={
                selectedMethod
                  ? () => {
                      // When generating mock data from the button, if no columns exist, we DO want to auto-generate columns
                      // so we don't pass the skipColumnGeneration flag
                      handleMockData(
                        selectedMethodData?.responseSchema,
                        columns.length > 0,
                      );
                    }
                  : undefined
              }
              mockCount={mockCount}
              onMockCountChange={setMockCount}
            />
            <div className="h-[calc(100vh-160px)]">
              {getMethods.length > 0 ? (
                <div className="h-full">
                  {/* Load Data and Mock Data buttons moved to header */}

                  {loaded && selectedMethod ? (
                    <>
                      <Tabs defaultValue="columns" className="w-full h-full">
                        <div className="flex flex-col h-full">
                          <TabsList className="mb-4 sticky top-0 z-10">
                            <TabsTrigger value="columns">
                              Column Editor
                            </TabsTrigger>
                            <TabsTrigger value="groups">
                              Column Groups
                            </TabsTrigger>
                            <TabsTrigger value="documentation">
                              Documentation
                            </TabsTrigger>
                            <TabsTrigger value="properties">
                              Properties
                            </TabsTrigger>
                          </TabsList>

                          <div className="flex-1 overflow-hidden">
                            <TabsContent
                              value="documentation"
                              className="h-[calc(100vh-230px)] overflow-hidden"
                            >
                              <ScrollArea className="h-full">
                                <div className="p-4">
                                  <ApiDocumentation
                                    method={selectedMethodData}
                                  />
                                </div>
                              </ScrollArea>
                            </TabsContent>

                            <TabsContent
                              value="properties"
                              className="h-[calc(100vh-230px)] overflow-hidden"
                            >
                              <ScrollArea className="h-full">
                                <div className="p-4">
                                  <SchemaProperties
                                    properties={properties}
                                    dataPath={paths.data}
                                  />
                                </div>
                              </ScrollArea>
                            </TabsContent>

                            <TabsContent
                              value="columns"
                              className="h-[calc(100vh-230px)] overflow-hidden"
                            >
                              <ScrollArea className="h-full">
                                <div className="p-4">
                                  <ColumnEditor />
                                </div>
                              </ScrollArea>
                            </TabsContent>

                            <TabsContent
                              value="groups"
                              className="h-[calc(100vh-230px)] overflow-hidden"
                            >
                              <ScrollArea className="h-full">
                                <div className="p-4">
                                  <ColumnGroups />
                                </div>
                              </ScrollArea>
                            </TabsContent>
                          </div>
                        </div>
                      </Tabs>
                    </>
                  ) : getMethods.length > 0 ? (
                    <div className="h-full flex flex-col">
                      <div className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 p-4 rounded-lg mb-4">
                        <div className="flex items-center">
                          <h3 className="font-semibold">
                            Select an API Method
                          </h3>
                        </div>
                        <p className="text-sm mt-1">
                          OpenAPI specification loaded. Please select a method
                          from the dropdown above to begin designing your data
                          grid.
                        </p>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <ScrollArea className="h-[calc(100vh-230px)]">
                          <div className="p-4">
                            <ApiDocumentation />
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full">
                      <EmptyState
                        message="No API method selected"
                        loading={loading}
                        error={error}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full">
                  <EmptyState
                    message={
                      error
                        ? undefined
                        : "Load an OpenAPI specification to see available methods"
                    }
                    loading={loading}
                    error={error}
                  />
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={50} className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <div className="flex-1 overflow-hidden flex flex-col p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold">
                    {showColumnCreator ? "Column Creator" : "Data View"}
                    {!showColumnCreator && apiUrl && (
                      <span className="text-xs font-normal ml-2 text-muted-foreground">
                        Source: {apiUrl}
                      </span>
                    )}
                  </h3>

                  {/* Add action buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant={showColumnCreator ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowColumnCreator(true)}
                      className={showColumnCreator ? "pointer-events-none" : ""}
                    >
                      {showColumnCreator
                        ? "Editing Columns"
                        : "Configure Columns"}
                    </Button>
                    <Button
                      variant={!showColumnCreator ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowColumnCreator(false)}
                      className={
                        !showColumnCreator ? "pointer-events-none" : ""
                      }
                    >
                      {!showColumnCreator
                        ? "Viewing Data Grid"
                        : "View Data Grid"}
                    </Button>
                    <ExportButton className="ml-auto" />
                  </div>
                </div>

                {showColumnCreator ? (
                  <div className="h-full overflow-auto">
                    <ColumnCreator
                      onColumnsChanged={() => {
                        // Auto-generate mock data when columns are added
                        if (selectedMethodData) {
                          logger.info(
                            `Column change detected, current columns: ${columns.length}, generating mock data`,
                          );
                          // We already have columns, manually set a flag to prevent auto-generation
                          // We need to pass this flag to handleMockData to ensure it never auto-generates columns
                          // when manually adding columns one by one
                          handleMockData(
                            selectedMethodData.responseSchema,
                            true,
                          );
                        }
                      }}
                    />
                  </div>
                ) : dataError ? (
                  <div className="text-red-500 text-center p-8 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/10 dark:border-red-800">
                    {/*<p>Error loading data: {dataError}</p>*/}
                    {/*{apiUrl && <p className="text-xs mt-2">URL: {apiUrl}</p>}*/}
                  </div>
                ) : !apiData ? (
                  <div className="text-muted-foreground text-center p-8 border rounded-md bg-muted/10">
                    <p>
                      Select an API method and click "Load Data" or "Generate
                      Mock Data" to view data here.
                    </p>
                  </div>
                ) : (
                  <>
                    {(() => {
                      // Extract the actual data array using the specified data path
                      const actualData = getActualData(apiData, paths.data);

                      if (
                        Array.isArray(actualData) &&
                        actualData.length > 0 &&
                        columns.length > 0
                      ) {
                        return (
                          <>
                            <DataGrid
                              // Add a key based on column IDs to force rerender when column order changes
                              key={columns.map((col) => col.id).join("|")}
                              id="designer-data-grid"
                              columns={columns}
                              data={actualData}
                              getRowId={getRowId}
                              pagination={designerPagination}
                              sorting={designerSorting}
                              onSortingChange={handleSortingChange}
                              onPaginationChange={handlePaginationChange}
                              designerMode={true}
                              onColumnOrderChange={(newColumnOrder) => {
                                // When column order changes in the DataGrid,
                                // we need to reorder the columns array to match
                                const reorderedColumns = [...columns];

                                // Sort the columns array based on the new order
                                reorderedColumns.sort((a, b) => {
                                  const aIndex = newColumnOrder.indexOf(
                                    a.id as string,
                                  );
                                  const bIndex = newColumnOrder.indexOf(
                                    b.id as string,
                                  );

                                  // Handle columns that aren't in the order array
                                  if (aIndex === -1) return 1;
                                  if (bIndex === -1) return -1;

                                  return aIndex - bIndex;
                                });

                                console.log(
                                  "DataGrid column order changed, updating Designer columns",
                                );

                                // Update the context with the new column order
                                DesignerContext.trigger.update({
                                  update: { columns: reorderedColumns },
                                });
                              }}
                            />
                          </>
                        );
                      }
                      if (
                        Array.isArray(actualData) &&
                        actualData.length > 0 &&
                        columns.length === 0
                      ) {
                        return (
                          <div className="flex-1 flex flex-col items-center justify-center p-4 border rounded-md bg-amber-50 text-amber-700">
                            <p className="mb-4 font-medium">
                              Data loaded, but no columns configured.
                            </p>
                            <p className="mb-4">
                              Use the <strong>Configure Columns</strong> button
                              to set up your columns, or click below to
                              auto-generate them.
                            </p>
                            <Button
                              onClick={() => {
                                // Automatically generate columns from the actual data with smart defaults
                                if (actualData && actualData.length > 0) {
                                  const firstItem = actualData[0];

                                  // Create intelligent auto columns with sensible defaults by data type
                                  const autoColumns = Object.keys(
                                    firstItem,
                                  ).map((key) => {
                                    const dataType = typeof firstItem[key];

                                    // Set sensible defaults based on type
                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                    const columnDef: any = {
                                      id: key,
                                      header: key
                                        .split(/(?=[A-Z])/)
                                        .map(
                                          (word) =>
                                            word.charAt(0).toUpperCase() +
                                            word.slice(1),
                                        )
                                        .join(" "),
                                      accessorKey: key,
                                      enableSorting: true,
                                      enableColumnFilter: true,
                                      meta: {
                                        type: dataType,
                                        required: false,
                                        nullable: firstItem[key] === null,
                                        description: `Auto-generated column for ${key}`,
                                      },
                                    };

                                    // Apply type-specific settings
                                    if (
                                      key.toLowerCase().includes("date") ||
                                      key.toLowerCase().includes("time")
                                    ) {
                                      // Add date sorting
                                      columnDef.sortingFn = "datetime";
                                      columnDef.meta.type = "date-time";
                                    }

                                    // For numeric types, set appropriate filtering and sorting
                                    if (dataType === "number") {
                                      columnDef.sortingFn = "alphanumeric";
                                      columnDef.meta.type = "number";
                                    }

                                    return columnDef;
                                  });

                                  // Group related columns together by naming patterns
                                  const columnGroups = [];
                                  const patterns = [
                                    {
                                      pattern:
                                        /^(user|customer|person|employee)/i,
                                      name: "User Information",
                                    },
                                    {
                                      pattern: /^(address|location|place)/i,
                                      name: "Location",
                                    },
                                    {
                                      pattern:
                                        /(date|time|created|updated|timestamp)/i,
                                      name: "Dates & Times",
                                    },
                                    {
                                      pattern:
                                        /(price|cost|amount|payment|total)/i,
                                      name: "Financial",
                                    },
                                    {
                                      pattern: /(status|state|condition)/i,
                                      name: "Status",
                                    },
                                  ];

                                  for (const pattern of patterns) {
                                    const matchingColumns = autoColumns.filter(
                                      (col) =>
                                        pattern.pattern.test(
                                          col.accessorKey as string,
                                        ),
                                    );

                                    if (matchingColumns.length > 0) {
                                      const groupId = pattern.name
                                        .toLowerCase()
                                        .replace(/\s+/g, "-");
                                      const group = {
                                        id: groupId,
                                        name: pattern.name,
                                        description: `Columns related to ${pattern.name.toLowerCase()}`,
                                      };

                                      columnGroups.push(group);

                                      // Assign group to columns
                                      for (const col of matchingColumns) {
                                        if (col.meta) {
                                          col.meta.groupId = groupId;
                                        }
                                      }
                                    }
                                  }

                                  // Also set the first column as the ID field if none is selected
                                  if (!idField && autoColumns.length > 0) {
                                    // Look for common ID field names first
                                    const possibleIdFields = [
                                      "id",
                                      "ID",
                                      "Id",
                                      "_id",
                                      "uuid",
                                      "key",
                                      "identifier",
                                      "primary",
                                    ];
                                    const bestIdField =
                                      autoColumns.find((col) =>
                                        possibleIdFields.includes(
                                          col.accessorKey as string,
                                        ),
                                      ) || autoColumns[0];

                                    DesignerContext.trigger.update({
                                      update: {
                                        columns: autoColumns,
                                        columnGroups: columnGroups,
                                        idField:
                                          bestIdField.accessorKey as string,
                                      },
                                    });
                                  } else {
                                    DesignerContext.trigger.update({
                                      update: {
                                        columns: autoColumns,
                                        columnGroups: columnGroups,
                                      },
                                    });
                                  }
                                }
                              }}
                            >
                              Auto-Generate Columns
                            </Button>

                            <div className="w-full mt-4 border rounded-md overflow-hidden">
                              <ScrollArea className="h-[400px] w-full">
                                <pre className="p-4 text-xs whitespace-pre-wrap">
                                  {JSON.stringify(actualData, null, 2)}
                                </pre>
                              </ScrollArea>
                            </div>
                          </div>
                        );
                      }
                      // Fallback case: Show raw JSON
                      return (
                        <div className="border rounded-md overflow-hidden">
                          <div className="bg-amber-50 px-4 py-2 text-sm text-amber-700 border-b">
                            {paths.data && (
                              <p>
                                <strong>Note:</strong> Data at path "
                                {paths.data}"{" "}
                                {Array.isArray(actualData)
                                  ? `found (${actualData?.length || 0} items)`
                                  : "not found or not an array"}
                                .
                              </p>
                            )}
                            <p>Showing raw API response below:</p>
                          </div>
                          <ScrollArea className="h-[500px] w-full">
                            <pre className="p-4 text-xs whitespace-pre-wrap">
                              {JSON.stringify(apiData, null, 2)}
                            </pre>
                          </ScrollArea>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>

            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium mb-1">Designer Logs</h3>
                <div className="flex gap-2">
                  <ConsoleLogDrawer triggerLabel="Console Logs" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={clearLogs}
                    title="Clear designer logs"
                  >
                    {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
