import { Menu, Search, X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ShadcnContextMenu } from "./shadcn-context-menu";
import { TreeNode } from "./tree-node";
import type { TreeViewProps } from "./types";
import { transformToTreeData } from "./utils";

export function TreeView({
  items,
  title = "File Explorer",
  onMoveItem,
  onRenameItem,
  onDeleteItem,
  onCreateItem,
  onTitleSelected,
  titleContextMenuItems,
  nodeContextMenuItems,
  showNodeContextMenus = true,
  showMobileMenuButton = true,
  iconMap = {},
  className = "",
  initialExpandedState = {},
  removeEmptyFolders = false,
  selected,
  onExpandedChange,
  onSelectionChange,
}: TreeViewProps) {
  // State hooks must come first
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["root"]),
  );
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOverNode, setDragOverNode] = useState<string | null>(null);
  const [isRootDropZoneActive, setIsRootDropZoneActive] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Transform items to tree data
  const { nodeMap, rootChildren } = useMemo(
    () => transformToTreeData(items),
    [items],
  );

  // Filter nodes based on search term
  const filteredRootChildren = useMemo(() => {
    if (!searchTerm) return rootChildren;

    const searchLower = searchTerm.toLowerCase();
    const matchedNodes = new Set<string>();

    // Find all nodes that match the search
    for (const [, node] of nodeMap.entries()) {
      if (
        node.name.toLowerCase().includes(searchLower) ||
        node.path.toLowerCase().includes(searchLower)
      ) {
        matchedNodes.add(node.id);

        // Add all parent nodes to ensure they're visible
        let parent = node.parent;
        while (parent) {
          matchedNodes.add(parent.id);
          parent = parent.parent;
        }
      }
    }

    // Filter tree to only show matched nodes and their parents
    const filterTree = (nodes: typeof rootChildren): typeof rootChildren => {
      return nodes
        .filter((node) => matchedNodes.has(node.id))
        .map((node) => ({
          ...node,
          children: node.children ? filterTree(node.children) : null,
        }));
    };

    return filterTree(rootChildren);
  }, [rootChildren, nodeMap, searchTerm]);

  // Update selected state whenever the selected prop changes
  useEffect(() => {
    if (selected) {
      setSelectedNodes(new Set([selected]));
    } else {
      setSelectedNodes(new Set());
    }
  }, [selected]);

  // Set initial expanded state ONCE based on props
  useEffect(() => {
    if (!hasInitialized && rootChildren.length > 0) {
      const expandedSet = new Set<string>(["root"]); // Always include root

      // Helper function to recursively process nodes
      const processNodes = (nodes: typeof rootChildren) => {
        for (const node of nodes) {
          if (!node.isFile) {
            // Check if this specific node should be expanded
            if (initialExpandedState[node.id]) {
              expandedSet.add(node.id);
            } else if (initialExpandedState[node.id] === undefined) {
              // Default behavior for nodes not specified - expand first level only
              const pathDepth = node.path.split("/").filter(Boolean).length;
              if (pathDepth === 1) {
                expandedSet.add(node.id);
              }
            }
            // If initialExpandedState[node.id] === false, don't expand (explicit collapse)

            // Recursively process children
            if (node.children) {
              processNodes(node.children);
            }
          }
        }
      };

      processNodes(rootChildren);
      setExpandedNodes(expandedSet);
      setHasInitialized(true);

      // Notify parent of initial expanded state
      onExpandedChange?.(Array.from(expandedSet));
    }
  }, [rootChildren, initialExpandedState, hasInitialized, onExpandedChange]);

  // Expand all matched nodes when searching
  useEffect(() => {
    if (searchTerm) {
      const expandedSet = new Set<string>(["root"]);

      // Expand all parent nodes of matched items
      const expandMatches = (nodes: typeof rootChildren) => {
        for (const node of nodes) {
          if (!node.isFile && node.children?.length) {
            // If any child is in the filtered results, expand this node
            if (
              filteredRootChildren.some((filtered) => {
                const checkDescendants = (
                  n: (typeof rootChildren)[0] | null,
                ): boolean => {
                  if (!n) return false;
                  if (n.id === node.id) return true;
                  if (n.children) {
                    return n.children.some(checkDescendants);
                  }
                  return false;
                };
                return checkDescendants(filtered);
              })
            ) {
              expandedSet.add(node.id);
            }
          }
          if (node.children) {
            expandMatches(node.children);
          }
        }
      };

      expandMatches(filteredRootChildren);
      setExpandedNodes(expandedSet);
    }
  }, [searchTerm, filteredRootChildren]);

  const handleToggleExpand = useCallback(
    (nodeId: string) => {
      setExpandedNodes((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(nodeId)) {
          newSet.delete(nodeId);
        } else {
          newSet.add(nodeId);
        }

        // Notify parent of expanded state change
        onExpandedChange?.(Array.from(newSet));

        return newSet;
      });
    },
    [onExpandedChange],
  );

  const handleSelect = useCallback(
    (nodeId: string, multiSelect = false) => {
      // Only update internal selection state if 'selected' prop is not provided
      // This ensures we don't override the selected state from props
      if (selected === undefined) {
        setSelectedNodes((prev) => {
          let newSet: Set<string>;

          if (multiSelect) {
            newSet = new Set(prev);
            if (newSet.has(nodeId)) {
              newSet.delete(nodeId);
            } else {
              newSet.add(nodeId);
            }
          } else {
            newSet = new Set([nodeId]);
          }

          return newSet;
        });
      }

      // Always notify parent of selection change
      onSelectionChange?.([nodeId]);
    },
    [onSelectionChange, selected],
  );

  const handleRename = useCallback(
    (nodeId: string, newName: string) => {
      const node = nodeMap.get(nodeId);
      if (node && onRenameItem) {
        onRenameItem(nodeId, node.path, newName);
      }
    },
    [nodeMap, onRenameItem],
  );

  const handleDelete = useCallback(
    (nodeId: string) => {
      const node = nodeMap.get(nodeId);
      if (node && onDeleteItem) {
        onDeleteItem(nodeId, node.path);
      }
    },
    [nodeMap, onDeleteItem],
  );

  const handleCreateFile = useCallback(
    (parentId: string) => {
      const parentNode = nodeMap.get(parentId);
      if (parentNode) {
        onCreateItem(parentId, parentNode.path, "file");
      }
    },
    [nodeMap, onCreateItem],
  );

  const handleCreateFolder = useCallback(
    (parentId: string) => {
      const parentNode = nodeMap.get(parentId);
      if (parentNode) {
        onCreateItem(parentId, parentNode.path, "folder");
      }
    },
    [nodeMap, onCreateItem],
  );

  const handleDragStart = useCallback((nodeId: string) => {
    setDraggedNode(nodeId);
  }, []);

  const handleDragOver = useCallback((nodeId: string) => {
    setDragOverNode(nodeId);
  }, []);

  const handleDrop = useCallback(
    (draggedId: string, targetId: string) => {
      const draggedNodeData = nodeMap.get(draggedId);
      const targetNode = nodeMap.get(targetId);

      if (draggedNodeData && targetNode && !targetNode.isFile && onMoveItem) {
        // Perform the move
        onMoveItem(draggedId, draggedNodeData.path, targetNode.path);

        // Check for empty folders if option is enabled
        if (removeEmptyFolders && draggedNodeData.parent) {
          const parentNode = draggedNodeData.parent;

          // Check if parent folder will be empty after this move
          const remainingChildren =
            parentNode.children?.filter((child) => child.id !== draggedId) ||
            [];

          if (remainingChildren.length === 0 && onDeleteItem) {
            // Parent folder will be empty, schedule it for deletion
            setTimeout(() => {
              onDeleteItem(parentNode.id, parentNode.path);
            }, 0);
          }
        }
      }

      setDraggedNode(null);
      setDragOverNode(null);
    },
    [nodeMap, onMoveItem, onDeleteItem, removeEmptyFolders],
  );

  // Simple root drop zone handlers
  const handleRootDropZoneDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsRootDropZoneActive(true);
  }, []);

  const handleRootDropZoneDragLeave = useCallback(() => {
    setIsRootDropZoneActive(false);
  }, []);

  const handleRootDropZoneDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");
      const draggedNodeData = nodeMap.get(draggedId);

      if (draggedNodeData && onMoveItem) {
        onMoveItem(draggedId, draggedNodeData.path, "/");
      }

      setIsRootDropZoneActive(false);
      setDraggedNode(null);
      setDragOverNode(null);
    },
    [nodeMap, onMoveItem],
  );

  // Title handlers
  const handleTitleClick = useCallback(() => {
    setSelectedNodes(new Set());
    onSelectionChange?.([]);
    onTitleSelected?.();
  }, [onTitleSelected, onSelectionChange]);

  return (
    <div
      className={`w-full h-full border border-border rounded-none overflow-hidden bg-muted/50 ${className}`}
    >
      {/* Tree view title */}
      <div
        className="w-full relative p-3 border-b border-border cursor-pointer transition-colors flex items-center justify-between group"
        onClick={handleTitleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleTitleClick();
          }
        }}
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {/* Menu button with context menu */}
        {showMobileMenuButton &&
          titleContextMenuItems &&
          titleContextMenuItems.length > 0 && (
            <ShadcnContextMenu
              trigger={
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click triggering title click
                  }}
                  className="p-1 hover:bg-blue-200 dark:hover:bg-blue-700 rounded-md transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              }
              menuItems={titleContextMenuItems}
              align="start"
              side="bottom"
            />
          )}
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-8 py-1 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500
                       hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="h-full overflow-auto">
        {/* Tree Content */}
        <div className="p-2">
          {filteredRootChildren.length > 0 ? (
            <div className="space-y-0">
              {filteredRootChildren.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  level={0}
                  expandedNodes={expandedNodes}
                  selectedNodes={selectedNodes}
                  onToggleExpand={handleToggleExpand}
                  onSelect={handleSelect}
                  onRename={handleRename}
                  onDelete={handleDelete}
                  onCreateFile={handleCreateFile}
                  onCreateFolder={handleCreateFolder}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragOver={dragOverNode === node.id}
                  contextMenuItems={
                    typeof nodeContextMenuItems === "function"
                      ? nodeContextMenuItems(node.id)
                      : nodeContextMenuItems
                  }
                  showContextMenu={showNodeContextMenus}
                  showMobileMenuButton={showMobileMenuButton}
                  iconMap={iconMap}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "No files match your search"
                : "Right-click the title above to create a new file"}
            </div>
          )}

          {/* Discrete Root Drop Zone - only visible when dragging, at bottom */}
          {draggedNode && (
            <div
              className={`
                mt-3 mb-1 h-8 border-2 border-dashed rounded transition-all duration-200 flex items-center justify-center
                ${
                  isRootDropZoneActive
                    ? "border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/30"
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500"
                }
              `}
              onDragOver={handleRootDropZoneDragOver}
              onDragLeave={handleRootDropZoneDragLeave}
              onDrop={handleRootDropZoneDrop}
            >
              <span
                className={`text-xs font-medium ${
                  isRootDropZoneActive
                    ? "text-green-700 dark:text-green-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {isRootDropZoneActive
                  ? "Drop to move to root"
                  : "Drop here for root level"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
