import type React from "react";
import { useMemo, useCallback, useRef } from "react";
import {
  Folder,
  FolderOpen,
  FileText,
  MoreVertical,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { ShadcnContextMenu } from "./shadcn-context-menu";
import type { TreeNodeProps, ContextMenuItem } from "./types";

export function TreeNode({
  node,
  level = 0,
  expandedNodes,
  selectedNodes,
  onToggleExpand,
  onSelect,
  onRename,
  onDelete,
  onCreateFile,
  onCreateFolder,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver = false,
  contextMenuItems,
  showContextMenu = true,
  showMobileMenuButton = true,
  iconMap = {},
}: TreeNodeProps) {
  // We're using dialog-based renaming instead of inline
  const nodeRef = useRef<HTMLDivElement>(null);

  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  // Get icon for node based on type or default behavior
  const getNodeIcon = useCallback(() => {
    // Check for custom icon first
    if (node.type && iconMap[node.type]) {
      const CustomIcon = iconMap[node.type];
      // Don't override the className - let the custom icon component handle its own styling
      return <CustomIcon />;
    }

    // Default behavior - folder icons for non-files
    if (!node.isFile) {
      return isExpanded ? (
        <FolderOpen className="w-4 h-4 text-blue-500 dark:text-blue-400" />
      ) : (
        <Folder className="w-4 h-4 text-blue-500 dark:text-blue-400" />
      );
    }

    // Default file icon
    return <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
  }, [node.type, node.isFile, isExpanded, iconMap]);

  // This is now just a placeholder for preventing the default context menu behavior
  // The actual menu is handled by ShadcnContextMenu
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!showContextMenu) return;
      e.preventDefault();
      e.stopPropagation();
      // We're not setting context menu position anymore, as ShadcnContextMenu is triggered by button click
    },
    [showContextMenu],
  );

  const handleRename = useCallback(() => {
    // Call the parent's rename handler with just id and name to match TreeView's handleRename signature
    console.log("TreeNode: handleRename clicked for node:", node);
    if (onRename) {
      console.log("TreeNode: Calling onRename with:", {
        id: node.id,
        name: node.name,
      });
      onRename(node.id, node.name);
    } else {
      console.warn("TreeNode: onRename function is not available");
    }
  }, [node.id, node.name, node, onRename]);

  // We're using dialog-based renaming in the parent component

  const handleDelete = useCallback(() => {
    onDelete(node.id);
  }, [node.id, onDelete]);

  const handleCreateFile = useCallback(() => {
    onCreateFile(node.id);
  }, [node.id, onCreateFile]);

  const handleCreateFolder = useCallback(() => {
    onCreateFolder(node.id);
  }, [node.id, onCreateFolder]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Only handle selection - don't expand/collapse folders
      onSelect(node.id, e.ctrlKey || e.metaKey);
    },
    [node.id, onSelect],
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Double-click on folders to expand/collapse
      if (!node.isFile) {
        onToggleExpand(node.id);
      }
    },
    [node.id, node.isFile, onToggleExpand],
  );

  const handleChevronClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Clicking chevron expands/collapses
      onToggleExpand(node.id);
    },
    [node.id, onToggleExpand],
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData("text/plain", node.id);
      onDragStart(node.id);
    },
    [node.id, onDragStart],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!node.isFile) {
        e.preventDefault();
        onDragOver(node.id);
      }
    },
    [node.id, node.isFile, onDragOver],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");
      if (draggedId !== node.id && !node.isFile) {
        onDrop(draggedId, node.id);
      }
    },
    [node.id, node.isFile, onDrop],
  );

  // Default context menu items
  const defaultMenuItems: ContextMenuItem[] = useMemo(() => {
    const items: ContextMenuItem[] = [];

    if (!node.isFile) {
      items.push(
        {
          label: "New File",
          icon: FileText,
          action: handleCreateFile,
        },
        {
          label: "New Folder",
          icon: Folder,
          action: handleCreateFolder,
        },
        { type: "separator" },
      );
    }

    items.push(
      {
        label: "Rename",
        icon: Edit2,
        action: handleRename,
      },
      {
        label: "Delete",
        icon: Trash2,
        action: handleDelete,
        danger: true,
      },
    );

    return items;
  }, [
    node.isFile,
    handleCreateFile,
    handleCreateFolder,
    handleRename,
    handleDelete,
  ]);

  const menuItems = contextMenuItems || defaultMenuItems;

  return (
    <div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        ref={nodeRef}
        className={`
          flex items-center py-1 px-2 rounded cursor-pointer group transition-colors
          ${
            isSelected
              ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }
          ${isDragOver ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" : ""}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        draggable={true}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        title={node.path}
      >
        {/* Expand/Collapse Arrow - clickable independently */}
        <div className="w-4 flex justify-center mr-1">
          {!node.isFile && hasChildren && (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              onClick={handleChevronClick}
              className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-0.5"
              title={isExpanded ? "Collapse folder" : "Expand folder"}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              )}
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="w-4 h-4 mr-2 flex-shrink-0">{getNodeIcon()}</div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <span className="text-sm truncate block text-gray-900 dark:text-gray-100">
            {node.name}
          </span>
        </div>

        {/* More Options with ShadcnContextMenu */}
        {showContextMenu && (
          <ShadcnContextMenu
            trigger={
              <button
                type="button"
                onClick={(e) => e.stopPropagation()} // Prevent click triggering selection
                className={`ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors
                         ${
                           showMobileMenuButton
                             ? "opacity-100"
                             : "opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                         }`}
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </button>
            }
            menuItems={menuItems}
            align="end"
            side="bottom"
          />
        )}
      </div>

      {/* Old Context Menu - Removed as we're using ShadcnContextMenu */}

      {/* Children */}
      {!node.isFile && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              selectedNodes={selectedNodes}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              isDragOver={isDragOver}
              contextMenuItems={contextMenuItems}
              showContextMenu={showContextMenu}
              showMobileMenuButton={showMobileMenuButton}
              iconMap={iconMap}
            />
          ))}
        </div>
      )}
    </div>
  );
}
