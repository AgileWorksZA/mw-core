import type { SortingState } from "@tanstack/react-table";
import React from "react";
import { DataGrid } from "~/components/datagrid/data-grid/data-grid";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useDesigner } from "../types";
import { DesignerContext } from "../types";

interface DataGridViewProps {
  data: any[] | null;
}

export function DataGridView({ data }: DataGridViewProps) {
  const columns = useDesigner((state) => state.context.columns);
  const idField = useDesigner((state) => state.context.idField);
  const designerPagination = useDesigner((state) => state.context.pagination);
  const designerSorting = useDesigner((state) => state.context.sorting);

  // Set up local pagination and sorting state that will be synced with the designer context
  const [pagination, setPagination] = React.useState(designerPagination);
  const [sorting, setSorting] = React.useState<SortingState>(designerSorting);

  // Update local pagination when API data changes
  React.useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        total: data.length,
      }));

      // Update the designer context with the new pagination info
      DesignerContext.trigger.update({
        update: {
          pagination: {
            ...designerPagination,
            total: data.length,
          },
        },
      });
    }
  }, [data, designerPagination]);

  // Sync sorting changes with the designer context
  React.useEffect(() => {
    DesignerContext.trigger.update({
      update: { sorting },
    });
  }, [sorting]);

  // Create a getRowId function based on the selected idField
  const getRowId = React.useCallback(
    (row: any) => {
      // If an idField is selected, use it as the row ID
      if (idField && row[idField] !== undefined) {
        return String(row[idField]);
      }
      // Fallback: create a composite ID from all row values
      // This is a simplistic approach; in a real application, we'd want something more robust
      return JSON.stringify(row);
    },
    [idField],
  );

  // Handle pagination changes
  const handlePaginationChange = React.useCallback((updater: any) => {
    setPagination((prev) => {
      // If updater is a function, call it with prev state
      const newPagination =
        typeof updater === "function" ? updater(prev) : updater;

      // Update the designer context
      DesignerContext.trigger.update({
        update: { pagination: newPagination },
      });

      return newPagination;
    });
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground mb-2">No data available</p>
          <p className="text-xs text-muted-foreground">
            Load data from an API endpoint by selecting a method and clicking
            "Load Data"
          </p>
        </div>
      </div>
    );
  }

  if (columns.length === 0) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                No columns configured yet. Configure columns to display the data
                in a table.
              </p>
              <Button
                onClick={() => {
                  // Automatically generate columns from the first item in the data
                  if (data && data.length > 0) {
                    const firstItem = data[0];
                    const autoColumns = Object.keys(firstItem).map((key) => ({
                      id: key,
                      header: key.charAt(0).toUpperCase() + key.slice(1),
                      accessorKey: key,
                      enableSorting: true,
                      enableColumnFilter: true,
                    }));

                    // Also set the first column as the ID field if none is selected
                    if (!idField && autoColumns.length > 0) {
                      DesignerContext.trigger.update({
                        update: {
                          columns: autoColumns,
                          idField: autoColumns[0].accessorKey as string,
                        },
                      });
                    } else {
                      DesignerContext.trigger.update({
                        update: { columns: autoColumns },
                      });
                    }
                  }
                }}
                className="mb-4"
              >
                Auto-Generate Columns
              </Button>

              <div className="border rounded-md overflow-hidden">
                <div className="p-4 max-h-[500px] overflow-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Data Table ({data.length} records)
          </CardTitle>
          {!idField && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-2 mt-2 text-sm text-amber-700">
              No ID field selected. Please select an ID field in the Column
              Config section for optimal table functionality.
            </div>
          )}
        </CardHeader>
        <CardContent>
          <DataGrid
            id="designer-data-grid"
            columns={columns}
            data={data || []}
            getRowId={getRowId}
            pagination={pagination}
            sorting={sorting}
            onSortingChange={setSorting}
            onPaginationChange={handlePaginationChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
