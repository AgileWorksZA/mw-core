import type { TreeItem, TreeNode } from "./types";

export function transformToTreeData(items: TreeItem[]): {
  nodeMap: Map<string, TreeNode>;
  rootChildren: TreeNode[];
} {
  const nodeMap = new Map<string, TreeNode>();
  const rootChildren: TreeNode[] = [];

  // Helper functions
  const getName = (path: string): string => {
    const parts = path.split("/").filter(Boolean);
    return parts[parts.length - 1] || "root";
  };

  const getParentPath = (path: string): string | null => {
    const parts = path.split("/").filter(Boolean);
    if (parts.length <= 1) return null;
    return `/${parts.slice(0, -1).join("/")}`;
  };

  // Sort by depth to process parents first
  const sortedItems = [...items].sort((a, b) => {
    const aDepth = a.path.split("/").filter(Boolean).length;
    const bDepth = b.path.split("/").filter(Boolean).length;
    return aDepth - bDepth;
  });

  // Build nodes
  for (const item of sortedItems) {
    const isFileItem = item.type !== "folder";
    const node: TreeNode = {
      id: item.id,
      name: getName(item.path),
      path: item.path,
      type: item.type,
      isFile: isFileItem,
      children: isFileItem ? null : [],
      parent: null,
    };
    nodeMap.set(item.id, node);
  }

  // Establish parent-child relationships
  for (const item of sortedItems) {
    const node = nodeMap.get(item.id);
    if (!node) continue;

    const parentPath = getParentPath(item.path);

    if (parentPath) {
      const parent = Array.from(nodeMap.values()).find(
        (n) => n.path === parentPath,
      );
      if (parent?.children) {
        parent.children.push(node);
        node.parent = parent;
      }
    } else {
      rootChildren.push(node);
    }
  }

  return { nodeMap, rootChildren };
}