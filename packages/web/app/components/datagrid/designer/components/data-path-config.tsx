import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import type { OpenAPIV3 } from "openapi-types";
import { validateDataPath } from "../utils/schema/pathValidation";

interface DataPathConfigProps {
  paths: { data: string; pagination: string };
  schema?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  onPathsChange: (paths: { data: string; pagination: string }) => void;
  onError: (message: string) => void;
}

export function DataPathConfig({
  paths,
  schema,
  onPathsChange,
  onError,
}: DataPathConfigProps) {
  const [dataPath, setDataPath] = useState(paths.data);
  const [paginationPath, setPaginationPath] = useState(paths.pagination);

  // Update state when props change
  useEffect(() => {
    setDataPath(paths.data);
    setPaginationPath(paths.pagination);
  }, [paths.data, paths.pagination]);

  const handleRefresh = useCallback(() => {
    const newDataPath = dataPath.trim();
    const newPaginationPath = paginationPath.trim();

    try {
      // First check if the path would be valid
      const isValid = !newDataPath || validateDataPath(schema, newDataPath);

      if (isValid) {
        onPathsChange({
          data: newDataPath,
          pagination: newPaginationPath || paths.pagination,
        });
      } else {
        onError(`Invalid path: ${newDataPath} - Path does not exist in schema`);
      }
    } catch (err) {
      onError(`Error validating path: ${err}`);
    }
  }, [
    dataPath,
    paginationPath,
    schema,
    paths.pagination,
    onPathsChange,
    onError,
  ]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Data Path Configuration</CardTitle>
        <CardDescription>
          Configure the JSON path to extract data from the response
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="data-path-input"
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Data Path
                </label>
                <Input
                  value={dataPath}
                  onChange={(e) => setDataPath(e.target.value)}
                  placeholder="e.g., data, data.items, results"
                  className="w-full"
                  id="data-path-input"
                />
              </div>
              <div>
                <label
                  htmlFor="pagination-path-input"
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Pagination Path
                </label>
                <Input
                  value={paginationPath}
                  onChange={(e) => setPaginationPath(e.target.value)}
                  placeholder="e.g., pagination, meta"
                  className="w-full"
                  id="pagination-path-input"
                />
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={handleRefresh}>
            Apply
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Enter the JSON path to the data in the response. Use dot notation for
          nested properties (e.g., "data.items").
          <strong className="text-primary">
            {" "}
            Leave empty to process the entire response without extracting a
            specific property.
          </strong>
        </div>
      </CardContent>
    </Card>
  );
}
