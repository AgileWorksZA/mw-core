/**
 * MoneyWorks Configuration Exports
 *
 * @moneyworks-dsl PURE
 * @ai-instruction Export configuration types
 */
import type { MoneyWorksConfig } from '../config/types';
/**
 * Load MoneyWorks configuration from file
 *
 * @ai-instruction Reads mw-config.json by default
 */
export declare function loadConfig(configPath?: string): Promise<MoneyWorksConfig>;
export type { MoneyWorksConfig, MoneyWorksResponse, MoneyWorksQueryParams, MoneyWorksError } from '../config/types';
//# sourceMappingURL=index.d.ts.map