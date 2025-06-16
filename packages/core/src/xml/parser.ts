/**
 * XML Parser for MoneyWorks
 *
 * Parses MoneyWorks XML export format into TypeScript objects.
 */

import { parseStringPromise } from "xml2js";
import { convertPascalToCamel, toCamelCase } from "../converters/field-converter";
import { ParseError } from "../rest/errors";
import { shouldKeepAsString } from "../schemas/field-types";
import type {
  TableMap,
  TableMapCamel,
  TableName,
  Transaction,
} from "../tables";

interface ParsedXML {
  table?: Record<string, unknown>;
  export?: {
    table: unknown | unknown[];
  };
  [key: string]: unknown;
}

interface TableNode {
  name?: string;
  [key: string]: unknown;
}

interface TransactionRecord {
  subfile?: unknown | unknown[];
  [key: string]: unknown;
}

interface SubfileNode {
  name?: string;
  detail?: unknown | unknown[];
}

/**
 * Parse XML export into typed objects
 */
export async function parseXML<T extends TableName>(
  xml: string,
  table: T,
  format: "xml-terse" | "xml-verbose",
): Promise<TableMapCamel[T][]> {
  try {
    // We need to track current field name for context
    let currentFieldPath: string[] = [];
    
    // Parse XML to JavaScript object
    const parsed = await parseStringPromise(xml, {
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: false, // Don't merge attributes - we need to handle them specially
      tagNameProcessors: [
        (name) => {
          // Track field path
          currentFieldPath.push(name);
          return name; // Keep original case for now
        },
      ],
      attrNameProcessors: [(name) => name],
      attrValueProcessors: [
        (value, name) => {
          // Skip system attributes
          if (name === "system") return undefined;
          return value;
        },
      ],
      valueProcessors: [
        (value, name) => {
          // Handle MoneyWorks special values
          if (value === "") return undefined;
          if (value === "true") return true;
          if (value === "false") return false;

          // For strings, check if we should keep as string based on schema
          if (typeof value === "string" && /^\d+$/.test(value)) {
            // Get the current field name (last in path that's not a container)
            const fieldName = currentFieldPath[currentFieldPath.length - 1] || "";
            
            if (shouldKeepAsString(table, fieldName, value)) {
              return value;
            }
          }

          // Try to parse numbers
          const num = Number(value);
          if (!Number.isNaN(num) && value !== "") {
            return num;
          }

          return value;
        },
      ],
    });

    // Extract records based on structure
    const records = extractRecords(parsed as ParsedXML, table);

    // Clean up records - handle MoneyWorks attribute structure
    const cleanedRecords = records.map(record => {
      const cleaned = cleanMoneyWorksRecord(record, table);
      return cleaned;
    });

    // Convert to camelCase
    return cleanedRecords.map(
      (record) => {
        const converted = convertPascalToCamel(
          table,
          record as Partial<TableMap[T]>,
        ) as TableMapCamel[T];
        return converted;
      }
    );
  } catch (error) {
    // Add more context for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const xmlPreview = xml.substring(0, 500);
    
    // Check for specific issues
    if (xmlPreview.includes(`<${table.toLowerCase()}>${table}</${table.toLowerCase()}>`)) {
      throw new ParseError(
        `Malformed XML: Table '${table}' contains string value instead of records`,
        format,
        xmlPreview,
        error,
      );
    }
    
    throw new ParseError(
      `Failed to parse ${format} XML for ${table}: ${errorMessage}`,
      format,
      xmlPreview,
      error,
    );
  }
}

/**
 * Clean MoneyWorks record - extract values from attribute structure
 */
function cleanMoneyWorksRecord(record: Record<string, unknown>, table?: string): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(record)) {
    // Special handling for subfile (transaction details)
    if (key === "subfile" && value && table === "Transaction") {
      // For now, preserve the raw subfile structure as array
      cleaned.subfile = Array.isArray(value) ? value : [value];
      
      // Also process subfile structure and flatten to details array
      const subfiles = Array.isArray(value) ? value : [value];
      const allDetails = [];
      
      for (const subfile of subfiles) {
        if (typeof subfile === "object" && subfile !== null) {
          const subfileObj = subfile as Record<string, unknown>;
          
          // Check if this is a Detail subfile
          const isDetailSubfile = 
            (subfileObj.$ && (subfileObj.$ as any).name === "Detail") ||
            subfileObj.name === "Detail";
          
          if (isDetailSubfile) {
            // Extract detail records
            const detailRecords = subfileObj.detail || subfileObj.Detail;
            if (detailRecords) {
              const details = Array.isArray(detailRecords) 
                ? detailRecords 
                : [detailRecords];
              
              // Process each detail record
              for (const detail of details) {
                const cleanDetail: Record<string, unknown> = {};
                
                for (const [detailKey, detailValue] of Object.entries(detail as Record<string, unknown>)) {
                  // Skip $ attribute
                  if (detailKey === "$") continue;
                  
                  // Convert detail.fieldname to just fieldname
                  let fieldName = detailKey;
                  if (detailKey.startsWith("detail.")) {
                    fieldName = detailKey.substring(7);
                  }
                  
                  // Extract value from MoneyWorks attribute structure
                  let cleanValue = detailValue;
                  if (detailValue && typeof detailValue === "object" && "_" in detailValue) {
                    cleanValue = (detailValue as Record<string, unknown>)._;
                  }
                  // Skip empty objects with only $
                  else if (
                    detailValue && 
                    typeof detailValue === "object" && 
                    !Array.isArray(detailValue) &&
                    (Object.keys(detailValue).length === 0 || 
                     (Object.keys(detailValue).length === 1 && "$" in detailValue))
                  ) {
                    // Empty element - use empty string
                    cleanValue = "";
                  }
                  
                  cleanDetail[fieldName] = cleanValue;
                }
                
                // Add the cleaned detail record
                allDetails.push(cleanDetail);
              }
            }
          }
        }
      }
      
      // Add details directly to transaction instead of subfile
      if (allDetails.length > 0) {
        cleaned.details = allDetails;
      }
      // Don't add subfile to cleaned record
    }
    // Handle MoneyWorks attribute structure where value is in "_" attribute
    else if (value && typeof value === "object" && "_" in value) {
      // Extract the actual value from the "_" attribute
      cleaned[key] = (value as Record<string, unknown>)._;
    }
    // Handle MoneyWorks attribute structure where value is in "$._"
    else if (value && typeof value === "object" && "$" in value && typeof (value as any).$ === "object" && "_" in (value as any).$) {
      // Extract the actual value from the "$._" attribute
      cleaned[key] = (value as any).$._;
    }
    // Handle empty XML elements that become {$: {}} or similar
    else if (
      value && 
      typeof value === "object" && 
      !Array.isArray(value) &&
      (Object.keys(value).length === 0 || 
       (Object.keys(value).length === 1 && "$" in value))
    ) {
      // Empty element - skip it entirely
      // Don't add to cleaned object
    }
    else {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
}

/**
 * Extract records from parsed XML structure
 */
function extractRecords(
  parsed: ParsedXML,
  table: TableName,
): Record<string, unknown>[] {
  // Handle different XML structures
  // Structure 1: <table><record>...</record><record>...</record></table>
  if (parsed.table?.[table.toLowerCase()]) {
    const tableData = parsed.table[table.toLowerCase()] as
      | Record<string, unknown>
      | Record<string, unknown>[];
    return Array.isArray(tableData) ? tableData : [tableData];
  }

  // Structure 2: <export><table name="..."><record>...</record></table></export>
  if (parsed.export?.table) {
    // Check if export.table is a string (malformed response)
    if (typeof parsed.export.table === "string") {
      // Special case for malformed MoneyWorks response where table name is returned as string
      // Instead of proper structure
      if (parsed.export.table === table || parsed.export.table === table.toLowerCase()) {
        console.warn(`Warning: Expected table object but got string: "${parsed.export.table}"`);
        return [];
      }
      console.warn(`Warning: Expected table object but got string: "${parsed.export.table}"`);
      return [];
    }
    
    const tables = Array.isArray(parsed.export.table)
      ? parsed.export.table
      : [parsed.export.table];

    const targetTable = tables.find(
      (t) => {
        const tableObj = t as any;
        // Check for name in attributes
        const tableName = tableObj.$?.name || tableObj.name;
        return tableName === table || tableName === table.toLowerCase();
      }
    );

    if (targetTable) {
      const recordKey = table.toLowerCase();
      const records = (targetTable as TableNode)[recordKey];
      return Array.isArray(records)
        ? (records as Record<string, unknown>[])
        : records
          ? [records as Record<string, unknown>]
          : [];
    }
  }

  // Structure 3: Direct records under root
  const rootKey = table.toLowerCase();
  if (parsed[rootKey]) {
    const data = parsed[rootKey];
    
    // Check if data is a string - this might happen with malformed XML
    // or when MoneyWorks returns an error
    if (typeof data === "string") {
      console.warn(`Warning: Expected object for table '${table}' but got string: "${data}"`);
      return [];
    }
    
    return Array.isArray(data)
      ? (data as Record<string, unknown>[])
      : [data as Record<string, unknown>];
  }

  // Structure 4: Records under plural form
  const pluralKey = `${rootKey}s`;
  const pluralData = (parsed as Record<string, unknown>)[pluralKey];
  if (pluralData && typeof pluralData === "object" && rootKey in pluralData) {
    const records = (pluralData as Record<string, unknown>)[rootKey];
    return Array.isArray(records)
      ? (records as Record<string, unknown>[])
      : [records as Record<string, unknown>];
  }

  // No records found
  return [];
}

/**
 * Parse transaction with details (special handling)
 */
export async function parseTransactionWithDetails(xml: string): Promise<
  Array<{
    transaction: TableMapCamel["Transaction"];
    details: TableMapCamel["Detail"][];
  }>
> {
  const parsed = await parseStringPromise(xml, {
    explicitArray: false,
    ignoreAttrs: false,
    mergeAttrs: true,
  });

  const transactions = extractRecords(parsed as ParsedXML, "Transaction");

  return transactions.map((trans) => {
    const transRecord = trans as TransactionRecord;
    // Extract details from subfile
    const details: Record<string, unknown>[] = [];

    // Check for detail subfile
    if (transRecord.subfile) {
      const subfiles = Array.isArray(transRecord.subfile)
        ? transRecord.subfile
        : [transRecord.subfile];
      const detailSubfile = subfiles.find(
        (s) => (s as SubfileNode).name === "detail",
      );

      if ((detailSubfile as SubfileNode)?.detail) {
        const detailRecords = Array.isArray(
          (detailSubfile as SubfileNode).detail,
        )
          ? ((detailSubfile as SubfileNode).detail as Record<string, unknown>[])
          : [(detailSubfile as SubfileNode).detail as Record<string, unknown>];
        details.push(...detailRecords);
      }

      // Remove subfile from transaction
      transRecord.subfile = undefined;
    }

    return {
      transaction: convertPascalToCamel(
        "Transaction",
        transRecord as Partial<Transaction>,
      ) as TableMapCamel["Transaction"],
      details: details.map(
        (d) => convertPascalToCamel("Detail", d) as TableMapCamel["Detail"],
      ),
    };
  });
}

/**
 * Parse MoneyWorks date format (YYYYMMDD)
 */
export function parseDate(dateStr: string | undefined): Date | undefined {
  if (!dateStr || dateStr.length !== 8) {
    return undefined;
  }

  const year = Number.parseInt(dateStr.substring(0, 4), 10);
  const month = Number.parseInt(dateStr.substring(4, 6), 10) - 1; // 0-based
  const day = Number.parseInt(dateStr.substring(6, 8), 10);

  return new Date(year, month, day);
}

/**
 * Parse MoneyWorks time format (HHMMSS)
 */
export function parseTime(timeStr: string | undefined): string | undefined {
  if (!timeStr || timeStr.length !== 6) {
    return undefined;
  }

  const hours = timeStr.substring(0, 2);
  const minutes = timeStr.substring(2, 4);
  const seconds = timeStr.substring(4, 6);

  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Parse MoneyWorks boolean (0/1)
 */
export function parseBoolean(
  value: string | number | boolean | undefined,
): boolean {
  return value === 1 || value === "1" || value === true;
}

/**
 * Parse MoneyWorks amount with sign encoding
 */
export function parseAmount(
  value: number | undefined,
  hasSignBit = false,
): number {
  if (value === undefined) return 0;

  if (hasSignBit) {
    // Check high bit for sign (overpayment in Payments table)
    const MAX_INT = 2147483647;
    if (value > MAX_INT) {
      return -(value - MAX_INT * 2);
    }
  }

  return value;
}

// Export legacy-style object for backward compatibility
export const XMLParser = {
  parse: parseXML,
  parseTransactionWithDetails,
  parseDate,
  parseTime,
  parseBoolean,
  parseAmount,
};
