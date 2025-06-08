import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Edit2,
  FileText,
  Plus,
  Trash2,
  Layers,
  Lock,
  Variable,
} from "lucide-react";
import { listAdapters } from "~/modules/ide/adapter/register";
import {
  type ContextMenuItem,
  type TreeItem,
  TreeView,
} from "~/components/ui/tree-view";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useIdeTrigger } from "~/modules/ide/hooks/use-ide-trigger";
import { useIde } from "~/modules/ide/hooks/use-ide";

/**
 * File Tree Component using the new TreeView
 */
export function FileTree({ className }: { className?: string }) {
  const { id: currentId } = useParams();
  const navigate = useNavigate();
  const { files = {}, fileOrder = [], name = "", expandedPaths = [] } = useIde() || {};
  const trigger = useIdeTrigger();

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    path: string;
  } | null>(null);

  // State for rename dialog
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [itemToRename, setItemToRename] = useState<{
    id: string;
    path: string;
  } | null>(null);
  const [newItemName, setNewItemName] = useState("");

  // Transform files into tree items
  const treeItems = useMemo(() => {
    if (!fileOrder?.length) return [];

    const items: TreeItem[] = [];
    const virtualFolders = new Set<string>();

    for (const fileId of fileOrder) {
      const file = files[fileId];
      if (!file) continue;

      // Access nested structure - files have data.manifest
      const manifest = file;
      if (!manifest) continue;

      // Add the file
      items.push({
        id: manifest.id,
        path: manifest.path,
        type: manifest.type === "folder" ? "folder" : manifest.type,
      });

      // Create virtual folders for parent directories
      const parts = manifest.path.split("/").filter(Boolean);
      let currentPath = "";

      for (let i = 0; i < parts.length - 1; i++) {
        currentPath += `/${parts[i]}`;
        if (!virtualFolders.has(currentPath)) {
          virtualFolders.add(currentPath);
          items.push({
            id: `folder-${currentPath}`,
            path: currentPath,
            type: "folder",
          });
        }
      }
    }

    return items;
  }, [files, fileOrder]);

  // Create initial expanded state from expandedPaths
  const initialExpandedState = useMemo(() => {
    const state: Record<string, boolean> = {};
    if (expandedPaths && Array.isArray(expandedPaths)) {
      for (const path of expandedPaths) {
        // Find the item with this path
        const item = treeItems.find((item) => {
          const itemPath = item.path.replace(/^\//, ""); // Remove leading slash
          return itemPath.startsWith(path);
        });
        if (item) {
          state[item.id] = true;
        }
      }
    }
    return state;
  }, [expandedPaths, treeItems]);

  // Handle expanded state changes
  const handleExpandedChange = useCallback(
    (expandedNodeIds: string[]) => {
      if (!trigger) return;

      // Get paths from expanded nodes
      const paths = expandedNodeIds
        .map((id) => {
          const item = treeItems.find((item) => item.id === id);
          return item?.path.replace(/^\//, "") || "";
        })
        .filter(Boolean);

      // Only update if changed
      if (
        JSON.stringify(paths.sort()) !==
        JSON.stringify([...(expandedPaths || [])].sort())
      ) {
        trigger.update({
          context: {
            expandedPaths: paths,
          },
        });
      }
    },
    [treeItems, expandedPaths, trigger],
  );

  // Handle selection changes
  const handleSelectionChange = useCallback(
    (selectedNodeIds: string[]) => {
      // Get the first selected node (single selection)
      const selectedId = selectedNodeIds[0];
      if (!selectedId) return;

      // Handle virtual folders
      if (selectedId.startsWith("folder-")) {
        const path = selectedId.substring(7); // Remove 'folder-' prefix
        navigate(`/ide/items?path=${encodeURIComponent(path)}`);
        return;
      }

      const item = treeItems.find((item) => item.id === selectedId);
      if (!item || !files[item.id]) return;

      const manifest = files[item.id];
      if (!manifest) return;

      if (manifest.type === "folder") {
        // Navigate to dashboard for folders
        navigate(`/ide/items?path=${encodeURIComponent(manifest.path)}`);
      } else {
        // Navigate to file details for files
        navigate(`/ide/${manifest.type}/${item.id}`);
      }
    },
    [treeItems, files, navigate],
  );

  // Handle move operations
  const handleMoveItem = useCallback(
    (itemId: string, sourcePath: string, targetPath: string) => {
      if (!trigger) return;

      // Update file order based on move
      const newOrder = [...fileOrder];
      const file = files[itemId];
      const name = file.path.split("/").pop() || "";
      const sourceIndex = fileOrder.indexOf(itemId);

      if (sourceIndex !== -1) {
        // Remove from current position
        newOrder.splice(sourceIndex, 1);

        // Find target position
        let targetIndex = newOrder.length; // Default to end

        // If moving to a folder, place after the last item in that folder
        if (targetPath !== "/") {
          const targetFolderPrefix = `${targetPath}/`;
          for (let i = newOrder.length - 1; i >= 0; i--) {
            const manifest = files[newOrder[i]];
            const itemPath = manifest?.path || "";
            if (itemPath.startsWith(targetFolderPrefix)) {
              targetIndex = i + 1;
              break;
            }
          }
          file.path = `${targetPath}/${name}`;
        } else {
          file.path = name;
        }

        // Insert at target position
        newOrder.splice(targetIndex, 0, itemId);

        // Update file order
        trigger.update({
          context: {
            fileOrder: newOrder,
            files,
          },
        });
      }
    },
    [fileOrder, files, trigger],
  );

  // Simple function to initiate rename
  const initiateRename = useCallback(
    (itemId: string) => {
      // Check if we have valid data
      if (!trigger || !files[itemId]) {
        console.error("Cannot rename: trigger or file not found");
        return;
      }

      // Get file info
      const file = files[itemId];
      const filePath = file.path;

      // Extract the current name from the path
      const currentName = filePath.split("/").pop() || "";

      // Set up dialog state
      setItemToRename({ id: itemId, path: filePath });
      setNewItemName(currentName);

      // Open the dialog
      setRenameDialogOpen(true);
    },
    [files, trigger],
  );

  // Function to handle the actual rename operation
  const handleRenameConfirmed = useCallback(() => {
    if (
      !itemToRename ||
      !trigger ||
      !files[itemToRename.id] ||
      !newItemName.trim()
    ) {
      console.error("Cannot complete rename: missing required data");
      return;
    }

    try {
      const { id, path } = itemToRename;

      // Get directory part of the path
      const pathParts = path.split("/");
      pathParts.pop(); // Remove filename

      // Create new path
      const newPath = [...pathParts, newItemName.trim()].join("/");

      // Call the rename method from the store
      trigger.rename({
        id,
        path: newPath,
      });

      // Reset dialog state
      setRenameDialogOpen(false);
      setItemToRename(null);
      setNewItemName("");
    } catch (error) {
      console.error("Error renaming file:", error);
      setRenameDialogOpen(false);
      alert(
        `Failed to rename file: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }, [itemToRename, newItemName, files, trigger]);

  // Dummy handler for TreeView's onRenameItem - we'll do direct rename instead
  const handleRenameItem = useCallback(
    (itemId: string) => {
      // Ignore the TreeView's rename functionality and use our own
      initiateRename(itemId);
    },
    [initiateRename],
  );

  // Handle initiating a delete operation - opens the dialog
  const initiateDelete = useCallback(
    (itemId: string, path: string) => {
      if (!trigger || !files[itemId]) return;

      // Set the item to be deleted and open the dialog
      setItemToDelete({ id: itemId, path });
      setDeleteDialogOpen(true);
    },
    [files, trigger],
  );

  // Actually perform the delete operation after confirmation
  const handleDeleteConfirmed = useCallback(async () => {
    if (!itemToDelete || !trigger || !files[itemToDelete.id]) return;

    const { id: itemId, path } = itemToDelete;

    try {
      // Get file type from the manifest
      const manifest = files[itemId];
      const fileType = manifest.type;

      // First, delete the file from the server by sending a DELETE request
      const response = await fetch(`/api/ide/${fileType}/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`);
      }

      // Close the dialog
      setDeleteDialogOpen(false);
      setItemToDelete(null);

      const project = await response.json();

      // Update the project context
      trigger.update({ context: project, noEmit: true });

      if (itemId === currentId) {
        // If the deleted item was the current selection, navigate back to the IDE home
        navigate("/ide", {
          replace: true,
          flushSync: true,
          viewTransition: true,
        });
      }

      // Navigate back to the IDE home
      // window.location.href = "/ide";
    } catch (error) {
      console.error("Error deleting file:", error);
      // Close the dialog but show an error
      setDeleteDialogOpen(false);
      alert(
        `Failed to delete file: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }, [itemToDelete, files, trigger, currentId, navigate]);

  // Handle create operations
  const handleCreateItem = useCallback(
    (parentId: string, parentPath: string, type: "file" | "folder") => {
      // Not implemented for now - using the New File Menu
      console.log("Create item:", { parentId, parentPath, type });
    },
    [],
  );

  // Title context menu for creating new files and viewing by type
  const titleContextMenuItems: ContextMenuItem[] = useMemo(() => {
    const items: ContextMenuItem[] = [];
    const adapters = listAdapters();

    // Group adapters by category
    const adaptersByCategory = new Map<string, typeof adapters>();
    const uncategorized: typeof adapters = [];

    for (const adapter of adapters) {
      const category = adapter.metadata?.category || "uncategorized";
      if (category === "uncategorized") {
        uncategorized.push(adapter);
      } else {
        if (!adaptersByCategory.has(category)) {
          adaptersByCategory.set(category, []);
        }
        adaptersByCategory.get(category)?.push(adapter);
      }
    }

    // Create submenu - group items by category
    const createMenuItems: ContextMenuItem[] = [];

    // Add categorized items first
    for (const [category, categoryAdapters] of adaptersByCategory) {
      // Add category as separator
      if (createMenuItems.length > 0) {
        createMenuItems.push({ type: "separator" });
      }

      createMenuItems.push({
        label: category,
        type: "label",
      });

      for (const adapter of categoryAdapters) {
        createMenuItems.push({
          label: adapter.metadata?.name || adapter.type,
          icon: adapter.Icon,
          action: () => {
            navigate(`/ide/new/${adapter.type}`);
          },
        });
      }
    }

    // Add uncategorized items
    if (uncategorized.length > 0) {
      if (createMenuItems.length > 0) {
        createMenuItems.push({ type: "separator" });
      }

      for (const adapter of uncategorized) {
        createMenuItems.push({
          label: adapter.metadata?.name || adapter.type,
          icon: adapter.Icon,
          action: () => {
            navigate(`/ide/new/${adapter.type}`);
          },
        });
      }
    }

    // View by type submenu - also group by category
    const viewByTypeItems: ContextMenuItem[] = [];

    // Add categorized items first
    for (const [category, categoryAdapters] of adaptersByCategory) {
      if (viewByTypeItems.length > 0) {
        viewByTypeItems.push({ type: "separator" });
      }

      viewByTypeItems.push({
        label: category,
        type: "label",
      });

      for (const adapter of categoryAdapters) {
        viewByTypeItems.push({
          label: adapter.metadata?.name || adapter.type,
          icon: adapter.Icon,
          action: () => {
            navigate(`/ide/by/${adapter.type}`);
          },
        });
      }
    }

    // Add uncategorized items to view by type
    if (uncategorized.length > 0) {
      if (viewByTypeItems.length > 0) {
        viewByTypeItems.push({ type: "separator" });
      }

      for (const adapter of uncategorized) {
        viewByTypeItems.push({
          label: adapter.metadata?.name || adapter.type,
          icon: adapter.Icon,
          action: () => {
            navigate(`/ide/by/${adapter.type}`);
          },
        });
      }
    }

    // Main menu items
    items.push({
      label: "Create",
      icon: Plus,
      submenu: createMenuItems,
    });

    items.push({
      label: "View by Type",
      icon: Layers,
      submenu: viewByTypeItems,
    });

    items.push({ type: "separator" });

    items.push({
      label: "Variables",
      icon: Variable,
      action: () => {
        navigate("/ide/variables");
      },
    });

    items.push({
      label: "Secrets",
      icon: Lock,
      action: () => {
        navigate("/ide/secrets");
      },
    });

    return items;
  }, [navigate]);

  // Create a function to generate context menu items for a specific node
  const createNodeContextMenuItems = useCallback(
    (nodeId: string) => {
      const items: ContextMenuItem[] = [];

      // Get the file info
      const manifest = files[nodeId];

      if (manifest && manifest.type !== "folder") {
        // Add file-specific methods
        items.push({
          label: "Open",
          icon: FileText,
          action: () => navigate(`/ide/${manifest.type}/${nodeId}`),
        });

        items.push({
          label: "Duplicate",
          icon: Plus,
          action: () => {
            console.log("Duplicate file:", nodeId);
            // TODO: Implement file duplication
          },
        });

        items.push({ type: "separator" });
      }

      // These will be handled by TreeView's internal functionality
      items.push({
        label: "Rename",
        icon: Edit2,
        action: () => initiateRename(nodeId),
      });

      items.push({
        label: "Delete",
        icon: Trash2,
        action: () => {
          const manifest = files[nodeId];
          initiateDelete(nodeId, manifest?.path || "");
        },
        danger: true,
      });

      return items;
    },
    [files, navigate, initiateDelete, initiateRename],
  );

  // Handle title selection (clicking on "IDE")
  const handleTitleSelected = useCallback(() => {
    navigate("/ide");
  }, [navigate]);

  // Create iconMap from adapters
  const iconMap = useMemo(() => {
    const map: Record<string, any> = {};
    const adapters = listAdapters();

    for (const adapter of adapters) {
      if (adapter.Icon) {
        map[adapter.type] = adapter.Icon;
      }
    }

    return map;
  }, []);

  // No direct rename buttons - using context menu instead
  const treeContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={treeContainerRef} className="relative">
      <TreeView
        items={treeItems}
        title={name || "Project"}
        selected={currentId}
        initialExpandedState={initialExpandedState}
        onExpandedChange={handleExpandedChange}
        onSelectionChange={handleSelectionChange}
        onMoveItem={handleMoveItem}
        onRenameItem={handleRenameItem}
        onDeleteItem={() => {}}
        onCreateItem={handleCreateItem}
        onTitleSelected={handleTitleSelected}
        titleContextMenuItems={titleContextMenuItems}
        nodeContextMenuItems={createNodeContextMenuItems}
        showMobileMenuButton={true}
        iconMap={iconMap}
        className={className}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              {itemToDelete?.path && (
                <span className="font-medium">{itemToDelete.path}</span>
              )}
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Item</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <label
                htmlFor="current-path"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
              >
                Current Path
              </label>
              <Input
                id="current-path"
                value={itemToRename?.path || ""}
                readOnly
                className="cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="new-name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
              >
                New Name
              </label>
              <Input
                id="new-name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter new name"
                className="focus:border-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleRenameConfirmed();
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRenameDialogOpen(false);
                setItemToRename(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameConfirmed}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
