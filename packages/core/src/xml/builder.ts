/**
 * XML Builder for MoneyWorks
 *
 * Builds MoneyWorks XML import format from TypeScript objects.
 */

import { Builder } from "xml2js";
import { convertCamelToPascal } from "../converters/field-converter";
import type { Detail, TableMapCamel, TableName } from "../tables";
import { validateDetailFieldLengths } from "../tables/detail";

export interface XMLBuildOptions {
  mode?: "create" | "update" | "upsert";
  workItOut?: string[];
  calculated?: Record<string, string>;
}

interface SubfileDetail {
  $?: { name: string };
  detail: Record<string, unknown>[];
}

/**
 * Build XML import document
 */
export function buildXML<T extends TableName>(
  table: T,
  records: Partial<TableMapCamel[T]>[],
  options: XMLBuildOptions = {},
): string {
  // Convert records to PascalCase
  const pascalRecords = records.map((record) =>
    convertCamelToPascal(table, record),
  );

  // Build XML structure
  const xmlObj = buildXMLStructure(table, pascalRecords, options);

  // Convert to XML string
  const builder = new Builder({
    renderOpts: {
      pretty: true,
      indent: "  ",
      newline: "\n",
    },
    xmldec: {
      version: "1.0",
      encoding: "UTF-8",
    },
    headless: false,
  });

  return builder.buildObject(xmlObj);
}

/**
 * Build XML structure
 */
function buildXMLStructure(
  table: TableName,
  records: Record<string, unknown>[],
  options: XMLBuildOptions,
): Record<string, unknown> {
  const tableElement = {
    $: {
      name: table.toLowerCase(),
      ...(options.mode && { mode: options.mode }),
    },
    [table.toLowerCase()]: records.map((record) =>
      processRecord(record, options),
    ),
  };

  return {
    import: {
      table: tableElement,
    },
  };
}

/**
 * Process individual record
 */
function processRecord(
  record: Record<string, unknown>,
  options: XMLBuildOptions,
): Record<string, unknown> {
  const processed: Record<string, unknown> = {};

  // Add work-it-out attribute if needed
  if (options.workItOut?.length) {
    processed.$ = {
      "work-it-out": options.workItOut.join(","),
    };
  }

  // Process each field
  for (const [field, value] of Object.entries(record)) {
    if (value === undefined || value === null) {
      continue;
    }

    // Special handling for subfiles
    if (field === "subfile" && Array.isArray(value)) {
      processed.subfile = value.map((sub) => {
        if (sub.name === "detail" && Array.isArray(sub.records)) {
          return buildSubfile(sub.records);
        }
        return sub;
      });
      continue;
    }

    // Format value
    processed[field] = formatValue(value);
  }

  // Add calculated fields if provided
  if (options.calculated) {
    for (const [field, expression] of Object.entries(options.calculated)) {
      processed[`calculated_${field}`] = expression;
    }
  }

  return processed;
}

/**
 * Build subfile structure (for transaction details)
 */
function buildSubfile(details: Record<string, unknown>[]): SubfileDetail {
  return {
    $: { name: "detail" },
    detail: details.map((detail) => {
      const processed: Record<string, unknown> = {};
      for (const [field, value] of Object.entries(detail)) {
        if (value !== undefined && value !== null) {
          processed[field] = formatValue(value);
        }
      }
      return processed;
    }),
  };
}

/**
 * Format value for XML
 */
function formatValue(value: unknown): string | number {
  if (value instanceof Date) {
    // Format as YYYYMMDD
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  if (typeof value === "string") {
    // Escape XML special characters
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  return value as string | number;
}

/**
 * Build transaction with details
 */
export function buildTransactionWithDetails(
  transaction: Partial<TableMapCamel["Transaction"]>,
  details: Partial<TableMapCamel["Detail"]>[],
  options: XMLBuildOptions = {},
): string {
  // Convert to PascalCase
  const pascalTrans = convertCamelToPascal("Transaction", transaction);
  const pascalDetails = details.map((d) => convertCamelToPascal("Detail", d));

  // Add details as subfile
  const transWithDetails = {
    ...pascalTrans,
    subfile: [
      {
        name: "detail",
        records: pascalDetails,
      },
    ],
  };

  return buildXML(
    "Transaction",
    [transWithDetails as Partial<TableMapCamel["Transaction"]>],
    options,
  );
}

/**
 * Build batch import for multiple tables
 */
export function buildBatchImport(
  imports: Array<{
    table: TableName;
    records: Partial<TableMapCamel[TableName]>[];
    options?: XMLBuildOptions;
  }>,
): string {
  const tables = imports.map(({ table, records, options = {} }) => {
    const pascalRecords = records.map((record) =>
      convertCamelToPascal(table, record),
    );

    return {
      $: {
        name: table.toLowerCase(),
        ...(options.mode && { mode: options.mode }),
      },
      [table.toLowerCase()]: pascalRecords.map((record) =>
        processRecord(record, options),
      ),
    };
  });

  const builder = new Builder({
    renderOpts: {
      pretty: true,
      indent: "  ",
      newline: "\n",
    },
    xmldec: {
      version: "1.0",
      encoding: "UTF-8",
    },
    headless: false,
  });

  return builder.buildObject({
    import: {
      table: tables,
    },
  });
}

/**
 * Validate record before building XML
 */
export function validateRecord<T extends TableName>(
  table: T,
  record: Partial<TableMapCamel[T]>,
): string[] {
  const errors: string[] = [];

  // Table-specific validation
  if (table === "Detail") {
    const pascalRecord = convertCamelToPascal(table, record);
    const detailErrors = validateDetailFieldLengths(
      pascalRecord as unknown as Detail,
    );
    errors.push(...detailErrors);
  }

  // Add more table-specific validations as needed

  return errors;
}

// Export legacy-style object for backward compatibility
export const XMLBuilder = {
  build: buildXML,
  buildTransactionWithDetails,
  buildBatchImport,
  validateRecord,
};
