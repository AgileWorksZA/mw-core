import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  type Cell,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSkipSSR } from "~/hooks/use-skip-ssr";

import type { OnChangeFn } from "@tanstack/table-core";
import type { RowData } from "@tanstack/table-core";
import { DraggableCell } from "~/components/datagrid/data-grid/draggable-cell";
import { DraggableHeader } from "~/components/datagrid/data-grid/draggable-header";
import { DraggableItem } from "~/components/datagrid/data-grid/draggable-item";
import {
  type StoredColumnState,
  deleteColumnTemplate,
  getColumnTemplates,
  loadColumnState,
  saveColumnState,
  saveColumnTemplate,
} from "~/components/datagrid/data-grid/templates";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

// --- Data Grid Component ---

export interface DataGridProps<TData> {
  /** Unique identifier for this moneyworks-table-editor instance, used for URL params */
  id: string;
  /** TanStack Table column definitions */
  columns: ColumnDef<TData>[];
  /** The key in TData that represents the unique row ID */
  getRowId: (row: TData) => string;
  /** Enable/disable multi-row selection */
  enableMultiRowSelection?: boolean;
  /** Initial page size */
  className?: string;
  /** The data is always passed from outside as DataGrid is a SSR data table and doesn't support client-side refreshing */
  data: TData[];
  /** Pagination is always passed from outside for the same reason as above */
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  /** Multi-sort is only supported if sorting: { id: string; desc: boolean }[]; is active */
  sorting: { id: string; desc: boolean }[];
  enableMultiSort?: boolean;
  onSortingChange?: OnChangeFn<SortingState>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  onPaginationChange?: OnChangeFn<PaginationState>;
  /** Event handler when column order changes */
  onColumnOrderChange?: (columnOrder: string[]) => void;
  /** If true, the component is in designer mode and shouldn't adapter state to localStorage */
  designerMode?: boolean;
  isLoading?: boolean;
  error?: Error;
}

export type CellProps = Record<string, string | number | boolean>;
export type CellFunction<
  TData extends RowData,
  TValue,
  TProps extends CellProps,
> = (props: {
  cell: Cell<TData, TValue>;
  props: TProps;
  ref?: (node: HTMLElement | null) => void;
  className?: string;
  style?: React.CSSProperties;
}) => ReactNode;

export function TextCell<
  TData extends RowData,
  TValue,
  TProps extends CellProps = { align: "left" | "right" | "middle" },
>({
  cell,
  ref,
  style,
  className,
}: {
  cell: Cell<TData, TValue>;
  props: TProps;
  ref?: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
  className?: string;
}) {
  const meta = cell.column.columnDef.meta as Meta;
  const align = meta?.props?.align || "middle";
  return (
    <td
      key={cell.id}
      className={cn(`p-4 align-${align}`, className)}
      ref={ref}
      style={style}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
}

// export type CellRegistryType = Record<
//   string,
//   {
//     cell: CellProps;
//     cellFunction: CellFunction<CellProps, RowData, unknown>;
//   }
// >;

export const CellRegistry = {
  text: {
    cell: {
      className: "p-4 align-middle",
    },
    cellFunction: TextCell,
  },
};

export type CellRegistryType = keyof typeof CellRegistry;

export type Meta = { render: CellRegistryType; props: CellProps };

export type CellRowFunction<TData> = ({
  row,
}: { row: Row<TData> }) => ReactNode;
export const SelectCell = <TData,>({ row }: { row: Row<TData> }): ReactNode => {
  return (
    <td className="p-4 align-middle">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </td>
  );
};

export function DataGrid<TData>(props: DataGridProps<TData>) {
  const {
    id,
    columns,
    getRowId,
    enableMultiRowSelection = true,
    className,
    data,
    pagination,
    sorting,
    onSortingChange,
    onColumnFiltersChange,
    onPaginationChange,
    onColumnOrderChange,
    designerMode = false,
    isLoading,
    error,
  } = props;
  // Calculate default column order first
  const defaultColumnOrder = useMemo(
    () => columns.map((col) => col.id as string).filter(Boolean),
    [columns],
  );

  // Initialize states with persisted values from localStorage if available and not in designer mode
  const storedState = useMemo(
    () => (designerMode ? null : loadColumnState(id)),
    [id, designerMode],
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    storedState?.visibility || {},
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Initialize column order with stored values or default order from props
  // In designer mode, always use default order
  const [columnOrder, setColumnOrder] = useState<string[]>(
    designerMode
      ? defaultColumnOrder
      : storedState?.order || defaultColumnOrder,
  );
  const [showReorderDialog, setShowReorderDialog] = useState(false);

  // --- TanStack Table Instance ---
  const table = useReactTable({
    data,
    columns,
    pageCount: pagination.total,
    state: {
      sorting,
      // columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageSize: pagination.limit,
        pageIndex: pagination.offset / pagination.limit,
      },
      columnOrder,
    },
    enableRowSelection: true, // Always enable for getRowId
    enableMultiRowSelection,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId, // Use provided key for row ID
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    debugTable: process.env.NODE_ENV === "development",
  });

  const selectedRowCount = Object.keys(rowSelection).length;

  // Whenever columnOrder changes manually (not from props), notify parent component
  // We need a ref to track whether the change is from us or from props
  const isInternalChange = useRef(false);

  const notifyColumnOrderChange = useCallback(() => {
    if (isInternalChange.current && typeof onColumnOrderChange === "function") {
      onColumnOrderChange(columnOrder);
      isInternalChange.current = false;
    }
  }, [columnOrder, onColumnOrderChange]);

  // When column order changes internally, notify parent
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    notifyColumnOrderChange();
  }, [columnOrder, notifyColumnOrderChange]);

  // Keep column order synchronized with the columns prop
  // Always use the exact order of the columns as they are passed in
  useEffect(() => {
    // When columns change, completely reset the column order
    // to match exactly what was passed in via props
    const newColumnOrder = columns
      .map((col) => col.id as string)
      .filter(Boolean);

    console.log(
      "DataGrid - Setting column order to match passed columns:",
      newColumnOrder,
    );

    // This will replace the current column order completely
    setColumnOrder(newColumnOrder);
  }, [columns]);

  // Save column visibility and order to localStorage (only in non-designer mode)
  useEffect(() => {
    if (!designerMode) {
      saveColumnState(id, {
        visibility: columnVisibility,
        order: columnOrder,
      });
    }
  }, [id, columnVisibility, columnOrder, designerMode]);

  // Handler for dnd-kit drag end - simplified to just move columns
  const handleColumnDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      console.log("Column drag end:", {
        active: active?.id,
        over: over?.id,
      });

      if (!active || !over) {
        console.log("Drag end has missing active/over data");
        return;
      }

      if (active.id === over.id) {
        console.log("No movement detected, same id");
        return;
      }

      try {
        const activeId = active.id as string;
        const overId = over.id as string;

        if (!activeId || !overId) {
          console.warn("Invalid active or over ID", { activeId, overId });
          return;
        }

        // Simple array move operation on current column order
        const oldIndex = columnOrder.indexOf(activeId);
        const newIndex = columnOrder.indexOf(overId);

        if (oldIndex === -1 || newIndex === -1) {
          console.warn("Could not find column in current order", {
            activeId,
            overId,
            columnOrder,
          });
          return;
        }

        console.log(`Moving column from index ${oldIndex} to ${newIndex}`);

        // Mark this as an internal change before updating
        isInternalChange.current = true;

        // Update the local state with the new column order
        setColumnOrder(arrayMove([...columnOrder], oldIndex, newIndex));
      } catch (error) {
        console.error("Error in handleColumnDragEnd:", error);
      }
    },
    [columnOrder],
  );

  // Setup dnd-kit sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // More permissive activation constraint with better axis-specific control
      activationConstraint: {
        // Only require 5px movement to start drag operation - more responsive
        distance: 5,
        // Allow more movement in other axis before cancelling
        tolerance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // More permissive settings for touch
      activationConstraint: {
        delay: 150, // Reduced from 250ms for more responsive feel
        tolerance: 10, // Increased for better touch control
      },
    }),
    useSensor(KeyboardSensor, {}),
  );

  // Component states
  const [open, setOpen] = useState(false);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [templates, setTemplates] = useState<Record<string, StoredColumnState>>(
    {},
  );
  const [activeTemplate, setActiveTemplate] = useState<string | undefined>();

  // Handler for saving a template with a given name
  const handleSaveTemplate = useCallback(
    (name: string) => {
      if (!name.trim()) return;

      const currentState: StoredColumnState = {
        visibility: columnVisibility,
        order: columnOrder,
        lastUsed: Date.now(),
      };

      // Only save to localStorage if not in designer mode
      if (!designerMode) {
        saveColumnTemplate(id, name, currentState);
        // Persist active template to localStorage
        setActiveTemplate(name);
      }

      // Update local state (always do this for UI consistency)
      setTemplates((prev) => ({
        ...prev,
        [name]: currentState,
      }));

      setShowSaveTemplateDialog(false);
    },
    [columnVisibility, columnOrder, id, designerMode],
  );

  // Load templates from localStorage on mount (only if not in designer mode)
  useEffect(() => {
    if (!designerMode) {
      const storedTemplates = getColumnTemplates(id);
      setTemplates(
        Object.fromEntries(
          Object.entries(storedTemplates).filter(
            ([key]) => key !== "activeTemplate",
          ),
        ) as Record<string, StoredColumnState>,
      );
      setActiveTemplate(storedTemplates.activeTemplate);
    } else {
      // In designer mode, reset to empty templates
      setTemplates({});
      setActiveTemplate(undefined);
    }
  }, [id, designerMode]);

  // Apply a template
  const applyTemplate = useCallback(
    (name: string) => {
      const template = templates[name];
      if (template) {
        setColumnVisibility(template.visibility);
        setColumnOrder(template.order);

        // Update lastUsed timestamp
        const updatedTemplate = {
          ...template,
          lastUsed: Date.now(),
        };

        // Update templates in state
        setTemplates((prev) => ({
          ...prev,
          [name]: updatedTemplate,
        }));

        // Save updated template with new timestamp (only if not in designer mode)
        if (!designerMode) {
          saveColumnTemplate(id, name, updatedTemplate);
          // Update UI and adapter the selected template
          setActiveTemplate(name);
        }
      }
    },
    [templates, id, designerMode],
  );

  // Delete a template
  const deleteTemplate = useCallback(
    (name: string) => {
      // Only delete from localStorage if not in designer mode
      if (!designerMode) {
        deleteColumnTemplate(id, name);
      }

      // Update local state (always do this for UI consistency)
      setTemplates((prev) => {
        const newTemplates = { ...prev };
        delete newTemplates[name];
        return newTemplates;
      });

      if (activeTemplate === name) {
        setActiveTemplate(undefined);
      }
    },
    [id, activeTemplate, designerMode],
  );

  // Column Management Menu Component
  const ColumnManagementMenu = useMemo(
    () =>
      function ColumnManagementMenu() {
        // Sort templates by lastUsed timestamp (most recent first)
        const sortedTemplates = Object.entries(templates)
          .map(([name, template]) => ({
            name,
            template,
            lastUsed: template.lastUsed || 0,
          }))
          .sort((a, b) => b.lastUsed - a.lastUsed);

        // Split into recent (top 2) and older templates
        const recentTemplates = sortedTemplates.slice(0, 2);
        const olderTemplates = sortedTemplates.slice(2);

        return (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Column Management
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setShowReorderDialog(true)}>
                Reorder Columns
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  // Reset column order and visibility to defaults
                  setColumnOrder(defaultColumnOrder);
                  setColumnVisibility({});
                  setActiveTemplate(undefined);
                }}
              >
                Reset Columns
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Layout Templates
              </DropdownMenuLabel>

              <DropdownMenuItem onClick={() => setShowSaveTemplateDialog(true)}>
                Save Current Layout
              </DropdownMenuItem>

              {sortedTemplates.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Recent Templates
                  </DropdownMenuLabel>

                  {/* Recent templates (top 2) */}
                  {recentTemplates.map(({ name }) => (
                    <DropdownMenuItem
                      key={name}
                      className="flex justify-between items-center"
                      onClick={() => applyTemplate(name)}
                    >
                      <div className="flex items-center">
                        {name === activeTemplate && (
                          <span className="mr-2">✓</span>
                        )}
                        <span
                          className={
                            name === activeTemplate ? "font-medium" : ""
                          }
                        >
                          {name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 ml-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTemplate(name);
                        }}
                      >
                        ✕
                      </Button>
                    </DropdownMenuItem>
                  ))}

                  {/* More submenu for older templates */}
                  {olderTemplates.length > 0 && (
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        More Templates ({olderTemplates.length})
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {olderTemplates.map(({ name }) => (
                          <DropdownMenuItem
                            key={name}
                            className="flex justify-between items-center"
                            onClick={() => applyTemplate(name)}
                          >
                            <div className="flex items-center">
                              {name === activeTemplate && (
                                <span className="mr-2">✓</span>
                              )}
                              <span
                                className={
                                  name === activeTemplate ? "font-medium" : ""
                                }
                              >
                                {name}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 ml-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTemplate(name);
                              }}
                            >
                              ✕
                            </Button>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  )}
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Toggle Visibility
              </DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      className="capitalize"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <Checkbox
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                        className="mr-2"
                      />
                      {column.id}
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    [
      open,
      defaultColumnOrder,
      templates,
      activeTemplate,
      applyTemplate,
      deleteTemplate,
      table,
    ],
  );

  // Column Reordering Dialog - using native HTML elements with dnd-kit
  // Capture props in the closure to ensure we have access to onColumnOrderChange
  const ColumnReorderingDialog = () => (
    <Dialog open={showReorderDialog} onOpenChange={setShowReorderDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reorder Columns</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (active && over && active.id !== over.id) {
                const activeId = active.id as string;
                const overId = over.id as string;

                const oldIndex = columnOrder.indexOf(activeId);
                const newIndex = columnOrder.indexOf(overId);

                if (oldIndex >= 0 && newIndex >= 0) {
                  // Mark this as an internal change before updating
                  isInternalChange.current = true;

                  // Simply update the column order - useEffect will handle notification
                  setColumnOrder(
                    arrayMove([...columnOrder], oldIndex, newIndex),
                  );
                }
              }
            }}
          >
            <SortableContext
              items={columnOrder.filter((colId) => {
                const column = table.getColumn(colId);
                return column?.getIsVisible();
              })}
              strategy={horizontalListSortingStrategy}
            >
              <ul className="border rounded-md p-4 list-none m-0">
                {columnOrder
                  .map((columnId) => {
                    const column = table.getColumn(columnId);
                    if (
                      !column ||
                      !column.getCanHide() ||
                      !column.getIsVisible()
                    )
                      return null;
                    return (
                      <DraggableItem
                        key={columnId}
                        id={columnId}
                        label={columnId}
                      />
                    );
                  })
                  .filter(Boolean)}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setShowReorderDialog(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Completely separated Template Dialog component
  const SaveTemplateDialog = ({
    open,
    onClose,
    onSave,
  }: {
    open: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
  }) => {
    // Use local state to avoid re-renders in parent
    const [localName, setLocalName] = useState("");

    // Reset local state when dialog opens
    useEffect(() => {
      if (open) {
        setLocalName("");
      }
    }, [open]);

    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Save Column Layout</DialogTitle>
            <DialogDescription>
              Save your current column layout as a template that you can easily
              switch back to later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter template name"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!localName.trim()}
              onClick={() => {
                if (localName.trim()) {
                  onSave(localName);
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Skip SSR to prevent hydration mismatch with drag-and-drop functionality
  const isClient = useSkipSSR();

  if (!isClient) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Column Management UI */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          <div className="text-xs text-muted-foreground">
            <span className="inline-flex items-center">
              <span>⋮⋮</span> Drag column headers to reorder
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColumnManagementMenu />
        </div>
      </div>

      {/* Column Reorder Dialog */}
      <ColumnReorderingDialog />

      {/* Template Saving Dialog - completely isolated component */}
      <SaveTemplateDialog
        open={showSaveTemplateDialog}
        onClose={() => setShowSaveTemplateDialog(false)}
        onSave={handleSaveTemplate}
      />

      {/* Only enable DnD functionality on client-side to prevent hydration issues */}
      {isClient ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={handleColumnDragEnd}
          // Add debugging callbacks to help diagnose issues
          // Improve auto-scrolling behavior
          autoScroll={{
            threshold: { x: 0.2, y: 0.2 }, // Start scrolling sooner
            acceleration: 15, // Faster scrolling
            interval: 5, // More frequent updates
            // Use layout shift compensation to improve position of dragged items
            layoutShiftCompensation: true,
          }}
          // Measure droppable containers more frequently during drag operations
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
        >
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    {/* Selection Header */}
                    {enableMultiRowSelection && (
                      <th className="w-12 h-12 px-4 text-left align-middle font-medium">
                        <Checkbox
                          checked={
                            table.getIsAllPageRowsSelected() ||
                            (selectedRowCount > 0 &&
                              table.getIsSomePageRowsSelected())
                          }
                          onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                          }
                          aria-label="Select all rows on this page"
                          className={
                            table.getIsSomePageRowsSelected()
                              ? "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
                              : ""
                          }
                          data-state={
                            table.getIsSomePageRowsSelected()
                              ? "indeterminate"
                              : undefined
                          }
                        />
                      </th>
                    )}
                    <SortableContext
                      items={table
                        .getVisibleLeafColumns()
                        .map((col) => col.id as string)}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header) => (
                        <DraggableHeader key={header.id} header={header} />
                      ))}
                    </SortableContext>
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading ? (
                  // Skeleton Loader - Make sure each key is truly unique
                  Array.from({ length: pagination.limit }).map((_, i) => (
                    <tr
                      key={`skeleton-row-${i}-${id}`}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      {enableMultiRowSelection && (
                        <td
                          key={`skeleton-checkbox-${i}-${id}`}
                          className="p-5 align-middle"
                        >
                          <Skeleton className="h-4 w-4" />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td
                          key={`skeleton-cell-${i}-${column.id}-${id}`}
                          className="p-4 align-middle"
                        >
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : error ? (
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td
                      colSpan={
                        columns.length + (enableMultiRowSelection ? 1 : 0)
                      }
                      className="h-24 text-center text-destructive p-4 align-middle"
                    >
                      Error loading data: {error.message}
                    </td>
                  </tr>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      data-state={row.getIsSelected() ? "selected" : undefined}
                    >
                      {/* Selection Cell */}
                      {enableMultiRowSelection && <SelectCell row={row} />}

                      <SortableContext
                        items={table
                          .getVisibleLeafColumns()
                          .map((col) => col.id as string)}
                        strategy={horizontalListSortingStrategy}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <DraggableCell key={cell.id} cell={cell} />
                        ))}
                      </SortableContext>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td
                      colSpan={
                        columns.length + (enableMultiRowSelection ? 1 : 0)
                      }
                      className="h-24 text-center p-4 align-middle"
                    >
                      No results.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DndContext>
      ) : (
        // Fallback for SSR - no drag and drop
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  {/* Selection Header */}
                  {enableMultiRowSelection && (
                    <th className="w-12 h-12 px-0 text-left align-middle font-medium">
                      <Checkbox
                        checked={
                          table.getIsAllPageRowsSelected() ||
                          (selectedRowCount > 0 &&
                            table.getIsSomePageRowsSelected())
                        }
                        onCheckedChange={(value) =>
                          table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all rows on this page"
                      />
                    </th>
                  )}
                  {headerGroup.headers
                    .filter((header) => header.column.getIsVisible())
                    .map((header) => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className="h-12 px-0 text-left align-middle font-medium"
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            className={cn(
                              "flex items-center gap-2",
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </button>
                        )}
                      </th>
                    ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                // Skeleton Loader
                Array.from({ length: pagination.limit }).map((_, i) => (
                  <tr
                    key={`skeleton-row-${i}-${id}`}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    {enableMultiRowSelection && (
                      <td
                        key={`skeleton-checkbox-${i}-${id}`}
                        className="p-4 align-middle"
                      >
                        <Skeleton className="h-4 w-4" />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={`skeleton-cell-${i}-${column.id}-${id}`}
                        className="p-4 align-middle"
                      >
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={columns.length + (enableMultiRowSelection ? 1 : 0)}
                    className="h-24 text-center text-destructive p-4 align-middle"
                  >
                    Error loading data: {error.message}
                  </td>
                </tr>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    data-state={row.getIsSelected() ? "selected" : undefined}
                  >
                    {/* Selection Cell */}
                    {enableMultiRowSelection && <SelectCell row={row} />}
                    {row.getVisibleCells().map((cell) => {
                      const meta = (cell.column.columnDef.meta as Meta) || {
                        render: "text",
                        props: {},
                      };
                      const renderType = meta?.render || "text";
                      const props = meta?.props || {};
                      const CellComponent =
                        CellRegistry[renderType].cellFunction;
                      if (!CellComponent) {
                        console.error(
                          `No cell component found for type: ${renderType}`,
                        );
                        return <td>Error {renderType}</td>;
                      }
                      return (
                        <CellComponent
                          cell={cell}
                          key={cell.id}
                          props={props}
                        />
                      );
                    })}
                    {/*{row.getVisibleCells().map((cell) => (*/}
                    {/*  <td key={cell.id} className="p-4 align-middle">*/}
                    {/*    {flexRender(*/}
                    {/*      cell.column.columnDef.cell,*/}
                    {/*      cell.getContext(),*/}
                    {/*    )}*/}
                    {/*  </td>*/}
                    {/*))}*/}
                  </tr>
                ))
              ) : (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    colSpan={columns.length + (enableMultiRowSelection ? 1 : 0)}
                    className="h-24 text-center p-4 align-middle"
                  >
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedRowCount > 0
            ? `${selectedRowCount} of ${pagination.total} row(s) selected.`
            : pagination.total > 0
              ? `${pagination.total} row(s) total.`
              : "No rows."}
          {/* Add Select All/None buttons */}
          {enableMultiRowSelection && pagination.total > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.toggleAllRowsSelected(true)}
                className="ml-2"
                disabled={isLoading}
              >
                Select All ({pagination.total})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.toggleAllRowsSelected(false)}
                className="ml-2"
                disabled={selectedRowCount === 0 || isLoading}
              >
                Select None
              </Button>
              <span className="ml-2 text-xs italic">
                (Note: Select All applies to all data, not just current page)
              </span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
