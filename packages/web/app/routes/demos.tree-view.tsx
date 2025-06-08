import type React from "react";
import { useState, useCallback } from "react";
import {
  Folder,
  FileText,
  Code2,
  FileJson,
  Hash,
  Image,
  Settings,
  Edit2,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TreeView, type TreeItem, type ContextMenuItem } from "~/components/ui/tree-view";

// Example usage component with custom icons
export default function TreeViewDemo() {
  // Mock data for demo
  const mockItems: TreeItem[] = [
    { id: "1", path: "/src", type: "folder" }, // Virtual folder
    { id: "2", path: "/src/components", type: "folder" }, // Virtual folder
    { id: "3", path: "/src/components/Button.tsx", type: "typescript" },
    { id: "4", path: "/src/components/Modal.tsx", type: "typescript" },
    { id: "5", path: "/src/utils", type: "folder" }, // Virtual folder
    { id: "6", path: "/src/utils/helpers.ts", type: "typescript" },
    { id: "7", path: "/src/utils/constants.ts", type: "typescript" },
    { id: "8", path: "/package.json", type: "json" },
    { id: "9", path: "/README.md", type: "markdown" },
    { id: "10", path: "/src/hooks", type: "folder" }, // Virtual folder
    { id: "11", path: "/src/hooks/useAuth.ts", type: "typescript" },
    { id: "12", path: "/src/pages", type: "folder" }, // Virtual folder
    { id: "13", path: "/src/pages/Home.tsx", type: "typescript" },
    { id: "14", path: "/src/pages/About.tsx", type: "typescript" },
    { id: "15", path: "/docs", type: "folder" }, // Virtual folder
    { id: "16", path: "/docs/api.md", type: "markdown" },
  ];

  const [items, setItems] = useState<TreeItem[]>(mockItems);

  // State for tracking expand/collapse and selection
  const [expandedState, setExpandedState] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string[]>([]);

  // Custom icon mapping
  const customIconMap: Record<string, LucideIcon> = {
    typescript: Code2,
    javascript: Code2,
    json: FileJson,
    markdown: Hash,
    image: Image,
    config: Settings,
    // Add more mappings as needed
  };

  // Event handlers for external state management
  const handleMoveItem = useCallback(
    (itemId: string, sourcePath: string, destinationPath: string) => {
      console.log("Move item:", { itemId, sourcePath, destinationPath });

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === itemId) {
            const fileName = sourcePath.split("/").pop();
            const newPath =
              destinationPath === "/"
                ? `/${fileName}`
                : `${destinationPath}/${fileName}`;
            return { ...item, path: newPath };
          }
          return item;
        }),
      );
    },
    [],
  );

  const handleRenameItem = useCallback(
    (itemId: string, currentPath: string, newName: string) => {
      console.log("Rename item:", { itemId, currentPath, newName });

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === itemId) {
            const pathParts = currentPath.split("/");
            pathParts[pathParts.length - 1] = newName;
            const newPath = pathParts.join("/");
            return { ...item, path: newPath };
          }
          // Also update children if this item was a folder
          if (item.path.startsWith(`${currentPath}/`)) {
            const relativePath = item.path.substring(currentPath.length);
            const pathParts = currentPath.split("/");
            pathParts[pathParts.length - 1] = newName;
            const newBasePath = pathParts.join("/");
            return { ...item, path: newBasePath + relativePath };
          }
          return item;
        }),
      );
    },
    [],
  );

  const handleDeleteItem = useCallback((itemId: string, path: string) => {
    console.log("Delete item:", { itemId, path });

    setItems((prevItems) =>
      prevItems.filter(
        (item) => item.id !== itemId && !item.path.startsWith(`${path}/`),
      ),
    );
  }, []);

  const handleCreateItem = useCallback(
    (parentId: string, parentPath: string, type: "file" | "folder") => {
      console.log("Create item:", { parentId, parentPath, type });

      const timestamp = Date.now();
      const newName =
        type === "file"
          ? `new-file-${timestamp}.txt`
          : `new-folder-${timestamp}`;
      const newPath =
        parentPath === "/" ? `/${newName}` : `${parentPath}/${newName}`;

      const newItem: TreeItem = {
        id: timestamp.toString(),
        path: newPath,
        type: type === "file" ? "text" : "folder",
      };

      setItems((prevItems) => [...prevItems, newItem]);
    },
    [],
  );

  const handleTitleSelected = useCallback(() => {
    console.log("Title selected - deselected all nodes");
  }, []);

  // Example title context menu
  const titleContextMenuItems: ContextMenuItem[] = [
    {
      label: "New File in Root",
      icon: FileText,
      action: () => handleCreateItem("root", "/", "file"),
    },
    {
      label: "New Folder in Root",
      icon: Folder,
      action: () => handleCreateItem("root", "/", "folder"),
    },
    { type: "separator" },
    {
      label: "Refresh",
      action: () => console.log("Refresh triggered"),
    },
  ];

  // Example custom node context menu
  const nodeContextMenuItems: ContextMenuItem[] = [
    {
      label: "Open",
      action: () => console.log("Open triggered"),
    },
    {
      label: "Copy Path",
      action: () => console.log("Copy path triggered"),
    },
    { type: "separator" },
    {
      label: "Rename",
      icon: Edit2,
      action: () => {}, // Will be overridden by node handler
    },
    {
      label: "Delete",
      icon: Trash2,
      action: () => {}, // Will be overridden by node handler
      danger: true,
    },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Example 1: Simple, uncontrolled tree (no state management) */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Simple Tree
          </h2>
          <TreeView
            items={items}
            title="Basic Example"
            onMoveItem={handleMoveItem}
            onRenameItem={handleRenameItem}
            onDeleteItem={handleDeleteItem}
            onCreateItem={handleCreateItem}
            iconMap={customIconMap}
            className="shadow-lg h-96"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            • Click folders to select
            <br />• Click chevron or double-click to expand/collapse
          </p>
        </div>

        {/* Example 2: Controlled state with tracking */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Controlled State
          </h2>
          <TreeView
            items={items}
            title="With State Tracking"
            selected="3" // Select Button.tsx by default
            onExpandedChange={setExpandedState}
            onSelectionChange={setSelectedState}
            onMoveItem={handleMoveItem}
            onRenameItem={handleRenameItem}
            onDeleteItem={handleDeleteItem}
            onCreateItem={handleCreateItem}
            iconMap={customIconMap}
            className="shadow-lg h-96"
          />
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <div>Expanded: {expandedState.length} folders</div>
            <div>Selected: {selectedState.length} items</div>
          </div>
        </div>

        {/* Example 3: Auto-remove empty folders */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Auto-Remove Empty
          </h2>
          <TreeView
            items={items}
            title="Remove Empty Folders"
            removeEmptyFolders={true}
            initialExpandedState={{
              "1": true, // Expand /src
              "2": true, // Expand /src/components
              "5": true, // Expand /src/utils
              "15": true, // Expand /docs
            }}
            onMoveItem={handleMoveItem}
            onRenameItem={handleRenameItem}
            onDeleteItem={handleDeleteItem}
            onCreateItem={handleCreateItem}
            iconMap={customIconMap}
            className="shadow-lg h-96"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Empty folders disappear when last item is moved out
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-4xl mx-auto mt-8 flex justify-center gap-4">
        <button
          type="button"
          onClick={() => document.documentElement.classList.toggle("dark")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Toggle Dark Mode
        </button>
      </div>

      {/* Debug panel */}
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Debug Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
              Node IDs Reference
            </h4>
            <div className="text-sm space-y-1 text-gray-900 dark:text-gray-100 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.path}</span>
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">
                    ID: {item.id}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
              Controlled Tree State
            </h4>
            <div className="text-sm text-gray-900 dark:text-gray-100">
              <div>
                <strong>Expanded:</strong> [{expandedState.join(", ")}]
              </div>
              <div>
                <strong>Selected:</strong> [{selectedState.join(", ")}]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}