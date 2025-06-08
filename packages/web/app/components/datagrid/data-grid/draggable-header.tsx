// --- Custom Draggable Table Components ---
// Simple th component that works with dnd-kit
import {flexRender, type Header} from "@tanstack/react-table";
import {useSortable} from "@dnd-kit/sortable";
import type {CSSProperties} from "react";
import {CSS} from "@dnd-kit/utilities";
import {cn} from "~/lib/utils";

export function DraggableHeader<TData>({
  header,
}: {
  header: Header<TData, unknown>;
}) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    isDragging,
    setActivatorNodeRef 
  } = useSortable({
    id: header.id,
    // Add data property to help with debugging
    data: {
      type: 'header',
      columnId: header.id,
      columnIndex: header.column.getIndex(),
      header: header.column.columnDef.header,
    }
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    // Only apply transition when not dragging to avoid interference
    transition: isDragging ? undefined : "width 0.2s ease-in-out",
    // Use a higher z-index when dragging
    zIndex: isDragging ? 10 : 0,
    // When dragging, use a blue outline to make it clear that this is what's being moved
    outline: isDragging ? "2px solid #3b82f6" : "none",
    // Add some padding when dragging to make the outline more visible
    padding: isDragging ? "2px" : "0",
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      colSpan={header.colSpan}
      className={cn(
        "h-12 px-0 text-left align-middle font-medium relative group",
        isDragging ? "bg-blue-50 dark:bg-blue-900/20" : ""
      )}
    >
      {header.isPlaceholder ? null : (
        <div className="flex flex-row gap-1 w-full">
          <button
            type="button"
            className="opacity-30 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-blue-500 hover:text-blue-700 pl-1 pr-2"
            {...attributes}
            {...listeners}
            ref={setActivatorNodeRef}
            onClick={(e) => e.stopPropagation()}
            aria-label="Drag to reorder column"
          >
            <span className="select-none">⋮⋮</span>
          </button>
          <button
            type="button"
            className={cn(
              "flex items-center gap-2 text-left",
              header.column.getCanSort() ? "cursor-pointer select-none" : "",
            )}
            onClick={header.column.getToggleSortingHandler()}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {{
              asc: " 🔼",
              desc: " 🔽",
            }[header.column.getIsSorted() as string] ?? null}
          </button>
        </div>
      )}
    </th>
  );
}