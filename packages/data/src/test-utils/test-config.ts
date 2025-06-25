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
export const testConfig: MoneyWorksConfig = {
  host: process.env.MW_TEST_HOST || 'localhost',
  port: parseInt(process.env.MW_TEST_PORT || '6710'),
  protocol: 'http',
  dataFile: process.env.MW_TEST_DATA_FILE || 'test.moneyworks',
  username: process.env.MW_TEST_USERNAME || 'test',
  password: process.env.MW_TEST_PASSWORD || 'test123',
  timeout: 5000
};

/**
 * Get test config with optional overrides
 */
export function getTestConfig(overrides?: Partial<MoneyWorksConfig>): MoneyWorksConfig {
  return { ...testConfig, ...overrides };
}