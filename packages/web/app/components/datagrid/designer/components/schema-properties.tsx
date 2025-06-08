import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { type SchemaProperties } from "~/components/datagrid/designer/types";
import { usePropertyFilter } from "../hooks/use-property-filter";

interface SchemaPropertiesProps {
  properties?: SchemaProperties;
  dataPath?: string;
}

export function SchemaProperties({ properties, dataPath }: SchemaPropertiesProps) {
  const {
    filter,
    setFilter,
    filteredProperties,
    clearFilter,
    filterStats
  } = usePropertyFilter(properties);

  const renderEmptyState = useMemo(() => {
    if (!properties || Object.keys(properties).length === 0) {
      return (
        <div className="text-muted-foreground p-4 text-center">
          No properties found in schema
        </div>
      );
    }
    
    if (Object.keys(filteredProperties).length === 0) {
      return (
        <div className="text-muted-foreground p-4 text-center">
          No properties match the filter "{filter}"
        </div>
      );
    }
    
    return null;
  }, [properties, filteredProperties, filter]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Schema Properties
        </CardTitle>
        <CardDescription>
          Properties extracted from the response schema
          {dataPath
            ? ` via path: "${dataPath}"`
            : " (using entire response)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Filter properties..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={cn(
                "pr-8",
                filter && "border-primary",
              )}
            />
            {filter && (
              <Button
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3"
                onClick={clearFilter}
              >
                {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Button>
            )}
          </div>
          {filter && properties && (
            <div className="mt-1 text-xs text-muted-foreground">
              Showing {filterStats.filtered} of {filterStats.total} properties
            </div>
          )}
        </div>
        
        <div className="bg-muted/50 rounded overflow-auto max-h-[400px]">
          {renderEmptyState || (
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-2 px-2 font-medium">Property</th>
                  <th className="text-left py-2 px-2 font-medium">Type</th>
                  <th className="text-left py-2 px-2 font-medium">Required</th>
                  <th className="text-left py-2 px-2 font-medium">Nullable</th>
                  <th className="text-left py-2 px-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(filteredProperties).map(([propName, prop]) => (
                  <tr
                    key={propName}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-2 px-2 font-mono text-xs">{propName}</td>
                    <td className="py-2 px-2">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                        {prop.type}
                        {prop.format && (
                          <span className="ml-1 opacity-70">({prop.format})</span>
                        )}
                      </span>
                      {prop.enum && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          enum: [
                          {prop.enum
                            .map((v: string | number) => `"${v}"`)
                            .join(", ")}
                          ]
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      {prop.required ? (
                        <span className="text-red-500">Yes</span>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      {prop.nullable ? (
                        <span className="text-blue-500">Yes</span>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-muted-foreground">
                      {prop.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}