# TreeView Component

A production-ready, customizable file explorer tree component built with React, TypeScript, and Tailwind CSS. Perfect for file managers, project explorers, and hierarchical data visualization.

**Note**: This component has been successfully integrated into the IDE module to replace the previous FileTree implementation.

## ✨ Features

- 🌳 **Hierarchical Tree View** - Transform flat path data into nested tree structure
- 🖱️ **Drag & Drop** - Move files/folders between locations with visual feedback
- 🎯 **Multi-Select** - Select multiple items with Ctrl/Cmd + click
- 📝 **Inline Rename** - Rename files and folders directly in the tree
- 🎨 **Context Menus** - Customizable right-click menus for files, folders, and title
- 🌙 **Dark Mode** - Full dark mode support with Tailwind CSS
- ♿ **Accessibility** - Keyboard navigation and screen reader support
- 🎛️ **Highly Customizable** - Configurable context menus, styling, and behavior
- 🚀 **Performance Optimized** - Efficient rendering with React best practices
- 🔍 **Built-in Search** - Native search functionality with filtering
- 📱 **Mobile Friendly** - Touch-optimized with visible menu buttons

## 📦 Installation

The TreeView component is located in `/app/components/ui/tree-view/` and can be imported as:

```tsx
import { TreeView } from "~/components/ui/tree-view";
```

Ensure you have the following dependencies:
```bash
# Required dependencies
lucide-react
# Tailwind CSS should be configured in your project
```

## 🚀 Quick Start

```tsx
import { TreeView } from "~/components/ui/tree-view";
import type { TreeItem } from "~/components/ui/tree-view";
import { Code2, FileJson, Hash } from "lucide-react";

const items: TreeItem[] = [
  { id: "1", path: "/src", type: "folder" },
  { id: "2", path: "/src/components", type: "folder" },
  { id: "3", path: "/src/components/Button.tsx", type: "typescript" },
  { id: "4", path: "/package.json", type: "json" },
];

const iconMap = {
  typescript: Code2,
  json: FileJson,
  markdown: Hash,
};

function App() {
  const [treeItems, setTreeItems] = useState(items);

  return (
    <TreeView
      items={treeItems}
      title="My Files"
      iconMap={iconMap}
      onMoveItem={(id, from, to) => console.log("Move:", id, from, to)}
      onRenameItem={(id, path, newName) => console.log("Rename:", id, newName)}
      onDeleteItem={(id, path) => console.log("Delete:", id)}
      onCreateItem={(parentId, parentPath, type) => console.log("Create:", type)}
    />
  );
}
```

## 📋 Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `items` | `TreeItem[]` | Array of items with unique IDs, file paths, and optional types |
| `onMoveItem` | `(itemId: string, sourcePath: string, targetPath: string) => void` | Called when item is moved |
| `onRenameItem` | `(itemId: string, currentPath: string, newName: string) => void` | Called when item is renamed |
| `onDeleteItem` | `(itemId: string, path: string) => void` | Called when item is deleted |
| `onCreateItem` | `(parentId: string, parentPath: string, type: "file" \| "folder") => void` | Called when new item is created |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"File Explorer"` | Tree title displayed in header |
| `onTitleSelected` | `() => void` | - | Called when title is clicked (deselects all) |
| `titleContextMenuItems` | `ContextMenuItem[]` | - | Context menu items for title |
| `nodeContextMenuItems` | `ContextMenuItem[] \| (nodeId: string) => ContextMenuItem[]` | - | Custom context menu items for nodes (can be dynamic) |
| `showNodeContextMenus` | `boolean` | `true` | Whether to show node context menus |
| `showTitleContextMenu` | `boolean` | `true` | Whether to show title context menu |
| `showMobileMenuButton` | `boolean` | `true` | Whether to show mobile menu buttons |
| `iconMap` | `Record<string, LucideIcon>` | `{}` | Map file types to custom icons |
| `initialExpandedState` | `Record<string, boolean>` | `{}` | Initial expand state by node ID |
| `removeEmptyFolders` | `boolean` | `false` | Auto-remove folders when they become empty |
| `defaultSelected` | `string` | - | ID of item to select initially |
| `onExpandedChange` | `(expandedNodeIds: string[]) => void` | - | Called when expand/collapse state changes |
| `onSelectionChange` | `(selectedNodeIds: string[]) => void` | - | Called when selection changes |
| `className` | `string` | `""` | Additional CSS classes |

## ⚙️ Initial Expand State

Control which specific folders are expanded when the tree first loads using a simple Record:

```tsx
<TreeView
  items={items}
  initialExpandedState={{
    "folder-1": true,   // Expand this folder
    "folder-2": false,  // Explicitly collapse this folder
    "folder-3": true,   // Expand this folder
    // Folders not listed use default behavior (first level expanded)
  }}
  // ... other props
/>
```

**How it works:**
- `true`: Force expand this folder
- `false`: Force collapse this folder
- `undefined` (not specified): Use default behavior (first level folders expand)

**Examples:**
```tsx
// Expand only specific important folders
initialExpandedState={{
  "src-folder-id": true,
  "components-folder-id": true,
  "utils-folder-id": false,  // Explicitly keep closed
}}

// Collapse everything (minimalist view)
initialExpandedState={{
  "src-folder-id": false,
  "docs-folder-id": false,
  "assets-folder-id": false,
}}
```

## 🗂️ Auto-Remove Empty Folders

Enable automatic cleanup of empty folders when their last item is moved out:

```tsx
<TreeView
  items={items}
  removeEmptyFolders={true}  // Auto-remove empty folders
  onDeleteItem={(id, path) => {
    // Handle both manual deletes and auto-cleanup
    console.log("Folder/file deleted:", path);
    // Update your items array
  }}
  // ... other props
/>
```

**How it works:**
- When enabled, moving the last item out of a folder automatically triggers `onDeleteItem` for that folder
- Works for both drag-to-folder and drag-to-root operations
- Only affects folders that become completely empty
- The deletion happens after the move operation completes

> **Note:** Your `onDeleteItem` handler should remove the folder from your items array to complete the cleanup.

## 🎯 State Management

Control and track tree state changes:

### Selection State
```tsx
const [selectedItems, setSelectedItems] = useState<string[]>([]);

<TreeView
  items={items}
  defaultSelected="file-1"              // Initially select this item
  onSelectionChange={setSelectedItems}  // Track selection changes
  // ... other props
/>

// Access current selection
console.log("Selected items:", selectedItems);
```

### Expand/Collapse State
```tsx
const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

<TreeView
  items={items}
  onExpandedChange={setExpandedFolders}  // Track expand state changes
  // ... other props
/>

// Access current expanded state
console.log("Expanded folders:", expandedFolders);
```

### Controlled State Example
```tsx
function ControlledTree() {
  const [selectedItems, setSelectedItems] = useState(["initial-file"]);
  const [expandedFolders, setExpandedFolders] = useState(["folder-1"]);
  
  return (
    <TreeView
      items={items}
      defaultSelected="initial-file"
      onSelectionChange={setSelectedItems}
      onExpandedChange={setExpandedFolders}
      onMoveItem={(id, from, to) => {
        // Update items...
        // State automatically tracked
      }}
    />
  );
}
```

## 🎨 Custom Icons

You can provide custom icons for different file types using the `iconMap` prop:

```tsx
import { 
  Code2, 
  FileJson, 
  Hash, 
  Image,
  FileCode,
  Settings,
  FileText,
  PlayCircle,
  Volume2,
  Database 
} from "lucide-react";

const iconMap = {
  // Programming languages
  typescript: Code2,
  javascript: FileCode,
  python: Code2,
  
  // Data formats
  json: FileJson,
  yaml: Settings,
  xml: FileCode,
  
  // Documentation
  markdown: Hash,
  text: FileText,
  
  // Media
  image: Image,
  video: PlayCircle,
  audio: Volume2,
  
  // Custom types
  adapter: Settings,
  database: Database,
};

<TreeView
  items={items}
  iconMap={iconMap}
  // ... other props
/>
```

> **Note:** Folders are automatically detected from paths and don't need explicit types. The `type` field is only used for files to determine their icons.

## 🎛️ Context Menu Configuration

Context menu items support the following structure:

```typescript
interface ContextMenuItem {
  label?: string;              // Menu item text
  icon?: LucideIcon;          // Optional icon component
  action?: () => void;        // Action to perform on click
  danger?: boolean;           // Style as dangerous action (red)
  disabled?: boolean;         // Disable the menu item
  type?: "separator";         // Create a separator line
}
```

Example custom context menu:

```tsx
const customMenuItems: ContextMenuItem[] = [
  {
    label: "Open",
    icon: ExternalLink,
    action: () => openFile()
  },
  {
    label: "Copy Path",
    icon: Copy,
    action: () => copyToClipboard()
  },
  { type: "separator" },
  {
    label: "Delete",
    icon: Trash2,
    action: () => deleteFile(),
    danger: true
  }
];

<TreeView
  // ... other props
  nodeContextMenuItems={customMenuItems}
/>
```

## 🌙 Dark Mode

The component automatically supports dark mode when Tailwind's dark mode is enabled:

```html
<!-- Enable dark mode by adding 'dark' class to html element -->
<html class="dark">
```

## 🎨 Styling

The component uses Tailwind CSS classes and can be customized by:

1. **Overriding default classes** - Pass custom `className` prop
2. **CSS custom properties** - Define custom colors in your CSS
3. **Tailwind configuration** - Customize colors in your Tailwind adapter

Example custom styling:

```tsx
<TreeView
  className="border-2 border-blue-500 rounded-xl shadow-lg"
  // ... other props
/>
```

## 🔄 State Management Integration

The component works with any state management solution:

### With Zustand
```tsx
const useFileStore = create((set) => ({
  files: [],
  moveFile: (id, from, to) => set((state) => ({
    files: state.files.map(file => 
      file.id === id ? { ...file, path: getNewPath(from, to) } : file
    )
  })),
  // ... other methods
}));

function FileManager() {
  const { files, moveFile, renameFile, deleteFile, createFile } = useFileStore();
  
  return (
    <TreeView
      items={files}
      onMoveItem={moveFile}
      onRenameItem={renameFile}
      onDeleteItem={deleteFile}
      onCreateItem={createFile}
    />
  );
}
```

### With Redux Toolkit
```tsx
const fileSlice = createSlice({
  name: "files",
  initialState: { items: [] },
  reducers: {
    moveFile: (state, action) => {
      const { id, sourcePath, targetPath } = action.payload;
      // Update file path logic
    },
    // ... other reducers
  }
});

function FileManager() {
  const files = useJsonFileSelector(state => state.files.items);
  const dispatch = useDispatch();
  
  return (
    <TreeView
      items={files}
      onMoveItem={(id, from, to) => dispatch(moveFile({ id, from, to }))}
      // ... other handlers
    />
  );
}
```

## 🔧 Advanced Usage

### File Type Detection

The component automatically detects folders from file paths - you don't need to specify folder types. Folders are virtual and created based on the path hierarchy:

```tsx
const items = [
  { id: "1", path: "/src/components/Button.tsx", type: "typescript" },
  { id: "2", path: "/src/utils/helpers.js", type: "javascript" },
  // "/src", "/src/components", and "/src/utils" are automatically created as folders
];
```

### Custom File Type Icons

```tsx
// Define your custom icons
const iconMap = {
  typescript: () => <img src="/icons/typescript.svg" className="w-4 h-4" />,
  react: () => <div className="w-4 h-4 bg-blue-500 rounded" />,
  // Or use Lucide icons
  json: FileJson,
  markdown: Hash,
};
```

### Performance Optimization

For very large trees (thousands of nodes):
- Use `React.memo` for large trees
- Implement lazy loading for deep hierarchies
- Consider virtualization for 1000+ nodes

## 🐛 Troubleshooting

### Common Issues

1. **Items not updating after state change**
   - Ensure you're passing a new array reference, not mutating the existing one

2. **Drag and drop not working**
   - Check that `onMoveItem` is properly handling path updates
   - Ensure browser supports HTML5 drag and drop

3. **Context menus not appearing**
   - Verify `showNodeContextMenus` prop is `true`
   - Check that menu items array is properly formatted

## 📂 Component Architecture

```
app/components/ui/tree-view/
├── README.md           # This documentation
├── index.ts           # Main exports
├── tree-view.tsx      # Main TreeView component
├── tree-node.tsx      # Individual node component
├── context-menu.tsx   # Context menu component
├── types.ts          # TypeScript interfaces
└── utils.ts          # Utility functions
```

## 📱 Mobile Support

The TreeView component is fully mobile-friendly with:

### Touch-Optimized Interactions
- Visible menu buttons for all context menus
- No dependency on right-click gestures
- Large touch targets for easy interaction
- Search functionality with clear button

### Configuration
```tsx
<TreeView
  items={items}
  showMobileMenuButton={true}  // Show menu buttons (default: true)
  titleContextMenuItems={[     // Mobile-friendly title menu
    { label: "New File", icon: FileIcon, action: createFile },
    { label: "New Folder", icon: FolderIcon, action: createFolder }
  ]}
  nodeContextMenuItems={(nodeId) => [  // Dynamic node menus
    { label: "Open", icon: FileText, action: () => openFile(nodeId) },
    { label: "Delete", icon: Trash2, action: () => deleteFile(nodeId), danger: true }
  ]}
/>
```

## 🔍 Search Functionality

The TreeView includes built-in search:

- Search input below the title bar
- Filters tree items as you type
- Automatically expands parent folders of matching items
- Shows "No files match your search" when no results
- Clear button to reset search

## 🤝 Examples

See the demo at `/demos/tree-view` for comprehensive examples including:
- Basic tree structure
- Controlled state management
- Auto-remove empty folders
- Custom icons and styling
- Context menu customization
- Mobile-friendly interactions
- Search functionality

## 🙏 Acknowledgments

- Built with React & TypeScript
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Made with ❤️ for the React community