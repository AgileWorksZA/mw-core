/**
 * File Browser Route
 *
 * This route provides a directory-based view of files in the project.
 * It allows:
 * - Browsing the file system by path
 * - Navigating through folders with breadcrumbs
 * - Viewing files and folders grouped by directory
 *
 * Key features:
 * - Path-based navigation via URL query parameters (?path=...)
 * - Hierarchical view of nested folders
 * - Breadcrumb navigation to easily move up the folder tree
 * - Grouped display of files with their metadata
 *
 * This route doesn't have its own loader as it uses the project
 * context already loaded by the parent IDE route, accessible
 * through the useIde() hook.
 */
import { useSearchParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Folder, File, Plus, ChevronRight, Home } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import type { FileManifest } from "~/modules/ide/types";
import { useIde } from "~/modules/ide/hooks/use-ide";

export default function IdeDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const path = searchParams.get("path") || "";

  // Get the project context
  const ide = useIde();
  const { files, fileOrder, name } = ide;

  // Build breadcrumb trail
  const breadcrumbs = [];
  breadcrumbs.push({ label: name || "Project", path: "" });

  if (path) {
    const parts = path.split("/").filter(Boolean);
    let currentPath = "";
    for (const part of parts) {
      currentPath += `/${part}`;
      breadcrumbs.push({ label: part, path: currentPath });
    }
  }

  // Filter items that are under the current path - including all subdirectories
  const itemsUnderPath = (fileOrder || [])
    .map((id) => files?.[id])
    .filter((file) => {
      if (!file?.path) return false;
      const filePath = file.path;

      // For root path, show all items
      if (!path) {
        return true;
      }

      // For specific path, show all items under that path
      const cleanPath = path.startsWith("/") ? path.substring(1) : path;
      const cleanFilePath = filePath.startsWith("/")
        ? filePath.substring(1)
        : filePath;

      return cleanFilePath.startsWith(`${cleanPath}/`);
    })
    .filter(Boolean) as FileManifest[];

  const handleItemClick = (item: FileManifest) => {
    if (item.type === "folder") {
      navigate(`/ide/items?path=${encodeURIComponent(item.path)}`);
    } else {
      navigate(`/ide/${item.type}/${item.id}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 flex items-center text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            <button
              type="button"
              onClick={() => {
                if (crumb.path === "") {
                  navigate("/ide");
                } else {
                  navigate(`/ide/items?path=${encodeURIComponent(crumb.path)}`);
                }
              }}
              className="hover:text-primary transition-colors"
            >
              {index === 0 && <Home className="h-4 w-4 mr-1 inline" />}
              {crumb.label}
            </button>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {path ? path.split("/").pop() : "All Files"}
          </h1>
          <p className="text-muted-foreground">{itemsUnderPath.length} items</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Item
        </Button>
      </div>

      {itemsUnderPath.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm text-muted-foreground">
              {path
                ? "This folder is empty"
                : "Create your first file to get started"}
            </p>
            <Button className="mt-4" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Create File
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Group items by directory */}
          {(() => {
            const grouped = new Map<string, FileManifest[]>();
            const currentLevelItems: FileManifest[] = [];

            for (const item of itemsUnderPath) {
              const itemPath = item.path;
              const relativePath = path
                ? itemPath.substring(path.length + 1)
                : itemPath.startsWith("/")
                  ? itemPath.substring(1)
                  : itemPath;

              const firstSlash = relativePath.indexOf("/");

              if (firstSlash === -1) {
                // Direct child of current path
                currentLevelItems.push(item);
              } else {
                // Item in a subdirectory
                const subdir = relativePath.substring(0, firstSlash);
                if (!grouped.has(subdir)) {
                  grouped.set(subdir, []);
                }
                grouped.get(subdir)?.push(item);
              }
            }

            return (
              <>
                {/* Current level items */}
                {currentLevelItems.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentLevelItems.map((item) => (
                      <Card
                        key={item.id}
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleItemClick(item)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {item.type === "folder" ? (
                                <Folder className="h-5 w-5 text-blue-500" />
                              ) : (
                                <File className="h-5 w-5 text-gray-500" />
                              )}
                              <CardTitle className="text-base">
                                {item.path.split("/").pop() || item.path}
                              </CardTitle>
                            </div>
                            <Badge variant="secondary">{item.type}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-xs">
                            {item.path}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Subdirectories with their items */}
                {Array.from(grouped.entries()).map(([subdir, items]) => (
                  <div key={subdir} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Folder className="h-4 w-4" />
                      <span>{subdir}</span>
                      <span className="text-xs">({items.length} items)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-6">
                      {items.map((item) => (
                        <Card
                          key={item.id}
                          className="cursor-pointer hover:border-primary transition-colors"
                          onClick={() => handleItemClick(item)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                {item.type === "folder" ? (
                                  <Folder className="h-5 w-5 text-blue-500" />
                                ) : (
                                  <File className="h-5 w-5 text-gray-500" />
                                )}
                                <CardTitle className="text-base">
                                  {item.path.split("/").pop() || item.path}
                                </CardTitle>
                              </div>
                              <Badge variant="secondary">{item.type}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-xs">
                              {item.path}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
