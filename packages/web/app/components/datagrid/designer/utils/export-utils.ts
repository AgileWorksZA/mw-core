import type { ColumnDef } from "@tanstack/react-table";
import { logger } from "~/components/datagrid/data-grid/logger";

/**
 * Types for the exported configuration
 */
export interface DataGridExportConfig {
  columns: any[];
  idField?: string;
  paths: {
    data: string;
    pagination: string;
  };
  title: string;
  description: string;
  exportedAt: string;
}

/**
 * Format a configuration object for pretty printing
 */
export function formatConfig(config: DataGridExportConfig): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Create a shareable code snippet from the configuration
 */
export function createCodeSnippet(config: DataGridExportConfig): string {
  const { columns, idField, paths } = config;

  // Generate columns as code
  const columnsCode = columns
    .map((col) => {
      return `  {
    id: "${col.id}",
    header: "${col.header || col.id}",
    accessorKey: "${col.accessorKey || col.id}",
    enableSorting: ${col.enableSorting !== false},
    enableColumnFilter: ${col.enableColumnFilter !== false},
  }`;
    })
    .join(",\n");

  return `// DataGrid Configuration
// Generated on ${new Date().toLocaleString()}
// ${config.title}
// ${config.description}

const columns = [
${columnsCode}
];

// Configuration for DataGrid component
const dataGridConfig = {
  // Path to data in API response
  dataPath: "${paths.data}",
  
  // Path to pagination info in API response (if available)
  paginationPath: "${paths.pagination}",
  
  // Field to use as unique ID for rows
  idField: "${idField || ""}",
};

// Usage example:
/*
<DataGrid
  id="example-grid"
  columns={columns}
  data={data}
  getRowId={(row) => String(row["${idField || "id"}"])}
  pagination={{
    limit: 10,
    offset: 0,
    total: 100,
  }}
  sorting={[]}
/>
*/`;
}

/**
 * Prepare configuration for export
 */
export function prepareConfigForExport(
  columns: any[],
  idField: string | undefined,
  paths: { data: string; pagination: string },
  methodName?: string,
): DataGridExportConfig {
  logger.info("Preparing configuration for export");

  // Create a descriptive title
  const title = methodName
    ? `DataGrid for ${methodName}`
    : "DataGrid Configuration";

  // Create a description with basic info
  const description = `Configuration with ${columns.length} columns, data path: "${paths.data}"`;

  // Create the export object
  const exportConfig: DataGridExportConfig = {
    columns,
    idField,
    paths,
    title,
    description,
    exportedAt: new Date().toISOString(),
  };

  logger.info(`Export configuration prepared with ${columns.length} columns`);

  return exportConfig;
}

/**
 * Download configuration as JSON file
 */
export function downloadConfigAsJson(
  config: DataGridExportConfig,
  filename?: string,
): void {
  try {
    // Create a formatted JSON string
    const jsonString = formatConfig(config);

    // Create a blob with the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `datagrid-config-${Date.now()}.json`;

    // Append, click, and remove the link to trigger the download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up the URL object
    URL.revokeObjectURL(url);

    logger.info(`Configuration downloaded as ${a.download}`);
  } catch (error) {
    logger.error("Error downloading configuration:", error);
  }
}

/**
 * Copy configuration to clipboard
 */
export function copyConfigToClipboard(
  config: DataGridExportConfig,
  asPrettyJson = false,
): Promise<boolean> {
  try {
    // Create the content to copy
    const content = asPrettyJson
      ? formatConfig(config)
      : createCodeSnippet(config);

    // Copy to clipboard
    return navigator.clipboard
      .writeText(content)
      .then(() => {
        logger.info("Configuration copied to clipboard");
        return true;
      })
      .catch((error) => {
        logger.error("Error copying to clipboard:", error);
        return false;
      });
  } catch (error) {
    logger.error("Error preparing clipboard content:", error);
    return Promise.resolve(false);
  }
}
