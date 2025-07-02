/**
 * MoneyWorks Configuration Exports
 * 
 * @moneyworks-dsl PURE
 * @ai-instruction Export configuration types
 */

import type {MoneyWorksConfig} from '../config/types';

/**
 * Load MoneyWorks configuration from file
 * 
 * @ai-instruction Reads mw-config.json by default
 */
export async function loadConfig(configPath?: string): Promise<MoneyWorksConfig> {
  const path = configPath || process.env.MW_CONFIG_PATH || './mw-config.json';
  
  try {
    const configFile = await Bun.file(path).json();
    
    // Build config with environment variable overrides
    const config: MoneyWorksConfig = {
      host: process.env.MW_HOST || configFile.host,
      port: parseInt(process.env.MW_PORT || configFile.port),
      protocol: (process.env.MW_PROTOCOL || configFile.protocol || 'http') as 'http' | 'https',
      dataFile: process.env.MW_DATA_FILE || configFile.dataFile,
      username: process.env.MW_USERNAME || configFile.username,
      password: process.env.MW_PASSWORD || configFile.password,
    };
    
    // Add folder auth if present
    if (configFile.folderName || process.env.MW_FOLDER_NAME) {
      config.folderAuth = {
        folderName: process.env.MW_FOLDER_NAME || configFile.folderName,
        folderPassword: process.env.MW_FOLDER_PASSWORD || configFile.folderPassword || ''
      };
    }
    
    return config;
  } catch (error) {
    throw new Error(`Failed to load MoneyWorks config from ${path}: ${error}`);
  }
}

export type {
  MoneyWorksConfig,
  MoneyWorksResponse, 
  MoneyWorksQueryParams,
  MoneyWorksError
} from '../config/types';