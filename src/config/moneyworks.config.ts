import fs from "node:fs";
import path from "node:path";
import type { MoneyWorksConfig } from "../types/moneyworks";

/**
 * Load MoneyWorks configuration from environment variables or config file
 */
export function loadMoneyWorksConfig(): MoneyWorksConfig {
  // First try to load from environment variables
  if (process.env.MW_HOST && process.env.MW_PORT && process.env.MW_DATA_FILE) {
    const config: MoneyWorksConfig = {
      host: process.env.MW_HOST,
      port: Number.parseInt(process.env.MW_PORT, 10),
      dataFile: process.env.MW_DATA_FILE,
      username: process.env.MW_USERNAME || "",
      password: process.env.MW_PASSWORD || "",
    };

    // Add folder auth if configured
    if (process.env.MW_FOLDER_NAME && process.env.MW_FOLDER_PASSWORD) {
      config.folderAuth = {
        folderName: process.env.MW_FOLDER_NAME,
        password: process.env.MW_FOLDER_PASSWORD,
      };
    }

    return config;
  }

  // Fallback to config file
  const configPath =
    process.env.MW_CONFIG_PATH || path.join(process.cwd(), "mw-config.json");

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `MoneyWorks config file not found at ${configPath}. Please create the file or set environment variables.`,
    );
  }
  console.log(`Loading MoneyWorks config from ${configPath}`);

  try {
    const configData = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(configData) as MoneyWorksConfig;

    // Validate required fields
    if (!config.host) throw new Error("Missing host in MoneyWorks config");
    if (!config.port) throw new Error("Missing port in MoneyWorks config");
    if (!config.dataFile)
      throw new Error("Missing dataFile in MoneyWorks config");
    if (!config.username)
      throw new Error("Missing username in MoneyWorks config");
    if (!config.password)
      throw new Error("Missing password in MoneyWorks config");

    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load MoneyWorks config: ${error.message}`);
    }
    throw new Error("Failed to load MoneyWorks config");
  }
}

/**
 * Create a sample MoneyWorks config file
 */
export function createSampleConfig(outputPath: string): void {
  const sampleConfig: MoneyWorksConfig = {
    host: "localhost",
    port: 6710,
    dataFile: "Accounting.moneyworks",
    username: "Admin",
    password: "password",
    folderAuth: {
      folderName: "folder name",
      password: "folder password",
    },
  };

  const jsonContent = JSON.stringify(sampleConfig, null, 2);
  fs.writeFileSync(outputPath, jsonContent, "utf8");
}
