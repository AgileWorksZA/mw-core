import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// Simple td component that works with dnd-kit
import type { Cell } from "@tanstack/react-table";
import type { CSSProperties } from "react";
import {
  type CellProps,
  CellRegistry,
  type CellRegistryType,
  type Meta,
} from "~/components/datagrid/data-grid/data-grid";
import { cn } from "~/lib/utils";

export function DraggableCell<TData>({
  cell,
}: {
  cell: Cell<TData, unknown>;
}) {
  const { setNodeRef, transform, isDragging } = useSortable({
    id: cell.column.id,
    // Add data property to align with header implementation
    data: {
      type: "cell",
      columnId: cell.column.id,
      columnIndex: cell.column.getIndex(),
    },
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    // Only apply transition when not dragging to avoid interference
    transition: isDragging ? undefined : "width transform 0.2s ease-in-out",
    zIndex: isDragging ? 1 : 0,
  };

  const meta = (cell.column.columnDef.meta as Meta) || {
    render: "text",
    props: {},
  };
  const renderType = meta?.render || "text";
  const props = meta?.props || {};
  const CellComponent = CellRegistry[renderType].cellFunction;
  if (!CellComponent) {
    console.error(`No cell component found for type: ${renderType}`);
    return <td>Error</td>;
  }
  return (
    <CellComponent<TData, unknown, CellProps>
      ref={setNodeRef}
      style={style}
      className={cn(isDragging ? "bg-blue-50 dark:bg-blue-900/20" : "")}
      cell={cell}
      key={cell.id}
      props={props}
    />
  );
}
