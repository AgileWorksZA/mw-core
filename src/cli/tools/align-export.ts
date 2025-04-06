import * as fs from "node:fs";
import * as path from "node:path";
import { MoneyWorksApiService } from "../../services/moneyworks-api.service";
import { TableNames, tableNames } from "../../types/constants";
import type { MoneyWorksConfig } from "../../types/moneyworks";

interface FieldAlignment {
  field: string;
  xmlIndex: number;
  tsvIndex: number | null;
  matched: boolean;
}

interface TableAlignment {
  tableName: string;
  fields: FieldAlignment[];
  missingInTsv: string[];
  extraInTsv: string[];
  mismatchedOrder: FieldAlignment[];
  xmlSample?: string;
  tsvSample?: string;
}

/**
 * Align TSV exports with XML-verbose exports
 *
 * @param config MoneyWorks configuration
 * @param specificTable Optional specific table to check (default: all tables)
 * @param outputFile Output file path for the report
 */
export async function alignExports(
  config: MoneyWorksConfig,
  specificTable?: string,
  outputFile = "alignment-report.md",
): Promise<void> {
  const api = new MoneyWorksApiService(config);
  const results: TableAlignment[] = [];
  const tablesToCheck = specificTable ? [specificTable] : TableNames;

  // Process each table
  for (const tableName of tablesToCheck) {
    console.log(`Processing table: ${tableName}`);
    try {
      // Get the fields for this table
      const tableFields = await getTableFields(tableName);
      if (!tableFields || tableFields.length === 0) {
        console.warn(`No fields found for table: ${tableName}`);
        continue;
      }

      // Export data in XML-verbose format
      const xmlResponse = await api.exportRaw(tableName.toLowerCase(), {
        limit: 1,
        format: "xml-verbose",
      });

      const xmlResult = await api.export(tableName.toLowerCase(), {
        limit: 1,
        format: "xml-verbose",
      });

      // Get a single record from XML (if available)
      if (!xmlResult.data.length) {
        console.warn(`No data found in ${tableName} for XML-verbose export`);
        continue;
      }

      const xmlRecord = xmlResult.data[0];
      const xmlFields = Object.keys(xmlRecord).map(
        (key) => key.charAt(0).toUpperCase() + key.slice(1),
      );

      // Export data in TSV format (plain text)
      const tsvResponse = await api.exportRaw(tableName.toLowerCase(), {
        limit: 1,
        format: "", // Empty format means TSV
      });

      // Parse TSV header (first line)
      const tsvLines = tsvResponse.split("\n");
      if (tsvLines.length < 2) {
        console.warn(`No data found in ${tableName} for TSV export`);
        continue;
      }

      const tsvHeader = tsvLines[0].split("\t");

      // Create field alignment map
      const fieldAlignments: FieldAlignment[] = [];
      const missingInTsv: string[] = [];
      const extraInTsv: string[] = [];

      // Map XML fields to TSV fields
      for (let i = 0; i < tableFields.length; i++) {
        const field = tableFields[i];
        const xmlIndex = xmlFields.indexOf(field);
        const tsvIndex = tsvHeader.indexOf(field);

        fieldAlignments.push({
          field,
          xmlIndex,
          tsvIndex: tsvIndex === -1 ? null : tsvIndex,
          matched: xmlIndex !== -1 && tsvIndex !== -1 && xmlIndex === tsvIndex,
        });

        if (xmlIndex !== -1 && tsvIndex === -1) {
          missingInTsv.push(field);
        }
      }

      // Find extra fields in TSV
      for (const tsvField of tsvHeader) {
        if (!tableFields.includes(tsvField) && tsvField.trim() !== "") {
          extraInTsv.push(tsvField);
        }
      }

      // Find mismatched order
      const mismatchedOrder = fieldAlignments.filter(
        (alignment) =>
          alignment.xmlIndex !== -1 &&
          alignment.tsvIndex !== null &&
          alignment.xmlIndex !== alignment.tsvIndex,
      );

      // Create a limited sample of the XML and TSV for the report
      const xmlSample = formatXmlSample(xmlResponse, 100);
      const tsvSample = formatTsvSample(tsvResponse, 5); // First 5 lines should be enough

      results.push({
        tableName,
        fields: fieldAlignments,
        missingInTsv,
        extraInTsv,
        mismatchedOrder,
        xmlSample,
        tsvSample,
      });
    } catch (error) {
      console.error(`Error processing table ${tableName}:`, error);
    }
  }

  // Generate markdown report
  await generateReport(results, outputFile);
}

/**
 * Get field names for a specific table
 *
 * @param tableName The table name
 * @returns Array of field names
 */
async function getTableFields(tableName: string): Promise<string[]> {
  try {
    // Handle special case formats like "AssetCat" -> "asset-cat"
    const formattedName = tableName
      .replace(/([A-Z])/g, (match, p1, offset) => (offset > 0 ? `-${p1}` : p1))
      .toLowerCase();

    // Adjust tableName to match file naming convention (e.g., "asset-cat" for AssetCat)
    const filePath = `../../types/interface/tables/${formattedName}`;

    try {
      const module = await import(filePath);
      const fieldsConstant = `${tableName}Fields`;

      if (module?.[fieldsConstant]) {
        return module[fieldsConstant];
      }
    } catch (importError) {
      // Try alternative format (direct capitalization)
      const altPath = `../../types/interface/tables/${tableName.toLowerCase()}`;
      const module = await import(altPath);
      const fieldsConstant = `${tableName}Fields`;

      if (module?.[fieldsConstant]) {
        return module[fieldsConstant];
      }
    }

    throw new Error(`Fields not found for table: ${tableName}`);
  } catch (error) {
    console.error(`Error loading fields for ${tableName}:`, error);
    return [];
  }
}

/**
 * Generate markdown report for table alignments
 *
 * @param results Table alignment results
 * @param outputFile Output file path
 */
async function generateReport(
  results: TableAlignment[],
  outputFile: string,
): Promise<void> {
  let markdown = "# MoneyWorks Export Alignment Report\n\n";
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;
  markdown += "## Summary\n\n";

  // Summary table
  markdown +=
    "| Table | Fields | Mismatched | Missing in TSV | Extra in TSV |\n";
  markdown +=
    "|-------|--------|------------|----------------|-------------|\n";

  for (const result of results) {
    markdown += `| ${result.tableName} | ${result.fields.length} | ${result.mismatchedOrder.length} | ${result.missingInTsv.length} | ${result.extraInTsv.length} |\n`;
  }

  markdown += "\n## Detailed Analysis\n\n";

  // Detailed analysis for each table
  for (const result of results) {
    markdown += `### ${result.tableName}\n\n`;

    if (
      result.mismatchedOrder.length === 0 &&
      result.missingInTsv.length === 0 &&
      result.extraInTsv.length === 0
    ) {
      markdown +=
        "✅ **Perfect Match!** All fields align correctly between XML and TSV exports.\n\n";
      continue;
    }

    // Mismatched order
    if (result.mismatchedOrder.length > 0) {
      markdown += "#### Mismatched Field Order\n\n";
      markdown += "| Field | XML Index | TSV Index |\n";
      markdown += "|-------|-----------|----------|\n";

      for (const mismatch of result.mismatchedOrder) {
        markdown += `| ${mismatch.field} | ${mismatch.xmlIndex} | ${mismatch.tsvIndex} |\n`;
      }

      markdown += "\n";
    }

    // Complete field comparison (useful for detailed analysis)
    if (result.fields.length > 0) {
      markdown += "#### Complete Field Comparison\n\n";
      markdown += "| Field | XML Index | TSV Index | Status |\n";
      markdown += "|-------|-----------|----------|--------|\n";

      const sortedFields = [...result.fields].sort((a, b) => {
        // First sort by XML index
        if (a.xmlIndex !== -1 && b.xmlIndex !== -1) {
          return a.xmlIndex - b.xmlIndex;
        }

        // Fields in XML come first
        if (a.xmlIndex !== -1) return -1;
        if (b.xmlIndex !== -1) return 1;

        // Then sort by TSV index
        if (a.tsvIndex !== null && b.tsvIndex !== null) {
          return a.tsvIndex - b.tsvIndex;
        }

        // Fields in TSV come next
        if (a.tsvIndex !== null) return -1;
        if (b.tsvIndex !== null) return 1;

        // Finally sort by name
        return a.field.localeCompare(b.field);
      });

      for (const field of sortedFields) {
        let status = "✅ Match";

        if (field.xmlIndex === -1) {
          status = "❓ Only in TSV";
        } else if (field.tsvIndex === null) {
          status = "❌ Missing in TSV";
        } else if (field.xmlIndex !== field.tsvIndex) {
          status = "⚠️ Index Mismatch";
        }

        markdown += `| ${field.field} | ${field.xmlIndex !== -1 ? field.xmlIndex : "N/A"} | ${field.tsvIndex !== null ? field.tsvIndex : "N/A"} | ${status} |\n`;
      }

      markdown += "\n";
    }

    // Missing in TSV
    if (result.missingInTsv.length > 0) {
      markdown += "#### Fields Missing in TSV Export\n\n";
      markdown += "```\n";
      markdown += result.missingInTsv.join("\n");
      markdown += "\n```\n\n";
    }

    // Extra in TSV
    if (result.extraInTsv.length > 0) {
      markdown += "#### Extra Fields in TSV Export\n\n";
      markdown += "```\n";
      markdown += result.extraInTsv.join("\n");
      markdown += "\n```\n\n";
    }

    // Include XML and TSV samples
    markdown += "#### Export Samples\n\n";

    if (result.xmlSample) {
      markdown += "**XML-Verbose Sample:**\n\n";
      markdown += "```xml\n";
      markdown += result.xmlSample;
      markdown += "\n```\n\n";
    }

    if (result.tsvSample) {
      markdown += "**TSV Sample:**\n\n";
      markdown += "```\n";
      markdown += result.tsvSample;
      markdown += "\n```\n\n";

      // Add a separated version for Excel copy-paste with just the headers
      const tsvLines = result.tsvSample.split("\n");
      if (tsvLines.length > 0) {
        const headers = tsvLines[0];

        markdown += "**TSV Headers (for Excel):**\n\n";
        markdown += "```\n";
        markdown += headers;
        markdown += "\n```\n\n";

        // Add correctly ordered headers based on XML structure
        if (
          result.mismatchedOrder.length > 0 ||
          result.missingInTsv.length > 0
        ) {
          markdown += "**Correctly Ordered Headers (based on XML):**\n\n";
          markdown += "```\n";

          // Get field names in XML order
          const orderedFields = [...result.fields]
            .filter((f) => f.xmlIndex !== -1)
            .sort((a, b) => a.xmlIndex - b.xmlIndex)
            .map((f) => f.field);

          markdown += orderedFields.join("\t");
          markdown += "\n```\n\n";
        }
      }
    }

    // Suggested fix
    if (result.mismatchedOrder.length > 0 || result.missingInTsv.length > 0) {
      markdown += "#### Suggested Field Order for TSV Export\n\n";
      markdown += "```typescript\n";
      markdown += `export const ${result.tableName}Fields: ${result.tableName}Field[] = [\n`;

      // Get all fields in correct order based on XML
      const orderedFields = [...result.fields]
        .filter((f) => f.xmlIndex !== -1)
        .sort((a, b) => a.xmlIndex - b.xmlIndex)
        .map((f) => f.field);

      for (const field of orderedFields) {
        markdown += `  "${field}",\n`;
      }

      markdown += "];\n```\n\n";
    }
  }

  // Write report to file
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, markdown);
}

/**
 * Format XML sample for inclusion in the report
 *
 * @param xml The XML string
 * @param maxLines Maximum number of lines to include
 * @returns Formatted XML sample
 */
function formatXmlSample(xml: string, maxLines: number): string {
  const lines = xml.split("\n");
  const sample = lines.slice(0, maxLines).join("\n");

  if (lines.length > maxLines) {
    return `${sample}\n... (truncated)`;
  }

  return sample;
}

/**
 * Format TSV sample for inclusion in the report
 *
 * @param tsv The TSV string
 * @param maxLines Maximum number of lines to include
 * @returns Formatted TSV sample
 */
function formatTsvSample(tsv: string, maxLines: number): string {
  const lines = tsv.split("\n");
  const sample = lines.slice(0, maxLines).join("\n");

  if (lines.length > maxLines) {
    return `${sample}\n... (truncated)`;
  }

  return sample;
}
