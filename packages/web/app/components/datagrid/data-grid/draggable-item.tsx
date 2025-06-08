// Helper component for dialog items
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";
import { cn } from "~/lib/utils";

export function DraggableItem({ id, label }: { id: string; label: string }) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    isDragging,
    setActivatorNodeRef
  } = useSortable({
    id,
    // Add data for consistency with other components
    data: {
      type: 'item',
      id,
      label
    }
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    // Only apply transition when not dragging to avoid interference
    transition: isDragging ? undefined : "transform 0.2s ease-in-out",
    // Use a higher z-index when dragging
    zIndex: isDragging ? 10 : 0,
    // Apply a shadow when dragging to better indicate the active element
    boxShadow: isDragging ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "none",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-2 mb-2 rounded flex items-center",
        isDragging ? "bg-blue-100 dark:bg-blue-900/30" : "bg-muted",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
    >
      <span 
        {...attributes}
        {...listeners}
        ref={setActivatorNodeRef}
        className="mr-2 select-none"
      >
        ⋮⋮
      </span>
      <span className="capitalize">{label}</span>
    </li>
  );
}
