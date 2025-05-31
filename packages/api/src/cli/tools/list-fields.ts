import { MoneyWorksApiService } from "../../services/moneyworks-api.service";
import type { MoneyWorksConfig } from "../../types/moneyworks";

/**
 * List all fields in a specific MoneyWorks table
 *
 * @param config MoneyWorks configuration
 * @param tableName Name of the table to get fields from
 * @param options Options for listing fields
 * @returns Field list in the requested format
 */
export async function listFields(
  config: MoneyWorksConfig,
  tableName: string,
  options: {
    format?: "text" | "json" | "tsv" | "csv";
    withType?: boolean;
  } = {},
): Promise<string> {
  const api = new MoneyWorksApiService(config);
  const format = options.format || "text";
  const withType = options.withType || false;

  // Validate format and options combinations
  if ((format === "tsv" || format === "csv") && withType) {
    throw new Error(
      `The ${format.toUpperCase()} format cannot be used with the --with-type option`,
    );
  }

  try {
    // Validate that the table exists
    const tables = await api.getDatabaseTables();

    // Case-insensitive table name matching
    const matchedTable = tables.find(
      (t) => t.toLowerCase() === tableName.toLowerCase(),
    );

    if (!matchedTable) {
      // Display available moneyworks to help the user
      const availableTables = tables.join("\n");
      throw new Error(
        `Table "${tableName}" not found. Available tables are:\n${availableTables}`,
      );
    }

    if (withType) {
      // Get fields with type information
      const fieldsWithTypes =
        await api.getDatabaseFieldsWithTypes(matchedTable);

      // Format the output
      if (format === "json") {
        return JSON.stringify(fieldsWithTypes, null, 2);
      }
      // Format as "fieldName: type (jsType)"
      const lines = fieldsWithTypes.map((field) => {
        const jsTypeInfo = field.jsType ? ` (${field.jsType})` : "";
        return `${field.name}: ${field.type}${jsTypeInfo}`;
      });
      return lines.join("\n");
    }
    // Get just field names without type information
    const fields = await api.getDatabaseFields(matchedTable);

    // Format the output
    if (format === "json") {
      return JSON.stringify(fields, null, 2);
    }
    if (format === "tsv") {
      // Return a single line with tab-separated field names
      return fields.join("\t");
    }
    if (format === "csv") {
      // Return a single line with comma-separated field names
      return fields.join(",");
    }
    // Default text format - one field per line
    return fields.join("\n");
  } catch (error) {
    console.error(`Error listing fields for table ${tableName}:`, error);
    throw error;
  }
}
