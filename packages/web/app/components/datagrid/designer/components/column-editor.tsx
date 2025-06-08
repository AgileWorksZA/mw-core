import type { ColumnDef } from "@tanstack/react-table";
import type { AccessorKeyColumnDefBase } from "@tanstack/table-core";
import React from "react";
import { DraggableColumnList } from "~/components/datagrid/designer/components/draggable-column-list";
import { PanelCard } from "~/components/datagrid/designer/components/panel-card";
import { TypeIcon } from "~/components/datagrid/designer/components/type-icon";
import {
  DesignerContext,
  type SchemaMetaProperties,
  useDesigner,
} from "~/components/datagrid/designer/types";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";

export function ColumnEditor() {
  const existingColumns = useDesigner((state) => state.context.columns);
  const idField = useDesigner((state) => state.context.idField);
  const columnGroups = useDesigner((state) => state.context.columnGroups);

  const [columns, setColumns] = React.useState<ColumnDef<unknown>[]>([]);
  const [selectedColumn, setSelectedColumn] =
    React.useState<AccessorKeyColumnDefBase<unknown> | null>(null);

  const [selectedIdField, setSelectedIdField] = React.useState<string>(
    idField || "",
  );
  // Load existing columns from context when the component mounts or changes
  React.useEffect(() => {
    // Always keep local state in sync with context
    setColumns(existingColumns || []);
    
    // Log for debugging
    console.log("Column Editor - Updated columns from context:", 
      existingColumns?.map(col => col.id));
  }, [existingColumns]);

  // Update context when local columns state changes
  // But only if they're different from the existingColumns to avoid infinite updates
  React.useEffect(() => {
    // Only update the context if the local columns are different from the context columns
    if (columns.length > 0 && JSON.stringify(columns) !== JSON.stringify(existingColumns)) {
      console.log("Column Editor - Updating context with modified columns");
      DesignerContext.trigger.update({
        update: { columns },
      });
    }
  }, [columns]);

  // Update context when ID field changes
  React.useEffect(() => {
    if (selectedIdField !== idField) {
      DesignerContext.trigger.update({
        update: { idField: selectedIdField },
      });
    }
  }, [selectedIdField, idField]);

  const handleColumnSelection = (column: AccessorKeyColumnDefBase<unknown>) => {
    setSelectedColumn(column);
  };

  const handleColumnRemoval = (columnId: string) => {
    const updatedColumns = columns.filter((col) => col.id !== columnId);
    setColumns(updatedColumns);
    setSelectedColumn(null);
  };

  const handleColumnUpdate = (column: ColumnDef<unknown>) => {
    const updatedColumns = columns.map((col) => {
      if (col.id === column.id) {
        return column;
      }
      return col;
    });
    setColumns(updatedColumns);
    setSelectedColumn(null);
  };

  // Handle columns reordering from drag-and-drop
  const handleColumnsReordered = (newColumns: ColumnDef<unknown>[]) => {
    setColumns(newColumns);
    
    // Update in context
    DesignerContext.trigger.update({
      update: { columns: newColumns },
    });
    
    console.log("Column Editor - Columns reordered in Designer context:", 
      newColumns.map(col => col.id));
  };

  return (
    <div className="flex flex-col gap-4">
      <PanelCard
        header="Configured Columns"
        body={
          columns.length > 0 ? (
            <div className="mb-4 h-full">
              <ScrollArea className="h-full rounded-md border">
                <div className="p-4">
                  <DraggableColumnList
                    columns={columns}
                    selectedIdField={selectedIdField}
                    onColumnsReordered={handleColumnsReordered}
                    onColumnSelect={(column) => handleColumnSelection(column)}
                    onColumnRemove={(columnId) => handleColumnRemoval(columnId)}
                  />
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] border rounded-md bg-muted/10 mb-4">
              <p className="text-muted-foreground mb-2">
                No columns configured yet
              </p>
              <p className="text-xs text-muted-foreground">
                Add columns from your schema properties
              </p>
            </div>
          )
        }
      />

      {selectedColumn ? (
        <PanelCard
          header={`Edit Column: ${(selectedColumn as unknown as { header: string }).header as string}`}
          body={
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-id">Column ID</Label>
                  <Input
                    id="edit-id"
                    value={selectedColumn.id as string}
                    onChange={(e) => {
                      setSelectedColumn({
                        ...selectedColumn,
                        id: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-header">Header Label</Label>
                  <Input
                    id="edit-header"
                    value={
                      (selectedColumn as unknown as { header: string }).header
                    }
                    onChange={(e) => {
                      setSelectedColumn({
                        ...selectedColumn,
                        header: e.target.value,
                      } as AccessorKeyColumnDefBase<unknown>);
                    }}
                  />
                </div>
              </div>
              {selectedColumn.accessorKey && (
                <div className="space-y-2">
                  <Label>Accessor Key</Label>
                  <Input
                    value={selectedColumn.accessorKey as string}
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Accessor key matches the property name and cannot be changed
                  </p>
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-sorting" className="cursor-pointer">
                    Enable Sorting
                  </Label>
                  <Switch
                    id="edit-sorting"
                    checked={selectedColumn.enableSorting !== false}
                    onCheckedChange={(checked) => {
                      setSelectedColumn({
                        ...selectedColumn,
                        enableSorting: checked,
                      });
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-filtering" className="cursor-pointer">
                    Enable Filtering
                  </Label>
                  <Switch
                    id="edit-filtering"
                    checked={selectedColumn.enableColumnFilter !== false}
                    onCheckedChange={(checked) => {
                      setSelectedColumn({
                        ...selectedColumn,
                        enableColumnFilter: checked,
                      });
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-id-field" className="cursor-pointer">
                    Set as Primary Key (ID Field)
                  </Label>
                  <Switch
                    id="edit-id-field"
                    checked={selectedColumn.accessorKey === selectedIdField}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIdField(
                          selectedColumn.accessorKey as string,
                        );
                      } else if (
                        selectedColumn.accessorKey === selectedIdField
                      ) {
                        setSelectedIdField("");
                      }
                    }}
                  />
                </div>
                
                {/* Column Group Assignment */}
                <div className="space-y-2 pt-2 border-t">
                  <Label htmlFor="column-group">Assign to Group</Label>
                  <select
                    id="column-group"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                    value={(selectedColumn.meta as SchemaMetaProperties)?.groupId || ""}
                    onChange={(e) => {
                      const meta = {...(selectedColumn.meta as SchemaMetaProperties || {})};
                      meta.groupId = e.target.value || undefined;
                      
                      setSelectedColumn({
                        ...selectedColumn,
                        meta,
                      });
                    }}
                  >
                    <option value="">No group</option>
                    {columnGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Grouping columns helps organize complex tables
                  </p>
                </div>
              </div>
            </div>
          }
          footer={
            <>
              <Button variant="outline" onClick={() => setSelectedColumn(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleColumnUpdate(selectedColumn)}>
                Update Column
              </Button>
            </>
          }
        />
      ) : (
        <div>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Select a column to edit</CardTitle>
              <CardDescription>
                Click on a column in the list to edit its properties.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
}
