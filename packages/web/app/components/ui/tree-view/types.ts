import type { LucideIcon } from "lucide-react";

export interface TreeItem {
  id: string;
  path: string;
  type?: string;
}

export interface TreeNode {
  id: string;
  name: string;
  path: string;
  type?: string;
  isFile: boolean;
  children: TreeNode[] | null;
  parent: TreeNode | null;
}

export interface ContextMenuItem {
  label?: string;
  icon?: LucideIcon;
  action?: () => void;
  danger?: boolean;
  disabled?: boolean;
  type?: "separator" | "label";
  submenu?: ContextMenuItem[];
}

export interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  menuItems?: ContextMenuItem[];
  className?: string;
}

export interface TreeNodeProps {
  node: TreeNode;
  level?: number;
  expandedNodes: Set<string>;
  selectedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  onSelect: (nodeId: string, multiSelect?: boolean) => void;
  onRename: (nodeId: string, newName: string) => void;
  onDelete: (nodeId: string) => void;
  onCreateFile: (parentId: string) => void;
  onCreateFolder: (parentId: string) => void;
  onDragStart: (nodeId: string) => void;
  onDragOver: (nodeId: string) => void;
  onDrop: (draggedId: string, targetId: string) => void;
  isDragOver?: boolean;
  contextMenuItems?: ContextMenuItem[];
  showContextMenu?: boolean;
  showMobileMenuButton?: boolean;
  iconMap?: Record<string, LucideIcon>;
}

export interface TreeViewProps {
  items: TreeItem[];
  title?: string;
  onMoveItem?: (itemId: string, sourcePath: string, targetPath: string) => void;
  onRenameItem?: (itemId: string, currentPath: string, newName: string) => void;
  onDeleteItem?: (itemId: string, path: string) => void;
  onCreateItem: (
    parentId: string,
    parentPath: string,
    type: "file" | "folder",
  ) => void;
  onTitleSelected?: () => void;
  titleContextMenuItems?: ContextMenuItem[];
  nodeContextMenuItems?:
    | ContextMenuItem[]
    | ((nodeId: string) => ContextMenuItem[]);
  showNodeContextMenus?: boolean;
  showMobileMenuButton?: boolean;
  iconMap?: Record<string, LucideIcon>;
  className?: string;
  // Initial expand state - Record of nodeId to expanded boolean
  initialExpandedState?: Record<string, boolean>;
  // Remove empty folders after moving items out
  removeEmptyFolders?: boolean;
  // Selected item ID
  selected?: string;
  // Event handlers for state changes
  onExpandedChange?: (expandedNodeIds: string[]) => void;
  onSelectionChange?: (selectedNodeIds: string[]) => void;
}
