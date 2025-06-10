/**
 * Utility functions for MoneyWorks
 */

// Export individual utility modules as they are created
// export * from './date';
// export * from './currency';
// export * from './validation';
// export * from './formatting';

// Placeholder utility
export function isValidId(id: unknown): id is string {
  return typeof id === 'string' && id.length > 0;
}