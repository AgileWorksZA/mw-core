/**
 * @moneyworks/data - MoneyWorks Data Access Layer
 * 
 * @moneyworks-dsl PURE
 * @ai-instruction This package provides data access to MoneyWorks REST API
 * @ai-critical Use MoneyWorks terminology throughout
 */

import { createSmartClient } from './client/moneyworks-smart-client';
import { TaxRateRepository } from './repositories/tax-rate.repository';

// Export clients
export { MoneyWorksRESTClient } from './client/moneyworks-rest-client';
export { createSmartClient } from './client/moneyworks-smart-client';
export type { ExportOptions } from './client/moneyworks-rest-client';
export type {
  ImportOptions, 
  ImportResult, 
  ImportMode,
  GlobalOptions,
  ExportFormat,
  VersionInfo 
} from './client/types';

// Export repositories
export {
  BaseMoneyWorksRepository,
  createRepository
} from './repositories/base.repository';

export type {
  IMoneyWorksRepository,
} from './repositories/base.repository';

// Export parsers - directly from files to avoid circular deps
export {
  discoverTableStructure,
  clearFieldCache,
  getCachedStructure,
  buildTSVHeaders,
  type FieldInfo,
  type TableStructure
} from './parsers/field-discovery';

export {
  parseTSVWithStructure,
  validateTSVStructure
} from './parsers/smart-tsv-parser';

export {
  parseMWDate,
  parseMWTimestamp,
  formatMWDate
} from './parsers/date-parser';

export {
  parseMWNumber,
  formatMWNumber
} from './parsers/number-parser';

// Export configuration
export type {
  MoneyWorksConfig,
  MoneyWorksResponse,
  MoneyWorksQueryParams,
  MoneyWorksError
} from './config/types';
export { loadConfig } from './config';

// Export converters
export {
  arrayToObject,
  objectToArray,
  addHeaders,
  enrichWithSchema,
  convertExportFormat
} from './converters';
export type { SchemaEnrichedExport } from './client/types';

// Re-export types from client and repositories for convenience
export { SmartMoneyWorksClient } from './client/moneyworks-smart-client';
export type { SmartMoneyWorksClient as SmartMoneyWorksClientType } from './client/moneyworks-smart-client';
export { TaxRateRepository } from './repositories/tax-rate.repository';

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