import type { ColumnDef } from "@tanstack/react-table";
import type { AccessorKeyColumnDefBase } from "@tanstack/table-core";
import React from "react";
import { TypeIcon } from "~/components/datagrid/designer/components/type-icon";
import { type SchemaMetaProperties } from "~/components/datagrid/designer/types";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Single column item component that can be dragged
function DraggableColumnItem({
  column,
  selectedIdField,
  onSelect,
  onRemove,
  index,
}: {
  column: AccessorKeyColumnDefBase<unknown>;
  selectedIdField: string;
  onSelect: () => void;
  onRemove: () => void;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id as string,
    data: {
      type: "column",
      column,
      index,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted cursor-pointer mb-1",
        isDragging ? "bg-primary/10 border border-primary/30" : "border",
      )}
      onClick={onSelect}
    >
      <div className="flex-1">
        <div className="font-medium flex items-center gap-2">
          <span
            className="cursor-grab active:cursor-grabbing text-muted-foreground pr-2"
            {...listeners}
          >
            ⋮⋮
          </span>
          {(column as any).header || column.id}
          {(column as { accessorKey: string })?.accessorKey === selectedIdField && (
            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 0 1 .672 0 41.059 41.059 0 0 1 8.198 5.424.75.75 0 0 1-.254 1.285 23.89 23.89 0 0 1-5.949 1.07c-.066 1.683-.33 3.448-.806 5.204-.098.38-.182.632-.276.89a.75.75 0 0 1-1.248.13 32.81 32.81 0 0 1-4.017-7.189.75.75 0 0 1 .143-.534c.111-.12.451-.307 1.196-.307h1.765a1.5 1.5 0 1 0-1.193-2.398.75.75 0 0 1-1.194-.91c.204-.266.428-.52.67-.759A43.882 43.882 0 0 1 9.664 1.32ZM8 16.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
              </svg>
              ID
            </span>
          )}
        </div>
        <div className="text-xs flex items-center gap-2 mt-1">
          <TypeIcon 
            type={(column.meta as SchemaMetaProperties)?.type || "calculated"} 
            showLabel={true} 
            size="sm"
          />
          {(column.meta as SchemaMetaProperties)?.required && (
            <span className="text-red-600 dark:text-red-400 text-xs">Required</span>
          )}
          <span className="text-muted-foreground">
            {((column as { accessorKey: string })
              ?.accessorKey as string) || "calculated"}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        Remove
      </Button>
    </div>
  );
}

// The column that is currently being dragged
function DragOverlayContent({ column, selectedIdField }: { column: AccessorKeyColumnDefBase<unknown>, selectedIdField: string }) {
  if (!column) return null;

  return (
    <div className="flex items-center justify-between p-2 bg-background border-2 border-primary rounded-md shadow-md w-[97%]">
      <div>
        <div className="font-medium flex items-center gap-2">
          {(column as any).header || column.id}
          {(column as { accessorKey: string })?.accessorKey === selectedIdField && (
            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 0 1 .672 0 41.059 41.059 0 0 1 8.198 5.424.75.75 0 0 1-.254 1.285 23.89 23.89 0 0 1-5.949 1.07c-.066 1.683-.33 3.448-.806 5.204-.098.38-.182.632-.276.89a.75.75 0 0 1-1.248.13 32.81 32.81 0 0 1-4.017-7.189.75.75 0 0 1 .143-.534c.111-.12.451-.307 1.196-.307h1.765a1.5 1.5 0 1 0-1.193-2.398.75.75 0 0 1-1.194-.91c.204-.266.428-.52.67-.759A43.882 43.882 0 0 1 9.664 1.32ZM8 16.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
              </svg>
              ID
            </span>
          )}
        </div>
        <div className="text-xs flex items-center gap-2 mt-1">
          <TypeIcon 
            type={(column.meta as SchemaMetaProperties)?.type || "calculated"} 
            showLabel={true} 
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

export function DraggableColumnList({
  columns,
  selectedIdField,
  onColumnsReordered,
  onColumnSelect,
  onColumnRemove,
}: {
  columns: ColumnDef<unknown>[];
  selectedIdField: string;
  onColumnsReordered: (newColumns: ColumnDef<unknown>[]) => void;
  onColumnSelect: (column: AccessorKeyColumnDefBase<unknown>) => void;
  onColumnRemove: (columnId: string) => void;
}) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  
  // Get the active column
  const activeColumn = React.useMemo(() => {
    if (!activeId) return null;
    return columns.find((col) => col.id === activeId) as AccessorKeyColumnDefBase<unknown>;
  }, [activeId, columns]);

  // Configure the sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end - reorder columns
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // Create a new array with the changed order
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        
        // Call the callback with the new order
        onColumnsReordered(newColumns);
        
        console.log("Draggable Column List - Column order changed:", 
          newColumns.map(col => col.id));
      }
    }
    
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => setActiveId(event.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={columns.map((col) => col.id as string)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1">
          {columns.map((column, index) => (
            <DraggableColumnItem
              key={column.id as string}
              column={column as AccessorKeyColumnDefBase<unknown>}
              selectedIdField={selectedIdField}
              onSelect={() => onColumnSelect(column as AccessorKeyColumnDefBase<unknown>)}
              onRemove={() => onColumnRemove(column.id as string)}
              index={index}
            />
          ))}
        </div>
      </SortableContext>
      
      <DragOverlay adjustScale={true}>
        {activeColumn ? (
          <DragOverlayContent 
            column={activeColumn} 
            selectedIdField={selectedIdField}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}