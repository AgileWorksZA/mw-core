/**
 * Export Parser
 *
 * Parses various export formats from MoneyWorks.
 */

import { convertPascalToCamel } from "../converters/field-converter";
import { ParseError } from "../rest/errors";
import type { TableMap, TableMapCamel, TableName } from "../tables";
import {
  parseDate,
  parseTime,
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
  // Split by lines and parse each line
  const lines = data.trim().split('\n');
  const records: any[] = [];
  
  // For now, we need to return an empty array since we don't have column mappings
  // TSV parsing requires knowledge of column order which varies by table
  if (process.env.NODE_ENV !== 'test') {
    console.warn(`TSV parsing for table ${table} not yet implemented`);
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

/**
 * Parse field value based on type
 */
function parseValue(value: string, field: string): unknown {
  // Empty values
  if (value === "" || value === "NULL") {
    return undefined;
  }

  // Booleans
  if (value === "true" || value === "TRUE") return true;
  if (value === "false" || value === "FALSE") return false;

  // Dates (YYYYMMDD format)
  if (isDateField(field) && value.length === 8) {
    return parseDate(value);
  }

  // Times (HHMMSS format)
  if (isTimeField(field) && value.length === 6) {
    return parseTime(value);
  }

  // Numbers
  if (isNumericField(field)) {
    const num = Number(value);
    if (!Number.isNaN(num)) {
      return num;
    }
  }

  // Default to string
  return value;
}

/**
 * Check if field is a date field
 */
function isDateField(field: string): boolean {
  const dateFields = [
    "TransDate",
    "DueDate",
    "EntryDate",
    "DatePromised",
    "DateRequired",
    "DateCompleted",
    "LastModified",
    "StartDate",
    "EndDate",
    "ReminderDate",
  ];

  return (
    dateFields.includes(field) ||
    field.endsWith("Date") ||
    field.endsWith("_Date")
  );
}

/**
 * Check if field is a time field
 */
function isTimeField(field: string): boolean {
  const timeFields = [
    "TransTime",
    "EntryTime",
    "StartTime",
    "EndTime",
    "ReminderTime",
    "LastModifiedTime",
  ];

  return (
    timeFields.includes(field) ||
    field.endsWith("Time") ||
    field.endsWith("_Time")
  );
}

/**
 * Check if field is numeric
 */
function isNumericField(field: string): boolean {
  const numericFields = [
    "Amount",
    "Gross",
    "Net",
    "Tax",
    "Balance",
    "Debit",
    "Credit",
    "Quantity",
    "Price",
    "Cost",
    "Rate",
    "Percentage",
    "Count",
    "Total",
  ];

  return (
    numericFields.some((f) => field.includes(f)) ||
    field.endsWith("Amount") ||
    field.endsWith("Price") ||
    field.endsWith("Cost") ||
    field.endsWith("Qty") ||
    field.endsWith("Rate") ||
    field.endsWith("Percent") ||
    field.endsWith("Count") ||
    field.endsWith("Number") ||
    field.endsWith("Seq")
  );
}

// Export legacy-style object for backward compatibility
export const ExportParser = {
  parseXML,
  parseTSV,
  parseTemplate,
  parseScript,
};
