import type { OpenAPIV3 } from "openapi-types";
import React, { useState, useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { validateDataPath } from "../utils/schema/pathValidation";

interface DataPathHeaderProps {
  paths: { data: string; pagination: string };
  schema?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  onPathsChange: (paths: { data: string; pagination: string }) => void;
  onError: (message: string) => void;
  propertyCount: number;
}

export function DataPathHeader({
  paths,
  schema,
  onPathsChange,
  onError,
  propertyCount,
}: DataPathHeaderProps) {
  const [dataPath, setDataPath] = useState(paths.data);
  const [paginationPath, setPaginationPath] = useState(paths.pagination);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = useCallback(() => {
    const newDataPath = dataPath.trim();
    const newPaginationPath = paginationPath.trim();

    try {
      // First, check if the path would be valid
      const isValid = !newDataPath || validateDataPath(schema, newDataPath);

      if (isValid) {
        onPathsChange({
          data: newDataPath,
          pagination: newPaginationPath,
        });
      } else {
        onError(`Invalid path: ${newDataPath} - Path does not exist in schema`);
      }
    } catch (err) {
      onError(`Error validating path: ${err}`);
    }
  }, [dataPath, paginationPath, schema, onPathsChange, onError]);

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={isExpanded ? "data-path" : undefined}
      onValueChange={(value) => setIsExpanded(!!value)}
      className="mb-4"
    >
      <AccordionItem value="data-path">
        <AccordionTrigger className="py-2 hover:no-underline hover:bg-muted/40 px-2 rounded-md">
          <div className="flex justify-between w-full">
            <div className="font-medium text-sm">Data Path Config</div>
            <div className="text-xs text-muted-foreground font-normal">
              {paths.data ? (
                <span className="text-primary">Data path: "{paths.data}"</span>
              ) : (
                <span>No data path set</span>
              )}
              {propertyCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                  {propertyCount} properties
                </span>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card className="mt-2 border">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
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
                  <div className="text-xs text-muted-foreground">
                    The data path is where the actual array of items is located
                    in the response.
                  </div>
                </div>
                <div className="space-y-2">
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
                  <div className="text-xs text-muted-foreground">
                    The pagination path is for extracting pagination information
                    like total count.
                  </div>
                </div>
              </div>

              <Alert className="mt-4 bg-primary/5 text-primary">
                <AlertTitle className="text-sm">
                  Expected Data Structure
                </AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground mt-1">
                  <p>
                    Enter the JSON path to the data in the response using dot
                    notation for nested properties.
                  </p>
                  <pre className="mt-2 p-2 bg-background rounded-md border text-xs">
                    {`// Example API response
{
  "data": [    <-- Data path would be "data"
    { "id": 1, "name": "Item 1" }, 
    { "id": 2, "name": "Item 2" }
  ],
  "pagination": {    <-- Pagination path would be "pagination"
    "total": 50,
    "page": 1
  }
}`}
                  </pre>
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-end pt-0 pb-2">
              <Button variant="default" onClick={handleApply} size="sm">
                Apply Path Config
              </Button>
            </CardFooter>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
