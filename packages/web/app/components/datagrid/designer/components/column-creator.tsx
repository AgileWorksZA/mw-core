import type { AccessorFn, ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataPathHeader } from "~/components/datagrid/designer/components/data-path-header";
import { TypeIcon } from "~/components/datagrid/designer/components/type-icon";
import { useSchemaProcessing } from "~/components/datagrid/designer/hooks";
import {
  DesignerContext,
  useDesigner,
} from "~/components/datagrid/designer/types";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

type ActiveTab = "properties" | "calculated";

type ColumnCreatorProps = {
  onColumnsChanged?: () => void;
};

export function ColumnCreator({ onColumnsChanged }: ColumnCreatorProps) {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("properties");
  const properties = useDesigner((state) => state.context.properties);
  const columns = useDesigner((state) => state.context.columns);
  const selectedProperty = useDesigner(
    (state) => state.context.designerState.selectedProperty,
  );
  const paths = useDesigner((state) => state.context.paths);
  const schema = useDesigner((state) => state.context.schema);
  const [calculatedColumn, setCalculatedColumn] = React.useState({
    id: "",
    header: "",
    formula: "",
    enableSorting: true,
    enableColumnFilter: true,
  });

  const setSelectedProperty = (property?: string) => {
    DesignerContext.trigger.update({
      update: { designerState: { selectedProperty: property } },
    });
  };
  const [newColumnData, setNewColumnData] = React.useState<{
    id: string;
    header: string;
    accessorKey: string;
    propertyKey: string;
    enableSorting: boolean;
    enableColumnFilter: boolean;
  }>({
    id: "",
    header: "",
    accessorKey: "",
    propertyKey: "",
    enableSorting: true,
    enableColumnFilter: true,
  });
  const handleAddColumn = () => {
    if (!properties || !newColumnData.propertyKey) return;

    // Get property metadata
    const propertyMeta = properties[newColumnData.propertyKey];
    if (!propertyMeta) return;

    // Create a new column
    const newColumn: ColumnDef<unknown> = {
      id: newColumnData.id || newColumnData.propertyKey,
      header: newColumnData.header || newColumnData.propertyKey,
      accessorKey: newColumnData.propertyKey,
      enableSorting: newColumnData.enableSorting,
      enableColumnFilter: newColumnData.enableColumnFilter,
      meta: propertyMeta,
    };

    // Add the new column to the list and update the global context
    const updatedColumns = [...columns, newColumn];
    DesignerContext.trigger.update({
      update: { columns: updatedColumns },
    });

    // Call onColumnsChanged callback
    onColumnsChanged?.();

    // Reset form
    setNewColumnData({
      id: "",
      header: "",
      accessorKey: "",
      propertyKey: "",
      enableSorting: true,
      enableColumnFilter: true,
    });
    setSelectedProperty("");
  };

  const handleAddCalculatedColumn = () => {
    if (
      !calculatedColumn.id ||
      !calculatedColumn.header ||
      !calculatedColumn.formula
    ) {
      return; // Require all fields
    }

    // Create a calculated column
    const newCalculatedColumn: ColumnDef<unknown> = {
      id: calculatedColumn.id,
      header: calculatedColumn.header,
      accessorFn: new Function(
        "row",
        `return ${calculatedColumn.formula}`,
      ) as AccessorFn<unknown>,
      enableSorting: calculatedColumn.enableSorting,
      enableColumnFilter: calculatedColumn.enableColumnFilter,
      meta: {
        type: "calculated",
        formula: calculatedColumn.formula,
        required: false,
        nullable: true,
        description: `Calculated: ${calculatedColumn.formula}`,
      },
    };

    // Add to columns and update the global context
    const updatedColumns = [...columns, newCalculatedColumn];
    DesignerContext.trigger.update({
      update: { columns: updatedColumns },
    });

    // Call onColumnsChanged callback
    onColumnsChanged?.();

    // Reset form
    setCalculatedColumn({
      id: "",
      header: "",
      formula: "",
      enableSorting: true,
      enableColumnFilter: true,
    });
  };

  const handleAddAllProperties = () => {
    if (!properties) return;

    const allCols = Object.keys(properties).map((key) => {
      const columnCount = columns.filter(
        (col) => (col as { accessorKey: string })?.accessorKey === key,
      ).length;
      const uniqueId = columnCount > 0 ? `${key}_${columnCount + 1}` : key;

      return {
        id: uniqueId,
        header: key.charAt(0).toUpperCase() + key.slice(1),
        accessorKey: key,
        enableSorting: true,
        enableColumnFilter: true,
        meta: properties[key],
      };
    });

    const updatedColumns = [...columns, ...allCols];
    DesignerContext.trigger.update({
      update: { columns: updatedColumns },
    });

    // Call onColumnsChanged callback to trigger mock data generation
    onColumnsChanged?.();
  };

  // Import the function for updating schema properties
  const { updateSchemaProperties } = useSchemaProcessing();

  // Handle paths change for data and pagination paths
  const handlePathsChange = (newPaths: {
    data: string;
    pagination: string;
  }) => {
    console.log("Applying new data path:", newPaths.data);

    // Update the paths in context
    DesignerContext.trigger.update({
      update: {
        paths: newPaths,
        // Reset columns when the data path changes to force re-generation
        columns: [],
      },
    });

    // Now update the schema properties based on the new path
    if (schema) {
      console.log("Updating schema properties with new data path");
      const updatedProperties = updateSchemaProperties(
        schema,
        newPaths.data,
        (errorMsg) => console.error(errorMsg),
      );

      console.log(
        `Found ${Object.keys(updatedProperties).length} properties with new data path`,
      );
    } else {
      console.warn("No schema available for updating properties");
    }
  };

  const handlePropertySelection = (propertyKey: string) => {
    if (!properties || !propertyKey) return;

    setSelectedProperty(propertyKey);

    // Get property metadata
    const propertyMeta = properties[propertyKey];
    if (!propertyMeta) return;

    // Generate a unique ID for this column
    const columnCount = columns.filter(
      (col) => (col as { accessorKey: string })?.accessorKey === propertyKey,
    ).length;
    const uniqueId =
      columnCount > 0 ? `${propertyKey}_${columnCount + 1}` : propertyKey;

    // Update the new column data with property information
    setNewColumnData({
      propertyKey,
      accessorKey: propertyKey,
      header: propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1),
      id: uniqueId,
      enableSorting: true,
      enableColumnFilter: true,
    });
  };

  const handleQuickAdd = (propertyKey: string) => {
    if (!properties || !propertyKey) return;

    // Get property metadata
    const propertyMeta = properties[propertyKey];
    if (!propertyMeta) return;

    // Generate a unique ID for this column
    const columnCount = columns.filter(
      (col) => (col as { accessorKey: string })?.accessorKey === propertyKey,
    ).length;
    const uniqueId =
      columnCount > 0 ? `${propertyKey}_${columnCount + 1}` : propertyKey;

    // Create a column with default settings
    const defaultColumn: ColumnDef<unknown> = {
      id: uniqueId,
      header: propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1),
      accessorKey: propertyKey,
      enableSorting: true,
      enableColumnFilter: true,
      meta: propertyMeta,
    };

    // Add to columns immediately and update the global context
    const updatedColumns = [...columns, defaultColumn];

    // Debug log
    console.log("ColumnCreator - Quick Add - Adding column:", defaultColumn);
    console.log("ColumnCreator - Quick Add - Current columns:", columns);
    console.log("ColumnCreator - Quick Add - Updated columns:", updatedColumns);

    DesignerContext.trigger.update({
      update: { columns: updatedColumns },
    });

    // Important: We need to notify parent that columns changed so mock data can be generated
    // But we shouldn't call this directly; it should be called by the onClick handler in the button
  };

  if (!properties) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Column Config</CardTitle>
          <CardDescription>
            No schema properties available. Please select an API method first.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  // Function to log errors for DataPathHeader
  const handleError = (errorMsg: string) => {
    console.error(errorMsg);
    // You could show a toast or other notification here
  };

  return (
    <div className="p-4">
      {/* Data Path Configuration Header */}
      <DataPathHeader
        paths={paths}
        schema={schema}
        onPathsChange={handlePathsChange}
        onError={handleError}
        propertyCount={properties ? Object.keys(properties).length : 0}
      />

      {/* Tab Navigation */}
      <Tabs
        defaultValue={activeTab}
        onValueChange={(value) => setActiveTab(value as ActiveTab)}
      >
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="properties" className="flex-1">
            Properties
          </TabsTrigger>
          <TabsTrigger value="calculated" className="flex-1">
            Calculated Columns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Available Properties</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Clear all columns
                  DesignerContext.trigger.update({
                    update: { columns: [] },
                  });
                  // No need to call onColumnsChanged here as we don't want to generate mock data
                }}
              >
                Remove All Columns
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAllProperties}
              >
                Add All Properties
              </Button>
            </div>
          </div>

          <div className="h-[300px] overflow-y-auto space-y-2 pr-2 border rounded-md p-4">
            {properties &&
              Object.keys(properties).map((key) => {
                // Check if this property is already added as a column
                const isAlreadyAdded = columns.some(
                  (col) =>
                    (col as { accessorKey: string })?.accessorKey === key,
                );

                return (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                  <div
                    key={key}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md border",
                      isAlreadyAdded
                        ? "bg-muted cursor-not-allowed opacity-70"
                        : selectedProperty === key
                          ? "border-primary bg-primary/5"
                          : "cursor-pointer hover:bg-muted/50",
                    )}
                    onClick={() => {
                      if (!isAlreadyAdded) {
                        handlePropertySelection(key);
                      }
                    }}
                  >
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        {key}
                        {properties[key].description && (
                          <Tooltip delayDuration={200}>
                            <TooltipTrigger
                              className="inline-flex"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.75.75 0 0 1 .736.743l-.095 2.373a.75.75 0 0 0 1.5.041l.094-2.366a2.251 2.251 0 0 0-2.228-2.29H9Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              className="max-w-xs whitespace-normal text-wrap bg-slate-800/95 dark:bg-slate-950/95 text-white"
                            >
                              {properties[key].description}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div className="text-xs flex items-center gap-2">
                        <TypeIcon
                          type={properties[key].type}
                          showLabel={true}
                        />
                        {properties[key].required && (
                          <span className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 px-2 py-0.5 rounded-full flex items-center text-xs">
                            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-3 h-3 mr-1"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Required
                          </span>
                        )}
                        {properties[key].nullable && (
                          <span className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs">
                            Nullable
                          </span>
                        )}
                        {isAlreadyAdded && (
                          <span className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 px-2 py-0.5 rounded-full flex items-center text-xs">
                            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-3 h-3 mr-1"
                            >
                              <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                              <path
                                fillRule="evenodd"
                                d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Used
                          </span>
                        )}
                      </div>
                      {properties[key].description && (
                        <div className="text-xs text-muted-foreground mt-1 truncate max-w-[250px]">
                          {properties[key].description}
                        </div>
                      )}
                    </div>

                    {!isAlreadyAdded && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(key);
                          // Notify parent about column changes to trigger mock data generation
                          onColumnsChanged?.();
                        }}
                      >
                        Quick Add
                      </Button>
                    )}
                  </div>
                );
              })}
          </div>

          {selectedProperty && (
            <div className="border rounded-md p-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  Configure Column: {selectedProperty}
                  {properties[selectedProperty]?.description && (
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger className="inline-flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.75.75 0 0 1 .736.743l-.095 2.373a.75.75 0 0 0 1.5.041l.094-2.366a2.251 2.251 0 0 0-2.228-2.29H9Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="max-w-xs whitespace-normal text-wrap bg-slate-800/95 dark:bg-slate-950/95 text-white"
                      >
                        <div className="space-y-2">
                          <p>{properties[selectedProperty].description}</p>
                          <p className="font-semibold">
                            Type:{" "}
                            <span className="font-normal">
                              {properties[selectedProperty].type}
                            </span>
                          </p>
                          {properties[selectedProperty].format && (
                            <p className="font-semibold">
                              Format:{" "}
                              <span className="font-normal">
                                {properties[selectedProperty].format}
                              </span>
                            </p>
                          )}
                          {properties[selectedProperty].required && (
                            <p className="font-semibold text-red-400">
                              Required field
                            </p>
                          )}
                          {properties[selectedProperty].nullable && (
                            <p className="font-semibold text-amber-400">
                              This field can be null
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="header">Header Label</Label>
                    <Input
                      id="header"
                      value={newColumnData.header}
                      onChange={(e) =>
                        setNewColumnData({
                          ...newColumnData,
                          header: e.target.value,
                        })
                      }
                      placeholder="Enter column header"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id">Column ID</Label>
                    <Input
                      id="id"
                      value={newColumnData.id}
                      onChange={(e) =>
                        setNewColumnData({
                          ...newColumnData,
                          id: e.target.value,
                        })
                      }
                      placeholder="Enter column ID"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enable-sorting"
                      checked={newColumnData.enableSorting}
                      onCheckedChange={(checked) =>
                        setNewColumnData({
                          ...newColumnData,
                          enableSorting: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="enable-sorting" className="cursor-pointer">
                      Enable Sorting
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enable-filtering"
                      checked={newColumnData.enableColumnFilter}
                      onCheckedChange={(checked) =>
                        setNewColumnData({
                          ...newColumnData,
                          enableColumnFilter: checked as boolean,
                        })
                      }
                    />
                    <Label
                      htmlFor="enable-filtering"
                      className="cursor-pointer"
                    >
                      Enable Filtering
                    </Label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleAddColumn}
                    disabled={!newColumnData.propertyKey}
                  >
                    Add Column
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calculated">
          <div className="space-y-4 border rounded-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-medium">Add Calculated Column</h3>
              <Tooltip delayDuration={200}>
                <TooltipTrigger className="inline-flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.75.75 0 0 1 .736.743l-.095 2.373a.75.75 0 0 0 1.5.041l.094-2.366a2.251 2.251 0 0 0-2.228-2.29H9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="max-w-xs whitespace-normal text-wrap bg-slate-800/95 dark:bg-slate-950/95 text-white"
                >
                  <div className="space-y-2">
                    <p>
                      Calculated columns are computed from other columns using
                      JavaScript.
                    </p>
                    <p className="font-semibold">Examples:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <code className="bg-slate-700 px-1 rounded">
                          (row) =&gt; `${"{row.firstName}"} ${"{row.lastName}"}`
                        </code>
                      </li>
                      <li>
                        <code className="bg-slate-700 px-1 rounded">
                          (row) =&gt; row.quantity * row.price
                        </code>
                      </li>
                      <li>
                        <code className="bg-slate-700 px-1 rounded">
                          (row) =&gt; new
                          Date(row.dateCreated).toLocaleDateString()
                        </code>
                      </li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calc-id">Column ID</Label>
                  <Input
                    id="calc-id"
                    placeholder="e.g., fullName, totalPrice"
                    value={calculatedColumn.id}
                    onChange={(e) =>
                      setCalculatedColumn({
                        ...calculatedColumn,
                        id: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calc-header">Header Label</Label>
                  <Input
                    id="calc-header"
                    placeholder="e.g., Full Name, Total Price"
                    value={calculatedColumn.header}
                    onChange={(e) =>
                      setCalculatedColumn({
                        ...calculatedColumn,
                        header: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calc-formula">
                  Formula / Accessor Function
                </Label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted flex items-center justify-center border-r">
                    <span className="text-xs font-mono">fn</span>
                  </div>
                  <textarea
                    id="calc-formula"
                    className="min-h-[120px] pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="(row) => `${row.firstName} ${row.lastName}`"
                    value={calculatedColumn.formula}
                    onChange={(e) =>
                      setCalculatedColumn({
                        ...calculatedColumn,
                        formula: e.target.value,
                      })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter a JavaScript function to calculate this column's value
                  from row data
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="calc-sorting"
                    checked={calculatedColumn.enableSorting}
                    onCheckedChange={(checked) =>
                      setCalculatedColumn({
                        ...calculatedColumn,
                        enableSorting: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="calc-sorting" className="cursor-pointer">
                    Enable Sorting
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="calc-filtering"
                    checked={calculatedColumn.enableColumnFilter}
                    onCheckedChange={(checked) =>
                      setCalculatedColumn({
                        ...calculatedColumn,
                        enableColumnFilter: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="calc-filtering" className="cursor-pointer">
                    Enable Filtering
                  </Label>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleAddCalculatedColumn}
                disabled={
                  !calculatedColumn.id ||
                  !calculatedColumn.header ||
                  !calculatedColumn.formula
                }
              >
                Add Calculated Column
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
