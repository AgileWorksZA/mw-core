import React from "react";
import { MethodHeader } from "~/components/datagrid/designer/components/method-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useDesigner } from "../types";
import type { GetMethod } from "../types/openApiTypes";

interface IdeHeaderProps {
  className?: string;
  url: string;
  onReset: () => void;
  selectedMethodSchema?: GetMethod;
}

export function IdeHeader({
  className,
  url,
  onReset,
  selectedMethodSchema,
}: IdeHeaderProps) {
  // Get data from context
  const method = useDesigner((state) => state.context.method);
  const columns = useDesigner((state) => state.context.columns);
  const apiData = useDesigner((state) => state.context.apiData);

  // Get status badges
  const getMethodBadge = () => {
    if (!method) return null;

    // Extract HTTP method if present (GET, POST, etc)
    const httpMethod = method.split(" ")[0]?.toUpperCase();

    let color = "";
    if (httpMethod === "GET")
      color = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (httpMethod === "POST")
      color =
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (httpMethod === "PUT")
      color =
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    if (httpMethod === "DELETE")
      color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";

    return (
      <Badge variant="outline" className={cn("font-mono", color)}>
        {httpMethod || "METHOD"}
      </Badge>
    );
  };

  return (
    <div
      className={cn("p-2 bg-slate-200 dark:bg-slate-900 border-b", className)}
    >
      {/* Top row with title and badges */}
      <div className="flex items-center mb-2 justify-center">
        <span className="font-bold text-base mr-2">Designer</span>

        {/* Project status badges */}
        <div className="flex flex-row justify-center items-center gap-2 text-sm">
          <Badge
            variant="outline"
            className={cn(
              url
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 dark:bg-gray-800 dark:text-gray-300",
            )}
          >
            API
          </Badge>

          {getMethodBadge()}

          <Badge
            variant="outline"
            className={cn(
              columns?.length > 0
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                : "bg-gray-100 dark:bg-gray-800 dark:text-gray-300",
            )}
          >
            Columns: {columns?.length || 0}
          </Badge>

          <Badge
            variant="outline"
            className={cn(
              apiData
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 dark:bg-gray-800 dark:text-gray-300",
            )}
          >
            Data
          </Badge>
          <MethodHeader method={selectedMethodSchema} />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs ml-auto"
        >
          Reset Designer
        </Button>
      </div>
    </div>
  );
}
