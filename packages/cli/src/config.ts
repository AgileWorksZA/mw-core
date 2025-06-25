import {readFile} from "node:fs/promises";
import type {MoneyWorksConfig} from "@moneyworks/data";

/**
 * Load configuration from file or environment variables
 */
export async function loadConfig(configPath: string): Promise<MoneyWorksConfig> {
  // Try to load from file
  try {
    const configData = await readFile(configPath, "utf-8");
    return JSON.parse(configData);
  } catch (error) {
    // Fall back to environment variables
    console.warn(`Config file not found at ${configPath}, using environment variables`);

    return {
      host: process.env.MW_HOST || "localhost",
      port: parseInt(process.env.MW_PORT || "6710"),
      username: process.env.MW_USERNAME || "Admin",
      password: process.env.MW_PASSWORD || "",
      dataFile: process.env.MW_DATAFILE || "Acme Widgets",
    };
  }
}

/**
 * Save configuration to file
 */
export async function saveConfig(config: MoneyWorksConfig, configPath: string): Promise<void> {
  const { password, ...safeConfig } = config;
  const configData = JSON.stringify(
    {
      ...safeConfig,
      password: password ? "***" : "",
    },
    null,
    2
  );
  
  await Bun.write(configPath, configData);
}