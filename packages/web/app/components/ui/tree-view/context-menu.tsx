import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { ContextMenuProps, ContextMenuItem } from "./types";

export function ContextMenu({
  isOpen,
  x,
  y,
  onClose,
  menuItems = [],
  className = "",
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });

  // Enhanced click outside detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Check if click is outside both main menu and submenu
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(target);
      const isOutsideSubmenu = !submenuRef.current || (submenuRef.current && !submenuRef.current.contains(target));
      
      if (isOutsideMenu && isOutsideSubmenu) {
        event.stopPropagation();
        onClose();
      }
    }

    // Also handle escape key
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      // Use capture phase to ensure we get the event first
      document.addEventListener("mousedown", handleClickOutside, true);
      document.addEventListener("keydown", handleEscapeKey, true);
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside, true);
        document.removeEventListener("keydown", handleEscapeKey, true);
      };
    }
  }, [isOpen, onClose]);

  // Reset submenu when menu closes
  useEffect(() => {
    if (!isOpen) {
      setOpenSubmenu(null);
    }
  }, [isOpen]);

  if (!isOpen || menuItems.length === 0) return null;

  const handleSubmenuHover = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setSubmenuPosition({
      x: rect.right - x + 2,
      y: rect.top - y,
    });
    setOpenSubmenu(index);
  };

  const renderMenuItem = (item: ContextMenuItem, index: number, isSubmenu = false): React.ReactNode => {
    if (item.type === "separator") {
      return (
        <hr
          key={index}
          className="my-1 border-gray-200 dark:border-gray-700"
        />
      );
    }

    if (item.type === "label") {
      return (
        <div
          key={index}
          className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        >
          {item.label}
        </div>
      );
    }

    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
      <button
        key={index}
        type="button"
        className={`
          w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 
          flex items-center justify-between gap-2 transition-colors
          ${item.danger ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"}
          ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onClick={
          item.disabled
            ? undefined
            : hasSubmenu
            ? undefined // Don't handle click for parent items with submenus
            : (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (item.action) {
                  item.action();
                }
                onClose();
              }
        }
        onMouseEnter={hasSubmenu ? (e) => handleSubmenuHover(index, e) : undefined}
        onMouseLeave={hasSubmenu ? () => setOpenSubmenu(null) : undefined}
        disabled={item.disabled}
      >
        <div className="flex items-center gap-2">
          {item.icon && <item.icon className="w-4 h-4" />}
          {item.label}
        </div>
        {hasSubmenu && <ChevronRight className="w-4 h-4" />}
      </button>
    );
  };

  return (
    <>
      <div
        ref={menuRef}
        className={`
          fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
          rounded-md shadow-lg py-1 z-50 min-w-40 ${className}
        `}
        style={{ left: x, top: y }}
        onClick={(e) => e.stopPropagation()}
      >
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </div>

      {/* Render submenu if open */}
      {openSubmenu !== null && menuItems[openSubmenu]?.submenu && (
        <div
          ref={submenuRef}
          className={`
            fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
            rounded-md shadow-lg py-1 z-50 min-w-40
          `}
          style={{ 
            left: x + submenuPosition.x, 
            top: y + submenuPosition.y 
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setOpenSubmenu(openSubmenu)}
          onMouseLeave={() => setOpenSubmenu(null)}
        >
          {menuItems[openSubmenu].submenu!.map((item, index) => 
            renderMenuItem(item, index, true)
          )}
        </div>
      )}
    </>
  );
}