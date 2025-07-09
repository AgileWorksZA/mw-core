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
  // This function is deprecated - use token-based auth with the API instead
  console.warn('⚠️  loadConfig is deprecated. Use token-based authentication with the API instead.');
  
  // If running in API mode (no config needed), return a dummy config
  if (process.env.MW_API_MODE === 'token-auth') {
    return {
      host: 'not-used',
      port: 6710,
      protocol: 'http',
      dataFile: 'not-used',
      username: 'not-used',
      password: 'not-used'
    };
  }
  
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
    // If the file doesn't exist and we're in a production environment, log a warning
    // but don't fail - the API uses token auth now
    if (error instanceof Error && error.message.includes('ENOENT')) {
      console.warn(`⚠️  Config file not found at ${path}. If using the API with token auth, this is expected.`);
      // Return dummy config for backwards compatibility
      return {
        host: 'not-configured',
        port: 6710,
        protocol: 'http',
        dataFile: 'not-configured',
        username: 'not-configured',
        password: 'not-configured'
      };
    }
    throw new Error(`Failed to load MoneyWorks config from ${path}: ${error}`);
  }
}

export type {
  MoneyWorksConfig,
  MoneyWorksResponse, 
  MoneyWorksQueryParams,
  MoneyWorksError
} from '../config/types';