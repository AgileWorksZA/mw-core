import { MoneyWorksApiService } from "../../services/moneyworks-api.service";
import type { MoneyWorksConfig } from "../../types/moneyworks";

/**
 * List all moneyworks in the MoneyWorks database
 *
 * @param config MoneyWorks configuration
 * @param format Output format (text or json)
 * @returns Table list in the requested format
 */
export async function listTables(
  config: MoneyWorksConfig,
  format: "text" | "json" = "text",
): Promise<string> {
  const api = new MoneyWorksApiService(config);

  try {
    // Get moneyworks from MoneyWorks
    const tables = await api.getDatabaseTables();

    // Format the output
    if (format === "json") {
      return JSON.stringify(tables, null, 2);
    }
    return tables.join("\n");
  } catch (error) {
    console.error("Error listing moneyworks:", error);
    throw error;
  }
}
