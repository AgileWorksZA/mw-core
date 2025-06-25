/**
 * Bun test setup file - runs before all tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.MW_TEST_MODE = 'true';

// Global test utilities
(globalThis as any).testUtils = {
  // Add any global utilities here
};

// Mock console methods in tests to reduce noise
const originalConsole = { ...console };
global.console = {
  ...console,
  log: () => {},
  debug: () => {},
  info: () => {},
  // Keep error and warn for debugging
  error: originalConsole.error,
  warn: originalConsole.warn,
};