/**
 * Jest setup file - runs before all tests
 */

// Extend Jest matchers if needed
import '@jest/globals';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.MW_TEST_MODE = 'true';

// Increase timeout for integration tests
if (process.env.TEST_TYPE === 'integration') {
  jest.setTimeout(60000);
}

// Global test utilities
global.testUtils = {
  // Add any global utilities here
};

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  // Keep error and warn for debugging
  error: console.error,
  warn: console.warn,
};