import fs from "node:fs";
import path from "node:path";
import type { MoneyWorksConfig } from "../types/moneyworks";

const config: MoneyWorksConfig = {
  host: "localhost",
  port: 6710,
  dataFile: "",
  username: "",
  password: "",
  folderAuth: {
    folderName: "",
    password: "",
  },
};

// First try to load from environment variables
if (process.env.MW_HOST && process.env.MW_PORT && process.env.MW_DATA_FILE) {
  Object.assign(config, {
    host: process.env.MW_HOST,
    port: Number.parseInt(process.env.MW_PORT, 10),
    dataFile: process.env.MW_DATA_FILE,
    username: process.env.MW_USERNAME || "",
    password: process.env.MW_PASSWORD || "",
  });

  // Add folder auth if configured
  if (process.env.MW_FOLDER_NAME && process.env.MW_FOLDER_PASSWORD) {
    config.folderAuth = {
      folderName: process.env.MW_FOLDER_NAME,
      password: process.env.MW_FOLDER_PASSWORD,
    };
  }
}

// Fallback to config file
const configPath =
  process.env.MW_CONFIG_PATH || path.join(process.cwd(), "mw-config.json");

if (!fs.existsSync(configPath)) {
  throw new Error(
    `MoneyWorks config file not found at ${configPath}. Please create the file or set environment variables.`,
  );
}
try {
  const configData = fs.readFileSync(configPath, "utf8");
  Object.assign(config, JSON.parse(configData));

  // Validate required fields
  if (!config.host) {
    console.error("Missing host in MoneyWorks config");
    process.exit(1);
  }
  if (!config.port) {
    console.error("Missing port in MoneyWorks config");
    process.exit(1);
  }
  if (!config.dataFile) {
    console.error("Missing dataFile in MoneyWorks config");
    process.exit(1);
  }
  if (!config.username) {
    console.error("Missing username in MoneyWorks config");
    process.exit(1);
  }
  if (!config.password) {
    console.error("Missing password in MoneyWorks config");
    process.exit(1);
  }
} catch (error) {
  if (error instanceof Error) {
    throw new Error(`Failed to load MoneyWorks config: ${error.message}`);
  }
  throw new Error("Failed to load MoneyWorks config");
}

/**
 * Load MoneyWorks configuration from environment variables or config file
 */
export function loadMoneyWorksConfig(): MoneyWorksConfig {
  return config;
}
