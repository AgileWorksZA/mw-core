/**
 * @moneyworks/data - MoneyWorks Data Access Layer
 *
 * @moneyworks-dsl PURE
 * @ai-instruction This package provides data access to MoneyWorks REST API
 * @ai-critical Use MoneyWorks terminology throughout
 */
import { TaxRateRepository } from './repositories/tax-rate.repository';
export { MoneyWorksRESTClient } from './client/moneyworks-rest-client';
export { createSmartClient } from './client/moneyworks-smart-client';
export type { ImportOptions, ImportResult, ImportMode, GlobalOptions, ExportFormat, VersionInfo } from './client/types';
export { BaseMoneyWorksRepository, createRepository } from './repositories/base.repository';
export type { IMoneyWorksRepository, } from './repositories/base.repository';
export { discoverTableStructure, clearFieldCache, getCachedStructure, buildTSVHeaders, type FieldInfo, type TableStructure } from './parsers/field-discovery';
export { parseTSVWithStructure, validateTSVStructure } from './parsers/smart-tsv-parser';
export { parseMWDate, parseMWTimestamp, formatMWDate } from './parsers/date-parser';
export { parseMWNumber, formatMWNumber } from './parsers/number-parser';
export type { MoneyWorksConfig, MoneyWorksResponse, MoneyWorksQueryParams, MoneyWorksError } from './config/types';
export { loadConfig } from './config';
export { arrayToObject, objectToArray, addHeaders, enrichWithSchema, convertExportFormat } from './converters';
export type { SchemaEnrichedExport } from './client/types';
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
export declare function createDataLayer(configPath?: string): Promise<{
    client: import(".").SmartMoneyWorksClient;
    repositories: {
        taxRate: TaxRateRepository;
    };
}>;
//# sourceMappingURL=index.d.ts.map