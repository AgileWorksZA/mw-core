import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreVertical, ChevronRight } from "lucide-react";
import type { ContextMenuItem } from "./types";

interface ShadcnContextMenuProps {
  trigger: React.ReactNode;
  menuItems: ContextMenuItem[];
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  className?: string;
}

export function ShadcnContextMenu({
  trigger,
  menuItems,
  align = "end",
  side = "bottom",
  sideOffset = 4,
  className,
}: ShadcnContextMenuProps) {
  if (!menuItems.length) return null;

  const renderMenuItem = (item: ContextMenuItem) => {
    if (item.type === "separator") {
      return <DropdownMenuSeparator />;
    }

    if (item.type === "label") {
      return <DropdownMenuLabel>{item.label}</DropdownMenuLabel>;
    }

    // Check if item has submenu
    if (item.submenu && item.submenu.length > 0) {
      return (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            <span>{item.label}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {item.submenu.map((subItem, idx) => (
              <React.Fragment key={`${subItem.label || ""}-${idx}`}>
                {renderMenuItem(subItem)}
              </React.Fragment>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    return (
      <DropdownMenuItem
        disabled={item.disabled}
        onClick={(e) => {
          e.stopPropagation();
          console.log("Context menu item clicked:", item.label);
          if (item.action) {
            console.log("Executing context menu action for:", item.label);
            item.action();
          } else {
            console.warn("No action defined for context menu item:", item.label);
          }
        }}
        variant={item.danger ? "destructive" : "default"}
      >
        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
        <span>{item.label}</span>
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={className}
      >
        {menuItems.map((item, idx) => (
          <React.Fragment key={`${item.label || ""}-${idx}`}>
            {renderMenuItem(item)}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Default trigger button component
export function ContextMenuTriggerButton({
  onClick,
  className = "",
}: {
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${className}`}
      onClick={onClick}
    >
      <MoreVertical className="h-4 w-4" />
      <span className="sr-only">Menu</span>
    </Button>
  );
}
