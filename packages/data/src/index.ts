/**
 * @moneyworks/data - MoneyWorks Data Access Layer
 * 
 * @moneyworks-dsl PURE
 * @ai-instruction This package provides data access to MoneyWorks REST API
 * @ai-critical Use MoneyWorks terminology throughout
 */

import { createSmartClient } from '@moneyworks/data/client/moneyworks-smart-client';
import { TaxRateRepository } from '@moneyworks/data/repositories/tax-rate.repository';

// Export clients
export { MoneyWorksRESTClient } from '@moneyworks/data/client/moneyworks-rest-client';
export { createSmartClient } from '@moneyworks/data/client/moneyworks-smart-client';
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
} from '@moneyworks/data/repositories/base.repository';

export type {
  IMoneyWorksRepository,
} from '@moneyworks/data/repositories/base.repository';

// Export parsers - directly from files to avoid circular deps
export {
  discoverTableStructure,
  clearFieldCache,
  getCachedStructure,
  buildTSVHeaders,
  type FieldInfo,
  type TableStructure
} from '@moneyworks/data/parsers/field-discovery';

export {
  parseTSVWithStructure,
  validateTSVStructure
} from '@moneyworks/data/parsers/smart-tsv-parser';

export {
  parseMWDate,
  parseMWTimestamp,
  formatMWDate
} from '@moneyworks/data/parsers/date-parser';

export {
  parseMWNumber,
  formatMWNumber
} from '@moneyworks/data/parsers/number-parser';

// Export configuration
export type {
  MoneyWorksConfig,
  MoneyWorksResponse,
  MoneyWorksQueryParams,
  MoneyWorksError
} from '@moneyworks/data/config/types';
export { loadConfig } from '@moneyworks/data/config';

// Export converters
export {
  arrayToObject,
  objectToArray,
  addHeaders,
  enrichWithSchema,
  convertExportFormat
} from '@moneyworks/data/converters';
export type { SchemaEnrichedExport } from '@moneyworks/data/client/types';

// Re-export types from client and repositories for convenience
export { SmartMoneyWorksClient } from '@moneyworks/data/client/moneyworks-smart-client';
export { TaxRateRepository } from '@moneyworks/data/repositories/tax-rate.repository';

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