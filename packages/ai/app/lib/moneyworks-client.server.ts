/**
 * MoneyWorks SDK Client Wrapper for AI Tools
 *
 * Provides a singleton client that connects to MoneyWorks using config from mw-config.json.
 * This is the foundation for all MW tools.
 *
 * @moneyworks-dsl PURE
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  createSmartClient,
  type SmartMoneyWorksClient,
  type MoneyWorksConfig,
  type TableStructure,
  type FieldInfo,
} from "@moneyworks/data";

// Re-export types for tools to use
export type { TableStructure, FieldInfo };

/**
 * Safely extract error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object") {
    // Check for common error properties
    if ("message" in error && typeof (error as any).message === "string") {
      return (error as any).message;
    }
    if ("error" in error && typeof (error as any).error === "string") {
      return (error as any).error;
    }
    // Fallback to JSON stringify
    try {
      return JSON.stringify(error);
    } catch {
      return "[Complex error object]";
    }
  }
  return String(error);
}

/**
 * Singleton client instance
 */
let clientInstance: SmartMoneyWorksClient | null = null;
let clientConfig: MoneyWorksConfig | null = null;

/**
 * Known MoneyWorks tables with descriptions
 */
export const MW_TABLES = [
  { name: "Account", description: "Chart of accounts - all GL accounts" },
  { name: "Transaction", description: "All transactions (invoices, payments, journals, etc.)" },
  { name: "Name", description: "Customers, suppliers, and other contacts" },
  { name: "Product", description: "Products and services catalog" },
  { name: "TaxRate", description: "Tax codes and rates (GST, VAT, etc.)" },
  { name: "Job", description: "Jobs/projects for job costing" },
  { name: "Contact", description: "Contact persons linked to Name records" },
  { name: "Department", description: "Departments for departmental reporting" },
  { name: "Detail", description: "Transaction line items/details" },
  { name: "General", description: "Company information and settings" },
  { name: "Build", description: "Build assemblies" },
  { name: "Login", description: "User login records" },
  { name: "Message", description: "System messages" },
  { name: "Offledger", description: "Off-ledger memorized transactions" },
  { name: "PPD", description: "Prompt payment discount records" },
  { name: "Presentation", description: "Report presentations" },
  { name: "Recurrence", description: "Recurring transaction schedules" },
  { name: "Transfer", description: "Bank transfer records" },
  { name: "Unit", description: "Unit of measure definitions" },
  { name: "User", description: "User accounts" },
] as const;

/**
 * Load MoneyWorks config from mw-config.json
 */
function loadMoneyWorksConfig(): MoneyWorksConfig {
  // Look for config in project root (mw-core root)
  const projectRoot = process.env.PROJECT_ROOT || "/Users/hgeldenhuys/WebstormProjects/mw-core";
  const configPath = join(projectRoot, "mw-config.json");

  try {
    const configContent = readFileSync(configPath, "utf-8");
    const rawConfig = JSON.parse(configContent);

    const config: MoneyWorksConfig = {
      host: rawConfig.host || "localhost",
      port: rawConfig.port || 6710,
      protocol: rawConfig.protocol || "http",
      dataFile: rawConfig.dataFile,
      username: rawConfig.username,
      password: rawConfig.password || "",
      timeout: rawConfig.timeout || 30000,
      debug: rawConfig.debug || false,
    };

    // Add folder auth if present
    if (rawConfig.folderName && rawConfig.folderPassword) {
      config.folderAuth = {
        folderName: rawConfig.folderName,
        folderPassword: rawConfig.folderPassword,
      };
    }

    return config;
  } catch (error) {
    throw new Error(
      `Failed to load MoneyWorks config from ${configPath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get the singleton MoneyWorks client
 * Creates it on first call, returns cached instance after
 */
export function getMoneyWorksClient(): SmartMoneyWorksClient {
  if (!clientInstance) {
    clientConfig = loadMoneyWorksConfig();
    clientInstance = createSmartClient(clientConfig);
  }
  return clientInstance;
}

/**
 * Get connection info (for display, no sensitive data)
 */
export function getConnectionInfo(): { host: string; port: number; dataFile: string; username: string } {
  if (!clientConfig) {
    clientConfig = loadMoneyWorksConfig();
  }
  return {
    host: clientConfig.host,
    port: clientConfig.port,
    dataFile: clientConfig.dataFile,
    username: clientConfig.username,
  };
}

/**
 * Test the MoneyWorks connection
 */
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const client = getMoneyWorksClient();
    const isConnected = await client.testConnection();

    if (isConnected) {
      const info = getConnectionInfo();
      return {
        success: true,
        message: `Connected to MoneyWorks at ${info.host}:${info.port} (${info.dataFile})`,
      };
    } else {
      return {
        success: false,
        message: "MoneyWorks connection test failed - unable to evaluate expression",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Parse nested detail records from a subfile XML block
 */
function parseNestedDetails(subfileXml: string): Record<string, unknown>[] {
  const details: Record<string, unknown>[] = [];

  // Match all detail elements within the subfile
  const detailPattern = /<detail>([\s\S]*?)<\/detail>/gi;
  const detailMatches = subfileXml.matchAll(detailPattern);

  for (const detailMatch of detailMatches) {
    const detailXml = detailMatch[1];
    const detail: Record<string, unknown> = {};

    // Extract fields from detail record
    const fieldPattern = /<([\w.]+)(?:\s+[^>]*)?>([^<]*)<\/\1>/g;
    const fieldMatches = detailXml.matchAll(fieldPattern);

    for (const fieldMatch of fieldMatches) {
      const fieldName = fieldMatch[1];
      const value = fieldMatch[2];

      // Keep dotted field names as-is (e.g., detail.account)
      detail[fieldName] = value;

      // Also add normalized versions for convenience
      if (fieldName.includes('.')) {
        const parts = fieldName.split('.');
        const lastPart = parts[parts.length - 1];
        const pascalLast = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
        detail[pascalLast] = value;
      }
    }

    if (Object.keys(detail).length > 0) {
      details.push(detail);
    }
  }

  return details;
}

/**
 * Parse XML response into records
 * This is a workaround for TSV field mapping issues
 */
function parseXMLRecords(xml: string): Record<string, unknown>[] {
  const records: Record<string, unknown>[] = [];

  // Detect record type from the table element
  const tableMatch = xml.match(/<table\s+name="(\w+)"/i);
  let recordType = 'record';
  if (tableMatch) {
    // Table name is capitalized, record element is lowercase
    recordType = tableMatch[1].toLowerCase();
  }

  // Match all record elements
  const pattern = new RegExp(`<${recordType}>([\\s\\S]*?)</${recordType}>`, 'gi');
  const matches = xml.matchAll(pattern);

  for (const match of matches) {
    const recordXml = match[1];
    const record: Record<string, unknown> = {};

    // Extract fields - handle both simple and dotted field names (like detail.account)
    // Match either <fieldname>value</fieldname> or <prefix.fieldname>value</prefix.fieldname>
    const fieldPattern = /<([\w.]+)(?:\s+[^>]*)?>([^<]*)<\/\1>/g;
    const fieldMatches = recordXml.matchAll(fieldPattern);

    for (const fieldMatch of fieldMatches) {
      const fieldName = fieldMatch[1];
      const value = fieldMatch[2];

      // Skip container elements
      if (fieldName === 'subfile' || fieldName === 'detail') continue;

      // For dotted field names (detail.account), keep them as-is for flexibility
      // Also add a PascalCase version of the last part for convenience
      if (fieldName.includes('.')) {
        // Keep lowercase dotted name (e.g., detail.account)
        record[fieldName] = value;
        // Also add PascalCase version of the last segment (e.g., Account)
        const parts = fieldName.split('.');
        const lastPart = parts[parts.length - 1];
        const pascalLast = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
        record[pascalLast] = value;
      } else {
        // Convert to PascalCase for simple field names
        const pascalName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        record[pascalName] = value;
      }
    }

    // Parse nested subfiles (e.g., Detail records within Transaction)
    const subfilePattern = /<subfile\s+name="Detail">([\s\S]*?)<\/subfile>/gi;
    const subfileMatches = recordXml.matchAll(subfilePattern);

    for (const subfileMatch of subfileMatches) {
      const nestedDetails = parseNestedDetails(subfileMatch[1]);
      if (nestedDetails.length > 0) {
        record._details = nestedDetails;
      }
    }

    if (Object.keys(record).length > 0) {
      records.push(record);
    }
  }

  return records;
}

/**
 * Query a MoneyWorks table with optional filtering
 * Uses XML format for reliable field mapping
 */
export async function queryTable(
  table: string,
  options: {
    filter?: string;
    fields?: string[];
    limit?: number;
    sort?: string;
  } = {}
): Promise<Record<string, unknown>[]> {
  const client = getMoneyWorksClient();

  // Build export options - use XML terse format for reliability
  const exportOptions: any = {
    format: "xml-terse",
  };

  // Add search filter if provided
  if (options.filter) {
    exportOptions.search = options.filter;
  }

  // Add limit if provided
  if (options.limit) {
    exportOptions.limit = options.limit;
  }

  // Add sort if provided
  if (options.sort) {
    exportOptions.sort = options.sort;
  }

  // Export as XML for reliable field names
  const xmlResult = await client.export(table, exportOptions);

  if (typeof xmlResult !== 'string') {
    throw new Error('Expected XML string response');
  }

  // Parse XML into records
  const records = parseXMLRecords(xmlResult);

  // If specific fields requested, filter the output
  if (options.fields && options.fields.length > 0) {
    return records.map((record) => {
      const filtered: Record<string, unknown> = {};
      for (const field of options.fields!) {
        // Try both exact match and case-insensitive match
        if (field in record) {
          filtered[field] = record[field];
        } else {
          // Try case-insensitive lookup
          const lowerField = field.toLowerCase();
          for (const [key, value] of Object.entries(record)) {
            if (key.toLowerCase() === lowerField) {
              filtered[field] = value;
              break;
            }
          }
        }
      }
      return filtered;
    });
  }

  return records;
}

/**
 * Get table schema/structure
 */
export async function getTableSchema(table: string): Promise<TableStructure> {
  const client = getMoneyWorksClient();
  const info = await client.getTableInfo(table);
  return info.structure;
}

/**
 * Evaluate a MWScript expression
 */
export async function evaluateExpression(expression: string): Promise<string> {
  const client = getMoneyWorksClient();
  return await client.evaluate(expression);
}

/**
 * Reset the client (useful for testing or config changes)
 */
export function resetClient(): void {
  clientInstance = null;
  clientConfig = null;
}
