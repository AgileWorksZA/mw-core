/**
 * MoneyWorks Export/Import System
 *
 * Main entry point for export/import functionality.
 */

// REST Client and types
export { MoneyWorksRESTClient } from "../rest/client";
export { MoneyWorksErrorCode } from "../rest/types";
export type {
  MoneyWorksConfig,
  ExportFormat,
  ExportOptions,
  ImportOptions,
  ImportResult,
  RESTResponse,
  StreamOptions,
} from "../rest/types";

// Errors
export {
  MoneyWorksError,
  ExportError,
  ImportError,
  AuthenticationError,
  ConnectionError,
  ValidationError,
  TimeoutError,
  ParseError,
} from "../rest/errors";

// Export functionality
export { ExportBuilder, exportFrom } from "../export/builder";
export { ExportParser } from "../export/parser";
export { ExportTemplate } from "../export/template";

// Import functionality
export { ImportBuilder, importInto } from "../import/builder";
export {
  TransactionBuilder,
  buildTransaction,
} from "../import/transaction-builder";
export type { TransactionImport } from "../import/transaction-builder";

// XML utilities
export { parseXML } from "../xml/parser";
export { XMLBuilder } from "../xml/builder";
export { parseXMLWithSchema } from "../xml/schema-parser";

// Field conversion
export {
  convertPascalToCamel,
  convertCamelToPascal,
  getFieldMappings,
  convertFieldName,
} from "../converters/field-converter";

// Quick start functions
import { MoneyWorksRESTClient } from "../rest/client";
import type { MoneyWorksConfig } from "../rest/types";

/**
 * Create a new MoneyWorks client
 */
export function createClient(config: MoneyWorksConfig): MoneyWorksRESTClient {
  return new MoneyWorksRESTClient(config);
}

/**
 * Load config from file
 */
export async function loadConfig(
  filePath = "./mw-config.json",
): Promise<MoneyWorksConfig> {
  const fs = await import("node:fs/promises");
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}
