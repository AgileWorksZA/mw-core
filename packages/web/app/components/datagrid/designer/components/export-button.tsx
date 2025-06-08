import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ScrollArea } from "~/components/ui/scroll-area";
import { logger } from "~/components/datagrid/data-grid/logger";
import {
  prepareConfigForExport,
  downloadConfigAsJson,
  copyConfigToClipboard,
  formatConfig,
  createCodeSnippet,
  type DataGridExportConfig,
} from "../utils/export-utils";
import { useDesigner } from "../types";

/**
 * Props for the ExportButton component
 */
interface ExportButtonProps {
  className?: string;
  buttonVariant?: "default" | "secondary" | "outline" | "ghost";
  buttonSize?: "default" | "sm" | "lg" | "icon";
}

/**
 * Component for exporting DataGrid configuration
 */
export function ExportButton({
  className,
  buttonVariant = "outline",
  buttonSize = "sm",
}: ExportButtonProps) {
  // Get required data from context
  const columns = useDesigner((state) => state.context.columns);
  const idField = useDesigner((state) => state.context.idField);
  const paths = useDesigner((state) => state.context.paths);
  const method = useDesigner((state) => state.context.method);
  const apiData = useDesigner((state) => state.context.apiData);

  // Local state
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportConfig, setExportConfig] = useState<DataGridExportConfig | null>(
    null,
  );
  const [filename, setFilename] = useState(
    `datagrid-config-${Date.now()}.json`,
  );
  const [exportTab, setExportTab] = useState("code");
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState(false);

  // Handle export button click
  const handleExport = () => {
    logger.info("Preparing DataGrid configuration for export");

    // Check if we have enough data to create a meaningful export
    if (columns.length === 0) {
      logger.warn("No columns configured for export");
      return;
    }

    // Prepare the configuration
    const config = prepareConfigForExport(columns, idField, paths, method);
    setExportConfig(config);

    // Generate a default filename
    const methodName = method?.split("/").pop() || "datagrid";
    setFilename(`${methodName.toLowerCase()}-config-${Date.now()}.json`);

    // Show the export dialog
    setShowExportDialog(true);
  };

  // Handle copy to clipboard
  const handleCopy = (asPrettyJson = false) => {
    if (!exportConfig) return;

    copyConfigToClipboard(exportConfig, asPrettyJson).then((success) => {
      setCopySuccess(success);
      setCopyError(!success);

      // Reset status after 3 seconds
      setTimeout(() => {
        setCopySuccess(false);
        setCopyError(false);
      }, 3000);
    });
  };

  // Handle download JSON
  const handleDownload = () => {
    if (!exportConfig) return;
    downloadConfigAsJson(exportConfig, filename);
  };

  // Generate content to display in preview tabs
  const jsonContent = exportConfig ? formatConfig(exportConfig) : "";
  const codeContent = exportConfig ? createCodeSnippet(exportConfig) : "";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={className}
            variant={buttonVariant}
            size={buttonSize}
          >
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExport}>
            Export Configuration
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Export DataGrid Configuration</DialogTitle>
            <DialogDescription>
              Export your DataGrid configuration to use in your application
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 flex flex-col">
            <Tabs
              defaultValue={exportTab}
              onValueChange={setExportTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="code">Code Snippet</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>

              <TabsContent
                value="code"
                className="flex-1 min-h-0 flex flex-col"
              >
                <div className="text-sm mb-2">
                  TypeScript code ready to copy into your project:
                </div>
                <ScrollArea className="flex-1 min-h-0 border rounded bg-muted">
                  <pre className="p-4 text-sm font-mono whitespace-pre overflow-auto">
                    {codeContent}
                  </pre>
                </ScrollArea>
                <Button
                  onClick={() => handleCopy(false)}
                  className="mt-2 self-end"
                  variant="outline"
                >
                  {copySuccess ? "Copied!" : "Copy Code"}
                </Button>
              </TabsContent>

              <TabsContent
                value="json"
                className="flex-1 min-h-0 flex flex-col"
              >
                <div className="text-sm mb-2">Raw JSON configuration:</div>
                <ScrollArea className="flex-1 min-h-0 border rounded bg-muted">
                  <pre className="p-4 text-sm font-mono whitespace-pre overflow-auto">
                    {jsonContent}
                  </pre>
                </ScrollArea>
                <Button
                  onClick={() => handleCopy(true)}
                  className="mt-2 self-end"
                  variant="outline"
                >
                  {copySuccess ? "Copied!" : "Copy JSON"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="flex items-center gap-4 pt-4 border-t">
            <div className="flex-1">
              <Label htmlFor="filename" className="text-xs">
                File name:
              </Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleDownload}>Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
