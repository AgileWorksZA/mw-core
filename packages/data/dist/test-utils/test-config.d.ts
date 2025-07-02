/**
 * Test configuration for unit tests
 *
 * @moneyworks-dsl PURE
 */
import { MoneyWorksConfig } from '../config/types';
/**
 * Mock configuration for tests
 * Can be overridden by environment variables
 */
export declare const testConfig: MoneyWorksConfig;
/**
 * Get test config with optional overrides
 */
export declare function getTestConfig(overrides?: Partial<MoneyWorksConfig>): MoneyWorksConfig;
//# sourceMappingURL=test-config.d.ts.map