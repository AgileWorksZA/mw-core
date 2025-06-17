/**
 * Export Parser
 *
 * Parses various export formats from MoneyWorks.
 */

import type { TableMapCamel, TableName } from "../tables";
import {
  parseXML as parseXMLFromParser,
} from "../xml/parser";

/**
 * Parse XML format
 */
export async function parseXML<T extends TableName>(
  data: string,
  table: T,
  format: "xml-terse" | "xml-verbose",
): Promise<TableMapCamel[T][]> {
  return parseXMLFromParser(data, table, format);
}

/**
 * Parse TSV format
 */
export function parseTSV<T extends TableName>(
  data: string,
  table: T,
): TableMapCamel[T][] {
  // MoneyWorks TSV format returns raw data without headers
  const records: any[] = [];
  
  // For now, we need to return an empty array since we don't have column mappings
  // TSV parsing requires knowledge of column order which varies by table
  if (process.env.NODE_ENV !== 'test') {
    console.warn(`TSV parsing for table ${table} not yet implemented - data has ${data.trim().split('\n').length} lines`);
  }
  
  // Return empty array instead of raw string to match expected type
  return records;
}

/**
 * Parse custom template result
 */
export function parseTemplate(data: string, _template: string): string {
  // Templates return raw string data
  // The format depends on the template used
  return data;
}

/**
 * Parse script result
 */
export function parseScript(data: string, _script: string): unknown {
  // Try to parse as JSON first
  try {
    return JSON.parse(data);
  } catch {
    // Return as string if not JSON
    return data;
  }
}



// Export legacy-style object for backward compatibility
export const ExportParser = {
  parseXML,
  parseTSV,
  parseTemplate,
  parseScript,
};
