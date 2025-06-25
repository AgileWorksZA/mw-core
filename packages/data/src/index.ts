/**
 * @moneyworks/data - MoneyWorks Data Access Layer
 * 
 * @moneyworks-dsl PURE
 * @ai-instruction This package provides data access to MoneyWorks REST API
 * @ai-critical Use MoneyWorks terminology throughout
 */

// Export clients
export { MoneyWorksRESTClient } from './client/moneyworks-rest-client';
export { SmartMoneyWorksClient, createSmartClient } from './client/moneyworks-smart-client';

// Export repositories
export {
  BaseMoneyWorksRepository,
  IMoneyWorksRepository,
  createRepository,
  TaxRateRepository
} from './repositories';

// Export parsers
export * from './parsers';

// Export configuration
export {
  MoneyWorksConfig,
  MoneyWorksResponse,
  MoneyWorksQueryParams,
  MoneyWorksError,
  loadConfig
} from './config';

// Re-export types from client and repositories for convenience
export type { SmartMoneyWorksClient } from './client/moneyworks-smart-client';
export type { TaxRateRepository } from './repositories';

/**
 * Create a configured MoneyWorks client and repositories
 * 
 * @ai-instruction This is the main entry point for using the data layer
 * @example
 * ```typescript
 * import { createDataLayer } from '@moneyworks/data';
 * 
 * const { client, repositories } = await createDataLayer();
 * const taxRates = await repositories.taxRate.findAll();
 * ```
 */
export async function createDataLayer(configPath?: string) {
  const { loadConfig } = await import('./config');
  const config = await loadConfig(configPath);
  const client = createSmartClient(config);
  
  return {
    client,
    repositories: {
      taxRate: new TaxRateRepository(client),
      // Future repositories will be added here
      // account: new AccountRepository(client),
      // transaction: new TransactionRepository(client),
      // name: new NameRepository(client),
    }
  };
}